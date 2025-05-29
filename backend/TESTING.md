# Testing Documentation
## UF3/UF4 Curriculum Project - Fitness Tracker Backend

This document provides comprehensive information about the testing strategy, implementation, and execution for the Fitness Tracker Backend API.

## 🧪 Testing Strategy

### Testing Pyramid
Our testing strategy follows the testing pyramid approach:

1. **Unit Tests (70%)** - Test individual functions and components in isolation
2. **Integration Tests (20%)** - Test API endpoints and component interactions
3. **End-to-End Tests (10%)** - Test complete user workflows (future implementation)

### Test Categories

#### Unit Tests
- **Utilities**: Pagination, encryption, error handling functions
- **Middleware**: Authentication, validation, rate limiting, error handling
- **Controllers**: Business logic for auth, user, exercise, workout operations
- **Models**: Database interaction functions (when implemented)

#### Integration Tests
- **API Endpoints**: Complete HTTP request/response cycles
- **Authentication Flows**: Login, registration, token validation
- **Authorization**: Role-based access control and ownership checks
- **Data Validation**: Input sanitization and error responses

## 🛠️ Test Setup

### Dependencies
```json
{
  "jest": "^29.7.0",
  "supertest": "^7.1.0",
  "@babel/core": "^7.25.2",
  "@babel/preset-env": "^7.25.4",
  "babel-jest": "^29.7.0",
  "jest-environment-node": "^29.7.0"
}
```

### Configuration Files
- `jest.config.js` - Main Jest configuration with ES modules support
- `src/test/setup.js` - Global test setup and utilities
- `src/test/integration-setup.js` - Integration test utilities
- `.env.test` - Test environment variables

### Environment Variables
```bash
NODE_ENV=test
JWT_SECRET=test_jwt_secret_key
DB_NAME=fitness_tracker_test
# ... other test-specific variables
```

## 📁 Test Structure

```
backend/src/
├── test/
│   ├── setup.js                    # Global test setup
│   └── integration-setup.js        # Integration test utilities
├── utils/__tests__/
│   ├── pagination.utils.test.js    # Pagination utility tests
│   ├── encryption.utils.test.js    # Encryption utility tests
│   └── error.utils.test.js         # Error utility tests
├── middlewares/__tests__/
│   ├── auth.middleware.test.js     # Authentication middleware tests
│   ├── validation.middleware.test.js # Validation middleware tests
│   ├── error.middleware.test.js    # Error handling middleware tests
│   └── rateLimiter.middleware.test.js # Rate limiting tests
├── controllers/__tests__/
│   ├── auth.controller.test.js     # Auth controller tests
│   ├── user.controller.test.js     # User controller tests
│   └── exercise.controller.test.js # Exercise controller tests
└── routes/__tests__/
    ├── auth.routes.integration.test.js     # Auth API integration tests
    ├── user.routes.integration.test.js     # User API integration tests
    └── exercise.routes.integration.test.js # Exercise API integration tests
```

## 🚀 Running Tests

### Available Scripts
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests for CI/CD (no watch, with coverage)
npm run test:ci

# Validate code (lint + test)
npm run validate
```

### Test Execution Examples
```bash
# Run specific test file
npm test -- auth.controller.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should register user"

# Run tests with verbose output
npm test -- --verbose

# Run tests and update snapshots
npm test -- --updateSnapshot
```

## 📊 Coverage Requirements

### Coverage Thresholds
- **Branches**: 75%
- **Functions**: 75%
- **Lines**: 75%
- **Statements**: 75%

### Coverage Reports
- **Text**: Console output during test execution
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info` (for CI/CD integration)
- **JSON**: `coverage/coverage-final.json`

## 🧩 Test Utilities

### Global Test Utilities (`testUtils`)
```javascript
// Generate test data
testUtils.generateTestUser()
testUtils.generateTestExercise()
testUtils.generateTestWorkoutPlan()

// Mock responses
testUtils.mockDbResponse(data)
testUtils.mockDbError(message)

// Authentication helpers
testUtils.generateMockToken()
testUtils.generateMockUUID()
```

### Integration Test Utilities
```javascript
// Setup test environment
await testUtils.setupDatabase()
await testUtils.createTestUser()
await testUtils.getAuthToken()

// Make authenticated requests
testUtils.authenticatedRequest('GET', '/api/v1/users/profile')
testUtils.adminRequest('GET', '/api/v1/users')

// Assert response structures
testUtils.assertSuccessResponse(response, 200)
testUtils.assertErrorResponse(response, 400, 'Validation error')
testUtils.assertPaginatedResponse(response, 200)
```

## 🎯 Test Examples

### Unit Test Example
```javascript
describe('encrypt and decrypt', () => {
  test('should encrypt and decrypt text correctly', () => {
    const originalText = 'Hello, World!';
    const encrypted = encrypt(originalText);
    const decrypted = decrypt(encrypted);
    
    expect(encrypted).not.toBe(originalText);
    expect(decrypted).toBe(originalText);
  });
});
```

### Integration Test Example
```javascript
describe('POST /api/v1/auth/register', () => {
  test('should register new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'TestPassword123!',
      passwordConfirm: 'TestPassword123!'
    };

    const response = await agent
      .post('/api/v1/auth/register')
      .send(userData);

    testUtils.assertSuccessResponse(response, 201);
    expect(response.body).toHaveProperty('token');
  });
});
```

## 🔧 Mocking Strategy

### Database Mocking
```javascript
jest.mock('../../db/database.js', () => ({
  query: jest.fn()
}));

// Mock successful query
query.mockResolvedValue([mockData]);

// Mock database error
query.mockRejectedValue(new Error('Database error'));
```

### External Dependencies
```javascript
// Mock bcrypt
jest.mock('bcrypt');
bcrypt.hash.mockResolvedValue('hashedPassword');
bcrypt.compare.mockResolvedValue(true);

// Mock JWT
jest.mock('jsonwebtoken');
jwt.sign.mockReturnValue('mock-token');
jwt.verify.mockReturnValue({ id: 'user-123' });
```

## 📋 Test Checklist

### Unit Tests ✅
- [x] Pagination utilities (parsePaginationParams, calculatePaginationMeta, etc.)
- [x] Encryption utilities (encrypt/decrypt, hashPassword/comparePassword)
- [x] Error utilities (AppError, error handlers)
- [x] Authentication middleware (protect, restrictTo, checkOwnership)
- [x] Validation middleware (validate, validation rules)
- [x] Rate limiting middleware (generalLimiter, authLimiter)
- [x] Error handling middleware (catchAsync, globalErrorHandler)
- [x] Auth controller (register, login, getCurrentUser, logout)
- [x] User controller (profile CRUD, weight tracking, admin operations)
- [x] Exercise controller (exercise CRUD, search/filter, permissions)

### Integration Tests ✅
- [x] Auth routes (/api/v1/auth/*)
- [x] User routes (/api/v1/users/*)
- [x] Exercise routes (/api/v1/exercises/*)
- [x] Authentication flows
- [x] Authorization checks
- [x] Input validation
- [x] Error responses
- [x] Pagination and sorting

### Test Quality ✅
- [x] Proper test descriptions and organization
- [x] Mock external dependencies
- [x] Test positive and negative scenarios
- [x] Setup and teardown for each test suite
- [x] Isolated tests (no dependencies between tests)
- [x] Proper HTTP status codes verification
- [x] Response structure validation

## 🚨 Common Issues and Solutions

### ES Modules Issues
```javascript
// Use dynamic imports for ES modules in tests
const { someFunction } = await import('../module.js');

// Configure Jest for ES modules
"extensionsToTreatAsEsm": [".js"]
```

### Mock Issues
```javascript
// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Restore original implementations
afterEach(() => {
  jest.restoreAllMocks();
});
```

### Async Test Issues
```javascript
// Use async/await properly
test('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

// Handle promise rejections
test('should handle errors', async () => {
  await expect(asyncFunction()).rejects.toThrow('Error message');
});
```

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: |
    npm ci
    npm run test:ci
    
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run validate"
    }
  }
}
```

## 🎯 Future Improvements

1. **End-to-End Tests**: Implement E2E tests with Cypress or Playwright
2. **Performance Tests**: Add load testing with Artillery or k6
3. **Contract Tests**: Implement API contract testing with Pact
4. **Visual Regression Tests**: Add screenshot testing for documentation
5. **Mutation Testing**: Implement mutation testing with Stryker
6. **Database Integration**: Add real database testing with test containers

---

This comprehensive testing strategy ensures high code quality, reliability, and maintainability for the Fitness Tracker Backend API, meeting all UF3/UF4 curriculum requirements for professional software development practices.
