import express from 'express';
import { 
  applyForJob, 
  getJobApplicants, 
  updateApplicationStatus, 
  getMyApplications,
  getRecruiterApplications 
} from './application.controller.js';
import { protect, restrictTo } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect); 
router.post('/apply/:jobId', restrictTo('candidate'), applyForJob);
router.get('/my-applications', restrictTo('candidate'), getMyApplications);

router.get('/recruiter', restrictTo('recruiter'), getRecruiterApplications); 

router.get('/job/:jobId', restrictTo('recruiter'), getJobApplicants);
router.patch('/:id/status', restrictTo('recruiter'), updateApplicationStatus);

export default router;