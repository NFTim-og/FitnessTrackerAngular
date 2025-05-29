/**
 * Integration Test Setup
 * UF3/UF4 Curriculum Project
 * Setup utilities for API integration tests
 */

import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../server.js';

// Mock database for integration tests
jest.mock('../db/database.js', () => ({
  query: jest.fn(),
  pool: {
    getConnection: jest.fn(),
    end: jest.fn()
  }
}));

import { query } from '../db/database.js';

/**
 * Integration test utilities
 */
export class IntegrationTestUtils {
  constructor() {
    this.app = app;
    this.agent = request(app);
    this.authToken = null;
    this.adminToken = null;
    this.testUser = null;
    this.testAdmin = null;
  }

  /**
   * Setup test database state
   */
  async setupDatabase() {
    // Mock successful database connection
    query.mockImplementation((sql, params) => {
      // Default empty response
      return Promise.resolve([]);
    });
  }

  /**
   * Create test user and get auth token
   */
  async createTestUser(userData = {}) {
    const defaultUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      password: 'hashedPassword',
      first_name: 'John',
      last_name: 'Doe',
      role: 'user',
      is_active: true,
      created_at: new Date()
    };

    this.testUser = { ...defaultUser, ...userData };

    // Mock user creation and login
    query.mockImplementation((sql, params) => {
      if (sql.includes('SELECT') && sql.includes('users') && sql.includes('email')) {
        if (params[0] === this.testUser.email) {
          return Promise.resolve([this.testUser]);
        }
        return Promise.resolve([]);
      }
      if (sql.includes('INSERT INTO users')) {
        return Promise.resolve();
      }
      return Promise.resolve([]);
    });

    return this.testUser;
  }

  /**
   * Create test admin and get auth token
   */
  async createTestAdmin(adminData = {}) {
    const defaultAdmin = {
      id: 'test-admin-123',
      email: 'admin@example.com',
      password: 'hashedPassword',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      is_active: true,
      created_at: new Date()
    };

    this.testAdmin = { ...defaultAdmin, ...adminData };

    // Mock admin creation
    query.mockImplementation((sql, params) => {
      if (sql.includes('SELECT') && sql.includes('users') && sql.includes('email')) {
        if (params[0] === this.testAdmin.email) {
          return Promise.resolve([this.testAdmin]);
        }
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    });

    return this.testAdmin;
  }

  /**
   * Get authentication token for user
   */
  async getAuthToken(user = null) {
    const targetUser = user || this.testUser;
    if (!targetUser) {
      throw new Error('No user available for authentication');
    }

    // Mock successful login
    query.mockImplementation((sql, params) => {
      if (sql.includes('SELECT') && sql.includes('password')) {
        return Promise.resolve([targetUser]);
      }
      if (sql.includes('UPDATE') && sql.includes('last_login')) {
        return Promise.resolve();
      }
      return Promise.resolve([]);
    });

    const response = await this.agent
      .post('/api/v1/auth/login')
      .send({
        email: targetUser.email,
        password: 'TestPassword123!'
      });

    if (response.status === 200 && response.body.token) {
      if (targetUser.role === 'admin') {
        this.adminToken = response.body.token;
      } else {
        this.authToken = response.body.token;
      }
      return response.body.token;
    }

    throw new Error('Failed to get auth token');
  }

  /**
   * Get admin authentication token
   */
  async getAdminToken() {
    if (!this.testAdmin) {
      await this.createTestAdmin();
    }
    return this.getAuthToken(this.testAdmin);
  }

  /**
   * Create test exercise
   */
  async createTestExercise(exerciseData = {}) {
    const defaultExercise = {
      id: 'test-exercise-123',
      name: 'Test Exercise',
      description: 'A test exercise',
      category: 'cardio',
      duration_minutes: 30,
      calories_per_minute: 5.5,
      difficulty: 'beginner',
      met_value: 4.0,
      equipment_needed: 'None',
      muscle_groups: '["legs", "core"]',
      instructions: 'Test instructions',
      created_by: this.testUser?.id || 'test-user-123',
      is_public: true,
      created_at: new Date(),
      updated_at: new Date()
    };

    const testExercise = { ...defaultExercise, ...exerciseData };

    // Mock exercise creation
    query.mockImplementation((sql, params) => {
      if (sql.includes('SELECT') && sql.includes('exercises') && sql.includes('name')) {
        return Promise.resolve([]);
      }
      if (sql.includes('INSERT INTO exercises')) {
        return Promise.resolve();
      }
      if (sql.includes('SELECT') && sql.includes('exercises') && sql.includes('id')) {
        return Promise.resolve([testExercise]);
      }
      return Promise.resolve([]);
    });

    return testExercise;
  }

  /**
   * Create test workout plan
   */
  async createTestWorkoutPlan(planData = {}) {
    const defaultPlan = {
      id: 'test-plan-123',
      name: 'Test Workout Plan',
      description: 'A test workout plan',
      category: 'strength',
      difficulty: 'intermediate',
      estimated_duration_minutes: 45,
      target_muscle_groups: '["chest", "arms"]',
      equipment_needed: '["dumbbells"]',
      instructions: 'Test workout instructions',
      created_by: this.testUser?.id || 'test-user-123',
      is_public: true,
      created_at: new Date(),
      updated_at: new Date()
    };

    return { ...defaultPlan, ...planData };
  }

  /**
   * Mock database responses for specific scenarios
   */
  mockDatabaseResponses(scenario) {
    switch (scenario) {
      case 'empty':
        query.mockResolvedValue([]);
        break;
      case 'error':
        query.mockRejectedValue(new Error('Database connection error'));
        break;
      case 'user-exists':
        query.mockImplementation((sql) => {
          if (sql.includes('SELECT') && sql.includes('users')) {
            return Promise.resolve([this.testUser]);
          }
          return Promise.resolve([]);
        });
        break;
      default:
        query.mockResolvedValue([]);
    }
  }

  /**
   * Reset all mocks
   */
  resetMocks() {
    jest.clearAllMocks();
    query.mockReset();
  }

  /**
   * Cleanup after tests
   */
  async cleanup() {
    this.resetMocks();
    this.authToken = null;
    this.adminToken = null;
    this.testUser = null;
    this.testAdmin = null;
  }

  /**
   * Helper to make authenticated requests
   */
  authenticatedRequest(method, url, token = null) {
    const authToken = token || this.authToken;
    if (!authToken) {
      throw new Error('No auth token available');
    }

    return this.agent[method.toLowerCase()](url)
      .set('Authorization', `Bearer ${authToken}`);
  }

  /**
   * Helper to make admin requests
   */
  adminRequest(method, url) {
    if (!this.adminToken) {
      throw new Error('No admin token available');
    }

    return this.agent[method.toLowerCase()](url)
      .set('Authorization', `Bearer ${this.adminToken}`);
  }

  /**
   * Assert response structure
   */
  assertSuccessResponse(response, expectedStatus = 200) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('data');
  }

  /**
   * Assert error response structure
   */
  assertErrorResponse(response, expectedStatus, expectedMessage = null) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('status');
    expect(['error', 'fail']).toContain(response.body.status);
    expect(response.body).toHaveProperty('message');
    
    if (expectedMessage) {
      expect(response.body.message).toContain(expectedMessage);
    }
  }

  /**
   * Assert paginated response structure
   */
  assertPaginatedResponse(response, expectedStatus = 200) {
    this.assertSuccessResponse(response, expectedStatus);
    expect(response.body).toHaveProperty('pagination');
    expect(response.body.pagination).toHaveProperty('currentPage');
    expect(response.body.pagination).toHaveProperty('totalPages');
    expect(response.body.pagination).toHaveProperty('totalCount');
    expect(response.body.pagination).toHaveProperty('limit');
    expect(response.body.pagination).toHaveProperty('hasNextPage');
    expect(response.body.pagination).toHaveProperty('hasPrevPage');
  }
}

// Export singleton instance
export const testUtils = new IntegrationTestUtils();

export default testUtils;
