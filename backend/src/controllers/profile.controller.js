/**
 * Profile Controller
 * Handles all business logic for user profile operations
 */

import { query } from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';
import { catchAsync, AppError } from '../middlewares/error.middleware.js';
import { encryptObjectFields, decryptObjectFields } from '../utils/encryption.utils.js';

/**
 * Get current user's profile
 * Requires authentication
 *
 * @route GET /api/v1/profile
 * @param {Object} req - Express request object
 * @param {Object} req.user - User object from auth middleware
 * @param {string} req.user.id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with profile data or error
 */
export const getProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Get user profile with joined user data from user_profiles table
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
 * Update current user's profile
 * Requires authentication
 *
 * @route PUT /api/v1/profile
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {number} [req.body.weight_kg] - User weight in kilograms
 * @param {number} [req.body.height_cm] - User height in centimeters
 * @param {Object} req.user - User object from auth middleware
 * @param {string} req.user.id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated profile data or error
 */
export const updateProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { weight_kg, height_cm, date_of_birth, gender, activity_level, fitness_goal } = req.body;

  // Validate weight if provided (must be between 30 and 300 kg)
  if (weight_kg !== undefined && (weight_kg < 30 || weight_kg > 300)) {
    return next(new AppError('Weight must be between 30 and 300 kg', 400));
  }

  // Validate height if provided (must be between 100 and 250 cm)
  if (height_cm !== undefined && (height_cm < 100 || height_cm > 250)) {
    return next(new AppError('Height must be between 100 and 250 cm', 400));
  }

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
    const updateFields = [];
    const updateValues = [];

    if (weight_kg !== undefined) {
      updateFields.push('weight_kg = ?');
      updateValues.push(weight_kg);
    }
    if (height_cm !== undefined) {
      updateFields.push('height_cm = ?');
      updateValues.push(height_cm);
    }
    if (date_of_birth !== undefined) {
      updateFields.push('date_of_birth = ?');
      updateValues.push(date_of_birth);
    }
    if (gender !== undefined) {
      updateFields.push('gender = ?');
      updateValues.push(gender);
    }
    if (activity_level !== undefined) {
      updateFields.push('activity_level = ?');
      updateValues.push(activity_level);
    }
    if (fitness_goal !== undefined) {
      updateFields.push('fitness_goal = ?');
      updateValues.push(fitness_goal);
    }

    if (updateFields.length > 0) {
      updateFields.push('updated_at = NOW()');
      updateValues.push(userId);

      await query(
        `UPDATE user_profiles SET ${updateFields.join(', ')} WHERE user_id = ?`,
        updateValues
      );
    }
  }

  // Get the updated profile
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
