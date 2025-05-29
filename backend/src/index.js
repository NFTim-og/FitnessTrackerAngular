const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/db.config');
require('dotenv').config();

// Create Express app
const app = express();

// Set port
const PORT = process.env.PORT || 3000;

// Import routes
try {
  var authRoutes = require('./routes/auth.routes');
  var exerciseRoutes = require('./routes/exercise.routes');
  var workoutPlanRoutes = require('./routes/workout-plan.routes');
  var userRoutes = require('./routes/user.routes');
} catch (error) {
  console.error('Error importing routes:', error);
}

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
try {
  if (authRoutes) app.use('/api/v1/auth', authRoutes);
  if (exerciseRoutes) app.use('/api/v1/exercises', exerciseRoutes);
  if (workoutPlanRoutes) app.use('/api/v1/workout-plans', workoutPlanRoutes);
  if (userRoutes) app.use('/api/v1/users', userRoutes);
} catch (error) {
  console.error('Error registering routes:', error);
}

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Fitness Tracker API Server',
    apiBase: '/api/v1'
  });
});

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running'
  });
});

// Root health check route
app.get('/health', (req, res) => {
  console.log('Health endpoint called');
  res.status(200).json({
    status: 'success',
    message: 'API is running'
  });
});

// Test route
app.get('/test', (req, res) => {
  console.log('Test endpoint called');
  res.status(200).json({
    status: 'success',
    message: 'Test endpoint is working'
  });
});

// Catch-all route for debugging
app.use((req, res, next) => {
  console.log('Catch-all route hit:', req.method, req.url);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
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
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
