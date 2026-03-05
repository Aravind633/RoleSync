import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser'; 
import { logger } from './core/logger/index.js';
import { globalErrorHandler } from './core/middlewares/error.middleware.js';
import { AppError } from './core/errors/AppError.js';


import authRoutes from './modules/auth/auth.routes.js'; 

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser()); 
app.use(pinoHttp({ logger }));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Mount Routes
app.use('/api/v1/auth', authRoutes); 

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;