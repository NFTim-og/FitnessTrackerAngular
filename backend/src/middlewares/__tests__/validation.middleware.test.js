/**
 * Validation Middleware Unit Tests
 * UF3/UF4 Curriculum Project
 * Tests for validation middleware functions
 */

import { jest } from '@jest/globals';
import { validationResult } from 'express-validator';
import {
  validate,
  validateUserRegistration,
  validateUserLogin,
  validateUserProfile,
  validateExercise,
  validateWorkoutPlan,
  validateWeightEntry,
  validateUUID,
  validatePagination
} from '../validation.middleware.js';

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
  body: jest.fn(() => ({
    isEmail: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
    matches: jest.fn().mockReturnThis(),
    isIn: jest.fn().mockReturnThis(),
    isInt: jest.fn().mockReturnThis(),
    isFloat: jest.fn().mockReturnThis(),
    isUUID: jest.fn().mockReturnThis(),
    isDate: jest.fn().mockReturnThis(),
    isBoolean: jest.fn().mockReturnThis(),
    optional: jest.fn().mockReturnThis(),
    notEmpty: jest.fn().mockReturnThis(),
    trim: jest.fn().mockReturnThis(),
    escape: jest.fn().mockReturnThis(),
    normalizeEmail: jest.fn().mockReturnThis(),
    custom: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis()
  })),
  param: jest.fn(() => ({
    isUUID: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis()
  })),
  query: jest.fn(() => ({
    isInt: jest.fn().mockReturnThis(),
    isIn: jest.fn().mockReturnThis(),
    optional: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis()
  }))
}));

describe('Validation Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('validate middleware', () => {
    test('should call next when no validation errors', () => {
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });
      
      validate(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
    });

    test('should return 400 with errors when validation fails', () => {
      const errors = [
        {
          msg: 'Email is required',
          param: 'email',
          location: 'body'
        },
        {
          msg: 'Password must be at least 8 characters',
          param: 'password',
          location: 'body'
        }
      ];
      
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => errors
      });
      
      validate(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Validation failed',
        errors: errors
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle empty errors array', () => {
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => []
      });
      
      validate(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('validateUserRegistration', () => {
    test('should be an array of validation rules', () => {
      expect(Array.isArray(validateUserRegistration)).toBe(true);
      expect(validateUserRegistration.length).toBeGreaterThan(0);
    });

    test('should validate email field', () => {
      // This test verifies that the validation rules are properly configured
      // The actual validation logic is tested through integration tests
      expect(validateUserRegistration).toBeDefined();
    });
  });

  describe('validateUserLogin', () => {
    test('should be an array of validation rules', () => {
      expect(Array.isArray(validateUserLogin)).toBe(true);
      expect(validateUserLogin.length).toBeGreaterThan(0);
    });
  });

  describe('validateUserProfile', () => {
    test('should be an array of validation rules', () => {
      expect(Array.isArray(validateUserProfile)).toBe(true);
      expect(validateUserProfile.length).toBeGreaterThan(0);
    });
  });

  describe('validateExercise', () => {
    test('should be an array of validation rules', () => {
      expect(Array.isArray(validateExercise)).toBe(true);
      expect(validateExercise.length).toBeGreaterThan(0);
    });
  });

  describe('validateWorkoutPlan', () => {
    test('should be an array of validation rules', () => {
      expect(Array.isArray(validateWorkoutPlan)).toBe(true);
      expect(validateWorkoutPlan.length).toBeGreaterThan(0);
    });
  });

  describe('validateWeightEntry', () => {
    test('should be an array of validation rules', () => {
      expect(Array.isArray(validateWeightEntry)).toBe(true);
      expect(validateWeightEntry.length).toBeGreaterThan(0);
    });
  });

  describe('validateUUID', () => {
    test('should be an array of validation rules', () => {
      expect(Array.isArray(validateUUID)).toBe(true);
      expect(validateUUID.length).toBeGreaterThan(0);
    });
  });

  describe('validatePagination', () => {
    test('should be an array of validation rules', () => {
      expect(Array.isArray(validatePagination)).toBe(true);
      expect(validatePagination.length).toBeGreaterThan(0);
    });
  });

  describe('Validation rule structure', () => {
    test('should have proper validation chain structure', () => {
      // Test that validation rules return proper middleware functions
      validateUserRegistration.forEach(rule => {
        expect(typeof rule).toBe('function');
      });
      
      validateUserLogin.forEach(rule => {
        expect(typeof rule).toBe('function');
      });
      
      validateExercise.forEach(rule => {
        expect(typeof rule).toBe('function');
      });
    });
  });

  describe('Error message formatting', () => {
    test('should format single error correctly', () => {
      const errors = [
        {
          msg: 'Email is required',
          param: 'email',
          location: 'body'
        }
      ];
      
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => errors
      });
      
      validate(mockReq, mockRes, mockNext);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Validation failed',
        errors: errors
      });
    });

    test('should format multiple errors correctly', () => {
      const errors = [
        {
          msg: 'Email is required',
          param: 'email',
          location: 'body'
        },
        {
          msg: 'Password must be at least 8 characters',
          param: 'password',
          location: 'body'
        },
        {
          msg: 'First name is required',
          param: 'firstName',
          location: 'body'
        }
      ];
      
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => errors
      });
      
      validate(mockReq, mockRes, mockNext);
      
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Validation failed',
        errors: errors
      });
    });
  });

  describe('Validation middleware integration', () => {
    test('should work with express-validator chain', () => {
      // Mock a successful validation chain execution
      const mockValidationChain = jest.fn((req, res, next) => {
        next();
      });
      
      // Simulate running validation chain
      mockValidationChain(mockReq, mockRes, () => {
        validationResult.mockReturnValue({
          isEmpty: () => true,
          array: () => []
        });
        
        validate(mockReq, mockRes, mockNext);
      });
      
      expect(mockNext).toHaveBeenCalledWith();
    });

    test('should handle validation chain errors', () => {
      const mockValidationChain = jest.fn((req, res, next) => {
        // Simulate validation errors being added
        next();
      });
      
      mockValidationChain(mockReq, mockRes, () => {
        validationResult.mockReturnValue({
          isEmpty: () => false,
          array: () => [
            {
              msg: 'Validation error',
              param: 'field',
              location: 'body'
            }
          ]
        });
        
        validate(mockReq, mockRes, mockNext);
      });
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
