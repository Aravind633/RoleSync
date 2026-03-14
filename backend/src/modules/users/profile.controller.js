import { Profile } from './profile.model.js';
import { AppError } from '../../core/errors/AppError.js';

/**
 * @desc    Get logged-in user's profile
 * @route   GET /api/v1/profiles/me
 * @access  Private
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    
    if (!profile) return next(new AppError('Profile not found', 404));

    res.status(200).json({
      status: 'success',
      data: { profile }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update profile & upload resume
 * @route   PATCH /api/v1/profiles/me
 * @access  Private
 */
export const updateMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return next(new AppError('Profile not found', 404));

    // 1. Extract standard text fields
    const { firstName, lastName, skills, experienceYears, location, companyName, designation } = req.body;

    if (firstName) profile.firstName = firstName;
    if (lastName) profile.lastName = lastName;
    if (experienceYears) profile.experienceYears = experienceYears;
    if (location) profile.location = location;
    if (companyName) profile.companyName = companyName;
    if (designation) profile.designation = designation;

    // 2. Handle Skills (FormData sends arrays as comma-separated strings)
    if (skills) {
      profile.skills = Array.isArray(skills) 
        ? skills 
        : skills.split(',').map(skill => skill.trim());
    }

    // 3. Handle Resume File Upload (If Multer intercepted a file)
    if (req.file) {
      // In a production app, you'd upload this to AWS S3. 
      // For now, we save the local path so the frontend can download it.
      profile.resumeUrl = `/uploads/resumes/${req.file.filename}`;
    }

    await profile.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully!',
      data: { profile }
    });
  } catch (error) {
    next(error);
  }
};