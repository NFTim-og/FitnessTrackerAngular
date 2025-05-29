/**
 * Workout Plan Controller
 * Handles all business logic for workout plan-related operations
 */

const WorkoutPlan = require('../models/workout-plan.model'); // Import WorkoutPlan model

/**
 * Get all workout plans with pagination
 *
 * @route GET /api/v1/workout-plans
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with workout plans and pagination info
 */
exports.getAllWorkoutPlans = async (req, res) => {
  try {
    // Parse pagination parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Fetch workout plans from database with pagination
    const result = await WorkoutPlan.findAll(page, limit);

    // Return successful response with workout plans and pagination info
    return res.status(200).json({
      status: 'success',
      data: {
        workoutPlans: result.workoutPlans,
        pagination: result.pagination
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Get workout plans error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Get a specific workout plan by ID
 *
 * @route GET /api/v1/workout-plans/:id
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Workout plan ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with workout plan data or error
 */
exports.getWorkoutPlan = async (req, res) => {
  try {
    // Find workout plan by ID in database
    const workoutPlan = await WorkoutPlan.findById(req.params.id);

    // Return 404 if workout plan not found
    if (!workoutPlan) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout plan not found'
      });
    }

    // Return successful response with workout plan data
    return res.status(200).json({
      status: 'success',
      data: {
        workoutPlan
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Get workout plan error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Create a new workout plan
 * Requires authentication
 *
 * @route POST /api/v1/workout-plans
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.name - Workout plan name
 * @param {string} [req.body.description] - Workout plan description
 * @param {Array} [req.body.exercises] - List of exercises to include
 * @param {Object} req.user - Authenticated user info (from auth middleware)
 * @param {string} req.user.id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created workout plan data or error
 */
exports.createWorkoutPlan = async (req, res) => {
  try {
    // Extract workout plan data from request body
    const { name, description, exercises } = req.body;

    // Create new workout plan in database
    const workoutPlan = await WorkoutPlan.create({
      name,
      description,
      exercises,
      created_by: req.user.id // Set creator to current authenticated user
    });

    // Return successful response with created workout plan
    return res.status(201).json({
      status: 'success',
      data: {
        workoutPlan
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Create workout plan error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Update an existing workout plan
 * Requires authentication
 *
 * @route PUT /api/v1/workout-plans/:id
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Workout plan ID to update
 * @param {Object} req.body - Request body with fields to update
 * @param {string} [req.body.name] - Workout plan name
 * @param {string} [req.body.description] - Workout plan description
 * @param {Array} [req.body.exercises] - List of exercises to include
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated workout plan data or error
 */
exports.updateWorkoutPlan = async (req, res) => {
  try {
    // Extract workout plan data from request body
    const { name, description, exercises } = req.body;

    // Update workout plan in database
    const workoutPlan = await WorkoutPlan.update(req.params.id, {
      name,
      description,
      exercises
    });

    // Return successful response with updated workout plan
    return res.status(200).json({
      status: 'success',
      data: {
        workoutPlan
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Update workout plan error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Delete a workout plan
 * Requires authentication
 *
 * @route DELETE /api/v1/workout-plans/:id
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Workout plan ID to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON response indicating success or error
 */
exports.deleteWorkoutPlan = async (req, res) => {
  try {
    // Delete workout plan from database
    const deleted = await WorkoutPlan.delete(req.params.id);

    // Return 404 if workout plan not found
    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Workout plan not found'
      });
    }

    // Return successful response with no data
    return res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    // Log and handle errors
    console.error('Delete workout plan error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};
