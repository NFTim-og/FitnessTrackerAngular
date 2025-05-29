const { body } = require('express-validator');

exports.exerciseValidation = [
  body('name')
    .notEmpty()
    .withMessage('Exercise name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Exercise name must be between 3 and 100 characters'),
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  body('calories')
    .notEmpty()
    .withMessage('Calories is required')
    .isInt({ min: 0 })
    .withMessage('Calories must be a non-negative integer'),
  body('difficulty')
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  body('met_value')
    .notEmpty()
    .withMessage('MET value is required')
    .isFloat({ min: 0 })
    .withMessage('MET value must be a non-negative number')
];
