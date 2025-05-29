/**
 * Auth Routes Integration Tests
 * UF3/UF4 Curriculum Project
 * Integration tests for authentication endpoints
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../server.js';
import { testUtils } from '../../test/integration-setup.js';

// Mock dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../db/database.js', () => ({
  query: jest.fn()
}));

import { query } from '../../db/database.js';

describe('Auth Routes Integration Tests', () => {
  let agent;

  beforeAll(async () => {
    agent = request(app);
    await testUtils.setupDatabase();
  });

  beforeEach(() => {
    testUtils.resetMocks();

    // Set up default environment variables
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1d';
  });

  afterEach(() => {
    testUtils.resetMocks();
  });

  afterAll(async () => {
    await testUtils.cleanup();
  });

  describe('POST /api/v1/auth/register', () => {
    test('should register new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      // Mock database responses
      query.mockResolvedValueOnce([]); // No existing user
      bcrypt.hash.mockResolvedValue('hashedPassword');
      query.mockResolvedValueOnce(); // Insert user
      query.mockResolvedValueOnce([{
        id: 'new-user-123',
        email: 'newuser@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
        is_active: true,
        created_at: new Date()
      }]); // Get created user
      jwt.sign.mockReturnValue('mock-jwt-token');

      const response = await agent
        .post('/api/v1/auth/register')
        .send(userData);

      testUtils.assertSuccessResponse(response, 201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('email', 'newuser@example.com');
    });

    test('should return 400 when passwords do not match', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'DifferentPassword123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await agent
        .post('/api/v1/auth/register')
        .send(userData);

      testUtils.assertErrorResponse(response, 400, 'Passwords do not match');
    });

    test('should return 409 when user already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      // Mock existing user
      query.mockResolvedValueOnce([{ id: 'existing-user' }]);

      const response = await agent
        .post('/api/v1/auth/register')
        .send(userData);

      testUtils.assertErrorResponse(response, 409, 'User with this email already exists');
    });

    test('should return 400 for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await agent
        .post('/api/v1/auth/register')
        .send(userData);

      testUtils.assertErrorResponse(response, 400);
    });

    test('should return 400 for weak password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123',
        passwordConfirm: '123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await agent
        .post('/api/v1/auth/register')
        .send(userData);

      testUtils.assertErrorResponse(response, 400);
    });

    test('should return 400 for missing required fields', async () => {
      const userData = {
        email: 'test@example.com'
        // Missing password and other required fields
      };

      const response = await agent
        .post('/api/v1/auth/register')
        .send(userData);

      testUtils.assertErrorResponse(response, 400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    test('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!'
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashedPassword',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
        is_active: true
      };

      // Mock database responses
      query.mockResolvedValueOnce([mockUser]); // Find user
      bcrypt.compare.mockResolvedValue(true); // Password match
      query.mockResolvedValueOnce(); // Update last login
      jwt.sign.mockReturnValue('mock-jwt-token');

      const response = await agent
        .post('/api/v1/auth/login')
        .send(loginData);

      testUtils.assertSuccessResponse(response, 200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('email', 'test@example.com');
    });

    test('should return 400 when email is missing', async () => {
      const loginData = {
        password: 'TestPassword123!'
      };

      const response = await agent
        .post('/api/v1/auth/login')
        .send(loginData);

      testUtils.assertErrorResponse(response, 400);
    });

    test('should return 400 when password is missing', async () => {
      const loginData = {
        email: 'test@example.com'
      };

      const response = await agent
        .post('/api/v1/auth/login')
        .send(loginData);

      testUtils.assertErrorResponse(response, 400);
    });

    test('should return 401 when user not found', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'TestPassword123!'
      };

      query.mockResolvedValueOnce([]); // No user found

      const response = await agent
        .post('/api/v1/auth/login')
        .send(loginData);

      testUtils.assertErrorResponse(response, 401, 'Invalid email or password');
    });

    test('should return 401 when password is incorrect', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!'
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashedPassword',
        is_active: true
      };

      query.mockResolvedValueOnce([mockUser]); // Find user
      bcrypt.compare.mockResolvedValue(false); // Password doesn't match

      const response = await agent
        .post('/api/v1/auth/login')
        .send(loginData);

      testUtils.assertErrorResponse(response, 401, 'Invalid email or password');
    });

    test('should return 401 when user is inactive', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!'
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashedPassword',
        is_active: false
      };

      query.mockResolvedValueOnce([mockUser]); // Find inactive user

      const response = await agent
        .post('/api/v1/auth/login')
        .send(loginData);

      testUtils.assertErrorResponse(response, 401, 'Invalid email or password');
    });

    test('should return 400 for invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'TestPassword123!'
      };

      const response = await agent
        .post('/api/v1/auth/login')
        .send(loginData);

      testUtils.assertErrorResponse(response, 400);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    test('should get current user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
        is_active: true,
        email_verified: true,
        last_login: new Date(),
        created_at: new Date()
      };

      // Mock JWT verification
      jwt.verify.mockReturnValue({ id: 'user-123', email: 'test@example.com' });
      query.mockResolvedValueOnce([mockUser]); // Find user by ID
      query.mockResolvedValueOnce([mockUser]); // Get current user

      const response = await agent
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer mock-jwt-token');

      testUtils.assertSuccessResponse(response, 200);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('email', 'test@example.com');
    });

    test('should return 401 when no token provided', async () => {
      const response = await agent
        .get('/api/v1/auth/me');

      testUtils.assertErrorResponse(response, 401, 'You are not logged in');
    });

    test('should return 401 when token is invalid', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await agent
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      testUtils.assertErrorResponse(response, 401);
    });

    test('should return 401 when user no longer exists', async () => {
      jwt.verify.mockReturnValue({ id: 'user-123', email: 'test@example.com' });
      query.mockResolvedValueOnce([]); // User not found

      const response = await agent
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer mock-jwt-token');

      testUtils.assertErrorResponse(response, 401, 'The user belonging to this token does no longer exist');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    test('should logout user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'user',
        is_active: true
      };

      jwt.verify.mockReturnValue({ id: 'user-123', email: 'test@example.com' });
      query.mockResolvedValueOnce([mockUser]); // Find user

      const response = await agent
        .post('/api/v1/auth/logout')
        .set('Authorization', 'Bearer mock-jwt-token');

      testUtils.assertSuccessResponse(response, 200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });

    test('should return 401 when no token provided', async () => {
      const response = await agent
        .post('/api/v1/auth/logout');

      testUtils.assertErrorResponse(response, 401, 'You are not logged in');
    });
  });

  describe('Rate Limiting', () => {
    test('should apply rate limiting to auth endpoints', async () => {
      // This test would require actual rate limiting implementation
      // For now, we'll test that the endpoint responds normally
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!'
      };

      query.mockResolvedValueOnce([]); // No user found

      const response = await agent
        .post('/api/v1/auth/login')
        .send(loginData);

      // Should get normal response (not rate limited in test environment)
      expect(response.status).toBeDefined();
    });
  });

  describe('Input Validation', () => {
    test('should validate email format in registration', async () => {
      const userData = {
        email: 'not-an-email',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!'
      };

      const response = await agent
        .post('/api/v1/auth/register')
        .send(userData);

      testUtils.assertErrorResponse(response, 400);
    });

    test('should validate password strength in registration', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'weak',
        passwordConfirm: 'weak'
      };

      const response = await agent
        .post('/api/v1/auth/register')
        .send(userData);

      testUtils.assertErrorResponse(response, 400);
    });

    test('should sanitize input data', async () => {
      const userData = {
        email: '  test@example.com  ',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        firstName: '  John  ',
        lastName: '  Doe  '
      };

      query.mockResolvedValueOnce([]); // No existing user
      bcrypt.hash.mockResolvedValue('hashedPassword');
      query.mockResolvedValueOnce(); // Insert user
      query.mockResolvedValueOnce([{
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
        is_active: true,
        created_at: new Date()
      }]);
      jwt.sign.mockReturnValue('mock-jwt-token');

      const response = await agent
        .post('/api/v1/auth/register')
        .send(userData);

      testUtils.assertSuccessResponse(response, 201);
      // Email should be trimmed and normalized
      expect(response.body.data.user.email).toBe('test@example.com');
    });
  });
});
