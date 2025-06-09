/**
 * Rate Limiting Middleware
 * UF3/UF4 Curriculum Project
 * Implements rate limiting to control simultaneous API connections
 */

import rateLimit from 'express-rate-limit';
import { handleRateLimitError } from './error.middleware.js';

/**
 * General API rate limiter
 * Limits requests per IP address
 * More lenient in development mode
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || (process.env.NODE_ENV === 'development' ? 60 * 1000 : 15 * 60 * 1000), // 1 minute in dev, 15 minutes in prod
  max: parseInt(process.env.RATE_LIMIT_MAX) || (process.env.NODE_ENV === 'development' ? 1000 : 100), // 1000 in dev, 100 in prod
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || (process.env.NODE_ENV === 'development' ? 60 * 1000 : 15 * 60 * 1000)) / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: handleRateLimitError,
  skip: (req) => {
    // Skip rate limiting for health checks and in test environment
    return req.path === '/health' || req.path === '/api/v1/health' || process.env.NODE_ENV === 'test';
  }
});

/**
 * Strict rate limiter for authentication endpoints
 * More restrictive to prevent brute force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimitError,
  skipSuccessfulRequests: true // Don't count successful requests
});

/**
 * Moderate rate limiter for data modification endpoints
 * Prevents spam and abuse of POST/PUT/DELETE operations
 */
const modificationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit each IP to 20 modification requests per 5 minutes
  message: {
    status: 'error',
    message: 'Too many modification requests, please slow down.',
    retryAfter: 300 // 5 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimitError,
  skip: (req) => {
    // Only apply to POST, PUT, DELETE, PATCH methods
    return !['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  }
});

/**
 * Lenient rate limiter for read-only endpoints
 * Allows more requests for GET operations
 */
const readLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 read requests per minute
  message: {
    status: 'error',
    message: 'Too many read requests, please slow down.',
    retryAfter: 60 // 1 minute in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimitError,
  skip: (req) => {
    // Only apply to GET methods
    return req.method !== 'GET';
  }
});

/**
 * Create a custom rate limiter with specific configuration
 * @param {Object} options - Rate limiter options
 * @returns {Function} Express middleware function
 */
const createCustomLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      status: 'error',
      message: 'Rate limit exceeded, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: handleRateLimitError
  };

  return rateLimit({ ...defaultOptions, ...options });
};

/**
 * Rate limiter for file upload endpoints
 * Very restrictive to prevent abuse
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 uploads per hour
  message: {
    status: 'error',
    message: 'Upload limit exceeded, please try again later.',
    retryAfter: 3600 // 1 hour in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimitError
});

/**
 * Rate limiter for password reset endpoints
 * Prevents abuse of password reset functionality
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    status: 'error',
    message: 'Too many password reset attempts, please try again later.',
    retryAfter: 3600 // 1 hour in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: handleRateLimitError
});

export {
  apiLimiter,
  authLimiter,
  modificationLimiter,
  readLimiter,
  uploadLimiter,
  passwordResetLimiter,
  createCustomLimiter
};
