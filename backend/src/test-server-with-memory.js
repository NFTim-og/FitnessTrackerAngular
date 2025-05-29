const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for exercises
let exercises = [
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

// In-memory storage for workout plans
let workoutPlans = [
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
      }
    ]
  }
];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple middleware to log all requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Health route
app.get('/health', (req, res) => {
  console.log('Health route hit');
  res.json({ status: 'success', message: 'API is running' });
});

// Auth routes
// Login route
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    console.log('Login route hit');
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    // For testing purposes, accept any credentials
    const token = jwt.sign({ id: '123', email }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
    
    console.log('Login successful for:', email);
    
    return res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: '123',
          email,
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        }
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
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    console.log('Register route hit');
    const { email, password, passwordConfirm } = req.body;
    console.log('Register attempt for:', email);
    
    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match'
      });
    }
    
    // For testing purposes, accept any registration
    const token = jwt.sign({ id: '123', email }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
    
    console.log('Registration successful for:', email);
    
    return res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: '123',
          email,
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        }
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

// Get user profile
app.get('/api/v1/profile', async (req, res) => {
  try {
    console.log('Get profile route hit');
    
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
    
    // For testing purposes, return a dummy profile
    return res.status(200).json({
      status: 'success',
      data: {
        profile: {
          id: '00000000-0000-0000-0000-000000000001',
          user_id: decoded.id,
          weight_kg: 75.5,
          height_cm: 180.0,
          created_at: new Date(),
          updated_at: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

// Exercise routes
// Create exercise
app.post('/api/v1/exercises', async (req, res) => {
  try {
    console.log('Create exercise route hit');
    console.log('Request body:', req.body);
    
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
    
    // Create a new exercise with a UUID
    const newExercise = {
      id: '00000000-0000-0000-0000-00000000' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      name: req.body.name,
      duration: req.body.duration,
      calories: req.body.calories || 0,
      difficulty: req.body.difficulty,
      met_value: req.body.met_value,
      created_by: decoded.id,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Add the new exercise to the in-memory storage
    exercises.push(newExercise);
    
    console.log('Created new exercise:', newExercise);
    console.log('Total exercises now:', exercises.length);
    
    return res.status(201).json({
      status: 'success',
      data: {
        exercise: newExercise
      }
    });
  } catch (error) {
    console.error('Create exercise error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

// Get exercises
app.get('/api/v1/exercises', (req, res) => {
  console.log('Get exercises route hit');
  console.log('Query parameters:', req.query);
  console.log('Request headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  
  // Get pagination parameters from query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Filter by difficulty if provided
  let filteredExercises = exercises;
  if (req.query.difficulty) {
    filteredExercises = exercises.filter(ex => ex.difficulty === req.query.difficulty);
  }
  
  // Search by name if provided
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredExercises = filteredExercises.filter(ex => 
      ex.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedExercises = filteredExercises.slice(startIndex, endIndex);
  
  console.log('Sending response with exercises:', paginatedExercises.length);
  console.log('Total exercises in memory:', exercises.length);
  
  return res.status(200).json({
    status: 'success',
    data: {
      exercises: paginatedExercises,
      pagination: {
        total: filteredExercises.length,
        page,
        limit,
        pages: Math.ceil(filteredExercises.length / limit)
      }
    }
  });
});

// Get exercise by ID
app.get('/api/v1/exercises/:id', (req, res) => {
  console.log('Get exercise by ID route hit');
  console.log('Exercise ID:', req.params.id);
  
  const exercise = exercises.find(ex => ex.id === req.params.id);
  
  if (!exercise) {
    return res.status(404).json({
      status: 'error',
      message: 'Exercise not found'
    });
  }
  
  return res.status(200).json({
    status: 'success',
    data: {
      exercise
    }
  });
});

// Update exercise
app.put('/api/v1/exercises/:id', async (req, res) => {
  try {
    console.log('Update exercise route hit');
    console.log('Exercise ID:', req.params.id);
    console.log('Request body:', req.body);
    
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
    
    // Find the exercise
    const exerciseIndex = exercises.findIndex(ex => ex.id === req.params.id);
    
    if (exerciseIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Exercise not found'
      });
    }
    
    // Update the exercise
    const updatedExercise = {
      ...exercises[exerciseIndex],
      ...req.body,
      updated_at: new Date()
    };
    
    exercises[exerciseIndex] = updatedExercise;
    
    console.log('Updated exercise:', updatedExercise);
    
    return res.status(200).json({
      status: 'success',
      data: {
        exercise: updatedExercise
      }
    });
  } catch (error) {
    console.error('Update exercise error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

// Delete exercise
app.delete('/api/v1/exercises/:id', async (req, res) => {
  try {
    console.log('Delete exercise route hit');
    console.log('Exercise ID:', req.params.id);
    
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
    
    // Find the exercise
    const exerciseIndex = exercises.findIndex(ex => ex.id === req.params.id);
    
    if (exerciseIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Exercise not found'
      });
    }
    
    // Remove the exercise
    exercises.splice(exerciseIndex, 1);
    
    console.log('Deleted exercise with ID:', req.params.id);
    console.log('Total exercises now:', exercises.length);
    
    return res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Delete exercise error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

// Workout plan routes
app.get('/api/v1/workout-plans', (req, res) => {
  console.log('Get workout plans route hit');
  
  // Get pagination parameters from query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedWorkoutPlans = workoutPlans.slice(startIndex, endIndex);
  
  return res.status(200).json({
    status: 'success',
    data: {
      workoutPlans: paginatedWorkoutPlans,
      pagination: {
        total: workoutPlans.length,
        page,
        limit,
        pages: Math.ceil(workoutPlans.length / limit)
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 handler hit:', req.method, req.url);
  res.status(404).json({
    status: 'error',
    message: `Route ${req.url} not found`
  });
});

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
