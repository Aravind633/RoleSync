import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Job } from '../jobs/job.model.js';
import { User } from '../users/user.model.js'; 
import { Match } from './match.model.js';
import { calculateMatchScore } from '../../core/utils/scoring.util.js';


const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null 
});

// 2. Create the Queue 
export const matchQueue = new Queue('MatchQueue', { connection: redisConnection });

// 3. Create the Worker 
const matchWorker = new Worker('MatchQueue', async (jobTask) => {
  const { type, payload } = jobTask.data;


  if (type === 'NEW_JOB') {
    const { jobId } = payload;
    const newJob = await Job.findById(jobId);
    if (!newJob) return;

   
    const candidates = await User.find({ role: 'candidate' });

    // Calculate a score for every single candidate against this one job
    for (const candidate of candidates) {
      const { totalScore, details } = calculateMatchScore(candidate, newJob);

      //  update the score in the database
      await Match.findOneAndUpdate(
        { job: newJob._id, candidate: candidate._id },
        { score: totalScore, details },
        { upsert: true, new: true } 
      );
    }
  }

  if (type === 'NEW_CANDIDATE_PROFILE') {
    const { candidateId } = payload;
    const candidate = await User.findById(candidateId);
    if (!candidate) return;

    // Find ALL open jobs in the database
    const openJobs = await Job.find({ status: 'open' });

    // Calculate a score for this one candidate against every single job
    for (const job of openJobs) {
      const { totalScore, details } = calculateMatchScore(candidate, job);

      // Save or update the score
      await Match.findOneAndUpdate(
        { job: job._id, candidate: candidate._id },
        { score: totalScore, details },
        { upsert: true, new: true }
      );
    }
  }
}, { connection: redisConnection });

// . Console logs for monitoring
matchWorker.on('completed', (jobTask) => {
  console.log(`✅ [BullMQ] Match calculations finished for task: ${jobTask.id}`);
});

matchWorker.on('failed', (jobTask, err) => {
  console.error(`❌ [BullMQ] Task ${jobTask.id} failed:`, err.message);
});