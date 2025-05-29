const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/db.config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple middleware to log all requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Import routes
try {
  var authRoutes = require('./routes/auth.routes');
  var exerciseRoutes = require('./routes/exercise.routes');
  var workoutPlanRoutes = require('./routes/workout-plan.routes');
  var userRoutes = require('./routes/user.routes');

  // Register routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/exercises', exerciseRoutes);
  app.use('/api/v1/workout-plans', workoutPlanRoutes);
  app.use('/api/v1/users', userRoutes);
} catch (error) {
  console.error('Error importing or registering routes:', error.message);
}

// Root route
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.json({ message: 'Hello World!' });
});

// Health route
app.get('/health', (req, res) => {
  console.log('Health route hit');
  res.json({ status: 'success', message: 'API is running' });
});

// API health route
app.get('/api/v1/health', (req, res) => {
  console.log('API health route hit');
  res.json({ status: 'success', message: 'API is running' });
});

// Test route
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ status: 'success', message: 'Test endpoint is working' });
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
