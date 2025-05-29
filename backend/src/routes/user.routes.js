/**
 * User Routes
 * UF3/UF4 Curriculum Project
 * Handles user profile management, weight tracking, and user data operations
 */

import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect, restrictTo, checkOwnership } from '../middlewares/auth.middleware.js';
import { validateUserProfile, validateWeightEntry, validateUUID, validatePagination, validate } from '../middlewares/validation.middleware.js';
import { paginationMiddleware } from '../utils/pagination.utils.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile routes
router.get('/:userId/profile', validateUUID, validate, checkOwnership('userId'), userController.getProfile);
router.put('/:userId/profile', validateUUID, validateUserProfile, validate, checkOwnership('userId'), userController.updateProfile);

// Weight tracking routes
router.post('/:userId/weight', validateUUID, validateWeightEntry, validate, checkOwnership('userId'), userController.addWeightEntry);
router.get('/:userId/weight',
  validateUUID,
  validatePagination,
  validate,
  checkOwnership('userId'),
  paginationMiddleware({
    allowedSortFields: ['recorded_date', 'weight_kg', 'created_at'],
    defaultSortField: 'recorded_date'
  }),
  userController.getWeightHistory
);

// Admin only routes
router.get('/', restrictTo('admin'), paginationMiddleware(), userController.getAllUsers);
router.get('/:userId', validateUUID, validate, restrictTo('admin'), userController.getUserById);
router.patch('/:userId/status', validateUUID, validate, restrictTo('admin'), userController.updateUserStatus);

export default router;
