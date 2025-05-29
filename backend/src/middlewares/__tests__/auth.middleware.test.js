/**
 * Auth Middleware Unit Tests
 * UF3/UF4 Curriculum Project
 * Tests for authentication middleware functions
 */

import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { protect, restrictTo, checkOwnership, createSendToken, optionalAuth } from '../auth.middleware.js';
import { AppError } from '../error.middleware.js';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../db/database.js', () => ({
  query: jest.fn()
}));

import { query } from '../../db/database.js';

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
      cookies: {},
      params: {},
      user: null
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();

    // Reset mocks
    jest.clearAllMocks();

    // Set test environment
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1d';
    process.env.JWT_COOKIE_EXPIRES_IN = '1';
  });

  describe('protect middleware', () => {
    test('should authenticate user with valid token in header', async () => {
      const token = 'valid-token';
      const userId = 'user-123';
      const userEmail = 'test@example.com';

      mockReq.headers.authorization = `Bearer ${token}`;

      jwt.verify.mockReturnValue({ id: userId, email: userEmail });
      query.mockResolvedValue([{
        id: userId,
        email: userEmail,
        role: 'user',
        is_active: true
      }]);

      await protect(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret');
      expect(query).toHaveBeenCalledWith(
        'SELECT id, email, role, is_active FROM users WHERE id = ?',
        [userId]
      );
      expect(mockReq.user).toEqual({
        id: userId,
        email: userEmail,
        role: 'user',
        is_active: true
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    test('should authenticate user with valid token in cookie', async () => {
      const token = 'valid-token';
      const userId = 'user-123';

      mockReq.cookies.jwt = token;

      jwt.verify.mockReturnValue({ id: userId });
      query.mockResolvedValue([{
        id: userId,
        email: 'test@example.com',
        role: 'user',
        is_active: true
      }]);

      await protect(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    test('should return error when no token provided', async () => {
      await protect(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You are not logged in! Please log in to get access.',
          statusCode: 401
        })
      );
    });

    test('should return error when token is invalid', async () => {
      const token = 'invalid-token';
      mockReq.headers.authorization = `Bearer ${token}`;

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await protect(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    test('should return error when user not found', async () => {
      const token = 'valid-token';
      const userId = 'user-123';

      mockReq.headers.authorization = `Bearer ${token}`;
      jwt.verify.mockReturnValue({ id: userId });
      query.mockResolvedValue([]);

      await protect(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'The user belonging to this token does no longer exist.',
          statusCode: 401
        })
      );
    });

    test('should return error when user is inactive', async () => {
      const token = 'valid-token';
      const userId = 'user-123';

      mockReq.headers.authorization = `Bearer ${token}`;
      jwt.verify.mockReturnValue({ id: userId });
      query.mockResolvedValue([{
        id: userId,
        email: 'test@example.com',
        role: 'user',
        is_active: false
      }]);

      await protect(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Your account has been deactivated. Please contact support.',
          statusCode: 401
        })
      );
    });

    test('should handle malformed authorization header', async () => {
      mockReq.headers.authorization = 'InvalidFormat';

      await protect(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You are not logged in! Please log in to get access.',
          statusCode: 401
        })
      );
    });
  });

  describe('restrictTo middleware', () => {
    test('should allow access for authorized role', () => {
      mockReq.user = { role: 'admin' };
      const middleware = restrictTo('admin');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    test('should allow access for multiple authorized roles', () => {
      mockReq.user = { role: 'user' };
      const middleware = restrictTo('admin', 'user');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    test('should deny access for unauthorized role', () => {
      mockReq.user = { role: 'user' };
      const middleware = restrictTo('admin');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You do not have permission to perform this action',
          statusCode: 403
        })
      );
    });

    test('should handle missing user', () => {
      mockReq.user = null;
      const middleware = restrictTo('admin');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You do not have permission to perform this action',
          statusCode: 403
        })
      );
    });
  });

  describe('checkOwnership middleware', () => {
    test('should allow access for resource owner', () => {
      mockReq.user = { id: 'user-123', role: 'user' };
      mockReq.params = { userId: 'user-123' };
      const middleware = checkOwnership('userId');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    test('should allow access for admin', () => {
      mockReq.user = { id: 'admin-123', role: 'admin' };
      mockReq.params = { userId: 'user-123' };
      const middleware = checkOwnership('userId');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    test('should deny access for non-owner non-admin', () => {
      mockReq.user = { id: 'user-456', role: 'user' };
      mockReq.params = { userId: 'user-123' };
      const middleware = checkOwnership('userId');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You can only access your own resources',
          statusCode: 403
        })
      );
    });

    test('should handle missing parameter', () => {
      mockReq.user = { id: 'user-123', role: 'user' };
      mockReq.params = {};
      const middleware = checkOwnership('userId');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'You can only access your own resources',
          statusCode: 403
        })
      );
    });
  });

  describe('optionalAuth middleware', () => {
    test('should set user when valid token provided', async () => {
      const token = 'valid-token';
      const userId = 'user-123';

      mockReq.headers.authorization = `Bearer ${token}`;
      jwt.verify.mockReturnValue({ id: userId });
      query.mockResolvedValue([{
        id: userId,
        email: 'test@example.com',
        role: 'user',
        is_active: true
      }]);

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeDefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    test('should continue without user when no token provided', async () => {
      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeNull();
      expect(mockNext).toHaveBeenCalledWith();
    });

    test('should continue without user when invalid token provided', async () => {
      const token = 'invalid-token';
      mockReq.headers.authorization = `Bearer ${token}`;

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeNull();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('createSendToken', () => {
    test('should create and send token with user data', () => {
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        role: 'user'
      };
      const statusCode = 200;

      jwt.sign.mockReturnValue('generated-token');

      createSendToken(user, statusCode, mockRes);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'user-123', email: 'test@example.com' },
        'test-secret',
        { expiresIn: '1d' }
      );

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'jwt',
        'generated-token',
        expect.objectContaining({
          expires: expect.any(Date),
          httpOnly: true,
          secure: false
        })
      );

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        token: 'generated-token',
        data: {
          user: user
        }
      });
    });

    test('should set secure cookie in production', () => {
      process.env.NODE_ENV = 'production';
      const user = { id: 'user-123', email: 'test@example.com' };

      jwt.sign.mockReturnValue('generated-token');

      createSendToken(user, 200, mockRes);

      expect(mockRes.cookie).toHaveBeenCalledWith(
        'jwt',
        'generated-token',
        expect.objectContaining({
          secure: true
        })
      );
    });
  });
});
