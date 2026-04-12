import express from 'express';
import { getMyProfile, updateMyProfile, uploadUserResume } from './profile.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { uploadResume } from '../../core/middlewares/upload.middleware.js';

const router = express.Router();

// All profile routes require the user to be logged in
router.use(protect);

// General Profile Data
router.get('/me', getMyProfile);
router.patch('/me', updateMyProfile);

// Dedicated Resume Upload Route
router.patch('/resume', uploadResume.single('resume'), uploadUserResume);

export default router;