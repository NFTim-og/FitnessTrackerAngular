const { body } = require('express-validator');

exports.workoutPlanValidation = [
  body('name')
    .notEmpty()
    .withMessage('Workout plan name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Workout plan name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('exercises')
    .isArray()
    .withMessage('Exercises must be an array')
    .notEmpty()
    .withMessage('At least one exercise is required'),
  body('exercises.*.exercise_id')
    .notEmpty()
    .withMessage('Exercise ID is required'),
  body('exercises.*.order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer')
];
