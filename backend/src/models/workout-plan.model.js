/**
 * Workout Plan Model
 * Handles database operations and business logic for workout plans
 */

const { query } = require('../db/database'); // Database query function
const { v4: uuidv4 } = require('uuid'); // UUID generator for unique IDs
const Exercise = require('./exercise.model'); // Exercise model for relationships

/**
 * WorkoutPlan class
 * Represents a workout plan entity in the system
 */
class WorkoutPlan {
  /**
   * Create a new WorkoutPlan instance
   * @param {Object} data - Workout plan data
   * @param {string} [data.id] - Workout plan ID (generated if not provided)
   * @param {string} data.name - Workout plan name
   * @param {string} [data.description=''] - Workout plan description
   * @param {string} data.created_by - User ID who created the workout plan
   * @param {Date} [data.created_at] - Creation timestamp
   * @param {Date} [data.updated_at] - Last update timestamp
   * @param {Array} [data.exercises=[]] - List of exercises in the workout plan
   */
  constructor(data) {
    this.id = data.id || uuidv4(); // Generate UUID if not provided
    this.name = data.name;
    this.description = data.description || ''; // Default to empty string
    this.created_by = data.created_by;
    this.created_at = data.created_at || new Date(); // Default to current date
    this.updated_at = data.updated_at || new Date(); // Default to current date
    this.exercises = data.exercises || []; // Default to empty array
  }

  /**
   * Find all workout plans with pagination
   * @param {number} [page=1] - Page number
   * @param {number} [limit=10] - Number of items per page
   * @returns {Promise<Object>} Object containing workout plans array and pagination info
   * @throws {Error} Database or server error
   */
  static async findAll(page = 1, limit = 10) {
    try {
      // Get workout plans with pagination
      const sql = 'SELECT * FROM workout_plans ORDER BY name LIMIT ? OFFSET ?';
      const offset = (page - 1) * limit;
      const workoutPlans = await query(sql, [parseInt(limit), parseInt(offset)]);

      // Get total count for pagination
      const [countResult] = await query('SELECT COUNT(*) as total FROM workout_plans');
      const total = countResult.total;

      // Get exercises for each workout plan
      const workoutPlanObjects = [];

      // Loop through each workout plan and fetch its exercises
      for (const plan of workoutPlans) {
        const exercises = await WorkoutPlan.getExercisesForWorkoutPlan(plan.id);
        workoutPlanObjects.push(new WorkoutPlan({
          ...plan,
          exercises
        }));
      }

      // Return workout plans and pagination information
      return {
        workoutPlans: workoutPlanObjects,
        pagination: {
          total, // Total number of workout plans
          page: parseInt(page), // Current page
          limit: parseInt(limit), // Items per page
          pages: Math.ceil(total / limit) // Total number of pages
        }
      };
    } catch (error) {
      console.error('Error finding workout plans:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Find a workout plan by ID
   * @param {string} id - Workout plan ID to find
   * @returns {Promise<WorkoutPlan|null>} WorkoutPlan object if found, null otherwise
   * @throws {Error} Database or server error
   */
  static async findById(id) {
    try {
      // Query database for workout plan with matching ID
      const workoutPlans = await query('SELECT * FROM workout_plans WHERE id = ?', [id]);

      // Return null if workout plan not found
      if (!workoutPlans.length) {
        return null;
      }

      // Get exercises for this workout plan
      const exercises = await WorkoutPlan.getExercisesForWorkoutPlan(id);

      // Return WorkoutPlan object with exercises
      return new WorkoutPlan({
        ...workoutPlans[0],
        exercises
      });
    } catch (error) {
      console.error('Error finding workout plan by ID:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Get exercises for a specific workout plan
   * @param {string} workoutPlanId - Workout plan ID
   * @returns {Promise<Array>} Array of exercise objects with order information
   * @throws {Error} Database or server error
   */
  static async getExercisesForWorkoutPlan(workoutPlanId) {
    try {
      // SQL query to get exercises with their order in the workout plan
      const sql = `
        SELECT wpe.*, e.*
        FROM workout_plan_exercises wpe
        JOIN exercises e ON wpe.exercise_id = e.id
        WHERE wpe.workout_plan_id = ?
        ORDER BY wpe.order_num
      `;

      // Execute query with workout plan ID
      const results = await query(sql, [workoutPlanId]);

      // Map database results to exercise objects with order information
      return results.map(row => ({
        id: row.id, // Workout plan exercise ID
        workout_plan_id: row.workout_plan_id,
        exercise_id: row.exercise_id,
        order: row.order_num, // Order in the workout plan
        created_at: row.created_at,
        // Create Exercise object with data from join
        exercise: new Exercise({
          id: row.exercise_id,
          name: row.name,
          duration: row.duration,
          calories: row.calories,
          difficulty: row.difficulty,
          met_value: row.met_value,
          created_by: row.created_by
        })
      }));
    } catch (error) {
      console.error('Error getting exercises for workout plan:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Create a new workout plan in the database
   * @param {Object} workoutPlanData - Workout plan data
   * @param {string} workoutPlanData.name - Workout plan name
   * @param {string} [workoutPlanData.description] - Workout plan description
   * @param {string} workoutPlanData.created_by - User ID who created the workout plan
   * @param {Array} [workoutPlanData.exercises] - List of exercises to include
   * @returns {Promise<WorkoutPlan>} Created workout plan object
   * @throws {Error} Database or server error
   */
  static async create(workoutPlanData) {
    try {
      // Create new WorkoutPlan instance
      const workoutPlan = new WorkoutPlan(workoutPlanData);
      const exercises = workoutPlan.exercises;

      // Remove exercises from workout plan object for insertion
      // (exercises are stored in a separate table)
      delete workoutPlan.exercises;

      // Insert workout plan into database
      await query(
        'INSERT INTO workout_plans (id, name, description, created_by) VALUES (?, ?, ?, ?)',
        [
          workoutPlan.id,
          workoutPlan.name,
          workoutPlan.description,
          workoutPlan.created_by
        ]
      );

      // Insert exercises if provided
      if (exercises && exercises.length > 0) {
        // Loop through exercises and add them to the workout plan
        for (let i = 0; i < exercises.length; i++) {
          const exercise = exercises[i];
          const exerciseId = exercise.exercise_id || exercise.id;

          // Insert workout plan exercise relationship with order
          await query(
            'INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, order_num) VALUES (?, ?, ?, ?)',
            [
              uuidv4(), // Generate new ID for the relationship
              workoutPlan.id,
              exerciseId,
              i + 1 // Order number (1-based)
            ]
          );
        }
      }

      // Get the complete workout plan with exercises
      return WorkoutPlan.findById(workoutPlan.id);
    } catch (error) {
      console.error('Error creating workout plan:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Update an existing workout plan
   * @param {string} id - Workout plan ID to update
   * @param {Object} workoutPlanData - New workout plan data
   * @param {string} [workoutPlanData.name] - Workout plan name
   * @param {string} [workoutPlanData.description] - Workout plan description
   * @param {Array} [workoutPlanData.exercises] - List of exercises to include
   * @returns {Promise<WorkoutPlan>} Updated workout plan object
   * @throws {Error} If workout plan not found or database error
   */
  static async update(id, workoutPlanData) {
    try {
      // Find the workout plan to update
      const workoutPlan = await WorkoutPlan.findById(id);

      // Throw error if workout plan not found
      if (!workoutPlan) {
        throw new Error('Workout plan not found');
      }

      // Update only the fields that are provided
      if (workoutPlanData.name !== undefined) workoutPlan.name = workoutPlanData.name;
      if (workoutPlanData.description !== undefined) workoutPlan.description = workoutPlanData.description;
      workoutPlan.updated_at = new Date(); // Update the timestamp

      // Update workout plan in database
      await query(
        'UPDATE workout_plans SET name = ?, description = ?, updated_at = ? WHERE id = ?',
        [
          workoutPlan.name,
          workoutPlan.description,
          workoutPlan.updated_at,
          id
        ]
      );

      // Update exercises if provided
      if (workoutPlanData.exercises) {
        // Delete existing exercise relationships
        await query('DELETE FROM workout_plan_exercises WHERE workout_plan_id = ?', [id]);

        // Insert new exercise relationships
        for (let i = 0; i < workoutPlanData.exercises.length; i++) {
          const exercise = workoutPlanData.exercises[i];
          const exerciseId = exercise.exercise_id || exercise.id;

          // Insert workout plan exercise relationship with order
          await query(
            'INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, order_num) VALUES (?, ?, ?, ?)',
            [
              uuidv4(), // Generate new ID for the relationship
              id,
              exerciseId,
              i + 1 // Order number (1-based)
            ]
          );
        }
      }

      // Get the updated workout plan with exercises
      return WorkoutPlan.findById(id);
    } catch (error) {
      console.error('Error updating workout plan:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Delete a workout plan from the database
   * @param {string} id - Workout plan ID to delete
   * @returns {Promise<boolean>} True if workout plan was deleted, false if not found
   * @throws {Error} Database or server error
   */
  static async delete(id) {
    try {
      // Delete workout plan exercises first (should cascade, but just to be safe)
      await query('DELETE FROM workout_plan_exercises WHERE workout_plan_id = ?', [id]);

      // Delete workout plan
      const result = await query('DELETE FROM workout_plans WHERE id = ?', [id]);
      // Return true if a row was affected (workout plan existed and was deleted)
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      throw error; // Rethrow for controller to handle
    }
  }
}

module.exports = WorkoutPlan;
