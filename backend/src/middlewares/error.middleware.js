/**
 * Centralized Error Handling Middleware
 * UF3/UF4 Curriculum Project
 * Provides comprehensive error handling with proper HTTP status codes (500-599)
 */

/**
 * Custom Application Error class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle database connection errors
 */
const handleDBConnectionError = () => {
  return new AppError('Database connection failed. Please try again later.', 503);
};

/**
 * Handle database constraint errors
 */
const handleDBConstraintError = (err) => {
  if (err.code === 'ER_DUP_ENTRY') {
    const field = err.sqlMessage.match(/for key '(.+?)'/)?.[1] || 'field';
    return new AppError(`Duplicate value for ${field}. Please use a different value.`, 409);
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return new AppError('Referenced record does not exist.', 400);
  }

  return new AppError('Database constraint violation.', 400);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

/**
 * Handle validation errors
 */
const handleValidationError = (err) => {
  const errors = err.errors?.map(error => error.msg) || [err.message];
  return new AppError(`Validation failed: ${errors.join('. ')}`, 400);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: res.req?.originalUrl
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      timestamp: new Date().toISOString()
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error for monitoring
  console.error(`[${new Date().toISOString()}] ${err.status.toUpperCase()}: ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack trace:', err.stack);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      error = handleDBConnectionError();
    }

    if (err.code && err.code.startsWith('ER_')) {
      error = handleDBConstraintError(err);
    }

    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    if (err.name === 'ValidationError' || err.errors) {
      error = handleValidationError(err);
    }

    sendErrorProd(error, res);
  }
};

/**
 * Catch async errors wrapper
 * Wraps async functions to catch errors and pass them to error handler
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Handle 404 errors for undefined routes
 */
const handleNotFound = (req, res, next) => {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(err);
};

/**
 * Rate limit error handler
 */
const handleRateLimitError = (req, res) => {
  res.status(429).json({
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString(),
    retryAfter: req.rateLimit?.resetTime
  });
};

export {
  AppError,
  globalErrorHandler,
  catchAsync,
  handleNotFound,
  handleRateLimitError
};
