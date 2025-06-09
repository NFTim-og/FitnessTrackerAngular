/**
 * Exercise Controller
 * UF3/UF4 Curriculum Project
 * Handles all business logic for exercise-related operations with comprehensive features
 */

import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/database.js';
import { catchAsync, AppError } from '../middlewares/error.middleware.js';
import {
  calculatePaginationMeta,
  createPaginatedResponse,
  buildWhereClause,
  buildOrderByClause,
  buildLimitClause,
  buildSearchClause
} from '../utils/pagination.utils.js';

/**
 * Get all exercises with pagination, sorting and filtering
 * @route GET /api/v1/exercises
 * @access Public (with optional authentication for personalized results)
 */
export const getAllExercises = catchAsync(async (req, res, next) => {
  const { page, limit, offset } = req.pagination;
  const { sortBy, sortOrder } = req.sorting;
  const filters = req.filters;
  const searchTerm = req.query.search;

  // Build WHERE clause for filters
  const filterConditions = [];
  const filterParams = [];

  // Always show public exercises, plus user's own exercises if authenticated
  if (req.user) {
    filterConditions.push('(is_public = ? OR created_by = ?)');
    filterParams.push(true, req.user.id);
  } else {
    filterConditions.push('is_public = ?');
    filterParams.push(true);
  }

  // Add category filter
  if (filters.category) {
    filterConditions.push('category = ?');
    filterParams.push(filters.category);
  }

  // Add difficulty filter
  if (filters.difficulty) {
    filterConditions.push('difficulty = ?');
    filterParams.push(filters.difficulty);
  }

  // Add search functionality
  let searchClause = '';
  let searchParams = [];
  if (searchTerm) {
    const searchResult = buildSearchClause(searchTerm, ['name', 'description'], 'e');
    searchClause = searchResult.searchClause;
    searchParams = searchResult.params;
    if (searchClause) {
      filterConditions.push(searchClause);
      filterParams.push(...searchParams);
    }
  }

  const whereClause = filterConditions.length > 0 ? `WHERE ${filterConditions.join(' AND ')}` : '';

  // Get total count for pagination
  const [countResult] = await query(`
    SELECT COUNT(*) as total
    FROM exercises e
    ${whereClause}
  `, filterParams);
  const totalCount = countResult.total;

  // Get exercises with pagination
  const exercises = await query(`
    SELECT
      e.id, e.name, e.description, e.category, e.duration_minutes,
      e.calories_per_minute, e.difficulty, e.met_value, e.equipment_needed,
      e.muscle_groups, e.instructions, e.created_by, e.is_public,
      e.created_at, e.updated_at,
      u.first_name as creator_first_name, u.last_name as creator_last_name
    FROM exercises e
    LEFT JOIN users u ON e.created_by = u.id
    ${whereClause}
    ${buildOrderByClause(sortBy, sortOrder, 'e')}
    ${buildLimitClause(limit, offset)}
  `, filterParams);

  // Calculate pagination metadata
  const paginationMeta = calculatePaginationMeta(totalCount, page, limit);

  // Format response data
  const formattedData = exercises.map(exercise => ({
    id: exercise.id,
    name: exercise.name,
    description: exercise.description,
    category: exercise.category,
    durationMinutes: exercise.duration_minutes,
    caloriesPerMinute: exercise.calories_per_minute,
    difficulty: exercise.difficulty,
    metValue: exercise.met_value,
    equipmentNeeded: exercise.equipment_needed,
    muscleGroups: (() => {
      // MySQL2 automatically parses JSON columns, so check if it's already an array
      if (Array.isArray(exercise.muscle_groups)) {
        return exercise.muscle_groups;
      }

      // If it's a string, try to parse as JSON first
      if (typeof exercise.muscle_groups === 'string') {
        try {
          const parsed = JSON.parse(exercise.muscle_groups);
          return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          // If JSON parsing fails, treat as comma-separated string
          return exercise.muscle_groups.split(',').map(s => s.trim()).filter(s => s);
        }
      }

      // Default to empty array
      return [];
    })(),
    instructions: exercise.instructions,
    createdBy: exercise.created_by,
    creatorName: exercise.creator_first_name && exercise.creator_last_name
      ? `${exercise.creator_first_name} ${exercise.creator_last_name}`
      : 'Anonymous',
    isPublic: exercise.is_public,
    createdAt: exercise.created_at,
    updatedAt: exercise.updated_at
  }));

  res.status(200).json(createPaginatedResponse(
    formattedData,
    paginationMeta,
    'Exercises retrieved successfully'
  ));
});

/**
 * Get a specific exercise by ID
 * @route GET /api/v1/exercises/:id
 * @access Public
 */
export const getExercise = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Get exercise with creator information
  const [exercise] = await query(`
    SELECT
      e.id, e.name, e.description, e.category, e.duration_minutes,
      e.calories_per_minute, e.difficulty, e.met_value, e.equipment_needed,
      e.muscle_groups, e.instructions, e.created_by, e.is_public,
      e.created_at, e.updated_at,
      u.first_name as creator_first_name, u.last_name as creator_last_name
    FROM exercises e
    LEFT JOIN users u ON e.created_by = u.id
    WHERE e.id = ? AND (e.is_public = ? OR e.created_by = ?)
  `, [id, true, req.user?.id || null]);

  if (!exercise) {
    return next(new AppError('Exercise not found', 404));
  }

  // Format response data
  const formattedExercise = {
    id: exercise.id,
    name: exercise.name,
    description: exercise.description,
    category: exercise.category,
    durationMinutes: exercise.duration_minutes,
    caloriesPerMinute: exercise.calories_per_minute,
    difficulty: exercise.difficulty,
    metValue: exercise.met_value,
    equipmentNeeded: exercise.equipment_needed,
    muscleGroups: (() => {
      // MySQL2 automatically parses JSON columns, so check if it's already an array
      if (Array.isArray(exercise.muscle_groups)) {
        return exercise.muscle_groups;
      }

      // If it's a string, try to parse as JSON first
      if (typeof exercise.muscle_groups === 'string') {
        try {
          const parsed = JSON.parse(exercise.muscle_groups);
          return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          // If JSON parsing fails, treat as comma-separated string
          return exercise.muscle_groups.split(',').map(s => s.trim()).filter(s => s);
        }
      }

      // Default to empty array
      return [];
    })(),
    instructions: exercise.instructions,
    createdBy: exercise.created_by,
    creatorName: exercise.creator_first_name && exercise.creator_last_name
      ? `${exercise.creator_first_name} ${exercise.creator_last_name}`
      : 'Anonymous',
    isPublic: exercise.is_public,
    createdAt: exercise.created_at,
    updatedAt: exercise.updated_at
  };

  res.status(200).json({
    status: 'success',
    data: {
      exercise: formattedExercise
    }
  });
});

/**
 * Create a new exercise
 * @route POST /api/v1/exercises
 * @access Private
 */
export const createExercise = catchAsync(async (req, res, next) => {
  console.log('🏋️ CreateExercise - Request body:', req.body);
  console.log('🏋️ CreateExercise - User:', req.user.id);

  const {
    name,
    description,
    category,
    duration_minutes,
    calories_per_minute,
    difficulty,
    met_value,
    equipment_needed,
    muscle_groups,
    instructions,
    is_public = true
  } = req.body;

  // Check if exercise with same name already exists for this user
  const [existingExercise] = await query(
    'SELECT id FROM exercises WHERE name = ? AND created_by = ?',
    [name, req.user.id]
  );

  if (existingExercise) {
    console.log('🏋️ CreateExercise - Exercise already exists:', existingExercise);
    return next(new AppError('You already have an exercise with this name', 409));
  }

  // Create new exercise
  const exerciseId = uuidv4();
  console.log('🏋️ CreateExercise - Creating exercise with ID:', exerciseId);

  const insertResult = await query(`
    INSERT INTO exercises (
      id, name, description, category, duration_minutes, calories_per_minute,
      difficulty, met_value, equipment_needed, muscle_groups, instructions,
      created_by, is_public
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    exerciseId,
    name,
    description,
    category,
    duration_minutes,
    calories_per_minute,
    difficulty,
    met_value,
    equipment_needed,
    muscle_groups ? JSON.stringify(muscle_groups) : null,
    instructions,
    req.user.id,
    is_public
  ]);

  console.log('🏋️ CreateExercise - Insert result:', insertResult);

  // Get the created exercise with creator information
  const [newExercise] = await query(`
    SELECT
      e.id, e.name, e.description, e.category, e.duration_minutes,
      e.calories_per_minute, e.difficulty, e.met_value, e.equipment_needed,
      e.muscle_groups, e.instructions, e.created_by, e.is_public,
      e.created_at, e.updated_at,
      u.first_name as creator_first_name, u.last_name as creator_last_name
    FROM exercises e
    LEFT JOIN users u ON e.created_by = u.id
    WHERE e.id = ?
  `, [exerciseId]);

  console.log('🏋️ CreateExercise - Retrieved exercise:', newExercise);

  // Format response data
  const formattedExercise = {
    id: newExercise.id,
    name: newExercise.name,
    description: newExercise.description,
    category: newExercise.category,
    durationMinutes: newExercise.duration_minutes,
    caloriesPerMinute: newExercise.calories_per_minute,
    difficulty: newExercise.difficulty,
    metValue: newExercise.met_value,
    equipmentNeeded: newExercise.equipment_needed,
    muscleGroups: (() => {
      // MySQL2 automatically parses JSON columns, so check if it's already an array
      if (Array.isArray(newExercise.muscle_groups)) {
        return newExercise.muscle_groups;
      }

      // If it's a string, try to parse as JSON first
      if (typeof newExercise.muscle_groups === 'string') {
        try {
          const parsed = JSON.parse(newExercise.muscle_groups);
          return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          // If JSON parsing fails, treat as comma-separated string
          return newExercise.muscle_groups.split(',').map(s => s.trim()).filter(s => s);
        }
      }

      // Default to empty array
      return [];
    })(),
    instructions: newExercise.instructions,
    createdBy: newExercise.created_by,
    creatorName: newExercise.creator_first_name && newExercise.creator_last_name
      ? `${newExercise.creator_first_name} ${newExercise.creator_last_name}`
      : 'Anonymous',
    isPublic: newExercise.is_public,
    createdAt: newExercise.created_at,
    updatedAt: newExercise.updated_at
  };

  const response = {
    status: 'success',
    message: 'Exercise created successfully',
    data: {
      exercise: formattedExercise
    }
  };

  console.log('🏋️ CreateExercise - Sending response:', response);

  res.status(201).json(response);
});

/**
 * Update an existing exercise
 * @route PUT /api/v1/exercises/:id
 * @access Private (Own exercises or Admin)
 */
export const updateExercise = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    category,
    duration_minutes,
    calories_per_minute,
    difficulty,
    met_value,
    equipment_needed,
    muscle_groups,
    instructions,
    is_public
  } = req.body;

  // Check if exercise exists and user has permission to update
  const [existingExercise] = await query(
    'SELECT id, created_by FROM exercises WHERE id = ?',
    [id]
  );

  if (!existingExercise) {
    return next(new AppError('Exercise not found', 404));
  }

  // Check ownership (only creator or admin can update)
  if (existingExercise.created_by !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only update your own exercises', 403));
  }

  // Build dynamic update query to only update provided fields
  const updateFields = [];
  const updateValues = [];

  if (name !== undefined) {
    updateFields.push('name = ?');
    updateValues.push(name);
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    updateValues.push(description);
  }
  if (category !== undefined) {
    updateFields.push('category = ?');
    updateValues.push(category);
  }
  if (duration_minutes !== undefined) {
    updateFields.push('duration_minutes = ?');
    updateValues.push(duration_minutes);
  }
  if (calories_per_minute !== undefined) {
    updateFields.push('calories_per_minute = ?');
    updateValues.push(calories_per_minute);
  }
  if (difficulty !== undefined) {
    updateFields.push('difficulty = ?');
    updateValues.push(difficulty);
  }
  if (met_value !== undefined) {
    updateFields.push('met_value = ?');
    updateValues.push(met_value);
  }
  if (equipment_needed !== undefined) {
    updateFields.push('equipment_needed = ?');
    updateValues.push(equipment_needed);
  }
  if (muscle_groups !== undefined) {
    updateFields.push('muscle_groups = ?');
    updateValues.push(muscle_groups ? JSON.stringify(muscle_groups) : null);
  }
  if (instructions !== undefined) {
    updateFields.push('instructions = ?');
    updateValues.push(instructions);
  }
  if (is_public !== undefined) {
    updateFields.push('is_public = ?');
    updateValues.push(is_public);
  }

  // Always update the timestamp
  updateFields.push('updated_at = NOW()');
  updateValues.push(id);

  // Update exercise
  await query(`
    UPDATE exercises SET ${updateFields.join(', ')}
    WHERE id = ?
  `, updateValues);

  // Get updated exercise with creator information
  const [updatedExercise] = await query(`
    SELECT
      e.id, e.name, e.description, e.category, e.duration_minutes,
      e.calories_per_minute, e.difficulty, e.met_value, e.equipment_needed,
      e.muscle_groups, e.instructions, e.created_by, e.is_public,
      e.created_at, e.updated_at,
      u.first_name as creator_first_name, u.last_name as creator_last_name
    FROM exercises e
    LEFT JOIN users u ON e.created_by = u.id
    WHERE e.id = ?
  `, [id]);

  // Format response data
  const formattedExercise = {
    id: updatedExercise.id,
    name: updatedExercise.name,
    description: updatedExercise.description,
    category: updatedExercise.category,
    durationMinutes: updatedExercise.duration_minutes,
    caloriesPerMinute: updatedExercise.calories_per_minute,
    difficulty: updatedExercise.difficulty,
    metValue: updatedExercise.met_value,
    equipmentNeeded: updatedExercise.equipment_needed,
    muscleGroups: (() => {
      // MySQL2 automatically parses JSON columns, so check if it's already an array
      if (Array.isArray(updatedExercise.muscle_groups)) {
        return updatedExercise.muscle_groups;
      }

      // If it's a string, try to parse as JSON first
      if (typeof updatedExercise.muscle_groups === 'string') {
        try {
          const parsed = JSON.parse(updatedExercise.muscle_groups);
          return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
          // If JSON parsing fails, treat as comma-separated string
          return updatedExercise.muscle_groups.split(',').map(s => s.trim()).filter(s => s);
        }
      }

      // Default to empty array
      return [];
    })(),
    instructions: updatedExercise.instructions,
    createdBy: updatedExercise.created_by,
    creatorName: updatedExercise.creator_first_name && updatedExercise.creator_last_name
      ? `${updatedExercise.creator_first_name} ${updatedExercise.creator_last_name}`
      : 'Anonymous',
    isPublic: updatedExercise.is_public,
    createdAt: updatedExercise.created_at,
    updatedAt: updatedExercise.updated_at
  };

  res.status(200).json({
    status: 'success',
    message: 'Exercise updated successfully',
    data: {
      exercise: formattedExercise
    }
  });
});

/**
 * Delete an exercise
 * @route DELETE /api/v1/exercises/:id
 * @access Private (Own exercises or Admin)
 */
export const deleteExercise = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if exercise exists and user has permission to delete
  const [existingExercise] = await query(
    'SELECT id, created_by, name FROM exercises WHERE id = ?',
    [id]
  );

  if (!existingExercise) {
    return next(new AppError('Exercise not found', 404));
  }

  // Check ownership (only creator or admin can delete)
  if (existingExercise.created_by !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only delete your own exercises', 403));
  }

  // Check if exercise is being used in any workout plans
  const [workoutPlanUsage] = await query(
    'SELECT COUNT(*) as count FROM workout_plan_exercises WHERE exercise_id = ?',
    [id]
  );

  if (workoutPlanUsage.count > 0) {
    return next(new AppError('Cannot delete exercise as it is being used in workout plans', 409));
  }

  // Check if exercise is being used in any exercise logs
  const [exerciseLogUsage] = await query(
    'SELECT COUNT(*) as count FROM user_exercise_logs WHERE exercise_id = ?',
    [id]
  );

  if (exerciseLogUsage.count > 0) {
    return next(new AppError('Cannot delete exercise as it has associated exercise logs', 409));
  }

  // Delete the exercise
  await query('DELETE FROM exercises WHERE id = ?', [id]);

  res.status(204).json({
    status: 'success',
    message: 'Exercise deleted successfully'
  });
});
