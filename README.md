# 🏋️ Fitness Tracker API

A comprehensive REST API for fitness tracking built with Express.js, MySQL, and modern web technologies. This project demonstrates professional-level backend development skills and modern API design patterns.

**🚀 Production Ready** | **📊 Comprehensive Sample Data** | **🔒 Secure & Scalable**

---

## 🎯 QUICK START GUIDE

### ⚡ One-Command Setup (Recommended)

```bash
# Clone and setup everything automatically
git clone https://github.com/NFTim-og/FitnessTrackerAngular.git
cd FitnessTrackerAngular/backend
npm install
npm run docker:init
npm run seed
npm start
```

**✅ That's it! Your API is now running with complete sample data at `http://localhost:3000`**

### 🔑 Default Login Credentials

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| **Admin** | `admin@example.com` | `admin123` | Full system access, user management |
| **User** | `user@example.com` | `user123` | Regular user with workout data |
| **User** | `jane.smith@example.com` | `user123` | Strength training focused |
| **User** | `mike.wilson@example.com` | `user123` | Sports performance data |
| **User** | `sarah.johnson@example.com` | `user123` | Endurance training data |

### 📋 Essential URLs for Evaluation

| Resource | URL | Description |
|----------|-----|-------------|
| **API Root** | `http://localhost:3000` | HTML presentation page |
| **API Documentation** | `http://localhost:3000/api-docs` | Interactive Swagger UI |
| **Health Check** | `http://localhost:3000/health` | System status |
| **Database Admin** | `http://localhost:8080` | phpMyAdmin (admin/admin123) |

### 🧪 Quick API Test

```bash
# Test authentication
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}'

# Test protected endpoint (use token from login)
curl -X GET http://localhost:3000/api/v1/exercises \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 📊 Sample Data Overview

The database is automatically populated with:
- **5 Users** with varied profiles and fitness goals
- **20 Exercises** across all categories (cardio, strength, flexibility, balance, sports)
- **8 Workout Plans** with different difficulty levels and purposes
- **30+ Weight History** entries showing user progress
- **15+ Exercise Logs** demonstrating user activity
- **Complex Relationships** showcasing many-to-many database design

### 🎓 Curriculum Compliance Verification

| Requirement | Status | Evidence |
|-------------|--------|----------|
| **ES Modules** | ✅ | `"type": "module"` in package.json |
| **API Versioning** | ✅ | All routes use `/api/v1` prefix |
| **CRUD Operations** | ✅ | GET, POST, PUT, DELETE for all resources |
| **JWT Authentication** | ✅ | Token-based auth with role-based access |
| **Input Validation** | ✅ | express-validator with comprehensive schemas |
| **Rate Limiting** | ✅ | Multiple rate limiters for different endpoints |
| **Many-to-Many Relationships** | ✅ | `workout_plan_exercises`, `user_workout_plans` |
| **UUIDs** | ✅ | All tables use UUID primary keys |
| **SQL Injection Prevention** | ✅ | Parameterized queries throughout |
| **Error Handling** | ✅ | Centralized error middleware |
| **Pagination & Sorting** | ✅ | Advanced pagination with metadata |
| **HTML Presentation** | ✅ | Professional landing page at root URL |

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technical Requirements](#technical-requirements)
- [Features](#features)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Curriculum Compliance](#curriculum-compliance)

## 🎯 Project Overview

This fitness tracker application provides a complete REST API for managing users, exercises, workout plans, and fitness progress tracking. Built with enterprise-grade patterns and security practices, it serves as a demonstration of full-stack development capabilities.

### Key Highlights

- ✅ **Complete CRUD Operations** - Full Create, Read, Update, Delete functionality
- ✅ **JWT Authentication** - Secure user authentication and authorization
- ✅ **Input Validation** - Comprehensive data validation and sanitization
- ✅ **Rate Limiting** - Protection against abuse and DDoS attacks
- ✅ **Error Handling** - Centralized error management with proper HTTP codes
- ✅ **Database Relationships** - Complex many-to-many relationships with UUIDs
- ✅ **Pagination & Sorting** - Efficient data handling for large datasets
- ✅ **API Documentation** - Interactive Swagger/OpenAPI documentation
- ✅ **Security** - Data encryption, SQL injection protection, CORS
- ✅ **ES Modules** - Modern JavaScript module system

## 🛠️ Technical Requirements

### ✅ Application Setup
- [x] `npm start` launches production application
- [x] `npm run dev` for development mode with dev-specific packages
- [x] ES Modules syntax throughout the application
- [x] Proper `.gitignore` file configuration
- [x] Environment variables using `.env` file
- [x] CORS enabled for cross-origin requests

### ✅ API Architecture
- [x] Modular folder structure: `routes/`, `controllers/`, `models/`, `middlewares/`
- [x] All endpoints use `/api/v1` prefix
- [x] Routes using both `req.params` and `req.query`
- [x] Complete CRUD operations: GET, POST, PUT, DELETE
- [x] Centralized error handling with 500-599 error codes
- [x] Undefined routes handled with appropriate errors
- [x] Rate limiting for API connection control

### ✅ Security & Validation
- [x] JWT-based user authentication system
- [x] Input validation and sanitization (express-validator)
- [x] Sensitive data encryption in database
- [x] SQL injection protection through parameterized queries

### ✅ Database Requirements
- [x] `db/` folder with SQL schema and table creation scripts
- [x] Connection pooling and auto-reconnection
- [x] Multiple tables with many-to-many (n:m) relationships
- [x] UUIDs as primary key identifiers
- [x] Complete joined data from related tables

### ✅ Data Management
- [x] Data sorting (ASC/DESC) on multiple fields
- [x] Pagination for large datasets
- [x] Comprehensive API testing in `postman_collection.json`

## 🚀 Features

### 👤 User Management
- User registration and authentication
- Profile management with health metrics
- Weight tracking with history
- Role-based access control (user/admin)

### 💪 Exercise Management
- Comprehensive exercise database
- Categories: cardio, strength, flexibility, balance, sports
- Difficulty levels and MET values
- Equipment requirements and muscle groups
- Detailed instructions and descriptions

### 📋 Workout Planning
- Custom workout plan creation
- Exercise sequencing with sets, reps, and rest periods
- Workout categories and difficulty levels
- Progress tracking and completion status

### 📊 Analytics & Tracking
- Weight history tracking
- Exercise session logging
- Calorie burn calculations
- Progress visualization data

## Technology Stack

### Frontend
- Angular 18
- RxJS for reactive programming
- Angular Router for navigation
- Angular Forms for data validation
- Angular Material for UI components

### Backend
- Express.js REST API
- MySQL database with n:m relationships
- JWT Authentication with role-based access control
- bcrypt for password hashing
- express-validator for request validation
- Swagger UI for API documentation
- Docker for containerization

## Project Structure

```
fitness-tracker-app/
├── backend/                  # Express.js backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── db/               # Database scripts and configuration
│   │   ├── middlewares/      # Express middlewares
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   ├── validations/      # Request validation schemas
│   │   └── index.js          # Entry point
│   ├── test/                 # API tests
│   ├── .env                  # Environment variables
│   ├── Dockerfile            # Docker configuration for backend
│   └── package.json          # Backend dependencies
├── src/                      # Angular frontend
│   ├── app/
│   │   ├── components/       # Reusable components
│   │   ├── guards/           # Route guards
│   │   ├── models/           # Data models
│   │   ├── pages/            # Page components
│   │   ├── services/         # Services for API communication
│   │   └── shared/           # Shared utilities
│   ├── environments/         # Environment configuration
│   └── index.html            # Main HTML file
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose (for the easiest setup)
- MySQL (if not using Docker)

### Quick Start with Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fitness-tracker-app.git
   cd fitness-tracker-app
   ```

2. Start the application with Docker Compose:
   ```bash
   # Start MySQL database container
   cd backend
   docker-compose -f docker-compose.dev.yml up -d

   # Wait for MySQL to initialize (about 10-15 seconds)
   sleep 15

   # Initialize the database with schema and seed data
   docker cp src/db/schema.sql backend-mysql-1:/tmp/schema.sql
   docker cp src/db/seed.sql backend-mysql-1:/tmp/seed.sql
   docker exec -it backend-mysql-1 mysql -u root -ppassword -e "source /tmp/schema.sql"
   docker exec -it backend-mysql-1 mysql -u root -ppassword -e "source /tmp/seed.sql"

   # Start the backend server
   npm start
   ```

3. In a new terminal, start the frontend:
   ```bash
   # Navigate to the project root
   cd /path/to/fitness-tracker-app

   # Start the Angular frontend
   npm start
   ```

### Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fitness-tracker-app.git
   cd fitness-tracker-app
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create a .env file in the backend directory with the following content:
   cat > .env << EOL
   # Server configuration
   PORT=3000
   NODE_ENV=development

   # Database configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=fitness_tracker

   # JWT configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=1d

   # Rate limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=100

   # CORS configuration
   CORS_ORIGIN=*
   EOL
   ```

4. Set up MySQL:
   ```bash
   # Start MySQL with Docker
   cd backend
   docker-compose -f docker-compose.dev.yml up -d

   # Wait for MySQL to initialize (about 10-15 seconds)
   sleep 15

   # Initialize the database
   docker cp src/db/schema.sql backend-mysql-1:/tmp/schema.sql
   docker cp src/db/seed.sql backend-mysql-1:/tmp/seed.sql
   docker exec -it backend-mysql-1 mysql -u root -ppassword -e "source /tmp/schema.sql"
   docker exec -it backend-mysql-1 mysql -u root -ppassword -e "source /tmp/seed.sql"
   ```

5. Start the backend server:
   ```bash
   # From the backend directory
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

6. In a new terminal, start the frontend:
   ```bash
   # Navigate to the project root
   cd /path/to/fitness-tracker-app

   # Start the Angular frontend
   npm start
   ```

7. Access the application:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000/api/v1
   - API Documentation: http://localhost:3000/api-docs

### Default Users

The application comes with two pre-configured users:

1. **Admin User**
   - Email: admin@example.com
   - Password: admin123
   - Role: admin

2. **Regular User**
   - Email: user@example.com
   - Password: user123
   - Role: user

### Running Tests

```bash
# Run backend tests
cd backend
npm test

# Run backend tests with coverage
npm run test:coverage

# Run frontend tests
cd ..
npm test
```

## API Documentation

The API documentation is available at http://localhost:3000/api-docs when the server is running. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

### Key API Endpoints

- **Authentication**
  - POST `/api/v1/auth/register` - Register a new user
  - POST `/api/v1/auth/login` - Login and get JWT token
  - GET `/api/v1/auth/me` - Get current user info

- **Users**
  - GET `/api/v1/users` - Get all users (admin only)
  - GET `/api/v1/users/:id` - Get user by ID
  - PUT `/api/v1/users/:id` - Update user
  - DELETE `/api/v1/users/:id` - Delete user

- **User Profile**
  - GET `/api/v1/profile` - Get current user profile
  - PUT `/api/v1/profile` - Update profile
  - GET `/api/v1/profile/weight` - Get weight history
  - POST `/api/v1/profile/weight` - Add weight record

- **Exercises**
  - GET `/api/v1/exercises` - Get all exercises
  - GET `/api/v1/exercises/:id` - Get exercise by ID
  - POST `/api/v1/exercises` - Create new exercise
  - PUT `/api/v1/exercises/:id` - Update exercise
  - DELETE `/api/v1/exercises/:id` - Delete exercise

- **Workout Plans**
  - GET `/api/v1/workout-plans` - Get all workout plans
  - GET `/api/v1/workout-plans/:id` - Get workout plan by ID
  - POST `/api/v1/workout-plans` - Create new workout plan
  - PUT `/api/v1/workout-plans/:id` - Update workout plan
  - DELETE `/api/v1/workout-plans/:id` - Delete workout plan

## Data Validation

The application implements comprehensive data validation:

- **User Registration**
  - Email must be a valid email format
  - Password must be at least 8 characters long
  - Password confirmation must match password

- **User Profile**
  - Weight must be between 30kg and 300kg (with validation to prevent unhealthy values)
  - Height must be between 100cm and 250cm

- **Exercises**
  - Duration must be a positive number
  - Calories must be a positive number
  - Difficulty must be one of: 'easy', 'medium', 'hard'
  - MET value must be a positive number

## Pagination and Sorting

All list endpoints support pagination and sorting:

- **Pagination Parameters**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)

- **Sorting Parameters**
  - `sortBy` - Field to sort by
  - `sortOrder` - Sort direction ('ASC' or 'DESC')

Example: `/api/v1/exercises?page=2&limit=5&sortBy=name&sortOrder=ASC`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
