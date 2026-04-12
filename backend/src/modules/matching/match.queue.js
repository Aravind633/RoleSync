import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Job } from '../jobs/job.model.js';
import { Profile } from '../users/profile.model.js';
import { Match } from './match.model.js';
import { calculateMatchScore } from '../../core/utils/scoring.util.js';
import { env } from '../../config/env.js';

// Connect to Redis with the REQUIRED BullMQ options
const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null
});

export const matchQueue = new Queue('MatchQueue', { connection: redisConnection });

const matchWorker = new Worker('MatchQueue', async (jobTask) => {
  const { type, payload } = jobTask.data;

  if (type === 'NEW_JOB') {
    const { jobId } = payload;
    const newJob = await Job.findById(jobId);
    if (!newJob) return;

    // Query Profile model (not User) — skills, experienceYears, location live here
    const candidateProfiles = await Profile.find()
      .populate('user', 'role');

    // Filter to only candidate profiles
    const candidates = candidateProfiles.filter(p => p.user?.role === 'candidate');

    for (const candidate of candidates) {
      const { totalScore, details } = calculateMatchScore(candidate, newJob);

      await Match.findOneAndUpdate(
        { job: newJob._id, candidate: candidate.user._id },
        { score: totalScore, details },
        { upsert: true, new: true }
      );
    }

    const topCandidates = await Match.find({ job: newJob._id })
      .sort('-score')
      .limit(10)
      .populate('candidate', 'firstName lastName skills experienceYears location');

    await redisConnection.set(
      `top_matches:job:${newJob._id}`,
      JSON.stringify(topCandidates),
      'EX',
      3600
    );
  }

  if (type === 'NEW_CANDIDATE_PROFILE') {
    const { candidateId } = payload;
    // Query the Profile — this is where skills and experience live
    const candidateProfile = await Profile.findOne({ user: candidateId });
    if (!candidateProfile) return;

    const openJobs = await Job.find({ status: 'open' });

    for (const job of openJobs) {
      const { totalScore, details } = calculateMatchScore(candidateProfile, job);

      await Match.findOneAndUpdate(
        { job: job._id, candidate: candidateId },
        { score: totalScore, details },
        { upsert: true, new: true }
      );
    }

    const topJobs = await Match.find({ candidate: candidateId })
      .sort('-score')
      .limit(10)
      .populate('job', 'title companyName location experienceLevel skills');

    await redisConnection.set(
      `top_matches:candidate:${candidateId}`,
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