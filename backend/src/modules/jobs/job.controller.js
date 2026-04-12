import { Job } from './job.model.js';
import { AppError } from '../../core/errors/AppError.js';
import { matchQueue } from '../matching/match.queue.js';
import { redisClient } from '../../config/redis.js';
export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      recruiter: req.user.id
    });

    await matchQueue.add('CalculateJobMatch', { 
      type: 'NEW_JOB', 
      payload: { jobId: job._id } 
    });

    res.status(201).json({
      status: 'success',
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort('-createdAt');
    res.status(200).json({
      status: 'success',
      results: jobs.length,
      data: { jobs }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id }).sort('-createdAt');
    res.status(200).json({
      status: 'success',
      results: jobs.length,
      data: { jobs }
    });
  } catch (error) {
    next(error);
  }
};

export const bulkUploadJobs = async (req, res, next) => {
  try {
    const jobsData = req.body.map(job => ({
      ...job,
      recruiter: req.user.id
    }));

    const jobs = await Job.insertMany(jobsData);

    // Trigger AI Matching for every job in the bulk upload
    for (const job of jobs) {
      await matchQueue.add('CalculateJobMatch', { 
        type: 'NEW_JOB', 
        payload: { jobId: job._id } 
      });
    }

    res.status(201).json({
      status: 'success',
      results: jobs.length,
      data: { jobs }
    });
  } catch (error) {
    next(error);
  }
};


export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return next(new AppError('Job not found or unauthorized', 404));
    }

    // Re-calculate matches because the job requirements might have changed!
    await matchQueue.add('CalculateJobMatch', { 
      type: 'NEW_JOB', 
      payload: { jobId: job._id } 
    });

    res.status(200).json({
      status: 'success',
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ 
      _id: req.params.id, 
      recruiter: req.user.id 
    });

    if (!job) {
      return next(new AppError('Job not found or unauthorized', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};
export const searchJobs = async (req, res, next) => {
  try {
    const { q, location, experienceLevel, skills, page = 1, limit = 10 } = req.query;

    // Create a unique Redis cache key based on search parameters
    const cacheKey = `search:jobs:${JSON.stringify(req.query)}`;

    // Check Redis cache first
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      console.log('⚡ Serving search from Redis Cache');
      return res.status(200).json(JSON.parse(cachedResult));
    }

    console.log('🔍 Querying MongoDB for search');
    
    //  Build the MongoDB Aggregation Pipeline
    const matchStage = { status: 'open' }; 

    // Text search for Job Title or Company Name
    if (q) {
      matchStage.$or = [
        { title: { $regex: q, $options: 'i' } },
        { companyName: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Exact or partial location match
    if (location) {
      matchStage.location = { $regex: location, $options: 'i' };
    }
    
    // Exact experience level match
    if (experienceLevel) {
      matchStage.experienceLevel = experienceLevel;
    }
    
    // Skill matching \
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      matchStage.skills = { $in: skillsArray };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const pipeline = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } }, 
      { $skip: skip },
      { $limit: Number(limit) }
    ];

    // Execute the aggregation
    const jobs = await Job.aggregate(pipeline);
    
    // Get total count for pagination
    const total = await Job.countDocuments(matchStage);

    const responseData = {
      status: 'success',
      results: jobs.length,
      total,
      data: { jobs }
    };

    // Store this result in Redis for 5 minutes (300 seconds)
    await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 300 });

    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};