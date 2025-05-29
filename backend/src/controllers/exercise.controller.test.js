/**
 * Exercise Controller Tests
 * Tests for the Exercise controller's request handling
 */

const exerciseController = require('./exercise.controller');
const Exercise = require('../models/exercise.model');

// Mock the Exercise model
jest.mock('../models/exercise.model');

describe('Exercise Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock request and response objects
    req = {
      params: {},
      query: {},
      body: {},
      user: { id: 'user1' }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllExercises', () => {
    it('should return exercises with pagination', async () => {
      // Mock data
      const mockResult = {
        exercises: [
          { id: '1', name: 'Push-ups' },
          { id: '2', name: 'Sit-ups' }
        ],
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          pages: 1
        }
      };

      // Setup mock implementation
      Exercise.findAll.mockResolvedValue(mockResult);

      // Set request query parameters
      req.query = { page: '1', limit: '10', sortBy: 'name', sortOrder: 'ASC' };

      // Call the controller method
      await exerciseController.getAllExercises(req, res);

      // Assertions
      expect(Exercise.findAll).toHaveBeenCalledWith(1, 10, 'name', 'ASC', {});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          exercises: mockResult.exercises,
          pagination: mockResult.pagination
        }
      });
    });

    it('should handle errors', async () => {
      // Setup mock implementation to throw error
      const error = new Error('Database error');
      Exercise.findAll.mockRejectedValue(error);

      // Call the controller method
      await exerciseController.getAllExercises(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Database error'
      });
    });
  });

  describe('getExercise', () => {
    it('should return an exercise when found', async () => {
      // Mock data
      const mockExercise = { id: '1', name: 'Push-ups' };

      // Setup mock implementation
      Exercise.findById.mockResolvedValue(mockExercise);

      // Set request parameters
      req.params.id = '1';

      // Call the controller method
      await exerciseController.getExercise(req, res);

      // Assertions
      expect(Exercise.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          exercise: mockExercise
        }
      });
    });

    it('should return 404 when exercise not found', async () => {
      // Setup mock implementation
      Exercise.findById.mockResolvedValue(null);

      // Set request parameters
      req.params.id = '999';

      // Call the controller method
      await exerciseController.getExercise(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Exercise not found'
      });
    });
  });

  describe('createExercise', () => {
    it('should create a new exercise', async () => {
      // Mock data
      const exerciseData = {
        name: 'Push-ups',
        duration: 10,
        calories: 100,
        difficulty: 'medium',
        met_value: 3.5
      };
      const mockExercise = { id: '1', ...exerciseData, created_by: 'user1' };

      // Setup mock implementation
      Exercise.create.mockResolvedValue(mockExercise);

      // Set request body
      req.body = exerciseData;

      // Call the controller method
      await exerciseController.createExercise(req, res);

      // Assertions
      expect(Exercise.create).toHaveBeenCalledWith({
        ...exerciseData,
        created_by: 'user1'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          exercise: mockExercise
        }
      });
    });
  });

  describe('updateExercise', () => {
    it('should update an existing exercise', async () => {
      // Mock data
      const updateData = {
        name: 'Advanced Push-ups',
        difficulty: 'hard'
      };
      const mockExercise = { id: '1', ...updateData };

      // Setup mock implementation
      Exercise.update.mockResolvedValue(mockExercise);

      // Set request parameters and body
      req.params.id = '1';
      req.body = updateData;

      // Call the controller method
      await exerciseController.updateExercise(req, res);

      // Assertions
      expect(Exercise.update).toHaveBeenCalledWith('1', updateData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          exercise: mockExercise
        }
      });
    });
  });

  describe('deleteExercise', () => {
    it('should delete an exercise', async () => {
      // Setup mock implementation
      Exercise.delete.mockResolvedValue(true);

      // Set request parameters
      req.params.id = '1';

      // Call the controller method
      await exerciseController.deleteExercise(req, res);

      // Assertions
      expect(Exercise.delete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: null
      });
    });

    it('should return 404 when exercise not found', async () => {
      // Setup mock implementation
      Exercise.delete.mockResolvedValue(false);

      // Set request parameters
      req.params.id = '999';

      // Call the controller method
      await exerciseController.deleteExercise(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Exercise not found'
      });
    });
  });
});
