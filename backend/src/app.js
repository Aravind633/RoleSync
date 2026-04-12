
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser'; 
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { logger } from './core/logger/index.js';
import { globalErrorHandler } from './core/middlewares/error.middleware.js';
import { AppError } from './core/errors/AppError.js';


import authRoutes from './modules/auth/auth.routes.js';
import jobRoutes from './modules/jobs/job.routes.js';
import profileRoutes from './modules/users/profile.routes.js';
import applicationRoutes from './modules/applications/application.routes.js';
import matchRoutes from './modules/matching/match.routes.js';
import notificationRoutes from './modules/notification/notification.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Rate limiting — protect against brute-force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Too many requests, please try again later.' }
});
app.use('/api', apiLimiter);

// Pino handles all the HTTP request logging
app.use(pinoHttp({ logger }));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Mount Routes
app.use('/api/v1/auth', authRoutes); 
app.use('/api/v1/jobs', jobRoutes); 
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;