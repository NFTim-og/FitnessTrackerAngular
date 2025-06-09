/**
 * Authentication Middleware
 * UF3/UF4 Curriculum Project
 * Handles JWT token verification and user authorization with enhanced security
 */

import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { AppError, catchAsync } from './error.middleware.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Protect routes middleware
 * Verifies JWT token and attaches user data to request
 *
 * @middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
const protect = catchAsync(async (req, res, next) => {
  // Extract JWT token from Authorization header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Format: Bearer <token>
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    // Alternative: get token from cookies
    token = req.cookies.jwt;
  }

  // Return error if no token provided
  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  // Verify token signature and expiration
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

  // Check if the user still exists in the database
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // Check if user is active
  if (!user.is_active) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }

  // Check if user changed password after the token was issued
  if (user.passwordChangedAfter && user.passwordChangedAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  // Attach full user data to request object for use in protected routes
  req.user = user;
  next(); // Proceed to the next middleware or route handler
});

/**
 * Role-based access control middleware
 * Restricts access to routes based on user roles
 *
 * @middleware
 * @param {...string} roles - Allowed roles for the route
 * @returns {Function} Express middleware function
 */
const restrictTo = (...roles) => {
  // Return middleware function
  return catchAsync(async (req, res, next) => {
    // Check if user's role is in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    // User has permission, proceed to next middleware
    next();
  });
};

/**
 * Optional authentication middleware
 * Attaches user data if token is provided, but doesn't require it
 */
const optionalAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
      const user = await User.findById(decoded.id);

      if (user && user.is_active) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
});

/**
 * Check if user owns the resource
 * Compares user ID with resource owner ID
 */
const checkOwnership = (resourceUserIdField = 'user_id') => {
  return catchAsync(async (req, res, next) => {
    // Admin users can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // For other users, check ownership
    const resourceUserId = req.body[resourceUserIdField] || req.params[resourceUserIdField];

    if (resourceUserId && resourceUserId !== req.user.id) {
      return next(new AppError('You can only access your own resources', 403));
    }

    next();
  });
};

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @param {string} email - User email
 * @returns {string} JWT token
 */
const signToken = (id, email) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

/**
 * Create and send JWT token
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id, user.email);

  const cookieOptions = {
    expires: new Date(Date.now()), // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

export {
  protect,
  restrictTo,
  optionalAuth,
  checkOwnership,
  signToken,
  createSendToken
};
