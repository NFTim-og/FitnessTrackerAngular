/**
 * Jest Configuration for Fitness Tracker Backend
 * UF3/UF4 Curriculum Project - Comprehensive Testing Setup
 */

export default {
  // Test environment
  testEnvironment: 'node',

  // ES Modules support
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/test/**/*.js',
    '!src/db/seed.js',
    '!src/server.js',
    '!src/index.js',
    '!src/minimal-server.js',
    '!src/simple-server.js',
    '!src/test-server*.js'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },

  // Coverage reporting
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Coverage path ignore patterns
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    '/coverage/'
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],

  // Test timeout
  testTimeout: 15000,

  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  // Verbose output
  verbose: true,

  // Transform configuration for ES modules
  transform: {
    '^.+\\.js$': ['babel-jest', {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
    }]
  },

  // Module file extensions
  moduleFileExtensions: ['js', 'json'],

  // Maximum workers
  maxWorkers: '50%',

  // Force exit after tests complete
  forceExit: true,

  // Detect open handles
  detectOpenHandles: true
};
