/**
 * Exercise Model Tests
 * Tests for the Exercise model's database operations
 */

const Exercise = require('./exercise.model');
const { query } = require('../db/database');

// Mock the database query function
jest.mock('../db/database', () => ({
  query: jest.fn()
}));

describe('Exercise Model', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return exercises with pagination', async () => {
      // Mock data
      const mockExercises = [
        { id: '1', name: 'Push-ups', duration: 10, calories: 100, difficulty: 'medium', met_value: 3.5, created_by: 'user1' },
        { id: '2', name: 'Sit-ups', duration: 15, calories: 150, difficulty: 'easy', met_value: 2.5, created_by: 'user1' }
      ];
      const mockCount = [{ total: 2 }];

      // Setup mock implementation
      query.mockImplementation((sql, params) => {
        if (sql.includes('COUNT(*)')) {
          return mockCount;
        }
        return mockExercises;
      });

      // Call the method
      const result = await Exercise.findAll(1, 10, 'name', 'ASC', {});

      // Assertions
      expect(query).toHaveBeenCalledTimes(2);
      expect(result.exercises.length).toBe(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.pages).toBe(1);
    });

    it('should apply filters correctly', async () => {
      // Mock data
      const mockExercises = [
        { id: '1', name: 'Push-ups', duration: 10, calories: 100, difficulty: 'medium', met_value: 3.5, created_by: 'user1' }
      ];
      const mockCount = [{ total: 1 }];

      // Setup mock implementation
      query.mockImplementation((sql, params) => {
        if (sql.includes('COUNT(*)')) {
          return mockCount;
        }
        return mockExercises;
      });

      // Call the method with filters
      const filters = { difficulty: 'medium', search: 'push' };
      const result = await Exercise.findAll(1, 10, 'name', 'ASC', filters);

      // Assertions
      expect(query).toHaveBeenCalledTimes(2);
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE'),
        expect.arrayContaining(['medium', '%push%'])
      );
      expect(result.exercises.length).toBe(1);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return an exercise when found', async () => {
      // Mock data
      const mockExercise = [
        { id: '1', name: 'Push-ups', duration: 10, calories: 100, difficulty: 'medium', met_value: 3.5, created_by: 'user1' }
      ];

      // Setup mock implementation
      query.mockResolvedValue(mockExercise);

      // Call the method
      const result = await Exercise.findById('1');

      // Assertions
      expect(query).toHaveBeenCalledWith('SELECT * FROM exercises WHERE id = ?', ['1']);
      expect(result).toBeInstanceOf(Exercise);
      expect(result.id).toBe('1');
      expect(result.name).toBe('Push-ups');
    });

    it('should return null when exercise not found', async () => {
      // Setup mock implementation
      query.mockResolvedValue([]);

      // Call the method
      const result = await Exercise.findById('999');

      // Assertions
      expect(query).toHaveBeenCalledWith('SELECT * FROM exercises WHERE id = ?', ['999']);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new exercise', async () => {
      // Mock data
      const exerciseData = {
        name: 'Push-ups',
        duration: 10,
        calories: 100,
        difficulty: 'medium',
        met_value: 3.5,
        created_by: 'user1'
      };

      // Setup mock implementation
      query.mockResolvedValue({ affectedRows: 1 });

      // Call the method
      const result = await Exercise.create(exerciseData);

      // Assertions
      expect(query).toHaveBeenCalledWith(
        'INSERT INTO exercises (id, name, duration, calories, difficulty, met_value, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        expect.arrayContaining([
          expect.any(String), // UUID is generated
          'Push-ups',
          10,
          100,
          'medium',
          3.5,
          'user1'
        ])
      );
      expect(result).toBeInstanceOf(Exercise);
      expect(result.name).toBe('Push-ups');
      expect(result.duration).toBe(10);
    });
  });

  describe('update', () => {
    it('should update an existing exercise', async () => {
      // Mock data
      const mockExercise = [
        { id: '1', name: 'Push-ups', duration: 10, calories: 100, difficulty: 'medium', met_value: 3.5, created_by: 'user1' }
      ];
      const updateData = {
        name: 'Advanced Push-ups',
        difficulty: 'hard'
      };

      // Setup mock implementation
      query.mockImplementation((sql, params) => {
        if (sql.includes('SELECT')) {
          return mockExercise;
        }
        return { affectedRows: 1 };
      });

      // Call the method
      const result = await Exercise.update('1', updateData);

      // Assertions
      expect(query).toHaveBeenCalledTimes(2); // One for findById, one for update
      expect(result).toBeInstanceOf(Exercise);
      expect(result.name).toBe('Advanced Push-ups');
      expect(result.difficulty).toBe('hard');
      expect(result.duration).toBe(10); // Unchanged
    });

    it('should throw error when exercise not found', async () => {
      // Setup mock implementation
      query.mockResolvedValue([]);

      // Call the method and expect error
      await expect(Exercise.update('999', { name: 'Test' })).rejects.toThrow('Exercise not found');
    });
  });

  describe('delete', () => {
    it('should delete an exercise', async () => {
      // Setup mock implementation
      query.mockResolvedValue({ affectedRows: 1 });

      // Call the method
      const result = await Exercise.delete('1');

      // Assertions
      expect(query).toHaveBeenCalledWith('DELETE FROM exercises WHERE id = ?', ['1']);
      expect(result).toBe(true);
    });

    it('should return false when exercise not found', async () => {
      // Setup mock implementation
      query.mockResolvedValue({ affectedRows: 0 });

      // Call the method
      const result = await Exercise.delete('999');

      // Assertions
      expect(query).toHaveBeenCalledWith('DELETE FROM exercises WHERE id = ?', ['999']);
      expect(result).toBe(false);
    });
  });
});
