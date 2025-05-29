/**
 * Comprehensive Validation Middleware
 * UF3/UF4 Curriculum Project
 * Provides input validation and sanitization using express-validator
 */

import { validationResult, body, param, query } from 'express-validator';
import { AppError } from './error.middleware.js';

/**
 * Validation middleware to handle express-validator results
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errorMessages,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

/**
 * User registration validation rules
 */
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  body('passwordConfirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),

  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters')
];

/**
 * User login validation rules
 */
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * User profile validation rules
 */
const validateUserProfile = [
  body('weight_kg')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Weight must be between 30 and 300 kg'),

  body('height_cm')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),

  body('date_of_birth')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid date of birth'),

  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),

  body('activity_level')
    .optional()
    .isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'])
    .withMessage('Invalid activity level'),

  body('fitness_goal')
    .optional()
    .isIn(['lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle', 'improve_endurance'])
    .withMessage('Invalid fitness goal')
];

/**
 * Exercise validation rules
 */
const validateExercise = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Exercise name must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('category')
    .isIn(['cardio', 'strength', 'flexibility', 'balance', 'sports'])
    .withMessage('Invalid exercise category'),

  body('duration_minutes')
    .isInt({ min: 1, max: 300 })
    .withMessage('Duration must be between 1 and 300 minutes'),

  body('calories_per_minute')
    .isFloat({ min: 0.1, max: 50 })
    .withMessage('Calories per minute must be between 0.1 and 50'),

  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),

  body('met_value')
    .isFloat({ min: 0.1, max: 20 })
    .withMessage('MET value must be between 0.1 and 20'),

  body('equipment_needed')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Equipment description must not exceed 255 characters'),

  body('muscle_groups')
    .optional()
    .isArray()
    .withMessage('Muscle groups must be an array'),

  body('instructions')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Instructions must not exceed 2000 characters')
];

/**
 * Workout plan validation rules
 */
const validateWorkoutPlan = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Workout plan name must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),

  body('category')
    .optional()
    .isIn(['weight_loss', 'muscle_gain', 'endurance', 'strength', 'flexibility', 'general_fitness'])
    .withMessage('Invalid workout plan category'),

  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Difficulty must be beginner, intermediate, or advanced'),

  body('estimated_duration_minutes')
    .optional()
    .isInt({ min: 5, max: 300 })
    .withMessage('Estimated duration must be between 5 and 300 minutes'),

  body('target_calories')
    .optional()
    .isInt({ min: 10, max: 2000 })
    .withMessage('Target calories must be between 10 and 2000')
];

/**
 * UUID parameter validation
 */
const validateUUID = [
  param('id')
    .isUUID()
    .withMessage('Invalid ID format')
];

/**
 * Pagination validation rules
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sortBy')
    .optional()
    .isAlpha()
    .withMessage('Sort field must contain only letters'),

  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC', 'asc', 'desc'])
    .withMessage('Sort order must be ASC or DESC')
];

/**
 * Weight history validation rules
 */
const validateWeightEntry = [
  body('weight_kg')
    .isFloat({ min: 30, max: 300 })
    .withMessage('Weight must be between 30 and 300 kg'),

  body('recorded_date')
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid date'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters')
];

export {
  validate,
  validateUserRegistration,
  validateUserLogin,
  validateUserProfile,
  validateExercise,
  validateWorkoutPlan,
  validateUUID,
  validatePagination,
  validateWeightEntry
};
