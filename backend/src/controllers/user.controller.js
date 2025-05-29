/**
 * User Controller
 * UF3/UF4 Curriculum Project
 * Handles user profile management, weight tracking, and user data operations
 */

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/database.js';
import { catchAsync, AppError } from '../middlewares/error.middleware.js';
import { encryptObjectFields, decryptObjectFields } from '../utils/encryption.utils.js';
import {
  parsePaginationParams,
  parseSortParams,
  calculatePaginationMeta,
  createPaginatedResponse,
  buildWhereClause,
  buildOrderByClause,
  buildLimitClause
} from '../utils/pagination.utils.js';

/**
 * Get user profile
 * @route GET /api/v1/users/:userId/profile
 * @access Private (Own profile or Admin)
 */
export const getProfile = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  // Get user profile with joined user data
  const [profile] = await query(`
    SELECT
      up.id, up.user_id, up.weight_kg, up.height_cm, up.date_of_birth,
      up.gender, up.activity_level, up.fitness_goal, up.created_at, up.updated_at,
      u.email, u.first_name, u.last_name, u.role
    FROM user_profiles up
    JOIN users u ON up.user_id = u.id
    WHERE up.user_id = ?
  `, [userId]);

  if (!profile) {
    // Create profile if it doesn't exist
    const profileId = uuidv4();
    await query(
      'INSERT INTO user_profiles (id, user_id) VALUES (?, ?)',
      [profileId, userId]
    );

    // Get the newly created profile
    const [newProfile] = await query(`
      SELECT
        up.id, up.user_id, up.weight_kg, up.height_cm, up.date_of_birth,
        up.gender, up.activity_level, up.fitness_goal, up.created_at, up.updated_at,
        u.email, u.first_name, u.last_name, u.role
      FROM user_profiles up
      JOIN users u ON up.user_id = u.id
      WHERE up.user_id = ?
    `, [userId]);

    if (!newProfile) {
      return next(new AppError('Unable to create profile', 500));
    }

    const decryptedProfile = decryptObjectFields(newProfile, ['first_name', 'last_name']);

    return res.status(200).json({
      status: 'success',
      data: {
        profile: {
          id: decryptedProfile.id,
          userId: decryptedProfile.user_id,
          email: decryptedProfile.email,
          firstName: decryptedProfile.first_name,
          lastName: decryptedProfile.last_name,
          role: decryptedProfile.role,
          weightKg: decryptedProfile.weight_kg,
          heightCm: decryptedProfile.height_cm,
          dateOfBirth: decryptedProfile.date_of_birth,
          gender: decryptedProfile.gender,
          activityLevel: decryptedProfile.activity_level,
          fitnessGoal: decryptedProfile.fitness_goal,
          createdAt: decryptedProfile.created_at,
          updatedAt: decryptedProfile.updated_at
        }
      }
    });
  }

  // Decrypt sensitive data
  const decryptedProfile = decryptObjectFields(profile, ['first_name', 'last_name']);

  res.status(200).json({
    status: 'success',
    data: {
      profile: {
        id: decryptedProfile.id,
        userId: decryptedProfile.user_id,
        email: decryptedProfile.email,
        firstName: decryptedProfile.first_name,
        lastName: decryptedProfile.last_name,
        role: decryptedProfile.role,
        weightKg: decryptedProfile.weight_kg,
        heightCm: decryptedProfile.height_cm,
        dateOfBirth: decryptedProfile.date_of_birth,
        gender: decryptedProfile.gender,
        activityLevel: decryptedProfile.activity_level,
        fitnessGoal: decryptedProfile.fitness_goal,
        createdAt: decryptedProfile.created_at,
        updatedAt: decryptedProfile.updated_at
      }
    }
  });
});

/**
 * Update user profile
 * @route PUT /api/v1/users/:userId/profile
 * @access Private (Own profile or Admin)
 */
export const updateProfile = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { weight_kg, height_cm, date_of_birth, gender, activity_level, fitness_goal } = req.body;

  // Check if profile exists
  const [existingProfile] = await query(
    'SELECT id FROM user_profiles WHERE user_id = ?',
    [userId]
  );

  if (!existingProfile) {
    // Create profile if it doesn't exist
    const profileId = uuidv4();
    await query(
      'INSERT INTO user_profiles (id, user_id, weight_kg, height_cm, date_of_birth, gender, activity_level, fitness_goal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [profileId, userId, weight_kg, height_cm, date_of_birth, gender, activity_level, fitness_goal]
    );
  } else {
    // Update existing profile
    await query(
      'UPDATE user_profiles SET weight_kg = ?, height_cm = ?, date_of_birth = ?, gender = ?, activity_level = ?, fitness_goal = ?, updated_at = NOW() WHERE user_id = ?',
      [weight_kg, height_cm, date_of_birth, gender, activity_level, fitness_goal, userId]
    );
  }

  // Get updated profile
  const [updatedProfile] = await query(`
    SELECT
      up.id, up.user_id, up.weight_kg, up.height_cm, up.date_of_birth,
      up.gender, up.activity_level, up.fitness_goal, up.created_at, up.updated_at,
      u.email, u.first_name, u.last_name, u.role
    FROM user_profiles up
    JOIN users u ON up.user_id = u.id
    WHERE up.user_id = ?
  `, [userId]);

  // Decrypt sensitive data
  const decryptedProfile = decryptObjectFields(updatedProfile, ['first_name', 'last_name']);

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      profile: {
        id: decryptedProfile.id,
        userId: decryptedProfile.user_id,
        email: decryptedProfile.email,
        firstName: decryptedProfile.first_name,
        lastName: decryptedProfile.last_name,
        role: decryptedProfile.role,
        weightKg: decryptedProfile.weight_kg,
        heightCm: decryptedProfile.height_cm,
        dateOfBirth: decryptedProfile.date_of_birth,
        gender: decryptedProfile.gender,
        activityLevel: decryptedProfile.activity_level,
        fitnessGoal: decryptedProfile.fitness_goal,
        createdAt: decryptedProfile.created_at,
        updatedAt: decryptedProfile.updated_at
      }
    }
  });
});

/**
 * Add weight entry
 * @route POST /api/v1/users/:userId/weight
 * @access Private (Own data or Admin)
 */
export const addWeightEntry = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { weight_kg, recorded_date, notes } = req.body;

  // Check if entry already exists for this date
  const [existingEntry] = await query(
    'SELECT id FROM weight_history WHERE user_id = ? AND recorded_date = ?',
    [userId, recorded_date]
  );

  if (existingEntry) {
    return next(new AppError('Weight entry already exists for this date', 409));
  }

  // Create weight entry
  const entryId = uuidv4();
  await query(
    'INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, notes) VALUES (?, ?, ?, ?, ?)',
    [entryId, userId, weight_kg, recorded_date, notes]
  );

  // Get the created entry
  const [newEntry] = await query(
    'SELECT id, user_id, weight_kg, recorded_date, notes, created_at FROM weight_history WHERE id = ?',
    [entryId]
  );

  res.status(201).json({
    status: 'success',
    message: 'Weight entry added successfully',
    data: {
      weightEntry: {
        id: newEntry.id,
        userId: newEntry.user_id,
        weightKg: newEntry.weight_kg,
        recordedDate: newEntry.recorded_date,
        notes: newEntry.notes,
        createdAt: newEntry.created_at
      }
    }
  });
});

/**
 * Get weight history
 * @route GET /api/v1/users/:userId/weight
 * @access Private (Own data or Admin)
 */
export const getWeightHistory = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { page, limit, offset } = req.pagination;
  const { sortBy, sortOrder } = req.sorting;

  // Get total count
  const [countResult] = await query(
    'SELECT COUNT(*) as total FROM weight_history WHERE user_id = ?',
    [userId]
  );
  const totalCount = countResult.total;

  // Get weight history with pagination
  const weightHistory = await query(`
    SELECT id, user_id, weight_kg, recorded_date, notes, created_at
    FROM weight_history
    WHERE user_id = ?
    ${buildOrderByClause(sortBy, sortOrder)}
    ${buildLimitClause(limit, offset)}
  `, [userId]);

  // Calculate pagination metadata
  const paginationMeta = calculatePaginationMeta(totalCount, page, limit);

  // Format response data
  const formattedData = weightHistory.map(entry => ({
    id: entry.id,
    userId: entry.user_id,
    weightKg: entry.weight_kg,
    recordedDate: entry.recorded_date,
    notes: entry.notes,
    createdAt: entry.created_at
  }));

  res.status(200).json(createPaginatedResponse(
    formattedData,
    paginationMeta,
    'Weight history retrieved successfully'
  ));
});

/**
 * Get all users (Admin only)
 * @route GET /api/v1/users
 * @access Private (Admin only)
 */
export const getAllUsers = catchAsync(async (req, res, next) => {
  const { page, limit, offset } = req.pagination;
  const { sortBy, sortOrder } = req.sorting;

  // Get total count
  const [countResult] = await query('SELECT COUNT(*) as total FROM users');
  const totalCount = countResult.total;

  // Get users with pagination
  const users = await query(`
    SELECT id, email, first_name, last_name, role, is_active, email_verified, last_login, created_at
    FROM users
    ${buildOrderByClause(sortBy, sortOrder)}
    ${buildLimitClause(limit, offset)}
  `);

  // Calculate pagination metadata
  const paginationMeta = calculatePaginationMeta(totalCount, page, limit);

  // Decrypt and format response data
  const formattedData = users.map(user => {
    const decryptedUser = decryptObjectFields(user, ['first_name', 'last_name']);
    return {
      id: decryptedUser.id,
      email: decryptedUser.email,
      firstName: decryptedUser.first_name,
      lastName: decryptedUser.last_name,
      role: decryptedUser.role,
      isActive: decryptedUser.is_active,
      emailVerified: decryptedUser.email_verified,
      lastLogin: decryptedUser.last_login,
      createdAt: decryptedUser.created_at
    };
  });

  res.status(200).json(createPaginatedResponse(
    formattedData,
    paginationMeta,
    'Users retrieved successfully'
  ));
});

/**
 * Get user by ID (Admin only)
 * @route GET /api/v1/users/:userId
 * @access Private (Admin only)
 */
export const getUserById = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const [user] = await query(
    'SELECT id, email, first_name, last_name, role, is_active, email_verified, last_login, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Decrypt sensitive data
  const decryptedUser = decryptObjectFields(user, ['first_name', 'last_name']);

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: decryptedUser.id,
        email: decryptedUser.email,
        firstName: decryptedUser.first_name,
        lastName: decryptedUser.last_name,
        role: decryptedUser.role,
        isActive: decryptedUser.is_active,
        emailVerified: decryptedUser.email_verified,
        lastLogin: decryptedUser.last_login,
        createdAt: decryptedUser.created_at
      }
    }
  });
});

/**
 * Update user status (Admin only)
 * @route PATCH /api/v1/users/:userId/status
 * @access Private (Admin only)
 */
export const updateUserStatus = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { isActive } = req.body;

  // Update user status
  await query(
    'UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?',
    [isActive, userId]
  );

  // Get updated user
  const [updatedUser] = await query(
    'SELECT id, email, first_name, last_name, role, is_active, email_verified, last_login, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  // Decrypt sensitive data
  const decryptedUser = decryptObjectFields(updatedUser, ['first_name', 'last_name']);

  res.status(200).json({
    status: 'success',
    message: 'User status updated successfully',
    data: {
      user: {
        id: decryptedUser.id,
        email: decryptedUser.email,
        firstName: decryptedUser.first_name,
        lastName: decryptedUser.last_name,
        role: decryptedUser.role,
        isActive: decryptedUser.is_active,
        emailVerified: decryptedUser.email_verified,
        lastLogin: decryptedUser.last_login,
        createdAt: decryptedUser.created_at
      }
    }
  });
});
