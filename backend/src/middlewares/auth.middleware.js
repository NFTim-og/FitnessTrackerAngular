import jwt from 'jsonwebtoken';
import { query } from '../db/database.js';
import AppError from '../utils/error.utils.js';

/**
 * Create and send JWT token
 */
export const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });

  // Remove password from output
  const { password, ...userWithoutPassword } = user;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userWithoutPassword
    }
  });
};

/**
 * Middleware to protect routes that require authentication
 */
export const protect = async (req, res, next) => {
  try {
    // 1) Get token from headers
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const user = await query(
      'SELECT id, email, role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user || user.length === 0) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Set user in request
    req.user = user[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please log in again.', 401));
    }
    next(error);
  }
};

/**
 * Middleware to restrict access to certain roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

/**
 * Middleware to check if user owns the resource or is admin
 */
export const checkOwnership = (paramName = 'id') => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return next(new AppError('You must be logged in to access this resource', 401));
    }

    // Allow admins to access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user is accessing their own resource
    const userId = req.params[paramName] || req.params.id || req.params.userId;
    if (userId && userId !== req.user.id) {
      return next(new AppError('You can only access your own resources', 403));
    }

    next();
  };
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 */
export const optionalAuth = async (req, res, next) => {
  try {
    // 1) Get token from headers
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      // No token provided, continue without user
      return next();
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const user = await query(
      'SELECT id, email, role FROM users WHERE id = ?',
      [decoded.id]
    );

    if (user && user.length > 0) {
      // 4) Set user in request if found
      req.user = user[0];
    }

    next();
  } catch (error) {
    // If token is invalid, continue without user (don't throw error)
    next();
  }
};
