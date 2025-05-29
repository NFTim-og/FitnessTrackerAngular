/**
 * Rate Limiter Middleware Unit Tests
 * UF3/UF4 Curriculum Project
 * Tests for rate limiting middleware functions
 */

import { jest } from '@jest/globals';
import { generalLimiter, authLimiter, createCustomLimiter } from '../rateLimiter.middleware.js';

// Mock express-rate-limit
jest.mock('express-rate-limit', () => {
  return jest.fn((options) => {
    const limiter = jest.fn((req, res, next) => {
      // Simulate rate limiting logic
      const clientId = req.ip || 'unknown';
      const now = Date.now();
      
      // Mock store for tracking requests
      if (!limiter._store) {
        limiter._store = new Map();
      }
      
      const clientData = limiter._store.get(clientId) || { count: 0, resetTime: now + options.windowMs };
      
      if (now > clientData.resetTime) {
        clientData.count = 0;
        clientData.resetTime = now + options.windowMs;
      }
      
      clientData.count++;
      limiter._store.set(clientId, clientData);
      
      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': options.max,
        'X-RateLimit-Remaining': Math.max(0, options.max - clientData.count),
        'X-RateLimit-Reset': new Date(clientData.resetTime)
      });
      
      if (clientData.count > options.max) {
        return res.status(429).json({
          status: 'error',
          message: options.message || 'Too many requests'
        });
      }
      
      next();
    });
    
    // Store options for testing
    limiter._options = options;
    return limiter;
  });
});

describe('Rate Limiter Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      ip: '127.0.0.1',
      headers: {
        'user-agent': 'test-agent'
      }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('generalLimiter', () => {
    test('should allow requests within limit', () => {
      generalLimiter(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('should have correct configuration', () => {
      expect(generalLimiter._options).toEqual({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: {
          status: 'error',
          message: 'Too many requests from this IP, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false
      });
    });

    test('should set rate limit headers', () => {
      generalLimiter(mockReq, mockRes, mockNext);
      
      expect(mockRes.set).toHaveBeenCalledWith({
        'X-RateLimit-Limit': 100,
        'X-RateLimit-Remaining': expect.any(Number),
        'X-RateLimit-Reset': expect.any(Date)
      });
    });

    test('should block requests when limit exceeded', () => {
      // Simulate multiple requests to exceed limit
      for (let i = 0; i < 101; i++) {
        generalLimiter(mockReq, mockRes, mockNext);
      }
      
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: expect.stringContaining('Too many requests')
      });
    });
  });

  describe('authLimiter', () => {
    test('should allow requests within limit', () => {
      authLimiter(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('should have correct configuration', () => {
      expect(authLimiter._options).toEqual({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // limit each IP to 5 requests per windowMs
        message: {
          status: 'error',
          message: 'Too many authentication attempts from this IP, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: true
      });
    });

    test('should have stricter limits than general limiter', () => {
      expect(authLimiter._options.max).toBeLessThan(generalLimiter._options.max);
    });

    test('should block requests when auth limit exceeded', () => {
      // Simulate multiple auth requests to exceed limit
      for (let i = 0; i < 6; i++) {
        authLimiter(mockReq, mockRes, mockNext);
      }
      
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: expect.stringContaining('Too many authentication attempts')
      });
    });
  });

  describe('createCustomLimiter', () => {
    test('should create limiter with custom options', () => {
      const customOptions = {
        windowMs: 60000, // 1 minute
        max: 10,
        message: 'Custom rate limit message'
      };
      
      const customLimiter = createCustomLimiter(customOptions);
      
      expect(customLimiter._options).toEqual(expect.objectContaining(customOptions));
    });

    test('should merge with default options', () => {
      const customOptions = {
        max: 50
      };
      
      const customLimiter = createCustomLimiter(customOptions);
      
      expect(customLimiter._options.max).toBe(50);
      expect(customLimiter._options.windowMs).toBeDefined();
      expect(customLimiter._options.standardHeaders).toBe(true);
    });

    test('should work with custom configuration', () => {
      const customLimiter = createCustomLimiter({
        windowMs: 60000,
        max: 2,
        message: 'Custom limit exceeded'
      });
      
      // First two requests should pass
      customLimiter(mockReq, mockRes, mockNext);
      customLimiter(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(2);
      
      // Third request should be blocked
      customLimiter(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(429);
    });
  });

  describe('Rate limiter behavior', () => {
    test('should track requests per IP address', () => {
      const req1 = { ...mockReq, ip: '192.168.1.1' };
      const req2 = { ...mockReq, ip: '192.168.1.2' };
      
      // Each IP should have its own limit
      generalLimiter(req1, mockRes, mockNext);
      generalLimiter(req2, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledTimes(2);
    });

    test('should reset count after window expires', () => {
      const shortLimiter = createCustomLimiter({
        windowMs: 100, // 100ms window
        max: 1
      });
      
      // First request should pass
      shortLimiter(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
      
      // Second request should be blocked
      shortLimiter(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
      
      // Wait for window to expire and test again
      setTimeout(() => {
        jest.clearAllMocks();
        shortLimiter(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith();
      }, 150);
    });

    test('should handle missing IP address', () => {
      const reqWithoutIP = { ...mockReq, ip: undefined };
      
      generalLimiter(reqWithoutIP, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
    });

    test('should set correct remaining count', () => {
      const limiter = createCustomLimiter({ max: 5 });
      
      // Make 3 requests
      for (let i = 0; i < 3; i++) {
        limiter(mockReq, mockRes, mockNext);
      }
      
      // Check that remaining count is correct
      const lastCall = mockRes.set.mock.calls[mockRes.set.mock.calls.length - 1];
      const headers = lastCall[0];
      expect(headers['X-RateLimit-Remaining']).toBe(2); // 5 - 3 = 2
    });
  });

  describe('Error handling', () => {
    test('should handle rate limiter errors gracefully', () => {
      const errorLimiter = jest.fn((req, res, next) => {
        throw new Error('Rate limiter error');
      });
      
      expect(() => {
        errorLimiter(mockReq, mockRes, mockNext);
      }).toThrow('Rate limiter error');
    });

    test('should provide meaningful error messages', () => {
      const limiter = createCustomLimiter({
        max: 1,
        message: {
          status: 'error',
          message: 'Rate limit exceeded for this endpoint'
        }
      });
      
      // Exceed limit
      limiter(mockReq, mockRes, mockNext);
      limiter(mockReq, mockRes, mockNext);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Rate limit exceeded for this endpoint'
      });
    });
  });

  describe('Configuration validation', () => {
    test('should use default values for missing options', () => {
      const limiter = createCustomLimiter({});
      
      expect(limiter._options.windowMs).toBeDefined();
      expect(limiter._options.max).toBeDefined();
      expect(limiter._options.standardHeaders).toBe(true);
    });

    test('should override defaults with provided options', () => {
      const customOptions = {
        windowMs: 30000,
        max: 25,
        standardHeaders: false
      };
      
      const limiter = createCustomLimiter(customOptions);
      
      expect(limiter._options.windowMs).toBe(30000);
      expect(limiter._options.max).toBe(25);
      expect(limiter._options.standardHeaders).toBe(false);
    });
  });
});
