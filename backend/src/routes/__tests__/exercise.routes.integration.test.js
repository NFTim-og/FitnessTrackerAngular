/**
 * Exercise Routes Integration Tests
 * UF3/UF4 Curriculum Project
 * Integration tests for exercise management endpoints
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../server.js';
import { testUtils } from '../../test/integration-setup.js';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../db/database.js', () => ({
  query: jest.fn()
}));

import { query } from '../../db/database.js';

describe('Exercise Routes Integration Tests', () => {
  let agent;
  let authToken;
  let adminToken;
  let testUser;
  let testAdmin;

  beforeAll(async () => {
    agent = request(app);
    await testUtils.setupDatabase();
    
    // Create test user and admin
    testUser = await testUtils.createTestUser();
    testAdmin = await testUtils.createTestAdmin();
  });

  beforeEach(() => {
    testUtils.resetMocks();
    
    // Mock JWT verification for authenticated requests
    jwt.verify.mockImplementation((token) => {
      if (token === 'user-token') {
        return { id: testUser.id, email: testUser.email };
      }
      if (token === 'admin-token') {
        return { id: testAdmin.id, email: testAdmin.email };
      }
      throw new Error('Invalid token');
    });
    
    authToken = 'user-token';
    adminToken = 'admin-token';
  });

  afterEach(() => {
    testUtils.resetMocks();
  });

  afterAll(async () => {
    await testUtils.cleanup();
  });

  describe('GET /api/v1/exercises', () => {
    test('should get all public exercises without authentication', async () => {
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
          created_by: 'other-user',
          is_public: true,
          created_at: new Date(),
          updated_at: new Date(),
          creator_first_name: 'Other',
          creator_last_name: 'User'
        }
      ];

      // Mock database responses
      query.mockResolvedValueOnce([{ total: 25 }]); // Total count
      query.mockResolvedValueOnce(mockExercises); // Exercises

      const response = await agent
        .get('/api/v1/exercises')
        .query({ page: 1, limit: 10 });

      testUtils.assertPaginatedResponse(response, 200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty('name', 'Push-ups');
      expect(response.body.data[0]).toHaveProperty('muscleGroups', ['chest', 'arms']);
    });

    test('should get public and own exercises when authenticated', async () => {
      const mockExercises = [
        {
          id: 'exercise-1',
          name: 'My Exercise',
          category: 'cardio',
          created_by: testUser.id,
          is_public: false,
          muscle_groups: null
        },
        {
          id: 'exercise-2',
          name: 'Public Exercise',
          category: 'strength',
          created_by: 'other-user',
          is_public: true,
          muscle_groups: '["legs"]'
        }
      ];

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([{ total: 15 }]); // Total count
      query.mockResolvedValueOnce(mockExercises); // Exercises

      const response = await agent
        .get('/api/v1/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      testUtils.assertPaginatedResponse(response, 200);
      expect(response.body.data).toHaveLength(2);
    });

    test('should support search functionality', async () => {
      query.mockResolvedValueOnce([{ total: 5 }]); // Total count
      query.mockResolvedValueOnce([]); // Exercises

      const response = await agent
        .get('/api/v1/exercises')
        .query({ search: 'push', page: 1, limit: 10 });

      testUtils.assertPaginatedResponse(response, 200);
    });

    test('should support category filtering', async () => {
      query.mockResolvedValueOnce([{ total: 8 }]); // Total count
      query.mockResolvedValueOnce([]); // Exercises

      const response = await agent
        .get('/api/v1/exercises')
        .query({ category: 'cardio', page: 1, limit: 10 });

      testUtils.assertPaginatedResponse(response, 200);
    });

    test('should support difficulty filtering', async () => {
      query.mockResolvedValueOnce([{ total: 12 }]); // Total count
      query.mockResolvedValueOnce([]); // Exercises

      const response = await agent
        .get('/api/v1/exercises')
        .query({ difficulty: 'beginner', page: 1, limit: 10 });

      testUtils.assertPaginatedResponse(response, 200);
    });

    test('should support sorting', async () => {
      query.mockResolvedValueOnce([{ total: 20 }]); // Total count
      query.mockResolvedValueOnce([]); // Exercises

      const response = await agent
        .get('/api/v1/exercises')
        .query({ 
          sortBy: 'name', 
          sortOrder: 'DESC', 
          page: 1, 
          limit: 10 
        });

      testUtils.assertPaginatedResponse(response, 200);
    });
  });

  describe('GET /api/v1/exercises/:id', () => {
    test('should get exercise by ID successfully', async () => {
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
        created_by: 'other-user',
        is_public: true,
        created_at: new Date(),
        updated_at: new Date(),
        creator_first_name: 'Other',
        creator_last_name: 'User'
      };

      query.mockResolvedValueOnce([mockExercise]); // Get exercise

      const response = await agent
        .get('/api/v1/exercises/exercise-123');

      testUtils.assertSuccessResponse(response, 200);
      expect(response.body.data.exercise).toHaveProperty('name', 'Squats');
      expect(response.body.data.exercise).toHaveProperty('muscleGroups', ['legs', 'glutes']);
      expect(response.body.data.exercise).toHaveProperty('creatorName', 'Other User');
    });

    test('should return 404 when exercise not found', async () => {
      query.mockResolvedValueOnce([]); // No exercise found

      const response = await agent
        .get('/api/v1/exercises/nonexistent-exercise');

      testUtils.assertErrorResponse(response, 404, 'Exercise not found');
    });

    test('should return 400 for invalid UUID', async () => {
      const response = await agent
        .get('/api/v1/exercises/invalid-uuid');

      testUtils.assertErrorResponse(response, 400);
    });
  });

  describe('POST /api/v1/exercises', () => {
    test('should create exercise successfully', async () => {
      const exerciseData = {
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

      const newExercise = {
        id: 'new-exercise-123',
        ...exerciseData,
        muscle_groups: '["legs", "core"]',
        created_by: testUser.id,
        created_at: new Date(),
        updated_at: new Date(),
        creator_first_name: testUser.first_name,
        creator_last_name: testUser.last_name
      };

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([]); // No existing exercise with same name
      query.mockResolvedValueOnce(); // Insert exercise
      query.mockResolvedValueOnce([newExercise]); // Get created exercise

      const response = await agent
        .post('/api/v1/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData);

      testUtils.assertSuccessResponse(response, 201);
      expect(response.body).toHaveProperty('message', 'Exercise created successfully');
      expect(response.body.data.exercise).toHaveProperty('name', 'New Exercise');
      expect(response.body.data.exercise).toHaveProperty('muscleGroups', ['legs', 'core']);
    });

    test('should return 401 when not authenticated', async () => {
      const exerciseData = {
        name: 'New Exercise',
        category: 'cardio',
        duration_minutes: 20,
        calories_per_minute: 7.5,
        difficulty: 'beginner',
        met_value: 4.0
      };

      const response = await agent
        .post('/api/v1/exercises')
        .send(exerciseData);

      testUtils.assertErrorResponse(response, 401, 'You are not logged in');
    });

    test('should return 409 when exercise with same name already exists', async () => {
      const exerciseData = {
        name: 'Existing Exercise',
        category: 'cardio',
        duration_minutes: 20,
        calories_per_minute: 7.5,
        difficulty: 'beginner',
        met_value: 4.0
      };

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([{ id: 'existing-exercise' }]); // Existing exercise

      const response = await agent
        .post('/api/v1/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData);

      testUtils.assertErrorResponse(response, 409, 'You already have an exercise with this name');
    });

    test('should return 400 for invalid exercise data', async () => {
      const invalidData = {
        name: '', // Empty name
        category: 'invalid_category',
        duration_minutes: -5, // Invalid duration
        calories_per_minute: 'invalid', // Invalid type
        difficulty: 'invalid_difficulty',
        met_value: -1 // Invalid MET value
      };

      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup

      const response = await agent
        .post('/api/v1/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      testUtils.assertErrorResponse(response, 400);
    });

    test('should return 400 for missing required fields', async () => {
      const incompleteData = {
        name: 'Incomplete Exercise'
        // Missing required fields
      };

      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup

      const response = await agent
        .post('/api/v1/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(incompleteData);

      testUtils.assertErrorResponse(response, 400);
    });
  });

  describe('PUT /api/v1/exercises/:id', () => {
    test('should update exercise successfully', async () => {
      const updateData = {
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

      const updatedExercise = {
        id: 'exercise-123',
        ...updateData,
        muscle_groups: '["arms", "chest"]',
        created_by: testUser.id,
        created_at: new Date(),
        updated_at: new Date(),
        creator_first_name: testUser.first_name,
        creator_last_name: testUser.last_name
      };

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: testUser.id
      }]); // Existing exercise owned by user
      query.mockResolvedValueOnce(); // Update exercise
      query.mockResolvedValueOnce([updatedExercise]); // Get updated exercise

      const response = await agent
        .put('/api/v1/exercises/exercise-123')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      testUtils.assertSuccessResponse(response, 200);
      expect(response.body).toHaveProperty('message', 'Exercise updated successfully');
      expect(response.body.data.exercise).toHaveProperty('name', 'Updated Exercise');
    });

    test('should return 404 when exercise not found', async () => {
      const updateData = { name: 'Updated Exercise' };

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([]); // No exercise found

      const response = await agent
        .put('/api/v1/exercises/nonexistent-exercise')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      testUtils.assertErrorResponse(response, 404, 'Exercise not found');
    });

    test('should return 403 when user does not own exercise', async () => {
      const updateData = { name: 'Updated Exercise' };

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: 'other-user'
      }]); // Exercise owned by different user

      const response = await agent
        .put('/api/v1/exercises/exercise-123')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      testUtils.assertErrorResponse(response, 403, 'You can only update your own exercises');
    });

    test('should allow admin to update any exercise', async () => {
      const updateData = { name: 'Admin Updated Exercise' };

      const updatedExercise = {
        id: 'exercise-123',
        name: 'Admin Updated Exercise',
        created_by: 'other-user',
        muscle_groups: null
      };

      // Mock database responses
      query.mockResolvedValueOnce([testAdmin]); // Auth middleware admin lookup
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: 'other-user'
      }]); // Exercise owned by different user
      query.mockResolvedValueOnce(); // Update exercise
      query.mockResolvedValueOnce([updatedExercise]); // Get updated exercise

      const response = await agent
        .put('/api/v1/exercises/exercise-123')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      testUtils.assertSuccessResponse(response, 200);
    });
  });

  describe('DELETE /api/v1/exercises/:id', () => {
    test('should delete exercise successfully', async () => {
      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: testUser.id,
        name: 'Exercise to Delete'
      }]); // Existing exercise owned by user
      query.mockResolvedValueOnce([{ count: 0 }]); // No workout plan usage
      query.mockResolvedValueOnce([{ count: 0 }]); // No exercise log usage
      query.mockResolvedValueOnce(); // Delete exercise

      const response = await agent
        .delete('/api/v1/exercises/exercise-123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });

    test('should return 404 when exercise not found', async () => {
      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([]); // No exercise found

      const response = await agent
        .delete('/api/v1/exercises/nonexistent-exercise')
        .set('Authorization', `Bearer ${authToken}`);

      testUtils.assertErrorResponse(response, 404, 'Exercise not found');
    });

    test('should return 409 when exercise is used in workout plans', async () => {
      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: testUser.id,
        name: 'Used Exercise'
      }]); // Existing exercise
      query.mockResolvedValueOnce([{ count: 5 }]); // Used in workout plans

      const response = await agent
        .delete('/api/v1/exercises/exercise-123')
        .set('Authorization', `Bearer ${authToken}`);

      testUtils.assertErrorResponse(response, 409, 'Cannot delete exercise as it is being used in workout plans');
    });

    test('should return 403 when user does not own exercise', async () => {
      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([{
        id: 'exercise-123',
        created_by: 'other-user',
        name: 'Other User Exercise'
      }]); // Exercise owned by different user

      const response = await agent
        .delete('/api/v1/exercises/exercise-123')
        .set('Authorization', `Bearer ${authToken}`);

      testUtils.assertErrorResponse(response, 403, 'You can only delete your own exercises');
    });
  });

  describe('Input Validation', () => {
    test('should validate exercise name length', async () => {
      const exerciseData = {
        name: 'A'.repeat(101), // Too long
        category: 'cardio',
        duration_minutes: 20,
        calories_per_minute: 7.5,
        difficulty: 'beginner',
        met_value: 4.0
      };

      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup

      const response = await agent
        .post('/api/v1/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData);

      testUtils.assertErrorResponse(response, 400);
    });

    test('should validate category enum values', async () => {
      const exerciseData = {
        name: 'Test Exercise',
        category: 'invalid_category',
        duration_minutes: 20,
        calories_per_minute: 7.5,
        difficulty: 'beginner',
        met_value: 4.0
      };

      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup

      const response = await agent
        .post('/api/v1/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData);

      testUtils.assertErrorResponse(response, 400);
    });

    test('should validate numeric ranges', async () => {
      const exerciseData = {
        name: 'Test Exercise',
        category: 'cardio',
        duration_minutes: 0, // Invalid range
        calories_per_minute: -1, // Invalid range
        difficulty: 'beginner',
        met_value: 0 // Invalid range
      };

      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup

      const response = await agent
        .post('/api/v1/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData);

      testUtils.assertErrorResponse(response, 400);
    });
  });
});
