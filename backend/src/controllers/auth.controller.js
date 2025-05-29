/**
 * Authentication Controller
 * UF3/UF4 Curriculum Project
 * Handles user registration, login, and profile management with comprehensive security
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/database.js';
import { catchAsync, AppError } from '../middlewares/error.middleware.js';
import { createSendToken } from '../middlewares/auth.middleware.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm, firstName, lastName } = req.body;

  // Check if passwords match (additional validation)
  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUser.length > 0) {
    return next(new AppError('User with this email already exists', 409));
  }

  // Hash password with high cost factor for security
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user with UUID
  const userId = uuidv4();

  await query(
    `INSERT INTO users (id, email, password, first_name, last_name, is_active, email_verified)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, email, hashedPassword, firstName || null, lastName || null, true, false]
  );

  // Get the created user
  const [newUser] = await query(
    'SELECT id, email, first_name, last_name, role, is_active, created_at FROM users WHERE id = ?',
    [userId]
  );

  // Create and send token
  createSendToken({
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.first_name,
    lastName: newUser.last_name,
    role: newUser.role,
    isActive: newUser.is_active,
    createdAt: newUser.created_at
  }, 201, res);
});

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists and password is correct
  const [user] = await query(
    'SELECT id, email, password, first_name, last_name, role, is_active FROM users WHERE email = ?',
    [email]
  );

  if (!user || !user.is_active) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Update last login
  await query(
    'UPDATE users SET last_login = NOW() WHERE id = ?',
    [user.id]
  );

  // Create and send token
  createSendToken({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    isActive: user.is_active
  }, 200, res);
});

/**
 * Get current user information
 * @route GET /api/v1/auth/me
 * @access Private
 */
export const getCurrentUser = catchAsync(async (req, res, next) => {
  // User is already attached to req by protect middleware
  const [user] = await query(
    'SELECT id, email, first_name, last_name, role, is_active, email_verified, last_login, created_at FROM users WHERE id = ?',
    [req.user.id]
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        isActive: user.is_active,
        emailVerified: user.email_verified,
        lastLogin: user.last_login,
        createdAt: user.created_at
      }
    }
  });
});

/**
 * Logout user
 * @route POST /api/v1/auth/logout
 * @access Private
 */
export const logout = catchAsync(async (req, res, next) => {
  // Clear the JWT cookie
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});
