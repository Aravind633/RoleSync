import express from 'express';
import { 
  createJob, 
  getAllJobs, 
  getMyJobs, 
  updateJob, 
  deleteJob 
} from './job.controller.js';
import { protect, restrictTo } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

// Publicly accessible 
router.get('/', protect, getAllJobs);


router.use(protect);
router.use(restrictTo('recruiter'));

router.post('/', createJob);
router.get('/my-jobs', getMyJobs);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;