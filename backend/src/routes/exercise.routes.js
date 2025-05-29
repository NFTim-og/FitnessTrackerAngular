/**
 * Exercise Routes
 * UF3/UF4 Curriculum Project
 * Defines all API endpoints related to exercise management with comprehensive validation
 */

import express from 'express';
import * as exerciseController from '../controllers/exercise.controller.js';
import { protect, restrictTo, optionalAuth } from '../middlewares/auth.middleware.js';
import { validateExercise, validateUUID, validatePagination, validate } from '../middlewares/validation.middleware.js';
import { paginationMiddleware } from '../utils/pagination.utils.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - duration_minutes
 *         - calories_per_minute
 *         - difficulty
 *         - met_value
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Exercise unique identifier
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Exercise name
 *         description:
 *           type: string
 *           maxLength: 1000
 *           description: Exercise description
 *         category:
 *           type: string
 *           enum: [cardio, strength, flexibility, balance, sports]
 *           description: Exercise category
 *         duration_minutes:
 *           type: integer
 *           minimum: 1
 *           maximum: 300
 *           description: Exercise duration in minutes
 *         calories_per_minute:
 *           type: number
 *           minimum: 0.1
 *           maximum: 50
 *           description: Calories burned per minute
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Exercise difficulty level
 *         met_value:
 *           type: number
 *           minimum: 0.1
 *           maximum: 20
 *           description: Metabolic equivalent of task value
 *         equipment_needed:
 *           type: string
 *           maxLength: 255
 *           description: Equipment required for exercise
 *         muscle_groups:
 *           type: array
 *           items:
 *             type: string
 *           description: Muscle groups targeted
 *         instructions:
 *           type: string
 *           maxLength: 2000
 *           description: Exercise instructions
 *         created_by:
 *           type: string
 *           format: uuid
 *           description: User who created the exercise
 *         is_public:
 *           type: boolean
 *           description: Whether exercise is publicly available
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/exercises:
 *   get:
 *     summary: Get all exercises with pagination and filtering
 *     tags: [Exercises]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of exercises per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [cardio, strength, flexibility, balance, sports]
 *         description: Filter by category
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by difficulty
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and description
 *     responses:
 *       200:
 *         description: Exercises retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exercise'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalCount:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 */
router.get('/',
  optionalAuth,
  validatePagination,
  validate,
  paginationMiddleware({
    allowedSortFields: ['name', 'category', 'difficulty', 'duration_minutes', 'calories_per_minute', 'created_at'],
    allowedFilters: ['category', 'difficulty', 'is_public'],
    defaultSortField: 'name'
  }),
  exerciseController.getAllExercises
);

/**
 * @swagger
 * /api/v1/exercises/{id}:
 *   get:
 *     summary: Get exercise by ID
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Exercise retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       404:
 *         description: Exercise not found
 */
router.get('/:id', validateUUID, validate, exerciseController.getExercise);

// Protected routes - require authentication
router.use(protect);

/**
 * @swagger
 * /api/v1/exercises:
 *   post:
 *     summary: Create a new exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - duration_minutes
 *               - calories_per_minute
 *               - difficulty
 *               - met_value
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [cardio, strength, flexibility, balance, sports]
 *               duration_minutes:
 *                 type: integer
 *               calories_per_minute:
 *                 type: number
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               met_value:
 *                 type: number
 *               equipment_needed:
 *                 type: string
 *               muscle_groups:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exercise created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', validateExercise, validate, exerciseController.createExercise);

/**
 * @swagger
 * /api/v1/exercises/{id}:
 *   put:
 *     summary: Update exercise
 *     tags: [Exercises]
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
 *             $ref: '#/components/schemas/Exercise'
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *       404:
 *         description: Exercise not found
 *       403:
 *         description: Not authorized to update this exercise
 */
router.put('/:id', validateUUID, validateExercise, validate, exerciseController.updateExercise);

/**
 * @swagger
 * /api/v1/exercises/{id}:
 *   delete:
 *     summary: Delete exercise
 *     tags: [Exercises]
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
 *         description: Exercise deleted successfully
 *       404:
 *         description: Exercise not found
 *       403:
 *         description: Not authorized to delete this exercise
 */
router.delete('/:id', validateUUID, validate, exerciseController.deleteExercise);

export default router;
