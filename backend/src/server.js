import app from './app.js';
import { env } from './config/env.js';
import { logger } from './core/logger/index.js';
import { connectDB } from './config/database.js';
import { connectRedis, redisClient } from './config/redis.js';

// Handle Uncaught Exceptions (Synchronous)
process.on('uncaughtException', (err) => {
  logger.fatal('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});

// Top-level await to ensure DBs connect before starting server
await connectDB();
// await connectRedis();

const server = app.listen(env.PORT, () => {
  logger.info(` Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

// Handle Unhandled Rejections (Asynchronous)
process.on('unhandledRejection', (err) => {
  logger.fatal('UNHANDLED REJECTION! 💥 Shutting down...', err);
  server.close(() => process.exit(1));
});

// Graceful Shutdown on SIGTERM (Docker/AWS)
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(async () => {
    logger.info('💥 Process terminated!');
    await redisClient.quit();
  });
});