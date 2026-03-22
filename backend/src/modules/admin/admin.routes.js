import express from 'express';
import { getSystemAnalytics } from './admin.controller.js';
import { protect, restrictTo } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

// Only Admins can hit this route
router.get('/analytics', protect, restrictTo('admin'), getSystemAnalytics);

export default router;