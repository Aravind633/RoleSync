import express from 'express';
import { getMyProfile, updateMyProfile } from './profile.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { uploadResume } from '../../core/middlewares/upload.middleware.js';

const router = express.Router();

// All profile routes require the user to be logged in
router.use(protect);

router.get('/me', getMyProfile);

// Note: uploadResume.single('resume') tells Multer to look for a file attached to the field name "resume"
router.patch('/me', uploadResume.single('resume'), updateMyProfile);

export default router;