import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { corsOptions, setSecurityHeaders } from './config/corsConfig.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import healthRoute from './routes/health.route.js';
import AppError from './utils/AppError.js';
import ERROR_CODES from './constants/errorCodes.js';
import errorHandler from './middleware/errorHandler.js';
import { requestIdMiddleware, attachRequestIdToResponse } from './middleware/requestId.js';
import repositoryRoutes from './routes/repository.routes.js';
import activityRoutes from './routes/activity.routes.js';
import architectureRoutes from './routes/architectureRoutes.js';

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not configured. Server cannot start securely.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// corsOptions restricts Access-Control-Allow-Origin to the FRONTEND_URL
// allowlist (supports comma-separated values for multi-host deployments).
// No wildcard fallback is registered anywhere in this file.
app.use(cors(corsOptions));
app.use(setSecurityHeaders);

// Limit request body size to prevent payload-based DoS attacks.
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(mongoSanitize());
app.use(requestIdMiddleware);
app.use(attachRequestIdToResponse);

morgan.token('request-id', (req) => req.requestId || '-');
app.use(morgan(':request-id :method :url :status :response-time ms - :res[content-length]'));

// Global rate limiter applied to all /api/v1 routes as a backstop.
// Per-route limiters (e.g. on /auth) may be stricter.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.API_RATE_LIMIT || '200', 10),
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use('/health', healthRoute);
app.use('/api/v1', apiLimiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/repositories', repositoryRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/architecture', architectureRoutes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, ERROR_CODES.NOT_FOUND));
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect database:', error);
    process.exit(1);
  }
};

startServer();