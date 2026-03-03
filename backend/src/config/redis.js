import { createClient } from 'redis';
import { env } from './env.js';
import { logger } from '../core/logger/index.js';

export const redisClient = createClient({ url: env.REDIS_URL });

redisClient.on('error', (err) => logger.error(`❌ Redis Client Error: ${err}`));
redisClient.on('connect', () => logger.info('✅ Redis Connected'));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};