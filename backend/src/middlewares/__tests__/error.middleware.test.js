/**
 * Error Middleware Unit Tests
 * UF3/UF4 Curriculum Project
 * Tests for error handling middleware
 */

import { jest } from '@jest/globals';
import { AppError, catchAsync, globalErrorHandler } from '../error.middleware.js';

describe('Error Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      originalUrl: '/api/v1/test',
      method: 'GET',
      ip: '127.0.0.1',
      headers: {
        'user-agent': 'test-agent'
      }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    // Mock console methods
    console.error = jest.fn();
    console.log = jest.fn();
  });

  describe('AppError', () => {
    test('should create AppError with correct properties', () => {
      const message = 'Test error';
      const statusCode = 400;
      
      const error = new AppError(message, statusCode);
      
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.status).toBe('fail');
      expect(error.isOperational).toBe(true);
    });

    test('should set status to "error" for 5xx codes', () => {
      const error = new AppError('Server error', 500);
      expect(error.status).toBe('error');
    });

    test('should set status to "fail" for 4xx codes', () => {
      const error = new AppError('Client error', 404);
      expect(error.status).toBe('fail');
    });
  });

  describe('catchAsync', () => {
    test('should call next with error when async function throws', async () => {
      const asyncFn = jest.fn().mockRejectedValue(new Error('Async error'));
      const wrappedFn = catchAsync(asyncFn);
      
      await wrappedFn(mockReq, mockRes, mockNext);
      
      expect(asyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockNext.mock.calls[0][0].message).toBe('Async error');
    });

    test('should not call next when async function succeeds', async () => {
      const asyncFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = catchAsync(asyncFn);
      
      await wrappedFn(mockReq, mockRes, mockNext);
      
      expect(asyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle AppError correctly', async () => {
      const appError = new AppError('Custom error', 400);
      const asyncFn = jest.fn().mockRejectedValue(appError);
      const wrappedFn = catchAsync(asyncFn);
      
      await wrappedFn(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith(appError);
    });

    test('should handle non-Error objects', async () => {
      const asyncFn = jest.fn().mockRejectedValue('String error');
      const wrappedFn = catchAsync(asyncFn);
      
      await wrappedFn(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith('String error');
    });
  });

  describe('globalErrorHandler', () => {
    test('should handle AppError in development', () => {
      process.env.NODE_ENV = 'development';
      const error = new AppError('Test error', 400);
      
      globalErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'fail',
        error: error,
        message: 'Test error',
        stack: error.stack
      });
    });

    test('should handle AppError in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new AppError('Test error', 400);
      
      globalErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Test error'
      });
    });

    test('should handle non-operational errors in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Internal error');
      error.statusCode = 500;
      
      globalErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Something went wrong!'
      });
    });

    test('should handle JWT errors', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('jwt malformed');
      error.name = 'JsonWebTokenError';
      
      globalErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Invalid token. Please log in again!'
      });
    });

    test('should handle JWT expired errors', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      
      globalErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Your token has expired! Please log in again.'
      });
    });

    test('should handle validation errors', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Validation failed');
      error.name = 'ValidationError';
      error.errors = {
        email: { message: 'Email is required' }
      };
      
      globalErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('should handle cast errors', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Cast to ObjectId failed');
      error.name = 'CastError';
      error.path = '_id';
      error.value = 'invalid-id';
      
      globalErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('should handle duplicate field errors', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Duplicate key error');
      error.code = 11000;
      error.keyValue = { email: 'test@example.com' };
      
      globalErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('should set default status code for errors without statusCode', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Generic error');
      
      globalErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    test('should log errors in development', () => {
      process.env.NODE_ENV = 'development';
      const error = new AppError('Test error', 400);
      
      globalErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(console.error).toHaveBeenCalled();
    });

    test('should handle errors without message', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error();
      error.statusCode = 400;
      error.isOperational = true;
      
      globalErrorHandler(error, mockReq, mockRes, mockNext);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'fail',
        message: ''
      });
    });
  });

  describe('Error handling edge cases', () => {
    test('should handle null error', () => {
      process.env.NODE_ENV = 'production';
      
      globalErrorHandler(null, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    test('should handle undefined error', () => {
      process.env.NODE_ENV = 'production';
      
      globalErrorHandler(undefined, mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    test('should handle string error', () => {
      process.env.NODE_ENV = 'development';
      
      globalErrorHandler('String error', mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
