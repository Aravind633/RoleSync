import express from 'express';
import { getMyNotifications, markAsRead } from './notification.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

// All notification routes require the user to be logged in
router.use(protect);

router.route('/')
  .get(getMyNotifications);

router.route('/:id/read')
  .patch(markAsRead);

export default router;