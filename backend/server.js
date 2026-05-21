const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const connectDB = require('./config/db');
const logger = require('./config/logger');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// 1. Enable Security HTTP Headers
app.use(helmet());

// 2. Prevent NoSQL Query Injections
app.use(mongoSanitize());

// 3. CORS Configuration
app.use(
  cors({
    origin: '*', // Customize to specific domain in production
    credentials: true,
  })
);

// 4. Body Parser
app.use(express.json());

// 5. HTTP Request Logging (Linked to Winston Stream)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev', { stream: logger.stream }));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// 6. Security Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/register attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply standard limiter globally to /api
app.use('/api', apiLimiter);

// Apply strict rate limiting to Auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 7. Serve Static Assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 8. Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'DevHire Backend API is running smoothly.' });
});

// 9. Central Error Handler Middleware (Must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`❌ Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
