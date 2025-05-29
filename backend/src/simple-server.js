const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple middleware to log all requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.send('Hello World!');
});

// Health route
app.get('/health', (req, res) => {
  console.log('Health route hit');
  res.json({ status: 'success', message: 'API is running' });
});

// Import middlewares
const { registerValidation, loginValidation, profileValidation, exerciseValidation, workoutPlanValidation } = require('./middlewares/validation.middleware');
const errorHandler = require('./middlewares/error.middleware');
const AppError = require('./utils/error.utils');

// Auth routes
// Login route
app.post('/api/v1/auth/login', loginValidation, async (req, res) => {
  try {
    console.log('Login route hit');
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // For testing purposes, accept any credentials
    // In a real app, you would validate against the database
    const token = jwt.sign({ id: '123', email }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    console.log('Login successful for:', email);

    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: '123',
          email,
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

// Register route
app.post('/api/v1/auth/register', registerValidation, async (req, res) => {
  try {
    console.log('Register route hit');
    const { email, password, passwordConfirm } = req.body;
    console.log('Register attempt for:', email);

    // Password confirmation is already validated by middleware

    // For testing purposes, accept any registration
    // In a real app, you would save to the database
    const token = jwt.sign({ id: '123', email }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });

    console.log('Registration successful for:', email);

    return res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: '123',
          email,
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

// Get current user route
app.get('/api/v1/auth/me', async (req, res) => {
  try {
    console.log('Get current user route hit');

    // Get token from headers
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

    // For testing purposes, return a dummy user
    // In a real app, you would fetch from the database
    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: decoded.id,
          email: decoded.email,
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

// Exercise routes
app.get('/api/v1/exercises', (req, res) => {
  console.log('Get exercises route hit');

  // For testing purposes, return dummy exercises
  const exercises = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Push-ups',
      duration: 10,
      calories: 100,
      difficulty: 'medium',
      met_value: 3.8,
      created_by: '00000000-0000-0000-0000-000000000099',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Sit-ups',
      duration: 10,
      calories: 80,
      difficulty: 'easy',
      met_value: 3.0,
      created_by: '00000000-0000-0000-0000-000000000099',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Squats',
      duration: 15,
      calories: 150,
      difficulty: 'medium',
      met_value: 5.0,
      created_by: '00000000-0000-0000-0000-000000000099',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Lunges',
      duration: 12,
      calories: 120,
      difficulty: 'medium',
      met_value: 4.0,
      created_by: '00000000-0000-0000-0000-000000000099',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      name: 'Plank',
      duration: 5,
      calories: 50,
      difficulty: 'hard',
      met_value: 4.0,
      created_by: '00000000-0000-0000-0000-000000000099',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      name: 'Jumping Jacks',
      duration: 8,
      calories: 80,
      difficulty: 'easy',
      met_value: 8.0,
      created_by: '00000000-0000-0000-0000-000000000099',
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  // Get pagination parameters from query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  return res.status(200).json({
    status: 'success',
    data: {
      exercises,
      pagination: {
        total: exercises.length,
        page,
        limit,
        pages: Math.ceil(exercises.length / limit)
      }
    }
  });
});

// Workout plan routes
app.get('/api/v1/workout-plans', (req, res) => {
  console.log('Get workout plans route hit');

  // For testing purposes, return dummy workout plans
  const workoutPlans = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Full Body Workout',
      description: 'A complete workout targeting all major muscle groups',
      created_by: '00000000-0000-0000-0000-000000000099',
      created_at: new Date(),
      updated_at: new Date(),
      exercises: [
        {
          id: '00000000-0000-0000-0000-000000000101',
          workout_plan_id: '00000000-0000-0000-0000-000000000001',
          exercise_id: '00000000-0000-0000-0000-000000000001',
          order: 1,
          created_at: new Date(),
          exercise: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Push-ups',
            duration: 10,
            calories: 100,
            difficulty: 'medium',
            met_value: 3.8,
            created_by: '00000000-0000-0000-0000-000000000099'
          }
        },
        {
          id: '00000000-0000-0000-0000-000000000102',
          workout_plan_id: '00000000-0000-0000-0000-000000000001',
          exercise_id: '00000000-0000-0000-0000-000000000002',
          order: 2,
          created_at: new Date(),
          exercise: {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Sit-ups',
            duration: 10,
            calories: 80,
            difficulty: 'easy',
            met_value: 3.0,
            created_by: '00000000-0000-0000-0000-000000000099'
          }
        }
      ]
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Upper Body Strength',
      description: 'Focus on building upper body strength',
      created_by: '00000000-0000-0000-0000-000000000099',
      created_at: new Date(),
      updated_at: new Date(),
      exercises: [
        {
          id: '00000000-0000-0000-0000-000000000201',
          workout_plan_id: '00000000-0000-0000-0000-000000000002',
          exercise_id: '00000000-0000-0000-0000-000000000001',
          order: 1,
          created_at: new Date(),
          exercise: {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Push-ups',
            duration: 10,
            calories: 100,
            difficulty: 'medium',
            met_value: 3.8,
            created_by: '00000000-0000-0000-0000-000000000099'
          }
        }
      ]
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Core Strength',
      description: 'Focus on building core strength',
      created_by: '00000000-0000-0000-0000-000000000099',
      created_at: new Date(),
      updated_at: new Date(),
      exercises: [
        {
          id: '00000000-0000-0000-0000-000000000301',
          workout_plan_id: '00000000-0000-0000-0000-000000000003',
          exercise_id: '00000000-0000-0000-0000-000000000002',
          order: 1,
          created_at: new Date(),
          exercise: {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'Sit-ups',
            duration: 10,
            calories: 80,
            difficulty: 'easy',
            met_value: 3.0,
            created_by: '00000000-0000-0000-0000-000000000099'
          }
        },
        {
          id: '00000000-0000-0000-0000-000000000302',
          workout_plan_id: '00000000-0000-0000-0000-000000000003',
          exercise_id: '00000000-0000-0000-0000-000000000005',
          order: 2,
          created_at: new Date(),
          exercise: {
            id: '00000000-0000-0000-0000-000000000005',
            name: 'Plank',
            duration: 5,
            calories: 50,
            difficulty: 'hard',
            met_value: 4.0,
            created_by: '00000000-0000-0000-0000-000000000099'
          }
        }
      ]
    }
  ];

  // Get pagination parameters from query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  return res.status(200).json({
    status: 'success',
    data: {
      workoutPlans,
      pagination: {
        total: workoutPlans.length,
        page,
        limit,
        pages: Math.ceil(workoutPlans.length / limit)
      }
    }
  });
});

// Handle 404 errors
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health endpoint: http://localhost:${PORT}/health`);
  console.log(`Login endpoint: http://localhost:${PORT}/api/v1/auth/login`);
  console.log(`Register endpoint: http://localhost:${PORT}/api/v1/auth/register`);
  console.log(`Get current user endpoint: http://localhost:${PORT}/api/v1/auth/me`);
  console.log(`Get exercises endpoint: http://localhost:${PORT}/api/v1/exercises`);
  console.log(`Get workout plans endpoint: http://localhost:${PORT}/api/v1/workout-plans`);
});
