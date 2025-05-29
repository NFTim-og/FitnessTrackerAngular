/**
 * Auth Controller Unit Tests
 * UF3/UF4 Curriculum Project
 * Tests for authentication controller functions
 */

import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { register, login, getCurrentUser, logout } from '../auth.controller.js';
import { AppError } from '../middlewares/error.middleware.js';

// Mock dependencies
jest.mock('bcrypt');
jest.mock('uuid');
jest.mock('../../db/database.js', () => ({
  query: jest.fn()
}));
jest.mock('../../utils/encryption.utils.js', () => ({
  encryptObjectFields: jest.fn((obj) => obj),
  decryptObjectFields: jest.fn((obj) => obj)
}));
jest.mock('../../middlewares/auth.middleware.js', () => ({
  createSendToken: jest.fn()
}));

import { query } from '../../db/database.js';
import { encryptObjectFields, decryptObjectFields } from '../../utils/encryption.utils.js';
import { createSendToken } from '../../middlewares/auth.middleware.js';

describe('Auth Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: null
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should register new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      mockReq.body = userData;

      // Mock dependencies
      query.mockResolvedValueOnce([]); // No existing user
      bcrypt.hash.mockResolvedValue('hashedPassword');
      uuidv4.mockReturnValue('user-123');
      encryptObjectFields.mockReturnValue({
        firstName: 'encryptedFirstName',
        lastName: 'encryptedLastName'
      });
      query.mockResolvedValueOnce(); // Insert user
      query.mockResolvedValueOnce([{
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'encryptedFirstName',
        last_name: 'encryptedLastName',
        role: 'user',
        is_active: true,
        created_at: new Date()
      }]); // Get created user
      decryptObjectFields.mockReturnValue({
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
        is_active: true,
        created_at: new Date()
      });

      await register(mockReq, mockRes, mockNext);

      expect(bcrypt.hash).toHaveBeenCalledWith('TestPassword123!', 12);
      expect(query).toHaveBeenCalledWith(
        'SELECT id FROM users WHERE email = ?',
        ['test@example.com']
      );
      expect(createSendToken).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return error when passwords do not match', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'DifferentPassword123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      await register(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Passwords do not match',
          statusCode: 400
        })
      );
    });

    test('should return error when user already exists', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      query.mockResolvedValueOnce([{ id: 'existing-user' }]); // Existing user

      await register(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User with this email already exists',
          statusCode: 409
        })
      );
    });

    test('should handle database errors', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        passwordConfirm: 'TestPassword123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      query.mockRejectedValue(new Error('Database error'));

      await register(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('login', () => {
    test('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!'
      };

      mockReq.body = loginData;

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashedPassword',
        first_name: 'encryptedFirstName',
        last_name: 'encryptedLastName',
        role: 'user',
        is_active: true
      };

      query.mockResolvedValueOnce([mockUser]); // Find user
      bcrypt.compare.mockResolvedValue(true); // Password match
      query.mockResolvedValueOnce(); // Update last login
      decryptObjectFields.mockReturnValue({
        ...mockUser,
        first_name: 'John',
        last_name: 'Doe'
      });

      await login(mockReq, mockRes, mockNext);

      expect(query).toHaveBeenCalledWith(
        'SELECT id, email, password, first_name, last_name, role, is_active FROM users WHERE email = ?',
        ['test@example.com']
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('TestPassword123!', 'hashedPassword');
      expect(createSendToken).toHaveBeenCalled();
    });

    test('should return error when email or password missing', async () => {
      mockReq.body = { email: 'test@example.com' }; // Missing password

      await login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Please provide email and password',
          statusCode: 400
        })
      );
    });

    test('should return error when user not found', async () => {
      mockReq.body = {
        email: 'nonexistent@example.com',
        password: 'TestPassword123!'
      };

      query.mockResolvedValueOnce([]); // No user found

      await login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid email or password',
          statusCode: 401
        })
      );
    });

    test('should return error when user is inactive', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'TestPassword123!'
      };

      const inactiveUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashedPassword',
        is_active: false
      };

      query.mockResolvedValueOnce([inactiveUser]);

      await login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid email or password',
          statusCode: 401
        })
      );
    });

    test('should return error when password is incorrect', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'WrongPassword123!'
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        password: 'hashedPassword',
        is_active: true
      };

      query.mockResolvedValueOnce([mockUser]);
      bcrypt.compare.mockResolvedValue(false); // Password doesn't match

      await login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid email or password',
          statusCode: 401
        })
      );
    });
  });

  describe('getCurrentUser', () => {
    test('should return current user successfully', async () => {
      mockReq.user = { id: 'user-123' };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'encryptedFirstName',
        last_name: 'encryptedLastName',
        role: 'user',
        is_active: true,
        email_verified: true,
        last_login: new Date(),
        created_at: new Date()
      };

      query.mockResolvedValueOnce([mockUser]);
      decryptObjectFields.mockReturnValue({
        ...mockUser,
        first_name: 'John',
        last_name: 'Doe'
      });

      await getCurrentUser(mockReq, mockRes, mockNext);

      expect(query).toHaveBeenCalledWith(
        'SELECT id, email, first_name, last_name, role, is_active, email_verified, last_login, created_at FROM users WHERE id = ?',
        ['user-123']
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          user: expect.objectContaining({
            id: 'user-123',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe'
          })
        }
      });
    });

    test('should return error when user not found', async () => {
      mockReq.user = { id: 'nonexistent-user' };

      query.mockResolvedValueOnce([]); // No user found

      await getCurrentUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not found',
          statusCode: 404
        })
      );
    });
  });

  describe('logout', () => {
    test('should logout user successfully', async () => {
      await logout(mockReq, mockRes, mockNext);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'jwt',
        'loggedout',
        expect.objectContaining({
          expires: expect.any(Date),
          httpOnly: true
        })
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Logged out successfully'
      });
    });
  });
});
