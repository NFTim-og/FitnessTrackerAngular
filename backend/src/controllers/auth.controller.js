/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

const User = require('../models/user.model'); // User model for database operations
const Profile = require('../models/profile.model'); // Profile model for user profiles
const jwt = require('jsonwebtoken'); // JWT for authentication tokens
require('dotenv').config(); // Load environment variables

/**
 * Register a new user
 *
 * @route POST /api/v1/auth/register
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @param {string} req.body.passwordConfirm - Password confirmation
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data and token
 */
exports.register = async (req, res) => {
  try {
    const { email, password, passwordConfirm } = req.body;

    // Validate that passwords match
    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match'
      });
    }

    // Check if email is already registered
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }

    // Create new user in database
    const user = await User.create({
      email,
      password // Password will be hashed in the model
    });

    // Create user profile
    await Profile.create({
      user_id: user.id
    });

    // Generate JWT authentication token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Remove password from response for security
    user.password = undefined;

    // Return success response with user data and token
    return res.status(201).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Registration error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Login user
 *
 * @route POST /api/v1/auth/login
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data and token
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, passwordLength: password?.length });

    // Find user by email
    const user = await User.findByEmail(email);
    console.log('User found:', !!user);
    if (user) {
      console.log('User details:', { id: user.id, email: user.email, role: user.role, passwordExists: !!user.password });
    }

    // Return generic error if user not found (security best practice)
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Verify password
    console.log('Comparing password...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);

    // Return generic error if password is invalid (security best practice)
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT authentication token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Remove password from response for security
    user.password = undefined;

    // Return success response with user data and token
    return res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Get current user profile
 * Requires authentication
 *
 * @route GET /api/v1/auth/me
 * @param {Object} req - Express request object
 * @param {Object} req.user - User object from auth middleware
 * @param {string} req.user.id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // Get user from database using ID from JWT token
    const user = await User.findById(req.user.id);

    // Handle case where user no longer exists
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Remove password from response for security
    user.password = undefined;

    // Return user data
    return res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Get current user error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};
