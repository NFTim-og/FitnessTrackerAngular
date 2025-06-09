# 🏋️ Fitness Tracker Application

A comprehensive full-stack fitness tracking application built with Angular frontend and Express.js backend. This project demonstrates modern web development practices with professional-grade architecture, security, and user experience.

**🚀 Production Ready** | **📊 Comprehensive Sample Data** | **🔒 Secure & Scalable** | **⚡ One-Command Startup**

---

## 🎯 QUICK START GUIDE

### ⚡ One-Command Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/NFTim-og/FitnessTrackerAngular.git
cd FitnessTrackerAngular

# Install dependencies and start everything
npm install
npm start
```

**✅ That's it! The complete application is now running:**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Database**: MySQL running in Docker

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 8.0 or higher (comes with Node.js)
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/get-started))
- **Git** for cloning the repository

## 🚀 Installation & Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/NFTim-og/FitnessTrackerAngular.git
cd FitnessTrackerAngular

# Install main dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Start the Application

```bash
# Start everything with one command
npm start
```

This command automatically:
1. 🐳 Starts MySQL database in Docker
2. ⚡ Starts the Express.js backend server
3. 🌐 Starts the Angular frontend development server

### 🔑 Default Login Credentials

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| **Admin** | `admin@example.com` | `admin123` | Full system access, user management |
| **User** | `user@example.com` | `user123` | Regular user with workout data |
| **User** | `jane.smith@example.com` | `user123` | Strength training focused |
| **User** | `mike.wilson@example.com` | `user123` | Sports performance data |
| **User** | `sarah.johnson@example.com` | `user123` | Endurance training data |

### 📋 Development URLs

| Resource | URL | Description |
|----------|-----|-------------|
| **Frontend App** | `http://localhost:4200` | Angular application |
| **Backend API** | `http://localhost:3000` | Express.js REST API |
| **API Documentation** | `http://localhost:3000/api-docs` | Interactive Swagger UI |
| **Health Check** | `http://localhost:3000/health` | System status |
| **Database Admin** | `http://localhost:8080` | phpMyAdmin (root/password) |

## 📜 Available Scripts

### Main Commands

| Command | Description |
|---------|-------------|
| `npm start` | **Start everything** (database, backend, frontend) |
| `npm run start:frontend-only` | Start only Angular frontend |
| `npm run stop` | Stop all services |
| `npm run setup` | Full setup with database initialization |

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run start:db` | Start only the database |
| `npm run start:backend` | Start only the backend server |
| `npm run start:frontend` | Start frontend (waits for backend) |
| `npm test` | Run frontend tests |
| `npm run build` | Build for production |

## 🧪 Quick API Test

```bash
# Test authentication
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}'

# Test protected endpoint (use token from login)
curl -X GET http://localhost:3000/api/v1/exercises \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🏗️ Project Structure

```
fitness-tracker-app/
├── src/                          # Angular Frontend
│   ├── app/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components (login, exercises, etc.)
│   │   ├── services/             # API services and business logic
│   │   ├── guards/               # Route guards for authentication
│   │   ├── models/               # TypeScript interfaces and models
│   │   └── shared/               # Shared utilities and helpers
│   ├── environments/             # Environment configuration
│   └── global_styles.css         # Global styles and themes
├── backend/                      # Express.js Backend
│   ├── src/
│   │   ├── controllers/          # Request handlers and business logic
│   │   ├── routes/               # API route definitions
│   │   ├── models/               # Database models and queries
│   │   ├── middlewares/          # Express middlewares
│   │   ├── db/                   # Database scripts and configuration
│   │   ├── validations/          # Request validation schemas
│   │   └── server.js             # Main server entry point
│   ├── public/                   # Static files and HTML presentation
│   ├── docker-compose.yml        # Database container configuration
│   └── .env                      # Environment variables
├── package.json                  # Main project dependencies and scripts
└── README.md                     # This documentation
```

## 🛠️ Technology Stack

### Frontend (Angular 18)
- **Framework**: Angular 18 with TypeScript
- **UI Library**: Angular Material Design
- **State Management**: RxJS for reactive programming
- **Routing**: Angular Router with guards
- **Forms**: Reactive Forms with validation
- **HTTP Client**: Angular HttpClient with interceptors
- **Icons**: Google Material Icons
- **Styling**: Custom CSS with Material Design theming

### Backend (Express.js)
- **Framework**: Express.js with ES Modules
- **Database**: MySQL 8.0 with connection pooling
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: express-validator with custom rules
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Morgan with custom error handling
- **Containerization**: Docker and Docker Compose

### Development Tools
- **Package Manager**: npm
- **Process Management**: concurrently for multi-service startup
- **Database Admin**: phpMyAdmin
- **API Testing**: Postman collection included
- **Code Quality**: ESLint, TypeScript strict mode

## 🔧 Troubleshooting

### Common Issues and Solutions

#### ❌ "ERR_CONNECTION_REFUSED" Error
**Problem**: Frontend can't connect to backend API
**Solution**:
```bash
# Check if backend is running
curl http://localhost:3000/health

# If not running, restart the application
npm run stop
npm start
```

#### ❌ "Port 3000 already in use"
**Problem**: Another process is using port 3000
**Solution**:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

#### ❌ Database Connection Failed
**Problem**: MySQL container not running or not ready
**Solution**:
```bash
# Check Docker containers
docker ps

# Restart database
cd backend
docker-compose down
docker-compose up -d

# Wait 10-15 seconds for MySQL to initialize
sleep 15
npm start
```

#### ❌ "Module not found" Errors
**Problem**: Dependencies not installed
**Solution**:
```bash
# Reinstall dependencies
npm install
cd backend && npm install && cd ..
npm start
```

#### ❌ Frontend Build Errors
**Problem**: Angular compilation issues
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### 📊 Sample Data Overview

The database is automatically populated with:
- **5 Users** with varied profiles and fitness goals
- **20 Exercises** across all categories (cardio, strength, flexibility, balance, sports)
- **8 Workout Plans** with different difficulty levels and purposes
- **30+ Weight History** entries showing user progress
- **15+ Exercise Logs** demonstrating user activity
- **Complex Relationships** showcasing many-to-many database design

## 📚 API Documentation

### Accessing the Documentation

The API documentation is automatically generated and available at:
- **Interactive Swagger UI**: http://localhost:3000/api-docs
- **JSON Schema**: http://localhost:3000/api-docs.json

### Key API Endpoints

#### 🔐 Authentication
```bash
POST /api/v1/auth/register    # Register new user
POST /api/v1/auth/login       # Login and get JWT token
GET  /api/v1/auth/me          # Get current user info
```

#### 👤 User Management
```bash
GET    /api/v1/users          # Get all users (admin only)
GET    /api/v1/users/:id      # Get user by ID
PUT    /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user
```

#### 📊 User Profile
```bash
GET  /api/v1/profile          # Get current user profile
PUT  /api/v1/profile          # Update profile
GET  /api/v1/profile/weight   # Get weight history
POST /api/v1/profile/weight   # Add weight record
```

#### 💪 Exercises
```bash
GET    /api/v1/exercises      # Get all exercises (with pagination)
GET    /api/v1/exercises/:id  # Get exercise by ID
POST   /api/v1/exercises      # Create new exercise
PUT    /api/v1/exercises/:id  # Update exercise
DELETE /api/v1/exercises/:id  # Delete exercise
```

#### 📋 Workout Plans
```bash
GET    /api/v1/workout-plans      # Get all workout plans
GET    /api/v1/workout-plans/:id  # Get workout plan by ID
POST   /api/v1/workout-plans      # Create new workout plan
PUT    /api/v1/workout-plans/:id  # Update workout plan
DELETE /api/v1/workout-plans/:id  # Delete workout plan
```

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

## 🎯 Features

### Frontend Features (Angular)
- **🔐 Authentication**: Login/register with JWT tokens
- **👤 User Profile**: Personal information and health metrics
- **💪 Exercise Management**: Browse, create, and manage exercises
- **📋 Workout Plans**: Create and follow structured workout routines
- **📊 Progress Tracking**: Weight history and exercise logs
- **🎨 Modern UI**: Material Design with light/dark themes
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🔍 Search & Filter**: Find exercises and workouts easily
- **📄 Pagination**: Efficient handling of large data sets

### Backend Features (Express.js)
- **🔒 JWT Authentication**: Secure token-based authentication
- **👥 Role-Based Access**: User and admin roles with permissions
- **📊 RESTful API**: Complete CRUD operations for all resources
- **🛡️ Input Validation**: Comprehensive data validation and sanitization
- **🚦 Rate Limiting**: Protection against abuse and DDoS attacks
- **📄 Pagination & Sorting**: Advanced data handling with metadata
- **🗄️ Database Relations**: Complex many-to-many relationships
- **📚 API Documentation**: Interactive Swagger/OpenAPI docs
- **🔍 Error Handling**: Centralized error management
- **🐳 Containerization**: Docker setup for easy deployment

---

## 📋 Table of Contents

- [Quick Start Guide](#-quick-start-guide)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Available Scripts](#-available-scripts)
- [Project Structure](#️-project-structure)
- [Technology Stack](#️-technology-stack)
- [Troubleshooting](#-troubleshooting)
- [API Documentation](#-api-documentation)
- [Features](#-features)
- [Database Schema](#️-database-schema)
- [Data Validation](#-data-validation)
- [Pagination and Sorting](#-pagination-and-sorting)

## 🎯 Project Overview

This fitness tracker application is a comprehensive full-stack solution for managing fitness activities, workout plans, and health progress. Built with modern web technologies and enterprise-grade patterns, it demonstrates professional-level development skills across both frontend and backend technologies.

### Key Highlights

- ✅ **Full-Stack Application** - Complete Angular frontend with Express.js backend
- ✅ **One-Command Startup** - Start everything with `npm start`
- ✅ **Modern Architecture** - Component-based frontend, RESTful backend
- ✅ **Professional UI/UX** - Material Design with responsive layout
- ✅ **Secure Authentication** - JWT tokens with role-based access control
- ✅ **Real-Time Validation** - Frontend and backend data validation
- ✅ **Database Relationships** - Complex many-to-many relationships with UUIDs
- ✅ **API Documentation** - Interactive Swagger/OpenAPI documentation
- ✅ **Docker Integration** - Containerized database with easy setup
- ✅ **Production Ready** - Comprehensive error handling and security

## 🧪 Testing

### Running Tests

```bash
# Run frontend tests
npm test

# Run frontend tests with coverage
npm run test:coverage

# Run backend tests
cd backend
npm test

# Run backend tests with coverage
npm run test:coverage

# Run all tests
npm run test:all
```

### Test Coverage

The application includes comprehensive testing:
- **Frontend**: Angular component and service tests
- **Backend**: API endpoint and business logic tests
- **Integration**: End-to-end API testing
- **Validation**: Input validation and error handling tests

## 🚀 Deployment

### Production Build

```bash
# Build frontend for production
npm run build

# Start backend in production mode
cd backend
NODE_ENV=production npm start
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Scale services
docker-compose up -d --scale api=3
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Fitness Tracker Development Team**
- GitHub: [@NFTim-og](https://github.com/NFTim-og)
- Project: [FitnessTrackerAngular](https://github.com/NFTim-og/FitnessTrackerAngular)

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Express.js community for the robust backend framework
- Material Design team for the beautiful UI components
- Docker team for containerization technology

## 🗄️ Database Schema

The fitness tracker application uses a comprehensive MySQL database schema designed with enterprise-grade patterns, featuring UUID primary keys, encrypted sensitive data, and complex many-to-many relationships that demonstrate advanced database design principles.

### 📊 Entity Relationship Diagram

```mermaid
erDiagram
    users {
        VARCHAR-36 id PK
        VARCHAR-255 email UK
        VARCHAR-255 password
        ENUM role
        VARCHAR-100 first_name
        VARCHAR-100 last_name
        BOOLEAN is_active
        BOOLEAN email_verified
        TIMESTAMP last_login
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    user_profiles {
        VARCHAR-36 id PK
        VARCHAR-36 user_id FK
        DECIMAL-5-2 weight_kg
        DECIMAL-5-2 height_cm
        DATE date_of_birth
        ENUM gender
        ENUM activity_level
        ENUM fitness_goal
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    exercises {
        VARCHAR-36 id PK
        VARCHAR-100 name
        TEXT description
        ENUM category
        INT duration_minutes
        DECIMAL-4-2 calories_per_minute
        ENUM difficulty
        DECIMAL-4-2 met_value
        VARCHAR-255 equipment_needed
        JSON muscle_groups
        TEXT instructions
        VARCHAR-36 created_by FK
        BOOLEAN is_public
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    workout_plans {
        VARCHAR-36 id PK
        VARCHAR-100 name
        TEXT description
        ENUM category
        ENUM difficulty
        INT estimated_duration_minutes
        INT target_calories
        VARCHAR-36 created_by FK
        BOOLEAN is_public
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    workout_plan_exercises {
        VARCHAR-36 id PK
        VARCHAR-36 workout_plan_id FK
        VARCHAR-36 exercise_id FK
        INT exercise_order
        INT sets
        INT reps
        INT duration_minutes
        INT rest_seconds
        TEXT notes
        TIMESTAMP created_at
    }

    user_workout_plans {
        VARCHAR-36 id PK
        VARCHAR-36 user_id FK
        VARCHAR-36 workout_plan_id FK
        DATE assigned_date
        DATE completed_date
        ENUM status
        TEXT notes
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    weight_history {
        VARCHAR-36 id PK
        VARCHAR-36 user_id FK
        DECIMAL-5-2 weight_kg
        DATE recorded_date
        TEXT notes
        TIMESTAMP created_at
    }

    user_exercise_logs {
        VARCHAR-36 id PK
        VARCHAR-36 user_id FK
        VARCHAR-36 exercise_id FK
        VARCHAR-36 workout_plan_id FK
        DATE session_date
        INT duration_minutes
        INT calories_burned
        INT sets_completed
        INT reps_completed
        DECIMAL-5-2 weight_used_kg
        DECIMAL-6-3 distance_km
        TEXT notes
        TIMESTAMP created_at
    }

    users ||--|| user_profiles : "has"
    users ||--o{ exercises : "creates"
    users ||--o{ workout_plans : "creates"
    users ||--o{ weight_history : "tracks"
    users ||--o{ user_exercise_logs : "logs"
    workout_plans ||--o{ workout_plan_exercises : "contains"
    exercises ||--o{ workout_plan_exercises : "includes"
    users ||--o{ user_workout_plans : "assigned"
    workout_plans ||--o{ user_workout_plans : "assigned_to"
    exercises ||--o{ user_exercise_logs : "performed"
    workout_plans ||--o{ user_exercise_logs : "part_of"
```

### � Table Descriptions

#### **Core Entity Tables**

| Table | Purpose | Key Features |
|-------|---------|--------------|
| **users** | User accounts and authentication | UUID primary keys, bcrypt passwords, role-based access (user/admin), encrypted sensitive data |
| **user_profiles** | Health and fitness metrics | Weight/height validation (30-300kg, 100-250cm), activity levels, fitness goals |
| **exercises** | Exercise library and definitions | Categories (cardio/strength/flexibility/balance/sports), difficulty levels, MET values, JSON muscle groups |
| **workout_plans** | Structured workout routines | Categories (weight_loss/muscle_gain/endurance), estimated duration and calories, public/private visibility |

#### **Relationship Tables (Many-to-Many)**

| Table | Purpose | Key Features |
|-------|---------|--------------|
| **workout_plan_exercises** | Links exercises to workout plans | Exercise ordering, sets/reps configuration, rest periods, exercise-specific notes |
| **user_workout_plans** | Assigns workout plans to users | Assignment tracking, completion status, progress monitoring |
| **user_exercise_logs** | Individual exercise session tracking | Actual performance data, calories burned, weight used, distance covered |

#### **Tracking Tables**

| Table | Purpose | Key Features |
|-------|---------|--------------|
| **weight_history** | User weight tracking over time | Daily weight entries, progress notes, unique constraint per user per date |

### 🔧 Data Type Specifications

#### **UUID Primary Keys (VARCHAR-36)**
- Format: `550e8400-e29b-41d4-a716-446655440000`
- Benefits: Security, scalability, distributed systems compatibility
- Used in all tables for consistent identification

#### **ENUM Constraints**
- **Role**: `user`, `admin`
- **Gender**: `male`, `female`, `other`
- **Activity Level**: `sedentary`, `lightly_active`, `moderately_active`, `very_active`, `extremely_active`
- **Exercise Category**: `cardio`, `strength`, `flexibility`, `balance`, `sports`
- **Difficulty**: `beginner`, `intermediate`, `advanced`
- **Workout Status**: `assigned`, `in_progress`, `completed`, `paused`

#### **Validation Constraints**
- **Weight**: DECIMAL(5,2) with CHECK constraint (30.00 - 300.00 kg)
- **Height**: DECIMAL(5,2) with CHECK constraint (100.00 - 250.00 cm)
- **Duration**: INT with CHECK constraint (> 0 minutes)
- **Calories**: DECIMAL(4,2) with CHECK constraint (> 0.00)
- **MET Value**: DECIMAL(4,2) with CHECK constraint (> 0.00)

#### **JSON Fields**
- **muscle_groups**: Array of targeted muscle groups for exercises
- Example: `["chest", "triceps", "shoulders", "core"]`

### �🔑 Key Database Features

#### **UUID Primary Keys**
- All tables use UUID (36-character) primary keys instead of auto-incrementing integers
- Provides better security by preventing ID enumeration attacks
- Enables distributed database scaling and prevents ID collisions
- Example: `550e8400-e29b-41d4-a716-446655440000`

#### **Data Security & Encryption**
- **Password Security**: All passwords are hashed using bcrypt with salt rounds
- **Sensitive Data**: User personal information (names, emails) can be encrypted at rest
- **SQL Injection Prevention**: All queries use parameterized statements
- **Role-Based Access**: ENUM roles with proper authorization checks

#### **Data Validation & Constraints**
- **CHECK Constraints**: Weight (30-300kg), Height (100-250cm), Duration (>0)
- **ENUM Validation**: Predefined values for categories, difficulty levels, status
- **UNIQUE Constraints**: Email uniqueness, one weight entry per user per date
- **Foreign Key Constraints**: Referential integrity with CASCADE deletes

#### **Performance Optimization**
- **Strategic Indexing**: Indexes on frequently queried columns (email, role, category)
- **Composite Indexes**: Multi-column indexes for complex queries
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Optimized JOIN operations for related data

### 📋 Table Relationships Explained

#### **One-to-One Relationships**
- `users` ↔ `user_profiles`: Each user has exactly one profile with health metrics

#### **One-to-Many Relationships**
- `users` → `exercises`: Users can create multiple exercises
- `users` → `workout_plans`: Users can create multiple workout plans
- `users` → `weight_history`: Users can have multiple weight entries over time
- `users` → `user_exercise_logs`: Users can log multiple exercise sessions

#### **Many-to-Many Relationships (via Junction Tables)**

**1. Workout Plans ↔ Exercises** (`workout_plan_exercises`)
- A workout plan can contain multiple exercises
- An exercise can be used in multiple workout plans
- Junction table stores exercise order, sets, reps, duration, rest periods
- Enables complex workout composition with exercise-specific parameters

**2. Users ↔ Workout Plans** (`user_workout_plans`)
- Users can be assigned multiple workout plans
- Workout plans can be assigned to multiple users
- Tracks assignment date, completion status, and progress
- Supports plan sharing and assignment by trainers/admins

**3. Users ↔ Exercises** (`user_exercise_logs`)
- Users can log multiple exercise sessions
- Exercises can be performed by multiple users
- Tracks actual performance data (duration, calories, sets, reps, weight used)
- Links to workout plans when exercises are part of a structured plan

### 🎯 Database Design Benefits

#### **Scalability**
- UUID primary keys enable horizontal scaling
- Normalized structure reduces data redundancy
- Efficient indexing supports large datasets
- Connection pooling handles concurrent users

#### **Flexibility**
- JSON fields for dynamic data (muscle groups, equipment)
- ENUM fields for controlled vocabularies
- Nullable fields for optional data
- Extensible schema for future features

#### **Data Integrity**
- Foreign key constraints ensure referential integrity
- CHECK constraints validate business rules
- UNIQUE constraints prevent duplicate data
- Cascade deletes maintain consistency

#### **Analytics & Reporting**
- Comprehensive logging enables detailed analytics
- Time-series data for progress tracking
- Aggregation-friendly structure for statistics
- Historical data preservation for trends

### 🔧 Database Operations Examples

#### **Complex JOIN Query Example**
```sql
-- Get user's workout plan with exercises and progress
SELECT
    u.email,
    wp.name as workout_plan,
    e.name as exercise,
    wpe.exercise_order,
    wpe.sets,
    wpe.reps,
    uwp.status,
    uwp.assigned_date
FROM users u
JOIN user_workout_plans uwp ON u.id = uwp.user_id
JOIN workout_plans wp ON uwp.workout_plan_id = wp.id
JOIN workout_plan_exercises wpe ON wp.id = wpe.workout_plan_id
JOIN exercises e ON wpe.exercise_id = e.id
WHERE u.email = 'user@example.com'
ORDER BY wpe.exercise_order;
```

#### **Aggregation Query Example**
```sql
-- Get user's monthly exercise statistics
SELECT
    DATE_FORMAT(session_date, '%Y-%m') as month,
    COUNT(*) as total_sessions,
    SUM(duration_minutes) as total_minutes,
    SUM(calories_burned) as total_calories,
    AVG(calories_burned) as avg_calories_per_session
FROM user_exercise_logs
WHERE user_id = 'user-uuid-here'
GROUP BY DATE_FORMAT(session_date, '%Y-%m')
ORDER BY month DESC;
```

## 🔍 Data Validation

The application implements comprehensive multi-layer data validation using express-validator and database constraints:

### Frontend Validation (Angular)
- **Real-time validation** with immediate user feedback
- **TypeScript type checking** for compile-time safety
- **Reactive forms** with custom validators
- **Material Design** error display patterns

### Backend Validation (Express.js)
- **express-validator** middleware for request validation
- **Custom validation rules** for business logic
- **Sanitization** to prevent XSS attacks
- **Error formatting** with detailed field-level messages

### Database Validation (MySQL)
- **CHECK constraints** for data ranges and business rules
- **ENUM constraints** for predefined value sets
- **UNIQUE constraints** for data integrity
- **Foreign key constraints** for referential integrity

### Validation Rules by Entity

#### **User Registration & Authentication**
```javascript
// Email validation
email: {
  required: true,
  format: "valid email address",
  unique: true,
  maxLength: 255
}

// Password validation
password: {
  required: true,
  minLength: 8,
  pattern: "Must contain uppercase, lowercase, number",
  bcrypt: "Hashed with salt rounds"
}

// Role validation
role: {
  enum: ["user", "admin"],
  default: "user"
}
```

#### **User Profile & Health Data**
```javascript
// Weight validation
weight_kg: {
  type: "DECIMAL(5,2)",
  range: "30.00 - 300.00 kg",
  checkConstraint: "Prevents unhealthy values"
}

// Height validation
height_cm: {
  type: "DECIMAL(5,2)",
  range: "100.00 - 250.00 cm",
  checkConstraint: "Realistic human height range"
}

// Activity level validation
activity_level: {
  enum: ["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"],
  default: "moderately_active"
}
```

#### **Exercise Data Validation**
```javascript
// Exercise name validation
name: {
  required: true,
  minLength: 2,
  maxLength: 100,
  trim: true
}

// Duration validation
duration_minutes: {
  type: "INT",
  required: true,
  min: 1,
  max: 300,
  checkConstraint: "duration_minutes > 0"
}

// Calories validation
calories_per_minute: {
  type: "DECIMAL(4,2)",
  required: true,
  min: 0.1,
  max: 50.0,
  checkConstraint: "calories_per_minute > 0"
}

// Category validation
category: {
  enum: ["cardio", "strength", "flexibility", "balance", "sports"],
  required: true,
  default: "cardio"
}

// Difficulty validation
difficulty: {
  enum: ["beginner", "intermediate", "advanced"],
  required: true,
  default: "beginner"
}

// MET value validation
met_value: {
  type: "DECIMAL(4,2)",
  required: true,
  min: 0.1,
  max: 25.0,
  checkConstraint: "met_value > 0"
}
```

#### **Workout Plan Validation**
```javascript
// Plan name validation
name: {
  required: true,
  minLength: 2,
  maxLength: 100,
  trim: true
}

// Exercise order validation
exercise_order: {
  type: "INT",
  required: true,
  min: 1,
  uniquePerPlan: true
}

// Sets and reps validation
sets: {
  type: "INT",
  min: 1,
  max: 20,
  default: 1
}

reps: {
  type: "INT",
  min: 1,
  max: 1000
}
```

### Validation Error Handling

#### **Structured Error Response**
```json
{
  "status": "fail",
  "message": "Validation failed",
  "errors": [
    {
      "field": "weight_kg",
      "message": "Weight must be between 30 and 300 kg",
      "value": "25.5",
      "location": "body"
    },
    {
      "field": "email",
      "message": "Email must be a valid email address",
      "value": "invalid-email",
      "location": "body"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### **Frontend Error Display**
- **Field-level errors** shown immediately below input fields
- **Form-level errors** displayed in error notification component
- **Loading states** during validation to prevent multiple submissions
- **Success feedback** for completed operations

### Security Validation Features

#### **SQL Injection Prevention**
- **Parameterized queries** for all database operations
- **Input sanitization** before database insertion
- **Type validation** to ensure data types match expectations

#### **XSS Prevention**
- **HTML encoding** of user input before display
- **Content Security Policy** headers
- **Input sanitization** to remove malicious scripts

#### **Authentication Validation**
- **JWT token verification** for protected routes
- **Token expiration** checking
- **Role-based authorization** validation
- **Rate limiting** to prevent brute force attacks

## 📄 Pagination and Sorting

The application implements advanced pagination and sorting capabilities across all list endpoints, providing efficient data handling for large datasets with comprehensive metadata.

### 🔧 Pagination Features

#### **Query Parameters**
```javascript
// Pagination parameters
page: {
  type: "integer",
  default: 1,
  min: 1,
  description: "Page number to retrieve"
}

limit: {
  type: "integer",
  default: 10,
  min: 1,
  max: 100,
  description: "Number of items per page"
}

// Sorting parameters
sortBy: {
  type: "string",
  default: "created_at",
  allowedValues: ["name", "created_at", "updated_at", "difficulty", "category"],
  description: "Field to sort by"
}

sortOrder: {
  type: "string",
  default: "DESC",
  enum: ["ASC", "DESC"],
  description: "Sort direction"
}
```

#### **Response Format**
```json
{
  "status": "success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Push-ups",
      "category": "strength",
      "difficulty": "intermediate"
    }
  ],
  "pagination": {
    "currentPage": 2,
    "totalPages": 15,
    "totalCount": 147,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": true,
    "nextPage": 3,
    "previousPage": 1
  },
  "meta": {
    "sortBy": "name",
    "sortOrder": "ASC",
    "filters": {
      "category": "strength",
      "difficulty": "intermediate"
    }
  }
}
```

### 🎯 Advanced Query Examples

#### **Basic Pagination**
```bash
# Get second page with 20 items
GET /api/v1/exercises?page=2&limit=20
```

#### **Sorting Examples**
```bash
# Sort by name ascending
GET /api/v1/exercises?sortBy=name&sortOrder=ASC

# Sort by creation date descending (newest first)
GET /api/v1/exercises?sortBy=created_at&sortOrder=DESC

# Sort by difficulty level
GET /api/v1/exercises?sortBy=difficulty&sortOrder=ASC
```

#### **Combined Pagination and Sorting**
```bash
# Page 3, 15 items per page, sorted by name
GET /api/v1/exercises?page=3&limit=15&sortBy=name&sortOrder=ASC
```

#### **Filtering with Pagination**
```bash
# Filter strength exercises, page 2, sorted by difficulty
GET /api/v1/exercises?category=strength&page=2&sortBy=difficulty&sortOrder=ASC

# Search exercises with pagination
GET /api/v1/exercises?search=push&page=1&limit=10&sortBy=name&sortOrder=ASC
```

### 🚀 Performance Optimizations

#### **Database Level**
- **LIMIT and OFFSET** clauses for efficient data retrieval
- **COUNT queries** optimized with proper indexing
- **Composite indexes** on frequently sorted columns
- **Query caching** for repeated pagination requests

#### **Application Level**
- **Parameter validation** to prevent invalid page requests
- **Default limits** to prevent excessive data retrieval
- **Efficient counting** with separate optimized count queries
- **Memory management** for large result sets

### 📊 Pagination Metadata Calculation

#### **Backend Implementation**
```javascript
// Pagination utility function
export const calculatePaginationMeta = (page, limit, totalCount) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    currentPage: parseInt(page),
    totalPages,
    totalCount: parseInt(totalCount),
    itemsPerPage: parseInt(limit),
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? page + 1 : null,
    previousPage: hasPreviousPage ? page - 1 : null
  };
};

// SQL query with pagination
const getPaginatedExercises = async (page, limit, sortBy, sortOrder, filters) => {
  const offset = (page - 1) * limit;

  // Main data query
  const dataQuery = `
    SELECT * FROM exercises
    WHERE category = ?
    ORDER BY ${sortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

  // Count query for total
  const countQuery = `
    SELECT COUNT(*) as total
    FROM exercises
    WHERE category = ?
  `;

  const [exercises] = await db.execute(dataQuery, [filters.category, limit, offset]);
  const [countResult] = await db.execute(countQuery, [filters.category]);

  return {
    exercises,
    pagination: calculatePaginationMeta(page, limit, countResult[0].total)
  };
};
```

#### **Frontend Implementation**
```typescript
// Angular pagination component
@Component({
  selector: 'app-pagination',
  template: `
    <div class="pagination">
      <button
        [disabled]="!pagination.hasPreviousPage"
        (click)="onPageChange(pagination.previousPage)">
        Previous
      </button>

      <span class="page-info">
        Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
        ({{ pagination.totalCount }} total items)
      </span>

      <button
        [disabled]="!pagination.hasNextPage"
        (click)="onPageChange(pagination.nextPage)">
        Next
      </button>
    </div>
  `
})
export class PaginationComponent {
  @Input() pagination!: PaginationMeta;
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
```

### 🎨 User Experience Features

#### **Loading States**
- **Skeleton loaders** during data fetching
- **Progressive loading** for better perceived performance
- **Error handling** for failed pagination requests
- **Smooth transitions** between pages

#### **URL State Management**
- **Query parameters** synchronized with pagination state
- **Browser history** support for back/forward navigation
- **Bookmarkable URLs** with current page state
- **Deep linking** to specific pages and filters

## License

This project is licensed under the MIT License - see the LICENSE file for details.
