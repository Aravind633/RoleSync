// import { User } from './user.model.js';
// import { AppError } from '../../core/errors/AppError.js';
// import { matchQueue } from '../matching/match.queue.js';

// export const getMyProfile = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return next(new AppError('User not found', 404));
//     }

//     res.status(200).json({
//       status: 'success',
//       data: { profile: user }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateMyProfile = async (req, res, next) => {
//   try {
//     const { firstName, lastName, skills, experienceYears, location } = req.body;
    
//     // Parse skills if they come as a comma-separated string from the frontend form
//     let skillsArray = skills;
//     if (typeof skills === 'string') {
//       skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
//     }

//     const updateData = {
//       firstName,
//       lastName,
//       skills: skillsArray,
//       experienceYears: Number(experienceYears) || 0,
//       location
//     };

//     // If using multer for file uploads
//     if (req.file) {
//       updateData.resumeUrl = req.file.path; 
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     await matchQueue.add('CalculateCandidateMatch', { 
//       type: 'NEW_CANDIDATE_PROFILE', 
//       payload: { candidateId: updatedUser._id } 
//     });

//     res.status(200).json({
//       status: 'success',
//       data: { profile: updatedUser }
//     });
//   } catch (error) {
//     next(error);
//   }
// };



import { User } from './user.model.js';
import { AppError } from '../../core/errors/AppError.js';
import { matchQueue } from '../matching/match.queue.js';

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { profile: user }
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

    // If using multer for file uploads in the general profile update
    if (req.file) {
      updateData.resumeUrl = req.file.path; 
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    // 👇 THE AI MATCHING TRIGGER 👇
    await matchQueue.add('CalculateCandidateMatch', { 
      type: 'NEW_CANDIDATE_PROFILE', 
      payload: { candidateId: updatedUser._id } 
    });

    res.status(200).json({
      status: 'success',
      data: { profile: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

// NEW: Specific controller for just handling the resume file upload from the Nudge Banner
export const uploadUserResume = async (req, res, next) => {
  try {
    if (!req.file) {
      // If Multer didn't catch a file, something went wrong
      return next(new AppError('No file was uploaded', 400));
    }

    // Create the string path that the frontend will use to fetch the file later
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    // Update the currently logged-in user's profile with the new URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { resumeUrl: resumeUrl },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: updatedUser // Returning the updated user directly so React Query gets the fresh data
    });
  } catch (error) {
    next(error);
  }
};