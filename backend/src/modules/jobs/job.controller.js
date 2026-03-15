import { Job } from './job.model.js';
import { AppError } from '../../core/errors/AppError.js';
import { matchQueue } from '../matching/match.queue.js';

export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      recruiter: req.user.id
    });

    // 👇 THE AI MATCHING TRIGGER 👇
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

// 👇 The missing functions are back! 👇
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