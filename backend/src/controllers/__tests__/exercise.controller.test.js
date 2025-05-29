/**
 * Exercise Controller Unit Tests
 * UF3/UF4 Curriculum Project
 * Tests for exercise controller functions
 */

import { jest } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';
import {
  getAllExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise
} from '../exercise.controller.js';

// Mock dependencies
jest.mock('uuid');
jest.mock('../../db/database.js', () => ({
  query: jest.fn()
}));
jest.mock('../../utils/pagination.utils.js', () => ({
  calculatePaginationMeta: jest.fn(),
  createPaginatedResponse: jest.fn(),
  buildOrderByClause: jest.fn(() => 'ORDER BY name ASC'),
  buildLimitClause: jest.fn(() => 'LIMIT 10 OFFSET 0'),
  buildSearchClause: jest.fn(() => ({ searchClause: '', params: [] }))
}));

import { query } from '../../db/database.js';
import {
  calculatePaginationMeta,
  createPaginatedResponse,
  buildOrderByClause,
  buildLimitClause,
  buildSearchClause
} from '../../utils/pagination.utils.js';

describe('Exercise Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      query: {},
      user: { id: 'user-123', role: 'user' },
      pagination: { page: 1, limit: 10, offset: 0 },
      sorting: { sortBy: 'name', sortOrder: 'ASC' },
      filters: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('getAllExercises', () => {
    test('should get all exercises with pagination for authenticated user', async () => {
      const mockExercises = [
        {
          id: 'exercise-1',
          name: 'Push-ups',
          description: 'Basic push-up exercise',
          category: 'strength',
          duration_minutes: 10,
          calories_per_minute: 5.0,
          difficulty: 'beginner',
          met_value: 3.8,
          equipment_needed: 'None',
          muscle_groups: '["chest", "arms"]',
          instructions: 'Do push-ups',
          created_by: 'user-123',
          is_public: true,
          created_at: new Date(),
          updated_at: new Date(),
          creator_first_name: 'John',
          creator_last_name: 'Doe'
        }
      ];
      
      query.mockResolvedValueOnce([{ total: 25 }]); // Total count
      query.mockResolvedValueOnce(mockExercises); // Exercises
      
      const mockPaginationMeta = {
        currentPage: 1,
        totalPages: 3,
        totalCount: 25,
        limit: 10,
        hasNextPage: true,
        hasPrevPage: false
      };
      
      calculatePaginationMeta.mockReturnValue(mockPaginationMeta);
      createPaginatedResponse.mockReturnValue({
        status: 'success',
        data: mockExercises,
        pagination: mockPaginationMeta
      });
      
      await getAllExercises(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledTimes(2);
      expect(calculatePaginationMeta).toHaveBeenCalledWith(25, 1, 10);
      expect(createPaginatedResponse).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('should get public exercises for unauthenticated user', async () => {
      mockReq.user = null;
      
      const mockExercises = [
        {
          id: 'exercise-1',
          name: 'Running',
          category: 'cardio',
          is_public: true,
          created_by: 'other-user',
          muscle_groups: null
        }
      ];
      
      query.mockResolvedValueOnce([{ total: 10 }]);
      query.mockResolvedValueOnce(mockExercises);
      
      calculatePaginationMeta.mockReturnValue({
        currentPage: 1,
        totalPages: 1,
        totalCount: 10,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
      });
      createPaginatedResponse.mockReturnValue({
        status: 'success',
        data: mockExercises,
        pagination: {}
      });
      
      await getAllExercises(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('should handle search functionality', async () => {
      mockReq.query.search = 'push';
      
      buildSearchClause.mockReturnValue({
        searchClause: '(e.name LIKE ? OR e.description LIKE ?)',
        params: ['%push%', '%push%']
      });
      
      query.mockResolvedValueOnce([{ total: 5 }]);
      query.mockResolvedValueOnce([]);
      
      calculatePaginationMeta.mockReturnValue({
        currentPage: 1,
        totalPages: 1,
        totalCount: 5,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false
      });
      createPaginatedResponse.mockReturnValue({
        status: 'success',
        data: [],
        pagination: {}
      });
      
      await getAllExercises(mockReq, mockRes, mockNext);
      
      expect(buildSearchClause).toHaveBeenCalledWith('push', ['name', 'description'], 'e');
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('should handle database errors', async () => {
      query.mockRejectedValue(new Error('Database error'));
      
      await getAllExercises(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getExercise', () => {
    test('should get exercise by ID successfully', async () => {
      mockReq.params.id = 'exercise-123';
      
      const mockExercise = {
        id: 'exercise-123',
        name: 'Squats',
        description: 'Basic squat exercise',
        category: 'strength',
        duration_minutes: 15,
        calories_per_minute: 6.0,
        difficulty: 'intermediate',
        met_value: 5.0,
        equipment_needed: 'None',
        muscle_groups: '["legs", "glutes"]',
        instructions: 'Do squats properly',
        created_by: 'user-123',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        creator_first_name: 'John',
        creator_last_name: 'Doe'
      };
      
      query.mockResolvedValueOnce([mockExercise]);
      
      await getExercise(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['exercise-123', true, 'user-123']
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          exercise: expect.objectContaining({
            id: 'exercise-123',
            name: 'Squats',
            muscleGroups: ['legs', 'glutes'],
            creatorName: 'John Doe'
          })
        }
      });
    });

    test('should return error when exercise not found', async () => {
      mockReq.params.id = 'nonexistent-exercise';
      
      query.mockResolvedValueOnce([]); // No exercise found
      
      await getExercise(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Exercise not found',
          statusCode: 404
        })
      );
    });
  });

  describe('createExercise', () => {
    test('should create exercise successfully', async () => {
      mockReq.body = {
        name: 'New Exercise',
        description: 'A new exercise',
        category: 'cardio',
        duration_minutes: 20,
        calories_per_minute: 7.5,
        difficulty: 'advanced',
        met_value: 6.0,
        equipment_needed: 'Treadmill',
        muscle_groups: ['legs', 'core'],
        instructions: 'Exercise instructions',
        is_public: true
      };
      
      query.mockResolvedValueOnce([]); // No existing exercise with same name
      uuidv4.mockReturnValue('new-exercise-123');
      query.mockResolvedValueOnce(); // Insert exercise
      
      const newExercise = {
        id: 'new-exercise-123',
        name: 'New Exercise',
        description: 'A new exercise',
        category: 'cardio',
        duration_minutes: 20,
        calories_per_minute: 7.5,
        difficulty: 'advanced',
        met_value: 6.0,
        equipment_needed: 'Treadmill',
        muscle_groups: '["legs", "core"]',
        instructions: 'Exercise instructions',
        created_by: 'user-123',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        creator_first_name: 'John',
        creator_last_name: 'Doe'
      };
      
      query.mockResolvedValueOnce([newExercise]); // Get created exercise
      
      await createExercise(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        'SELECT id FROM exercises WHERE name = ? AND created_by = ?',
        ['New Exercise', 'user-123']
      );
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO exercises'),
        expect.arrayContaining(['new-exercise-123', 'New Exercise', 'A new exercise'])
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Exercise created successfully',
        data: {
          exercise: expect.objectContaining({
            id: 'new-exercise-123',
            name: 'New Exercise',
            muscleGroups: ['legs', 'core']
          })
        }
      });
    });

    test('should return error when exercise with same name already exists', async () => {
      mockReq.body = {
        name: 'Existing Exercise',
        category: 'cardio',
        duration_minutes: 20,
        calories_per_minute: 7.5,
        difficulty: 'beginner',
        met_value: 4.0
      };
      
      query.mockResolvedValueOnce([{ id: 'existing-exercise' }]); // Existing exercise
      
      await createExercise(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You already have an exercise with this name',
          statusCode: 409
        })
      );
    });
  });

  describe('updateExercise', () => {
    test('should update exercise successfully', async () => {
      mockReq.params.id = 'exercise-123';
      mockReq.body = {
        name: 'Updated Exercise',
        description: 'Updated description',
        category: 'strength',
        duration_minutes: 25,
        calories_per_minute: 8.0,
        difficulty: 'intermediate',
        met_value: 5.5,
        equipment_needed: 'Dumbbells',
        muscle_groups: ['arms', 'chest'],
        instructions: 'Updated instructions',
        is_public: false
      };
      
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: 'user-123'
      }]); // Existing exercise owned by user
      query.mockResolvedValueOnce(); // Update exercise
      
      const updatedExercise = {
        id: 'exercise-123',
        name: 'Updated Exercise',
        description: 'Updated description',
        category: 'strength',
        duration_minutes: 25,
        calories_per_minute: 8.0,
        difficulty: 'intermediate',
        met_value: 5.5,
        equipment_needed: 'Dumbbells',
        muscle_groups: '["arms", "chest"]',
        instructions: 'Updated instructions',
        created_by: 'user-123',
        is_public: false,
        created_at: new Date(),
        updated_at: new Date(),
        creator_first_name: 'John',
        creator_last_name: 'Doe'
      };
      
      query.mockResolvedValueOnce([updatedExercise]); // Get updated exercise
      
      await updateExercise(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        'SELECT id, created_by FROM exercises WHERE id = ?',
        ['exercise-123']
      );
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE exercises SET'),
        expect.arrayContaining(['Updated Exercise', 'Updated description'])
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('should return error when exercise not found', async () => {
      mockReq.params.id = 'nonexistent-exercise';
      mockReq.body = { name: 'Updated Exercise' };
      
      query.mockResolvedValueOnce([]); // No exercise found
      
      await updateExercise(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Exercise not found',
          statusCode: 404
        })
      );
    });

    test('should return error when user does not own exercise', async () => {
      mockReq.params.id = 'exercise-123';
      mockReq.body = { name: 'Updated Exercise' };
      
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: 'other-user'
      }]); // Exercise owned by different user
      
      await updateExercise(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You can only update your own exercises',
          statusCode: 403
        })
      );
    });

    test('should allow admin to update any exercise', async () => {
      mockReq.user.role = 'admin';
      mockReq.params.id = 'exercise-123';
      mockReq.body = { name: 'Admin Updated Exercise' };
      
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: 'other-user'
      }]); // Exercise owned by different user
      query.mockResolvedValueOnce(); // Update exercise
      
      const updatedExercise = {
        id: 'exercise-123',
        name: 'Admin Updated Exercise',
        created_by: 'other-user',
        muscle_groups: null
      };
      
      query.mockResolvedValueOnce([updatedExercise]); // Get updated exercise
      
      await updateExercise(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteExercise', () => {
    test('should delete exercise successfully', async () => {
      mockReq.params.id = 'exercise-123';
      
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: 'user-123',
        name: 'Exercise to Delete'
      }]); // Existing exercise owned by user
      query.mockResolvedValueOnce([{ count: 0 }]); // No workout plan usage
      query.mockResolvedValueOnce([{ count: 0 }]); // No exercise log usage
      query.mockResolvedValueOnce(); // Delete exercise
      
      await deleteExercise(mockReq, mockRes, mockNext);
      
      expect(query).toHaveBeenCalledWith(
        'SELECT id, created_by, name FROM exercises WHERE id = ?',
        ['exercise-123']
      );
      expect(query).toHaveBeenCalledWith(
        'SELECT COUNT(*) as count FROM workout_plan_exercises WHERE exercise_id = ?',
        ['exercise-123']
      );
      expect(query).toHaveBeenCalledWith(
        'DELETE FROM exercises WHERE id = ?',
        ['exercise-123']
      );
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });

    test('should return error when exercise not found', async () => {
      mockReq.params.id = 'nonexistent-exercise';
      
      query.mockResolvedValueOnce([]); // No exercise found
      
      await deleteExercise(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Exercise not found',
          statusCode: 404
        })
      );
    });

    test('should return error when exercise is used in workout plans', async () => {
      mockReq.params.id = 'exercise-123';
      
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: 'user-123',
        name: 'Used Exercise'
      }]); // Existing exercise
      query.mockResolvedValueOnce([{ count: 5 }]); // Used in workout plans
      
      await deleteExercise(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Cannot delete exercise as it is being used in workout plans',
          statusCode: 409
        })
      );
    });

    test('should return error when exercise has exercise logs', async () => {
      mockReq.params.id = 'exercise-123';
      
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: 'user-123',
        name: 'Logged Exercise'
      }]); // Existing exercise
      query.mockResolvedValueOnce([{ count: 0 }]); // No workout plan usage
      query.mockResolvedValueOnce([{ count: 3 }]); // Has exercise logs
      
      await deleteExercise(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Cannot delete exercise as it has associated exercise logs',
          statusCode: 409
        })
      );
    });

    test('should return error when user does not own exercise', async () => {
      mockReq.params.id = 'exercise-123';
      
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: 'other-user',
        name: 'Other User Exercise'
      }]); // Exercise owned by different user
      
      await deleteExercise(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You can only delete your own exercises',
          statusCode: 403
        })
      );
    });
  });
});
