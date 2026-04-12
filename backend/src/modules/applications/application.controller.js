import { Application } from './application.model.js';
import { Job } from '../jobs/job.model.js';
import { Profile } from '../users/profile.model.js';
import { AppError } from '../../core/errors/AppError.js';
import Notification from '../notification/notification.model.js';
import { emailQueue } from '../../workers/email.worker.js';

// Apply for a job
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

// Get all applications for a specific job (Recruiter)
export const getJobApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);

    if (!job || job.recruiter.toString() !== req.user.id) {
      return next(new AppError('Job not found or unauthorized', 404));
    }

    // Get all applications for this job
    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'email role')
      .sort('-createdAt');

    // Enrich with profile data (firstName, skills, etc. live on Profile, not User)
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const appObj = app.toObject();
        if (appObj.candidate) {
          const profile = await Profile.findOne({ user: appObj.candidate._id });
          if (profile) {
            appObj.candidateProfile = {
              firstName: profile.firstName,
              lastName: profile.lastName,
              skills: profile.skills,
              experienceYears: profile.experienceYears,
              location: profile.location,
              resumeUrl: profile.resumeUrl,
            };
          }
        }
        return appObj;
      })
    );

    res.status(200).json({
      status: 'success',
      results: enrichedApplications.length,
      data: { applications: enrichedApplications }
    });
  } catch (error) {
    next(error);
  }
};

// Get ALL applications for ALL jobs posted by the logged-in recruiter
export const getRecruiterApplications = async (req, res, next) => {
  try {
    const recruiterJobs = await Job.find({ recruiter: req.user.id }).select('_id');
    const jobIds = recruiterJobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title companyName')
      .populate('candidate', 'email role')
      .sort('-createdAt');

    // Enrich with profile data
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const appObj = app.toObject();
        if (appObj.candidate) {
          const profile = await Profile.findOne({ user: appObj.candidate._id });
          if (profile) {
            appObj.candidateProfile = {
              firstName: profile.firstName,
              lastName: profile.lastName,
              skills: profile.skills,
            };
          }
        }
        return appObj;
      })
    );

    res.status(200).json({
      status: 'success',
      results: enrichedApplications.length,
      data: enrichedApplications
    });
  } catch (error) {
    next(error);
  }
};

// Update application status AND send notification/email (Recruiter)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('candidate', 'email role');

    if (!application) return next(new AppError('Application not found', 404));

    // Verify ownership of the job
    if (application.job.recruiter.toString() !== req.user.id) {
      return next(new AppError('Unauthorized', 403));
    }

    // Update the status
    application.status = status;
    await application.save();

    try {
      // Fetch candidate's profile for their name
      const candidateProfile = await Profile.findOne({ user: application.candidate._id });
      const candidateName = candidateProfile?.firstName || 'Candidate';

      await Notification.create({
        user: application.candidate._id,
        message: `Your application for ${application.job.title} has been updated to: ${status.toUpperCase()}`,
        type: 'application_update',
        relatedId: application._id
      });

      if (status === 'shortlisted') {
        await emailQueue.add('send-status-email', {
          to: application.candidate.email,
          subject: `Great news! You've been shortlisted for ${application.job.title}`,
          html: `
            <h2>Congratulations ${candidateName}!</h2>
            <p>Your application for the <strong>${application.job.title}</strong> role has been reviewed, and the recruiter has officially shortlisted you.</p>
            <p>Log in to your RoleSync Candidate Dashboard to see more details and await next steps.</p>
          `
        });
      } else if (status === 'rejected') {
        await emailQueue.add('send-status-email', {
          to: application.candidate.email,
          subject: `Update on your application for ${application.job.title}`,
          html: `
            <h2>Hi ${candidateName},</h2>
            <p>Thank you for applying to the <strong>${application.job.title}</strong> role. While your background is impressive, the team has decided to move forward with other candidates at this time.</p>
            <p>We encourage you to keep applying for other roles on RoleSync. We wish you the best in your job search!</p>
          `
        });
      }

    } catch (notificationError) {
      console.error('Failed to send notification or queue email:', notificationError);
      // We log the error but don't crash the request—the MongoDB status change is saved!
    }

    res.status(200).json({
      status: 'success',
      data: application
    });
  } catch (error) {
    next(error);
  }
};