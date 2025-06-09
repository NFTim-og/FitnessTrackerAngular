/**
 * Workout Plan Controller
 * UF3/UF4 Curriculum Project
 * Handles all business logic for workout plan-related operations with comprehensive features
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
 * Get all workout plans with pagination, sorting and filtering
 * @route GET /api/v1/workout-plans
 * @access Public (with optional authentication for personalized results)
 */
export const getAllWorkoutPlans = catchAsync(async (req, res, next) => {
  const { page, limit, offset } = req.pagination;
  const { sortBy, sortOrder } = req.sorting;
  const filters = req.filters;
  const searchTerm = req.query.search;

  // Build WHERE clause for filters
  const filterConditions = [];
  const filterParams = [];

  // Always show public workout plans, plus user's own workout plans if authenticated
  if (req.user) {
    filterConditions.push('(wp.is_public = ? OR wp.created_by = ?)');
    filterParams.push(true, req.user.id);
  } else {
    filterConditions.push('wp.is_public = ?');
    filterParams.push(true);
  }

  // Add filter conditions from request filters
  const filterResult = buildWhereClause(filters, 'wp');
  if (filterResult.whereClause) {
    // Remove the 'WHERE' keyword since we'll add it ourselves
    const filterCondition = filterResult.whereClause.replace('WHERE ', '');
    filterConditions.push(filterCondition);
    filterParams.push(...filterResult.params);
  }

  // Add search functionality
  let searchClause = '';
  let searchParams = [];
  if (searchTerm) {
    const searchResult = buildSearchClause(searchTerm, ['name', 'description'], 'wp');
    searchClause = searchResult.searchClause;
    searchParams = searchResult.params;
  }

  // Build complete WHERE clause
  let whereClause = '';
  const allConditions = [...filterConditions];
  if (searchClause) {
    allConditions.push(searchClause);
  }

  if (allConditions.length > 0) {
    whereClause = `WHERE ${allConditions.join(' AND ')}`;
  }

  const allParams = [...filterParams, ...searchParams];

  // Get total count for pagination
  const [{ total: totalCount }] = await query(`
    SELECT COUNT(*) as total
    FROM workout_plans wp
    ${whereClause}
  `, allParams);

  // Get workout plans with pagination and calculated calories/duration
  const workoutPlans = await query(`
    SELECT
      wp.id, wp.name, wp.description, wp.category, wp.difficulty,
      wp.estimated_duration_minutes, wp.target_calories, wp.created_by, wp.is_public,
      wp.created_at, wp.updated_at,
      u.first_name as creator_first_name, u.last_name as creator_last_name,
      (SELECT COUNT(*)
       FROM workout_plan_exercises wpe
       WHERE wpe.workout_plan_id = wp.id) as exercise_count,
      COALESCE(
        (SELECT SUM(COALESCE(wpe.duration_minutes, e.duration_minutes))
         FROM workout_plan_exercises wpe
         JOIN exercises e ON wpe.exercise_id = e.id
         WHERE wpe.workout_plan_id = wp.id),
        wp.estimated_duration_minutes
      ) as calculated_duration_minutes,
      COALESCE(
        (SELECT SUM(e.calories_per_minute * COALESCE(wpe.duration_minutes, e.duration_minutes))
         FROM workout_plan_exercises wpe
         JOIN exercises e ON wpe.exercise_id = e.id
         WHERE wpe.workout_plan_id = wp.id),
        wp.target_calories
      ) as calculated_calories
    FROM workout_plans wp
    LEFT JOIN users u ON wp.created_by = u.id
    ${whereClause}
    ${buildOrderByClause(sortBy, sortOrder, 'wp')}
    ${buildLimitClause(limit, offset)}
  `, allParams);

  // Calculate pagination metadata
  const paginationMeta = calculatePaginationMeta(totalCount, page, limit);

  // Format response data with calculated values
  const formattedData = workoutPlans.map(workoutPlan => ({
    id: workoutPlan.id,
    name: workoutPlan.name,
    description: workoutPlan.description,
    category: workoutPlan.category,
    difficulty: workoutPlan.difficulty,
    estimatedDurationMinutes: workoutPlan.calculated_duration_minutes || workoutPlan.estimated_duration_minutes,
    targetCalories: workoutPlan.calculated_calories || workoutPlan.target_calories,
    exerciseCount: workoutPlan.exercise_count, // Debug field
    createdBy: workoutPlan.created_by,
    creatorName: workoutPlan.creator_first_name && workoutPlan.creator_last_name
      ? `${workoutPlan.creator_first_name} ${workoutPlan.creator_last_name}`
      : 'Anonymous',
    isPublic: workoutPlan.is_public,
    createdAt: workoutPlan.created_at,
    updatedAt: workoutPlan.updated_at
  }));

  res.status(200).json(createPaginatedResponse(
    formattedData,
    paginationMeta,
    'Workout plans retrieved successfully'
  ));
});

/**
 * Get a specific workout plan by ID
 * @route GET /api/v1/workout-plans/:id
 * @access Public
 */
export const getWorkoutPlan = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Get workout plan with creator information
  const [workoutPlan] = await query(`
    SELECT
      wp.id, wp.name, wp.description, wp.category, wp.difficulty,
      wp.estimated_duration_minutes, wp.target_calories, wp.created_by, wp.is_public,
      wp.created_at, wp.updated_at,
      u.first_name as creator_first_name, u.last_name as creator_last_name
    FROM workout_plans wp
    LEFT JOIN users u ON wp.created_by = u.id
    WHERE wp.id = ? AND (wp.is_public = ? OR wp.created_by = ?)
  `, [id, true, req.user?.id || null]);

  if (!workoutPlan) {
    return next(new AppError('Workout plan not found', 404));
  }

  // Get exercises for this workout plan
  const exercises = await query(`
    SELECT
      wpe.id, wpe.exercise_order, wpe.sets, wpe.reps, wpe.duration_minutes, wpe.rest_seconds, wpe.notes,
      e.id as exercise_id, e.name, e.description, e.category, e.duration_minutes as exercise_duration,
      e.calories_per_minute, e.difficulty, e.met_value, e.equipment_needed, e.muscle_groups,
      e.instructions, e.created_by as exercise_created_by, e.is_public as exercise_is_public
    FROM workout_plan_exercises wpe
    JOIN exercises e ON wpe.exercise_id = e.id
    WHERE wpe.workout_plan_id = ?
    ORDER BY wpe.exercise_order
  `, [id]);

  // Format response data
  const formattedWorkoutPlan = {
    id: workoutPlan.id,
    name: workoutPlan.name,
    description: workoutPlan.description,
    category: workoutPlan.category,
    difficulty: workoutPlan.difficulty,
    estimatedDurationMinutes: workoutPlan.estimated_duration_minutes,
    targetCalories: workoutPlan.target_calories,
    createdBy: workoutPlan.created_by,
    creatorName: workoutPlan.creator_first_name && workoutPlan.creator_last_name
      ? `${workoutPlan.creator_first_name} ${workoutPlan.creator_last_name}`
      : 'Anonymous',
    isPublic: workoutPlan.is_public,
    createdAt: workoutPlan.created_at,
    updatedAt: workoutPlan.updated_at,
    exercises: exercises.map(ex => ({
      id: ex.id,
      exerciseOrder: ex.exercise_order,
      sets: ex.sets,
      reps: ex.reps,
      durationMinutes: ex.duration_minutes,
      restSeconds: ex.rest_seconds,
      notes: ex.notes,
      exercise: {
        id: ex.exercise_id,
        name: ex.name,
        description: ex.description,
        category: ex.category,
        durationMinutes: ex.exercise_duration,
        caloriesPerMinute: ex.calories_per_minute,
        difficulty: ex.difficulty,
        metValue: ex.met_value,
        equipmentNeeded: ex.equipment_needed,
        muscleGroups: (() => {
          // MySQL2 automatically parses JSON columns, so check if it's already an array
          if (Array.isArray(ex.muscle_groups)) {
            return ex.muscle_groups;
          }

          // If it's a string, try to parse as JSON first
          if (typeof ex.muscle_groups === 'string') {
            try {
              const parsed = JSON.parse(ex.muscle_groups);
              return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
              // If JSON parsing fails, treat as comma-separated string
              return ex.muscle_groups.split(',').map(s => s.trim()).filter(s => s);
            }
          }

          // Default to empty array
          return [];
        })(),
        instructions: ex.instructions,
        createdBy: ex.exercise_created_by,
        isPublic: ex.exercise_is_public
      }
    }))
  };

  res.status(200).json({
    status: 'success',
    data: {
      workoutPlan: formattedWorkoutPlan
    }
  });
});

/**
 * Create a new workout plan
 * @route POST /api/v1/workout-plans
 * @access Private
 */
export const createWorkoutPlan = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    category = 'general_fitness',
    difficulty = 'beginner',
    estimated_duration_minutes,
    target_calories,
    exercises,
    is_public = true
  } = req.body;

  // Check if workout plan with same name already exists for this user
  const [existingWorkoutPlan] = await query(
    'SELECT id FROM workout_plans WHERE name = ? AND created_by = ?',
    [name, req.user.id]
  );

  if (existingWorkoutPlan) {
    return next(new AppError('You already have a workout plan with this name', 409));
  }

  // Create new workout plan
  const workoutPlanId = uuidv4();
  await query(`
    INSERT INTO workout_plans (
      id, name, description, category, difficulty, estimated_duration_minutes,
      target_calories, created_by, is_public
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    workoutPlanId,
    name,
    description || null,
    category,
    difficulty,
    estimated_duration_minutes || null,
    target_calories || null,
    req.user.id,
    is_public
  ]);

  // Add exercises if provided
  if (exercises && exercises.length > 0) {
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      await query(`
        INSERT INTO workout_plan_exercises (
          id, workout_plan_id, exercise_id, exercise_order, sets, reps,
          duration_minutes, rest_seconds, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        workoutPlanId,
        exercise.exercise_id,
        exercise.order || i + 1,
        exercise.sets || null,
        exercise.reps || null,
        exercise.duration_minutes || null,
        exercise.rest_seconds || null,
        exercise.notes || null
      ]);
    }
  }

  // Get the created workout plan with all details
  const [newWorkoutPlan] = await query(`
    SELECT
      wp.id, wp.name, wp.description, wp.category, wp.difficulty,
      wp.estimated_duration_minutes, wp.target_calories, wp.created_by, wp.is_public,
      wp.created_at, wp.updated_at,
      u.first_name as creator_first_name, u.last_name as creator_last_name
    FROM workout_plans wp
    LEFT JOIN users u ON wp.created_by = u.id
    WHERE wp.id = ?
  `, [workoutPlanId]);

  // Format response data
  const formattedWorkoutPlan = {
    id: newWorkoutPlan.id,
    name: newWorkoutPlan.name,
    description: newWorkoutPlan.description,
    category: newWorkoutPlan.category,
    difficulty: newWorkoutPlan.difficulty,
    estimatedDurationMinutes: newWorkoutPlan.estimated_duration_minutes,
    targetCalories: newWorkoutPlan.target_calories,
    createdBy: newWorkoutPlan.created_by,
    creatorName: newWorkoutPlan.creator_first_name && newWorkoutPlan.creator_last_name
      ? `${newWorkoutPlan.creator_first_name} ${newWorkoutPlan.creator_last_name}`
      : 'Anonymous',
    isPublic: newWorkoutPlan.is_public,
    createdAt: newWorkoutPlan.created_at,
    updatedAt: newWorkoutPlan.updated_at
  };

  res.status(201).json({
    status: 'success',
    message: 'Workout plan created successfully',
    data: {
      workoutPlan: formattedWorkoutPlan
    }
  });
});

/**
 * Update an existing workout plan
 * @route PUT /api/v1/workout-plans/:id
 * @access Private (Own workout plans or Admin)
 */
export const updateWorkoutPlan = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    category,
    difficulty,
    estimated_duration_minutes,
    target_calories,
    exercises,
    is_public
  } = req.body;

  // Check if workout plan exists and user has permission to update
  const [existingWorkoutPlan] = await query(
    'SELECT id, created_by FROM workout_plans WHERE id = ?',
    [id]
  );

  if (!existingWorkoutPlan) {
    return next(new AppError('Workout plan not found', 404));
  }

  // Check ownership (only creator or admin can update)
  if (existingWorkoutPlan.created_by !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only update your own workout plans', 403));
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
  if (difficulty !== undefined) {
    updateFields.push('difficulty = ?');
    updateValues.push(difficulty);
  }
  if (estimated_duration_minutes !== undefined) {
    updateFields.push('estimated_duration_minutes = ?');
    updateValues.push(estimated_duration_minutes);
  }
  if (target_calories !== undefined) {
    updateFields.push('target_calories = ?');
    updateValues.push(target_calories);
  }
  if (is_public !== undefined) {
    updateFields.push('is_public = ?');
    updateValues.push(is_public);
  }

  // Always update the timestamp
  updateFields.push('updated_at = NOW()');
  updateValues.push(id);

  // Update workout plan
  await query(`
    UPDATE workout_plans SET ${updateFields.join(', ')}
    WHERE id = ?
  `, updateValues);

  // Update exercises if provided
  if (exercises) {
    // Delete existing exercise relationships
    await query('DELETE FROM workout_plan_exercises WHERE workout_plan_id = ?', [id]);

    // Insert new exercise relationships
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      await query(`
        INSERT INTO workout_plan_exercises (
          id, workout_plan_id, exercise_id, exercise_order, sets, reps,
          duration_minutes, rest_seconds, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(),
        id,
        exercise.exercise_id,
        exercise.order || i + 1,
        exercise.sets || null,
        exercise.reps || null,
        exercise.duration_minutes || null,
        exercise.rest_seconds || null,
        exercise.notes || null
      ]);
    }
  }

  // Get updated workout plan with creator information
  const [updatedWorkoutPlan] = await query(`
    SELECT
      wp.id, wp.name, wp.description, wp.category, wp.difficulty,
      wp.estimated_duration_minutes, wp.target_calories, wp.created_by, wp.is_public,
      wp.created_at, wp.updated_at,
      u.first_name as creator_first_name, u.last_name as creator_last_name
    FROM workout_plans wp
    LEFT JOIN users u ON wp.created_by = u.id
    WHERE wp.id = ?
  `, [id]);

  // Format response data
  const formattedWorkoutPlan = {
    id: updatedWorkoutPlan.id,
    name: updatedWorkoutPlan.name,
    description: updatedWorkoutPlan.description,
    category: updatedWorkoutPlan.category,
    difficulty: updatedWorkoutPlan.difficulty,
    estimatedDurationMinutes: updatedWorkoutPlan.estimated_duration_minutes,
    targetCalories: updatedWorkoutPlan.target_calories,
    createdBy: updatedWorkoutPlan.created_by,
    creatorName: updatedWorkoutPlan.creator_first_name && updatedWorkoutPlan.creator_last_name
      ? `${updatedWorkoutPlan.creator_first_name} ${updatedWorkoutPlan.creator_last_name}`
      : 'Anonymous',
    isPublic: updatedWorkoutPlan.is_public,
    createdAt: updatedWorkoutPlan.created_at,
    updatedAt: updatedWorkoutPlan.updated_at
  };

  res.status(200).json({
    status: 'success',
    message: 'Workout plan updated successfully',
    data: {
      workoutPlan: formattedWorkoutPlan
    }
  });
});

/**
 * Delete a workout plan
 * @route DELETE /api/v1/workout-plans/:id
 * @access Private (Own workout plans or Admin)
 */
export const deleteWorkoutPlan = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if workout plan exists and user has permission to delete
  const [existingWorkoutPlan] = await query(
    'SELECT id, created_by, name FROM workout_plans WHERE id = ?',
    [id]
  );

  if (!existingWorkoutPlan) {
    return next(new AppError('Workout plan not found', 404));
  }

  // Check ownership (only creator or admin can delete)
  if (existingWorkoutPlan.created_by !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only delete your own workout plans', 403));
  }

  // Check if workout plan is being used in any user assignments
  const [userAssignmentUsage] = await query(
    'SELECT COUNT(*) as count FROM user_workout_plans WHERE workout_plan_id = ?',
    [id]
  );

  if (userAssignmentUsage.count > 0) {
    return next(new AppError('Cannot delete workout plan as it is assigned to users', 409));
  }

  // Check if workout plan is being used in any exercise logs
  const [exerciseLogUsage] = await query(
    'SELECT COUNT(*) as count FROM user_exercise_logs WHERE workout_plan_id = ?',
    [id]
  );

  if (exerciseLogUsage.count > 0) {
    return next(new AppError('Cannot delete workout plan as it has associated exercise logs', 409));
  }

  // Delete workout plan exercises first (should cascade, but just to be safe)
  await query('DELETE FROM workout_plan_exercises WHERE workout_plan_id = ?', [id]);

  // Delete the workout plan
  await query('DELETE FROM workout_plans WHERE id = ?', [id]);

  res.status(200).json({
    status: 'success',
    message: 'Workout plan deleted successfully',
    data: null
  });
});

/**
 * Add exercise to workout plan
 * @route POST /api/v1/workout-plans/:id/exercises
 * @access Private (Own workout plans or Admin)
 */
export const addExerciseToWorkoutPlan = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { exercise_id, exercise_order, sets, reps, duration_minutes, rest_seconds, notes } = req.body;

  // Check if workout plan exists and user has permission
  const [workoutPlan] = await query(
    'SELECT id, created_by FROM workout_plans WHERE id = ?',
    [id]
  );

  if (!workoutPlan) {
    return next(new AppError('Workout plan not found', 404));
  }

  // Check ownership (only creator or admin can modify)
  if (workoutPlan.created_by !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only modify your own workout plans', 403));
  }

  // Check if exercise exists
  const [exercise] = await query('SELECT id FROM exercises WHERE id = ?', [exercise_id]);
  if (!exercise) {
    return next(new AppError('Exercise not found', 404));
  }

  // Add exercise to workout plan
  await query(`
    INSERT INTO workout_plan_exercises (
      id, workout_plan_id, exercise_id, exercise_order, sets, reps,
      duration_minutes, rest_seconds, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    uuidv4(),
    id,
    exercise_id,
    exercise_order,
    sets,
    reps,
    duration_minutes,
    rest_seconds,
    notes
  ]);

  res.status(201).json({
    status: 'success',
    message: 'Exercise added to workout plan successfully'
  });
});

/**
 * Update exercise in workout plan
 * @route PUT /api/v1/workout-plans/:id/exercises/:exerciseId
 * @access Private (Own workout plans or Admin)
 */
export const updateExerciseInWorkoutPlan = catchAsync(async (req, res, next) => {
  const { id, exerciseId } = req.params;
  const { exercise_order, sets, reps, duration_minutes, rest_seconds, notes } = req.body;

  // Check if workout plan exists and user has permission
  const [workoutPlan] = await query(
    'SELECT id, created_by FROM workout_plans WHERE id = ?',
    [id]
  );

  if (!workoutPlan) {
    return next(new AppError('Workout plan not found', 404));
  }

  // Check ownership (only creator or admin can modify)
  if (workoutPlan.created_by !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only modify your own workout plans', 403));
  }

  // Update exercise in workout plan
  const result = await query(`
    UPDATE workout_plan_exercises SET
      exercise_order = ?, sets = ?, reps = ?, duration_minutes = ?,
      rest_seconds = ?, notes = ?
    WHERE workout_plan_id = ? AND exercise_id = ?
  `, [
    exercise_order,
    sets,
    reps,
    duration_minutes,
    rest_seconds,
    notes,
    id,
    exerciseId
  ]);

  if (result.affectedRows === 0) {
    return next(new AppError('Exercise not found in workout plan', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Exercise updated in workout plan successfully'
  });
});

/**
 * Remove exercise from workout plan
 * @route DELETE /api/v1/workout-plans/:id/exercises/:exerciseId
 * @access Private (Own workout plans or Admin)
 */
export const removeExerciseFromWorkoutPlan = catchAsync(async (req, res, next) => {
  const { id, exerciseId } = req.params;

  // Check if workout plan exists and user has permission
  const [workoutPlan] = await query(
    'SELECT id, created_by FROM workout_plans WHERE id = ?',
    [id]
  );

  if (!workoutPlan) {
    return next(new AppError('Workout plan not found', 404));
  }

  // Check ownership (only creator or admin can modify)
  if (workoutPlan.created_by !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You can only modify your own workout plans', 403));
  }

  // Remove exercise from workout plan
  const result = await query(
    'DELETE FROM workout_plan_exercises WHERE workout_plan_id = ? AND exercise_id = ?',
    [id, exerciseId]
  );

  if (result.affectedRows === 0) {
    return next(new AppError('Exercise not found in workout plan', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'Exercise removed from workout plan successfully'
  });
});
