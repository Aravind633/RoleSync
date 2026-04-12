import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  MONGO_URI: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  CORS_ORIGIN: z.string().optional(),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_ACCESS_KEY_ID: z.string().optional().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(''),
  AWS_S3_BUCKET: z.string().optional().default(''),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(' Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = Object.freeze(_env.data);