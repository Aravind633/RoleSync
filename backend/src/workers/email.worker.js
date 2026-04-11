import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis'; 
import { sendEmail } from '../core/utils/email.js';
const bullmqConnection = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
});

bullmqConnection.on('error', (err) => console.error('[BullMQ Redis] Error:', err));
bullmqConnection.on('connect', () => console.log('[BullMQ] Dedicated Redis Connected'));

//  Create the Queue
export const emailQueue = new Queue('email-queue', { connection: bullmqConnection });

// Create the Worker
const emailWorker = new Worker('email-queue', async (job) => {
  const email = job.data.email || job.data.to;
  const { subject, message, html } = job.data;
  
  console.log(`[Worker] Processing email job for ${email}...`);
  
  try {
    await sendEmail({ email, subject, message, html });
    console.log(`[Worker] Email sent successfully to ${email}`);
  } catch (error) {
    console.error(`[Worker] Failed to send email to ${email}:`, error);
    throw error; // Tells BullMQ to retry the job
  }
}, { connection: bullmqConnection });

emailWorker.on('failed', (job, err) => {
  console.log(`Email job ${job?.id} failed with error ${err.message}`);
});