import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Job } from '../jobs/job.model.js';
import { User } from '../users/user.model.js'; 
import { Match } from './match.model.js';
import { calculateMatchScore } from '../../core/utils/scoring.util.js';

//  Connect to your local Redis instance with the REQUIRED BullMQ options
const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null
});

export const matchQueue = new Queue('MatchQueue', { connection: redisConnection });

const matchWorker = new Worker('MatchQueue', async (jobTask) => {
  const { type, payload } = jobTask.data;

  if (type === 'NEW_JOB') {
    const { jobId } = payload;
    const newJob = await Job.findById(jobId);
    if (!newJob) return;

    const candidates = await User.find({ role: 'candidate' });

    for (const candidate of candidates) {
      const { totalScore, details } = calculateMatchScore(candidate, newJob);

      await Match.findOneAndUpdate(
        { job: newJob._id, candidate: candidate._id },
        { score: totalScore, details },
        { upsert: true, new: true } 
      );
    }

   
    const topCandidates = await Match.find({ job: newJob._id })
      .sort('-score')
      .limit(10)
      .populate('candidate', 'firstName lastName skills experienceYears location'); // Populate candidate details for the frontend
      
    await redisConnection.set(
      `top_matches:job:${newJob._id}`, 
      JSON.stringify(topCandidates), 
      'EX', 
      3600 
    );
  }


  if (type === 'NEW_CANDIDATE_PROFILE') {
    const { candidateId } = payload;
    const candidate = await User.findById(candidateId);
    if (!candidate) return;

    const openJobs = await Job.find({ status: 'open' });

    for (const job of openJobs) {
      const { totalScore, details } = calculateMatchScore(candidate, job);

      await Match.findOneAndUpdate(
        { job: job._id, candidate: candidate._id },
        { score: totalScore, details },
        { upsert: true, new: true }
      );
    }
    const topJobs = await Match.find({ candidate: candidate._id })
      .sort('-score')
      .limit(10)
      .populate('job', 'title companyName location experienceLevel skills'); // Populate job details for the frontend
      
    await redisConnection.set(
      `top_matches:candidate:${candidate._id}`, 
      JSON.stringify(topJobs), 
      'EX', 
      3600
    );
  }
}, { connection: redisConnection });

matchWorker.on('completed', (jobTask) => {
  console.log(`[BullMQ] Match calculations and Redis caching finished for task: ${jobTask.id}`);
});

matchWorker.on('failed', (jobTask, err) => {
  console.error(` [BullMQ] Task ${jobTask.id} failed:`, err.message);
});