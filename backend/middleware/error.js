const ErrorResponse = require('../utils/errorResponse');
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to Winston
  logger.error(
    `❌ [${req.method}] ${req.originalUrl} - ${err.message || 'Internal Server Error'}\nStack: ${err.stack}`
  );

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key (Code 11000)
  if (err.code === 11000) {
    const message = 'A duplicate field value was entered. Please choose another value.';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JWT invalid signature
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid authorization token. Access denied.';
    error = new ErrorResponse(message, 401);
  }

  // JWT token expired
  if (err.name === 'TokenExpiredError') {
    const message = 'Authorization token has expired. Please login again.';
    error = new ErrorResponse(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
