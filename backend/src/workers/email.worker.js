import { Worker, Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { sendEmail } from '../core/utils/email.js';

// Create the Queue
export const emailQueue = new Queue('email-queue', { connection: redisConnection });

// Create the Worker
const emailWorker = new Worker('email-queue', async (job) => {
  const { email, subject, message, html } = job.data;
  
  console.log(`[Worker] Processing email job for ${email}...`);
  
  try {
    await sendEmail({ email, subject, message, html });
    console.log(`[Worker]  Email sent successfully to ${email}`);
  } catch (error) {
    console.error(`[Worker] Failed to send email to ${email}:`, error);
    throw error; // Tells BullMQ to retry the job
  }
}, { connection: redisConnection });

emailWorker.on('failed', (job, err) => {
  console.log(`Email job ${job.id} failed with error ${err.message}`);
});