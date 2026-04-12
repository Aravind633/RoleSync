import { Profile } from './profile.model.js';
import { AppError } from '../../core/errors/AppError.js';
import { matchQueue } from '../matching/match.queue.js';
import { env } from '../../config/env.js';

/**
 * Resolves the resume URL based on the current storage strategy.
 * - Production (S3): multer-s3 provides `req.file.location` (full S3 URL)
 * - Development (Local): multer provides `req.file.filename`, served via /uploads/resumes/
 */
const getResumeUrl = (file) => {
  if (env.NODE_ENV === 'production') {
    return file.location; // Full S3 URL (e.g., https://bucket.s3.amazonaws.com/resumes/resume-xxx.pdf)
  }
  // Local dev: construct a relative URL served by express.static
  return `/uploads/resumes/${file.filename}`;
};

export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return next(new AppError('Profile not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { profile }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, skills, experienceYears, location } = req.body;
    
    // Parse skills if they come as a comma-separated string from the frontend form
    let skillsArray = skills;
    if (typeof skills === 'string') {
      skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
    }

    const updateData = {
      firstName,
      lastName,
      skills: skillsArray,
      experienceYears: Number(experienceYears) || 0,
      location
    };

    // If a file was uploaded, resolve the URL based on storage strategy
    if (req.file) {
      updateData.resumeUrl = getResumeUrl(req.file);
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return next(new AppError('Profile not found', 404));
    }

    // Trigger AI matching when candidate updates their profile
    await matchQueue.add('CalculateCandidateMatch', { 
      type: 'NEW_CANDIDATE_PROFILE', 
      payload: { candidateId: req.user.id } 
    });

    res.status(200).json({
      status: 'success',
      data: { profile: updatedProfile }
    });
  } catch (error) {
    next(error);
  }
};

// Specific controller for handling the resume file upload from the Nudge Banner
export const uploadUserResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No file was uploaded', 400));
    }

    // Resolve URL based on storage strategy (local or S3)
    const resumeUrl = getResumeUrl(req.file);

    // Update the profile with the resume URL
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { resumeUrl: resumeUrl },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return next(new AppError('Profile not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};