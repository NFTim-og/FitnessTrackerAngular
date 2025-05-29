/**
 * Exercise Model
 * Handles database operations for exercises
 */

const { query } = require('../db/database'); // Database query function
const { v4: uuidv4 } = require('uuid'); // UUID generator for unique IDs

/**
 * Exercise class
 * Represents an exercise entity in the system
 */
class Exercise {
  /**
   * Create a new Exercise instance
   * @param {Object} data - Exercise data
   * @param {string} [data.id] - Exercise ID (generated if not provided)
   * @param {string} data.name - Exercise name
   * @param {number} data.duration - Exercise duration in minutes
   * @param {number} [data.calories=0] - Calories burned
   * @param {string} [data.difficulty='medium'] - Difficulty level (easy, medium, hard)
   * @param {number} [data.met_value=0] - Metabolic equivalent value
   * @param {string} data.created_by - User ID who created the exercise
   * @param {Date} [data.created_at] - Creation timestamp
   * @param {Date} [data.updated_at] - Last update timestamp
   */
  constructor(data) {
    this.id = data.id || uuidv4(); // Generate UUID if not provided
    this.name = data.name;
    this.duration = data.duration;
    this.calories = data.calories || 0; // Default to 0 if not provided
    this.difficulty = data.difficulty || 'medium'; // Default to medium difficulty
    this.met_value = data.met_value || 0; // Default to 0 if not provided
    this.created_by = data.created_by;
    this.created_at = data.created_at || new Date(); // Default to current date
    this.updated_at = data.updated_at || new Date(); // Default to current date
  }

  /**
   * Find all exercises with pagination, sorting and filtering
   * @param {number} [page=1] - Page number
   * @param {number} [limit=10] - Number of items per page
   * @param {string} [sortBy='name'] - Field to sort by
   * @param {string} [sortOrder='ASC'] - Sort order (ASC or DESC)
   * @param {Object} [filters={}] - Filter criteria
   * @param {string} [filters.difficulty] - Filter by difficulty level
   * @param {string} [filters.search] - Search term for exercise name
   * @returns {Promise<Object>} Object containing exercises array and pagination info
   * @throws {Error} Database or server error
   */
  static async findAll(page = 1, limit = 10, sortBy = 'name', sortOrder = 'ASC', filters = {}) {
    try {
      // Start building the SQL query
      let sql = 'SELECT * FROM exercises';
      const params = [];

      // Add WHERE clause with filters if any exist
      if (Object.keys(filters).length > 0) {
        sql += ' WHERE';

        // Add difficulty filter if provided
        if (filters.difficulty) {
          sql += ' difficulty = ?'; // Use parameterized query for security
          params.push(filters.difficulty);
        }

        // Add search filter if provided
        if (filters.search) {
          if (params.length > 0) sql += ' AND'; // Add AND if there are multiple conditions
          sql += ' name LIKE ?'; // Use LIKE for partial matching
          params.push(`%${filters.search}%`); // Add wildcards for partial matching
        }
      }

      // Add ORDER BY clause for sorting
      sql += ` ORDER BY ${sortBy} ${sortOrder}`;

      // Add LIMIT and OFFSET for pagination
      const offset = (page - 1) * limit;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;

      // Execute the main query to get exercises for current page
      const exercises = await query(sql, params);

      // Build a separate query to get total count for pagination
      let countSql = 'SELECT COUNT(*) as total FROM exercises';

      // Add the same filters to count query
      if (Object.keys(filters).length > 0) {
        countSql += ' WHERE';

        if (filters.difficulty) {
          countSql += ` difficulty = '${filters.difficulty}'`;
        }

        if (filters.search) {
          if (filters.difficulty) countSql += ' AND';
          countSql += ` name LIKE '%${filters.search}%'`;
        }
      }

      // Execute count query and extract total
      const [countResult] = await query(countSql);
      const total = countResult.total;

      // Return exercises and pagination information
      return {
        exercises: exercises.map(exercise => new Exercise(exercise)), // Convert raw DB rows to Exercise objects
        pagination: {
          total, // Total number of exercises matching filters
          page: parseInt(page), // Current page
          limit: parseInt(limit), // Items per page
          pages: Math.ceil(total / limit) // Total number of pages
        }
      };
    } catch (error) {
      console.error('Error finding exercises:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Find an exercise by ID
   * @param {string} id - Exercise ID to find
   * @returns {Promise<Exercise|null>} Exercise object if found, null otherwise
   * @throws {Error} Database or server error
   */
  static async findById(id) {
    try {
      // Query database for exercise with matching ID
      const exercises = await query('SELECT * FROM exercises WHERE id = ?', [id]);
      // Return Exercise object if found, null otherwise
      return exercises.length ? new Exercise(exercises[0]) : null;
    } catch (error) {
      console.error('Error finding exercise by ID:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Create a new exercise in the database
   * @param {Object} exerciseData - Exercise data
   * @returns {Promise<Exercise>} Created exercise object
   * @throws {Error} Database or server error
   */
  static async create(exerciseData) {
    try {
      // Create new Exercise instance with provided data
      const exercise = new Exercise(exerciseData);

      // Insert exercise into database
      await query(
        'INSERT INTO exercises (id, name, duration, calories, difficulty, met_value, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          exercise.id,
          exercise.name,
          exercise.duration,
          exercise.calories,
          exercise.difficulty,
          exercise.met_value,
          exercise.created_by
        ]
      );

      // Return the created exercise object
      return exercise;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Update an existing exercise
   * @param {string} id - Exercise ID to update
   * @param {Object} exerciseData - New exercise data
   * @param {string} [exerciseData.name] - Exercise name
   * @param {number} [exerciseData.duration] - Exercise duration
   * @param {number} [exerciseData.calories] - Calories burned
   * @param {string} [exerciseData.difficulty] - Difficulty level
   * @param {number} [exerciseData.met_value] - Metabolic equivalent value
   * @returns {Promise<Exercise>} Updated exercise object
   * @throws {Error} If exercise not found or database error
   */
  static async update(id, exerciseData) {
    try {
      // Find the exercise to update
      const exercise = await Exercise.findById(id);

      // Throw error if exercise not found
      if (!exercise) {
        throw new Error('Exercise not found');
      }

      // Update only the fields that are provided
      if (exerciseData.name !== undefined) exercise.name = exerciseData.name;
      if (exerciseData.duration !== undefined) exercise.duration = exerciseData.duration;
      if (exerciseData.calories !== undefined) exercise.calories = exerciseData.calories;
      if (exerciseData.difficulty !== undefined) exercise.difficulty = exerciseData.difficulty;
      if (exerciseData.met_value !== undefined) exercise.met_value = exerciseData.met_value;
      exercise.updated_at = new Date(); // Update the timestamp

      // Update exercise in database
      await query(
        'UPDATE exercises SET name = ?, duration = ?, calories = ?, difficulty = ?, met_value = ?, updated_at = ? WHERE id = ?',
        [
          exercise.name,
          exercise.duration,
          exercise.calories,
          exercise.difficulty,
          exercise.met_value,
          exercise.updated_at,
          id
        ]
      );

      // Return the updated exercise
      return exercise;
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Delete an exercise from the database
   * @param {string} id - Exercise ID to delete
   * @returns {Promise<boolean>} True if exercise was deleted, false if not found
   * @throws {Error} Database or server error
   */
  static async delete(id) {
    try {
      // Delete exercise from database
      const result = await query('DELETE FROM exercises WHERE id = ?', [id]);
      // Return true if a row was affected (exercise existed and was deleted)
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error; // Rethrow for controller to handle
    }
  }
}

module.exports = Exercise;
