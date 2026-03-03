import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { logger } from './core/logger/index.js';
import { globalErrorHandler } from './core/middlewares/error.middleware.js';
import { AppError } from './core/errors/AppError.js';

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(pinoHttp({ logger }));

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// 404 Handler

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;