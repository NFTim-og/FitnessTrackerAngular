/**
 * Exercise Controller
 * Handles all business logic for exercise-related operations
 */

const Exercise = require('../models/exercise.model'); // Import Exercise model

/**
 * Get all exercises with pagination, sorting and filtering
 *
 * @route GET /api/v1/exercises
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {string} [req.query.sortBy='name'] - Field to sort by
 * @param {string} [req.query.sortOrder='ASC'] - Sort order (ASC or DESC)
 * @param {string} [req.query.difficulty] - Filter by difficulty level
 * @param {string} [req.query.search] - Search term for exercise name
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with exercises and pagination info
 */
exports.getAllExercises = async (req, res) => {
  try {
    // Parse pagination parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder || 'ASC';

    // Build filters object from query parameters
    const filters = {};
    if (req.query.difficulty) filters.difficulty = req.query.difficulty;
    if (req.query.search) filters.search = req.query.search;

    // Fetch exercises from database with pagination, sorting and filtering
    const result = await Exercise.findAll(page, limit, sortBy, sortOrder, filters);

    // Return successful response with exercises and pagination info
    return res.status(200).json({
      status: 'success',
      data: {
        exercises: result.exercises,
        pagination: result.pagination
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Get exercises error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Get a specific exercise by ID
 *
 * @route GET /api/v1/exercises/:id
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Exercise ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with exercise data or error
 */
exports.getExercise = async (req, res) => {
  try {
    // Find exercise by ID in database
    const exercise = await Exercise.findById(req.params.id);

    // Return 404 if exercise not found
    if (!exercise) {
      return res.status(404).json({
        status: 'error',
        message: 'Exercise not found'
      });
    }

    // Return successful response with exercise data
    return res.status(200).json({
      status: 'success',
      data: {
        exercise
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Get exercise error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Create a new exercise
 * Requires authentication
 *
 * @route POST /api/v1/exercises
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Exercise name
 * @param {number} req.body.duration - Exercise duration in minutes
 * @param {number} [req.body.calories] - Calories burned
 * @param {string} [req.body.difficulty] - Difficulty level (easy, medium, hard)
 * @param {number} [req.body.met_value] - Metabolic equivalent value
 * @param {Object} req.user - Authenticated user info (from auth middleware)
 * @param {string} req.user.id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created exercise data or error
 */
exports.createExercise = async (req, res) => {
  try {
    // Extract exercise data from request body
    const { name, duration, calories, difficulty, met_value } = req.body;

    // Create new exercise in database
    const exercise = await Exercise.create({
      name,
      duration,
      calories,
      difficulty,
      met_value,
      created_by: req.user.id // Set creator to current authenticated user
    });

    // Return successful response with created exercise
    return res.status(201).json({
      status: 'success',
      data: {
        exercise
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Create exercise error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Update an existing exercise
 * Requires authentication
 *
 * @route PUT /api/v1/exercises/:id
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Exercise ID to update
 * @param {Object} req.body - Request body with fields to update
 * @param {string} [req.body.name] - Exercise name
 * @param {number} [req.body.duration] - Exercise duration in minutes
 * @param {number} [req.body.calories] - Calories burned
 * @param {string} [req.body.difficulty] - Difficulty level
 * @param {number} [req.body.met_value] - Metabolic equivalent value
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated exercise data or error
 */
exports.updateExercise = async (req, res) => {
  try {
    // Extract exercise data from request body
    const { name, duration, calories, difficulty, met_value } = req.body;

    // Update exercise in database
    const exercise = await Exercise.update(req.params.id, {
      name,
      duration,
      calories,
      difficulty,
      met_value
    });

    // Return successful response with updated exercise
    return res.status(200).json({
      status: 'success',
      data: {
        exercise
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Update exercise error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Delete an exercise
 * Requires authentication
 *
 * @route DELETE /api/v1/exercises/:id
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Exercise ID to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON response indicating success or error
 */
exports.deleteExercise = async (req, res) => {
  try {
    // Delete exercise from database
    const deleted = await Exercise.delete(req.params.id);

    // Return 404 if exercise not found
    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Exercise not found'
      });
    }

    // Return successful response with no data
    return res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    // Log and handle errors
    console.error('Delete exercise error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};
