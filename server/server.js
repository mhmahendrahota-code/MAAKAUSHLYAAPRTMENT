import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import database configuration (tests postgres & enables in-memory fallback dynamically)
import './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import billRoutes from './routes/billRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import committeeRoutes from './routes/committeeRoutes.js';
import helplineRoutes from './routes/helplineRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';

// Import Middlewares
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Load environmental variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logger middleware in dev
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
// Request ID middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});
// Security middlewares
app.use(helmet());
app.use(cookieParser());
// Apply CSRF protection only to non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  return csurf({ cookie: true })(req, res, next);
});
// Global rate limiter: 100 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);
// HTTPS redirect (if behind proxy handling TLS)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.originalUrl}`);
  }
  next();
});
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsers — limit set to 1mb for security
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Root health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Bind Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/helplines', helplineRoutes);
app.use('/api/gallery', galleryRoutes);

// Serve frontend static assets in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Fallback for non-matching endpoints
  app.use(notFound);
}

// Global Exception & Error Interceptor
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  // Launch Node server listener
  app.listen(PORT, () => {
    console.log(`📡 Express server active on http://localhost:${PORT}`);
    console.log(`🔐 Authentication & RBAC rules applied.`);
  });
}
// Export app for testing
export default app;
