/**
 * Main server file for the Fitness Tracker API
 * UF3/UF4 Curriculum Project
 * Sets up Express server with comprehensive middleware and routes
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import database utilities
import { testConnection, getStats } from './db/database.js';

// Import middleware
import { globalErrorHandler, handleNotFound } from './middlewares/error.middleware.js';
import { apiLimiter, authLimiter, modificationLimiter } from './middlewares/rateLimiter.middleware.js';
import { createLogger, errorLogger } from './middlewares/logging.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import exerciseRoutes from './routes/exercise.routes.js';
import workoutRoutes from './routes/workout-plan.routes.js';

// Initialize Express application
const app = express();

// Set server port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fitness Tracker API',
      version: '1.0.0',
      description: 'REST API for Fitness Tracker Application - UF3/UF4 Curriculum Project',
      contact: {
        name: 'Student Developer',
        email: 'student@fitness.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
  optionsSuccessStatus: 200
};

// Configure middleware
app.use(cors(corsOptions)); // Enable CORS with specific configuration
app.use(helmet()); // Add security headers
app.use(compression()); // Compress responses
app.use(cookieParser()); // Parse cookies
app.use(express.json({ limit: '10mb' })); // Parse JSON with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded data

// Logging middleware
app.use(createLogger());
app.use(errorLogger);

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1/', modificationLimiter);

// API Documentation
if (process.env.API_DOCS_ENABLED === 'true') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Fitness Tracker API Documentation'
  }));
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbStats = await getStats();
    res.json({
      status: 'success',
      message: 'API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: dbStats ? 'connected' : 'disconnected',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Service temporarily unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

// Database status endpoint
app.get('/api/v1/status', async (req, res) => {
  try {
    const dbStats = await getStats();
    res.json({
      status: 'success',
      data: {
        database: dbStats,
        server: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          environment: process.env.NODE_ENV
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get system status'
    });
  }
});

// Register API route handlers with their respective URL prefixes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/exercises', exerciseRoutes);
app.use('/api/v1/workouts', workoutRoutes);

// Handle undefined routes
app.use('*', handleNotFound);

// Global error handler
app.use(globalErrorHandler);

/**
 * Server startup function
 * - Tests database connection before starting the server
 * - Exits process if database connection fails
 * - Starts the HTTP server if database connection succeeds
 */
const startServer = async () => {
  try {
    console.log('🚀 Starting Fitness Tracker API...');
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);

    // Test database connection before starting the server
    console.log('🔌 Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }
    console.log('✅ Database connection successful');

    // Start the HTTP server
    const server = app.listen(PORT, () => {
      console.log('\n🎉 Server started successfully!');
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 Status endpoint: http://localhost:${PORT}/api/v1/status`);

      if (process.env.API_DOCS_ENABLED === 'true') {
        console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      }

      console.log('\n🔗 API Endpoints:');
      console.log(`   Authentication: http://localhost:${PORT}/api/v1/auth`);
      console.log(`   Users: http://localhost:${PORT}/api/v1/users`);
      console.log(`   Exercises: http://localhost:${PORT}/api/v1/exercises`);
      console.log(`   Workouts: http://localhost:${PORT}/api/v1/workouts`);

      console.log('\n📝 Sample requests:');
      console.log(`   POST http://localhost:${PORT}/api/v1/auth/register`);
      console.log(`   POST http://localhost:${PORT}/api/v1/auth/login`);
      console.log(`   GET  http://localhost:${PORT}/api/v1/exercises`);
      console.log('\n✨ Ready to accept requests!');
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

      server.close(() => {
        console.log('✅ HTTP server closed');
        console.log('👋 Goodbye!');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('💥 Error starting server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  process.exit(1);
});

// Initialize the server
startServer();
