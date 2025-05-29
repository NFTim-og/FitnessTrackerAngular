/**
 * Workout Plan Routes
 * UF3/UF4 Curriculum Project
 * Handles workout plan management, exercise assignments, and workout tracking
 */

import express from 'express';
import * as workoutPlanController from '../controllers/workout-plan.controller.js';
import { protect, restrictTo, checkOwnership, optionalAuth } from '../middlewares/auth.middleware.js';
import { validateWorkoutPlan, validateWorkoutExercise, validateUUID, validatePagination, validate } from '../middlewares/validation.middleware.js';
import { paginationMiddleware } from '../utils/pagination.utils.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkoutPlan:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - difficulty
 *         - estimated_duration_minutes
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           maxLength: 100
 *         description:
 *           type: string
 *           maxLength: 1000
 *         category:
 *           type: string
 *           enum: [strength, cardio, flexibility, mixed, sports]
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         estimated_duration_minutes:
 *           type: integer
 *           minimum: 5
 *           maximum: 300
 *         target_muscle_groups:
 *           type: array
 *           items:
 *             type: string
 *         equipment_needed:
 *           type: array
 *           items:
 *             type: string
 *         instructions:
 *           type: string
 *           maxLength: 2000
 *         created_by:
 *           type: string
 *           format: uuid
 *         is_public:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         exercises:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               exercise_id:
 *                 type: string
 *                 format: uuid
 *               order_index:
 *                 type: integer
 *               sets:
 *                 type: integer
 *               reps:
 *                 type: integer
 *               duration_seconds:
 *                 type: integer
 *               rest_seconds:
 *                 type: integer
 *               notes:
 *                 type: string
 */

/**
 * @swagger
 * /api/v1/workout-plans:
 *   get:
 *     summary: Get all workout plans with pagination and filtering
 *     tags: [Workout Plans]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [strength, cardio, flexibility, mixed, sports]
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout plans retrieved successfully
 */
router.get('/',
  optionalAuth,
  validatePagination,
  validate,
  paginationMiddleware({
    allowedSortFields: ['name', 'category', 'difficulty', 'estimated_duration_minutes', 'created_at'],
    allowedFilters: ['category', 'difficulty', 'is_public'],
    defaultSortField: 'name'
  }),
  workoutPlanController.getAllWorkoutPlans
);

/**
 * @swagger
 * /api/v1/workout-plans/{id}:
 *   get:
 *     summary: Get workout plan by ID
 *     tags: [Workout Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Workout plan retrieved successfully
 *       404:
 *         description: Workout plan not found
 */
router.get('/:id', validateUUID, validate, workoutPlanController.getWorkoutPlan);

// Protected routes - require authentication
router.use(protect);

/**
 * @swagger
 * /api/v1/workout-plans:
 *   post:
 *     summary: Create a new workout plan
 *     tags: [Workout Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutPlan'
 *     responses:
 *       201:
 *         description: Workout plan created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validateWorkoutPlan, validate, workoutPlanController.createWorkoutPlan);

/**
 * @swagger
 * /api/v1/workout-plans/{id}:
 *   put:
 *     summary: Update workout plan
 *     tags: [Workout Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutPlan'
 *     responses:
 *       200:
 *         description: Workout plan updated successfully
 *       404:
 *         description: Workout plan not found
 *       403:
 *         description: Not authorized to update this workout plan
 */
router.put('/:id', validateUUID, validateWorkoutPlan, validate, workoutPlanController.updateWorkoutPlan);

/**
 * @swagger
 * /api/v1/workout-plans/{id}:
 *   delete:
 *     summary: Delete workout plan
 *     tags: [Workout Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Workout plan deleted successfully
 *       404:
 *         description: Workout plan not found
 *       403:
 *         description: Not authorized to delete this workout plan
 */
router.delete('/:id', validateUUID, validate, workoutPlanController.deleteWorkoutPlan);

/**
 * @swagger
 * /api/v1/workout-plans/{id}/exercises:
 *   post:
 *     summary: Add exercise to workout plan
 *     tags: [Workout Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exercise_id
 *               - order_index
 *             properties:
 *               exercise_id:
 *                 type: string
 *                 format: uuid
 *               order_index:
 *                 type: integer
 *               sets:
 *                 type: integer
 *               reps:
 *                 type: integer
 *               duration_seconds:
 *                 type: integer
 *               rest_seconds:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exercise added to workout plan successfully
 */
router.post('/:id/exercises', validateUUID, validateWorkoutExercise, validate, workoutPlanController.addExerciseToWorkoutPlan);

/**
 * @swagger
 * /api/v1/workout-plans/{id}/exercises/{exerciseId}:
 *   put:
 *     summary: Update exercise in workout plan
 *     tags: [Workout Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Exercise updated in workout plan successfully
 */
router.put('/:id/exercises/:exerciseId', validateUUID, validateWorkoutExercise, validate, workoutPlanController.updateExerciseInWorkoutPlan);

/**
 * @swagger
 * /api/v1/workout-plans/{id}/exercises/{exerciseId}:
 *   delete:
 *     summary: Remove exercise from workout plan
 *     tags: [Workout Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Exercise removed from workout plan successfully
 */
router.delete('/:id/exercises/:exerciseId', validateUUID, validate, workoutPlanController.removeExerciseFromWorkoutPlan);

export default router;
