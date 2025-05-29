/**
 * Jest Test Setup
 * UF3/UF4 Curriculum Project
 * Global test configuration and utilities
 */

import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test timeout
jest.setTimeout(15000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Global test utilities
global.testUtils = {
  // Generate test user data
  generateTestUser: (overrides = {}) => ({
    email: 'test@example.com',
    password: 'TestPassword123!',
    passwordConfirm: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    ...overrides
  }),

  // Generate test exercise data
  generateTestExercise: (overrides = {}) => ({
    name: 'Test Exercise',
    description: 'A test exercise for unit testing',
    category: 'cardio',
    duration_minutes: 30,
    calories_per_minute: 5.5,
    difficulty: 'beginner',
    met_value: 4.0,
    equipment_needed: 'None',
    muscle_groups: ['legs', 'core'],
    instructions: 'Test exercise instructions',
    is_public: true,
    ...overrides
  }),

  // Generate test workout plan data
  generateTestWorkoutPlan: (overrides = {}) => ({
    name: 'Test Workout Plan',
    description: 'A test workout plan for unit testing',
    category: 'strength',
    difficulty: 'intermediate',
    estimated_duration_minutes: 45,
    target_muscle_groups: ['chest', 'arms'],
    equipment_needed: ['dumbbells'],
    instructions: 'Test workout plan instructions',
    is_public: true,
    ...overrides
  }),

  // Generate test weight entry data
  generateTestWeightEntry: (overrides = {}) => ({
    weight_kg: 70.5,
    recorded_date: '2024-01-15',
    notes: 'Test weight entry',
    ...overrides
  }),

  // Generate test profile data
  generateTestProfile: (overrides = {}) => ({
    weight_kg: 70.0,
    height_cm: 175,
    date_of_birth: '1990-01-01',
    gender: 'male',
    activity_level: 'moderately_active',
    fitness_goal: 'maintain_weight',
    ...overrides
  }),

  // Mock JWT token
  generateMockToken: () => 'mock.jwt.token',

  // Mock UUID
  generateMockUUID: () => '123e4567-e89b-12d3-a456-426614174000',

  // Mock database response
  mockDbResponse: (data = []) => Promise.resolve(data),

  // Mock error response
  mockDbError: (message = 'Database error') => Promise.reject(new Error(message))
};

// Global test constants
global.testConstants = {
  VALID_UUID: '123e4567-e89b-12d3-a456-426614174000',
  INVALID_UUID: 'invalid-uuid',
  VALID_EMAIL: 'test@example.com',
  INVALID_EMAIL: 'invalid-email',
  VALID_PASSWORD: 'TestPassword123!',
  WEAK_PASSWORD: '123',
  TEST_USER_ID: '123e4567-e89b-12d3-a456-426614174000',
  TEST_EXERCISE_ID: '123e4567-e89b-12d3-a456-426614174001',
  TEST_WORKOUT_PLAN_ID: '123e4567-e89b-12d3-a456-426614174002',
  MOCK_JWT_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE2NDA5OTg4MDB9.test-signature'
};

// Setup and teardown hooks
beforeAll(async () => {
  // Global setup before all tests
  console.log('🧪 Starting test suite...');
});

afterAll(async () => {
  // Global cleanup after all tests
  console.log('✅ Test suite completed');
});

beforeEach(() => {
  // Reset mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
  jest.restoreAllMocks();
});

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export for ES modules
export default {};
