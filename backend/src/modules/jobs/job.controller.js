import { Job } from './job.model.js';
import { AppError } from '../../core/errors/AppError.js';

/**
 * @desc    Create a new job posting
 * @route   POST /api/v1/jobs
 * @access  Private (Recruiter only)
 */
export const createJob = async (req, res, next) => {
  try {
    // Attach the logged-in user's ID as the recruiter for this job
    const jobData = { ...req.body, recruiter: req.user._id };
    
    const job = await Job.create(jobData);

    res.status(201).json({
      status: 'success',
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all open jobs (for candidates to browse)
 * @route   GET /api/v1/jobs
 * @access  Public or Private (Candidate/Recruiter)
 */
export const getAllJobs = async (req, res, next) => {
  try {
    // Only fetch jobs that are actively open
    const jobs = await Job.find({ status: 'open' }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: jobs.length,
      data: { jobs }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get jobs posted by the logged-in recruiter
 * @route   GET /api/v1/jobs/my-jobs
 * @access  Private (Recruiter only)
 */
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: jobs.length,
      data: { jobs }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a job posting
 * @route   PATCH /api/v1/jobs/:id
 * @access  Private (Recruiter only)
 */
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('No job found with that ID', 404));
    }

    // Ensure the recruiter updating the job is the one who created it
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return next(new AppError('You do not have permission to edit this job', 403));
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated document
      runValidators: true // Ensures the updated data meets schema rules
    });

    res.status(200).json({
      status: 'success',
      data: { job: updatedJob }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a job posting
 * @route   DELETE /api/v1/jobs/:id
 * @access  Private (Recruiter only)
 */
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('No job found with that ID', 404));
    }

    // Security Check: Ensure the recruiter deleting the job is the one who created it
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return next(new AppError('You do not have permission to delete this job', 403));
    }

    await job.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Bulk upload multiple job postings
 * @route   POST /api/v1/jobs/bulk
 * @access  Private (Recruiter only)
 */
export const bulkUploadJobs = async (req, res, next) => {
  try {
    const jobsArray = req.body;

    // 1. Validate that the request body is an actual array
    if (!Array.isArray(jobsArray) || jobsArray.length === 0) {
      return next(new AppError('Please provide an array of job objects.', 400));
    }

    // 2. Map through the array and attach the logged-in recruiter's ID to EVERY job
    const jobsWithRecruiter = jobsArray.map(job => ({
      ...job,
      recruiter: req.user._id
    }));

    // 3. Insert all jobs into MongoDB in one massive batch
   
    const jobs = await Job.insertMany(jobsWithRecruiter, { ordered: false });

    res.status(201).json({
      status: 'success',
      results: jobs.length,
      message: `Successfully uploaded ${jobs.length} jobs.`,
      data: { jobs }
    });
  } catch (error) {
    next(error);
  }
};