/**
 * Exercise Routes Module
 * Defines all API endpoints related to exercise management
 */

const express = require('express'); // Express framework
const exerciseController = require('../controllers/exercise.controller'); // Exercise controller functions
const authMiddleware = require('../middleware/auth.middleware'); // Authentication middleware

// Create a new router instance
const router = express.Router();

/**
 * Public routes - accessible without authentication
 */
// GET /api/v1/exercises - Get all exercises with pagination, sorting and filtering
router.get('/', exerciseController.getAllExercises);
// GET /api/v1/exercises/:id - Get a specific exercise by ID
router.get('/:id', exerciseController.getExercise);

/**
 * Protected routes - require authentication
 * All routes below this middleware require a valid JWT token
 */
router.use(authMiddleware.protect); // Apply authentication middleware

// POST /api/v1/exercises - Create a new exercise
router.post('/', exerciseController.createExercise);
// PUT /api/v1/exercises/:id - Update an existing exercise
router.put('/:id', exerciseController.updateExercise);
// DELETE /api/v1/exercises/:id - Delete an exercise
router.delete('/:id', exerciseController.deleteExercise);

// Export the router for use in the main application
module.exports = router;
