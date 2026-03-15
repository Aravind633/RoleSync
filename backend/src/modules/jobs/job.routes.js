import express from 'express';
import { createJob, getAllJobs, getMyJobs, updateJob, deleteJob, bulkUploadJobs, searchJobs } from './job.controller.js';
import { protect, restrictTo } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.get('/search', searchJobs);
router.route('/')
  .get(getAllJobs)
  .post(protect, restrictTo('recruiter'), createJob);
router.post('/bulk', protect, restrictTo('recruiter'), bulkUploadJobs);
router.get('/my-jobs', protect, restrictTo('recruiter'), getMyJobs);

router.route('/:id')
  .patch(protect, restrictTo('recruiter'), updateJob)
  .delete(protect, restrictTo('recruiter'), deleteJob);

export default router;