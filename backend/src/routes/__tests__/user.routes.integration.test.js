/**
 * User Routes Integration Tests
 * UF3/UF4 Curriculum Project
 * Integration tests for user management endpoints
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

describe('User Routes Integration Tests', () => {
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

  describe('GET /api/v1/users/:userId/profile', () => {
    test('should get user profile successfully', async () => {
      const mockProfile = {
        id: 'profile-123',
        user_id: testUser.id,
        weight_kg: 70.5,
        height_cm: 175,
        date_of_birth: '1990-01-01',
        gender: 'male',
        activity_level: 'moderately_active',
        fitness_goal: 'maintain_weight',
        created_at: new Date(),
        updated_at: new Date(),
        email: testUser.email,
        first_name: testUser.first_name,
        last_name: testUser.last_name,
        role: testUser.role
      };

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([mockProfile]); // Get profile

      const response = await agent
        .get(`/api/v1/users/${testUser.id}/profile`)
        .set('Authorization', `Bearer ${authToken}`);

      testUtils.assertSuccessResponse(response, 200);
      expect(response.body.data).toHaveProperty('profile');
      expect(response.body.data.profile).toHaveProperty('userId', testUser.id);
      expect(response.body.data.profile).toHaveProperty('weightKg', 70.5);
      expect(response.body.data.profile).toHaveProperty('heightCm', 175);
    });

    test('should create profile if it does not exist', async () => {
      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([]); // No existing profile
      query.mockResolvedValueOnce(); // Insert new profile
      query.mockResolvedValueOnce([{
        id: 'new-profile-123',
        user_id: testUser.id,
        weight_kg: null,
        height_cm: null,
        created_at: new Date(),
        updated_at: new Date(),
        email: testUser.email,
        first_name: testUser.first_name,
        last_name: testUser.last_name,
        role: testUser.role
      }]); // Get newly created profile

      const response = await agent
        .get(`/api/v1/users/${testUser.id}/profile`)
        .set('Authorization', `Bearer ${authToken}`);

      testUtils.assertSuccessResponse(response, 200);
      expect(response.body.data.profile).toHaveProperty('id', 'new-profile-123');
    });

    test('should return 401 when not authenticated', async () => {
      const response = await agent
        .get(`/api/v1/users/${testUser.id}/profile`);

      testUtils.assertErrorResponse(response, 401, 'You are not logged in');
    });

    test('should return 403 when accessing other user profile', async () => {
      const otherUserId = 'other-user-123';
      
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup

      const response = await agent
        .get(`/api/v1/users/${otherUserId}/profile`)
        .set('Authorization', `Bearer ${authToken}`);

      testUtils.assertErrorResponse(response, 403, 'You can only access your own resources');
    });

    test('should allow admin to access any user profile', async () => {
      const mockProfile = {
        id: 'profile-123',
        user_id: 'other-user-123',
        email: 'other@example.com',
        first_name: 'Other',
        last_name: 'User',
        role: 'user'
      };

      query.mockResolvedValueOnce([testAdmin]); // Auth middleware admin lookup
      query.mockResolvedValueOnce([mockProfile]); // Get other user's profile

      const response = await agent
        .get('/api/v1/users/other-user-123/profile')
        .set('Authorization', `Bearer ${adminToken}`);

      testUtils.assertSuccessResponse(response, 200);
    });
  });

  describe('PUT /api/v1/users/:userId/profile', () => {
    test('should update user profile successfully', async () => {
      const updateData = {
        weight_kg: 72.0,
        height_cm: 180,
        date_of_birth: '1990-01-01',
        gender: 'male',
        activity_level: 'very_active',
        fitness_goal: 'build_muscle'
      };

      const updatedProfile = {
        id: 'profile-123',
        user_id: testUser.id,
        ...updateData,
        updated_at: new Date(),
        email: testUser.email,
        first_name: testUser.first_name,
        last_name: testUser.last_name,
        role: testUser.role
      };

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([{ id: 'profile-123' }]); // Existing profile
      query.mockResolvedValueOnce(); // Update profile
      query.mockResolvedValueOnce([updatedProfile]); // Get updated profile

      const response = await agent
        .put(`/api/v1/users/${testUser.id}/profile`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      testUtils.assertSuccessResponse(response, 200);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.data.profile).toHaveProperty('weightKg', 72.0);
      expect(response.body.data.profile).toHaveProperty('activityLevel', 'very_active');
    });

    test('should create profile if it does not exist', async () => {
      const updateData = {
        weight_kg: 70.0,
        height_cm: 175
      };

      const newProfile = {
        id: 'new-profile-123',
        user_id: testUser.id,
        ...updateData,
        created_at: new Date(),
        updated_at: new Date(),
        email: testUser.email,
        first_name: testUser.first_name,
        last_name: testUser.last_name,
        role: testUser.role
      };

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([]); // No existing profile
      query.mockResolvedValueOnce(); // Insert new profile
      query.mockResolvedValueOnce([newProfile]); // Get newly created profile

      const response = await agent
        .put(`/api/v1/users/${testUser.id}/profile`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      testUtils.assertSuccessResponse(response, 200);
      expect(response.body.data.profile).toHaveProperty('weightKg', 70.0);
    });

    test('should return 400 for invalid profile data', async () => {
      const invalidData = {
        weight_kg: -10, // Invalid weight
        height_cm: 500  // Invalid height
      };

      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup

      const response = await agent
        .put(`/api/v1/users/${testUser.id}/profile`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      testUtils.assertErrorResponse(response, 400);
    });
  });

  describe('POST /api/v1/users/:userId/weight', () => {
    test('should add weight entry successfully', async () => {
      const weightData = {
        weight_kg: 71.5,
        recorded_date: '2024-01-15',
        notes: 'Morning weight'
      };

      const newEntry = {
        id: 'weight-entry-123',
        user_id: testUser.id,
        ...weightData,
        created_at: new Date()
      };

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([]); // No existing entry for this date
      query.mockResolvedValueOnce(); // Insert weight entry
      query.mockResolvedValueOnce([newEntry]); // Get created entry

      const response = await agent
        .post(`/api/v1/users/${testUser.id}/weight`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(weightData);

      testUtils.assertSuccessResponse(response, 201);
      expect(response.body).toHaveProperty('message', 'Weight entry added successfully');
      expect(response.body.data.weightEntry).toHaveProperty('weightKg', 71.5);
      expect(response.body.data.weightEntry).toHaveProperty('recordedDate', '2024-01-15');
    });

    test('should return 409 when entry already exists for date', async () => {
      const weightData = {
        weight_kg: 71.5,
        recorded_date: '2024-01-15'
      };

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([{ id: 'existing-entry' }]); // Existing entry

      const response = await agent
        .post(`/api/v1/users/${testUser.id}/weight`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(weightData);

      testUtils.assertErrorResponse(response, 409, 'Weight entry already exists for this date');
    });

    test('should return 400 for invalid weight data', async () => {
      const invalidData = {
        weight_kg: -5, // Invalid weight
        recorded_date: 'invalid-date'
      };

      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup

      const response = await agent
        .post(`/api/v1/users/${testUser.id}/weight`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      testUtils.assertErrorResponse(response, 400);
    });
  });

  describe('GET /api/v1/users/:userId/weight', () => {
    test('should get weight history with pagination', async () => {
      const mockWeightHistory = [
        {
          id: 'entry-1',
          user_id: testUser.id,
          weight_kg: 70.0,
          recorded_date: '2024-01-10',
          notes: 'Test entry 1',
          created_at: new Date()
        },
        {
          id: 'entry-2',
          user_id: testUser.id,
          weight_kg: 71.0,
          recorded_date: '2024-01-11',
          notes: 'Test entry 2',
          created_at: new Date()
        }
      ];

      // Mock database responses
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([{ total: 25 }]); // Total count
      query.mockResolvedValueOnce(mockWeightHistory); // Weight history

      const response = await agent
        .get(`/api/v1/users/${testUser.id}/weight`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      testUtils.assertPaginatedResponse(response, 200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('weightKg', 70.0);
    });

    test('should support sorting and filtering', async () => {
      query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup
      query.mockResolvedValueOnce([{ total: 10 }]); // Total count
      query.mockResolvedValueOnce([]); // Weight history

      const response = await agent
        .get(`/api/v1/users/${testUser.id}/weight`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ 
          page: 1, 
          limit: 10, 
          sortBy: 'recorded_date', 
          sortOrder: 'DESC' 
        });

      testUtils.assertPaginatedResponse(response, 200);
    });
  });

  describe('Admin Routes', () => {
    describe('GET /api/v1/users', () => {
      test('should get all users for admin', async () => {
        const mockUsers = [
          {
            id: 'user-1',
            email: 'user1@example.com',
            first_name: 'User',
            last_name: 'One',
            role: 'user',
            is_active: true,
            created_at: new Date()
          }
        ];

        // Mock database responses
        query.mockResolvedValueOnce([testAdmin]); // Auth middleware admin lookup
        query.mockResolvedValueOnce([{ total: 50 }]); // Total count
        query.mockResolvedValueOnce(mockUsers); // Users

        const response = await agent
          .get('/api/v1/users')
          .set('Authorization', `Bearer ${adminToken}`);

        testUtils.assertPaginatedResponse(response, 200);
      });

      test('should return 403 for non-admin users', async () => {
        query.mockResolvedValueOnce([testUser]); // Auth middleware user lookup

        const response = await agent
          .get('/api/v1/users')
          .set('Authorization', `Bearer ${authToken}`);

        testUtils.assertErrorResponse(response, 403, 'You do not have permission');
      });
    });

    describe('GET /api/v1/users/:userId', () => {
      test('should get user by ID for admin', async () => {
        const targetUser = {
          id: 'target-user-123',
          email: 'target@example.com',
          first_name: 'Target',
          last_name: 'User',
          role: 'user',
          is_active: true,
          created_at: new Date()
        };

        // Mock database responses
        query.mockResolvedValueOnce([testAdmin]); // Auth middleware admin lookup
        query.mockResolvedValueOnce([targetUser]); // Get user by ID

        const response = await agent
          .get('/api/v1/users/target-user-123')
          .set('Authorization', `Bearer ${adminToken}`);

        testUtils.assertSuccessResponse(response, 200);
        expect(response.body.data.user).toHaveProperty('email', 'target@example.com');
      });

      test('should return 404 when user not found', async () => {
        query.mockResolvedValueOnce([testAdmin]); // Auth middleware admin lookup
        query.mockResolvedValueOnce([]); // No user found

        const response = await agent
          .get('/api/v1/users/nonexistent-user')
          .set('Authorization', `Bearer ${adminToken}`);

        testUtils.assertErrorResponse(response, 404, 'User not found');
      });
    });

    describe('PATCH /api/v1/users/:userId/status', () => {
      test('should update user status for admin', async () => {
        const updatedUser = {
          id: 'target-user-123',
          email: 'target@example.com',
          first_name: 'Target',
          last_name: 'User',
          role: 'user',
          is_active: false,
          created_at: new Date()
        };

        // Mock database responses
        query.mockResolvedValueOnce([testAdmin]); // Auth middleware admin lookup
        query.mockResolvedValueOnce(); // Update user status
        query.mockResolvedValueOnce([updatedUser]); // Get updated user

        const response = await agent
          .patch('/api/v1/users/target-user-123/status')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ isActive: false });

        testUtils.assertSuccessResponse(response, 200);
        expect(response.body).toHaveProperty('message', 'User status updated successfully');
        expect(response.body.data.user).toHaveProperty('isActive', false);
      });
    });
  });
});
