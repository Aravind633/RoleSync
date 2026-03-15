import { Application } from './application.model.js';
import { Job } from '../jobs/job.model.js';
import { AppError } from '../../core/errors/AppError.js';

//  Apply for a job

export const applyForJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);

    if (!job || job.status !== 'open') {
      return next(new AppError('Job is not available', 404));
    }

    // Check if they already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id
    });

    if (existingApplication) {
      return next(new AppError('You have already applied for this job', 400));
    }
// Create the application
    const application = await Application.create({
      job: jobId,
      candidate: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: { application }
    });
  } catch (error) {
    next(error);
  }
};

// Get all applications for the logged-in candidate
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title companyName location experienceLevel status')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: applications.length,
      data: { applications }
    });
  } catch (error) {
    next(error);
  }
};
// Get all applications for a specific job (recruiter only)
export const getJobApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;


    const job = await Job.findById(jobId);
    if (!job || job.recruiter.toString() !== req.user.id) {
      return next(new AppError('Job not found or unauthorized', 404));
    }
// Get all applications for this job, along with candidate details
    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'firstName lastName email skills experienceYears location resumeUrl')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: applications.length,
      data: { applications }
    });
  } catch (error) {
    next(error);
  }
};
// Update application status 
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) return next(new AppError('Application not found', 404));

    // Verify ownership of the job
    if (application.job.recruiter.toString() !== req.user.id) {
      return next(new AppError('Unauthorized', 403));
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      status: 'success',
      data: { application }
    });
  } catch (error) {
    next(error);
  }
};