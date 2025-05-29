/**
 * Auth Middleware Tests
 * Tests for the authentication middleware
 */

const jwt = require('jsonwebtoken');
const authMiddleware = require('./auth.middleware');
const User = require('../models/user.model');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../models/user.model');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock request, response, and next function
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('protect', () => {
    it('should call next() when token is valid', async () => {
      // Mock data
      const mockUser = { id: 'user1', email: 'user@example.com' };
      const mockToken = 'valid.jwt.token';
      const decodedToken = { id: 'user1', email: 'user@example.com' };

      // Setup mock implementations
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(decodedToken);
      User.findById.mockResolvedValue(mockUser);

      // Call the middleware
      await authMiddleware.protect(req, res, next);

      // Assertions
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, expect.any(String));
      expect(User.findById).toHaveBeenCalledWith('user1');
      expect(req.user).toEqual(decodedToken);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 when no token is provided', async () => {
      // Call the middleware
      await authMiddleware.protect(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'You are not logged in. Please log in to get access.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
      // Setup mock implementations
      req.headers.authorization = 'Bearer invalid.token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Call the middleware
      await authMiddleware.protect(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Invalid token. Please log in again.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when user no longer exists', async () => {
      // Setup mock implementations
      req.headers.authorization = 'Bearer valid.token';
      jwt.verify.mockReturnValue({ id: 'user1' });
      User.findById.mockResolvedValue(null);

      // Call the middleware
      await authMiddleware.protect(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('restrictTo', () => {
    it('should call next() when user has required role', async () => {
      // Mock data
      const mockUser = { id: 'user1', role: 'admin' };

      // Setup mock implementations
      req.user = { id: 'user1' };
      User.findById.mockResolvedValue(mockUser);

      // Create middleware instance
      const middleware = authMiddleware.restrictTo('admin');

      // Call the middleware
      await middleware(req, res, next);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith('user1');
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 when user does not have required role', async () => {
      // Mock data
      const mockUser = { id: 'user1', role: 'user' };

      // Setup mock implementations
      req.user = { id: 'user1' };
      User.findById.mockResolvedValue(mockUser);

      // Create middleware instance
      const middleware = authMiddleware.restrictTo('admin');

      // Call the middleware
      await middleware(req, res, next);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith('user1');
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
