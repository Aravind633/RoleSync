import express from 'express';
import { getTopRecommendations } from './match.controller.js';
import { protect, restrictTo } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.get('/recommendations', protect, restrictTo('candidate'), getTopRecommendations);

export default router;