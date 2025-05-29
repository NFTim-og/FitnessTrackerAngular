/**
 * Error Utils Unit Tests
 * UF3/UF4 Curriculum Project
 * Tests for error utility functions
 */

import { jest } from '@jest/globals';
import { AppError, handleCastErrorDB, handleDuplicateFieldsDB, handleValidationErrorDB } from '../error.utils.js';

describe('Error Utils', () => {
  describe('AppError', () => {
    test('should create AppError with message and status code', () => {
      const message = 'Test error message';
      const statusCode = 400;
      
      const error = new AppError(message, statusCode);
      
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.status).toBe('fail');
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe('AppError');
    });

    test('should set status to "error" for 5xx status codes', () => {
      const error = new AppError('Server error', 500);
      
      expect(error.status).toBe('error');
    });

    test('should set status to "fail" for 4xx status codes', () => {
      const error = new AppError('Client error', 400);
      
      expect(error.status).toBe('fail');
    });

    test('should capture stack trace', () => {
      const error = new AppError('Test error', 400);
      
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    test('should be instance of Error', () => {
      const error = new AppError('Test error', 400);
      
      expect(error instanceof Error).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });

    test('should handle default status code', () => {
      const error = new AppError('Test error');
      
      expect(error.statusCode).toBe(500);
      expect(error.status).toBe('error');
    });
  });

  describe('handleCastErrorDB', () => {
    test('should handle MongoDB cast error', () => {
      const mongoError = {
        path: '_id',
        value: 'invalid-id',
        name: 'CastError'
      };
      
      const appError = handleCastErrorDB(mongoError);
      
      expect(appError instanceof AppError).toBe(true);
      expect(appError.message).toBe('Invalid _id: invalid-id');
      expect(appError.statusCode).toBe(400);
    });

    test('should handle cast error with different path', () => {
      const mongoError = {
        path: 'userId',
        value: '123abc',
        name: 'CastError'
      };
      
      const appError = handleCastErrorDB(mongoError);
      
      expect(appError.message).toBe('Invalid userId: 123abc');
    });

    test('should handle cast error with undefined value', () => {
      const mongoError = {
        path: 'id',
        value: undefined,
        name: 'CastError'
      };
      
      const appError = handleCastErrorDB(mongoError);
      
      expect(appError.message).toBe('Invalid id: undefined');
    });
  });

  describe('handleDuplicateFieldsDB', () => {
    test('should handle MongoDB duplicate key error', () => {
      const mongoError = {
        code: 11000,
        keyValue: { email: 'test@example.com' },
        name: 'MongoError'
      };
      
      const appError = handleDuplicateFieldsDB(mongoError);
      
      expect(appError instanceof AppError).toBe(true);
      expect(appError.message).toBe('Duplicate field value: email. Please use another value!');
      expect(appError.statusCode).toBe(400);
    });

    test('should handle duplicate error with multiple fields', () => {
      const mongoError = {
        code: 11000,
        keyValue: { email: 'test@example.com', username: 'testuser' },
        name: 'MongoError'
      };
      
      const appError = handleDuplicateFieldsDB(mongoError);
      
      expect(appError.message).toBe('Duplicate field value: email. Please use another value!');
    });

    test('should handle duplicate error with no keyValue', () => {
      const mongoError = {
        code: 11000,
        errmsg: 'E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "test@example.com" }',
        name: 'MongoError'
      };
      
      const appError = handleDuplicateFieldsDB(mongoError);
      
      expect(appError instanceof AppError).toBe(true);
      expect(appError.statusCode).toBe(400);
    });
  });

  describe('handleValidationErrorDB', () => {
    test('should handle MongoDB validation error', () => {
      const mongoError = {
        name: 'ValidationError',
        errors: {
          email: {
            message: 'Please provide a valid email'
          },
          password: {
            message: 'Password must be at least 8 characters'
          }
        }
      };
      
      const appError = handleValidationErrorDB(mongoError);
      
      expect(appError instanceof AppError).toBe(true);
      expect(appError.message).toBe('Invalid input data. Please provide a valid email. Password must be at least 8 characters');
      expect(appError.statusCode).toBe(400);
    });

    test('should handle validation error with single field', () => {
      const mongoError = {
        name: 'ValidationError',
        errors: {
          name: {
            message: 'Name is required'
          }
        }
      };
      
      const appError = handleValidationErrorDB(mongoError);
      
      expect(appError.message).toBe('Invalid input data. Name is required');
    });

    test('should handle validation error with no errors object', () => {
      const mongoError = {
        name: 'ValidationError',
        message: 'Validation failed'
      };
      
      const appError = handleValidationErrorDB(mongoError);
      
      expect(appError instanceof AppError).toBe(true);
      expect(appError.statusCode).toBe(400);
    });

    test('should handle empty errors object', () => {
      const mongoError = {
        name: 'ValidationError',
        errors: {}
      };
      
      const appError = handleValidationErrorDB(mongoError);
      
      expect(appError.message).toBe('Invalid input data. ');
    });
  });

  describe('Error inheritance and properties', () => {
    test('should maintain Error prototype chain', () => {
      const error = new AppError('Test error', 400);
      
      expect(error.toString()).toBe('AppError: Test error');
      expect(Object.getPrototypeOf(error)).toBe(AppError.prototype);
      expect(Object.getPrototypeOf(AppError.prototype)).toBe(Error.prototype);
    });

    test('should be catchable in try-catch blocks', () => {
      expect(() => {
        throw new AppError('Test error', 400);
      }).toThrow('Test error');
      
      try {
        throw new AppError('Test error', 400);
      } catch (error) {
        expect(error instanceof AppError).toBe(true);
        expect(error instanceof Error).toBe(true);
      }
    });

    test('should have enumerable properties', () => {
      const error = new AppError('Test error', 400);
      const keys = Object.keys(error);
      
      expect(keys).toContain('message');
      expect(keys).toContain('statusCode');
      expect(keys).toContain('status');
      expect(keys).toContain('isOperational');
    });
  });
});
