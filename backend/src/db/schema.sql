-- Fitness Tracker Database Schema
-- UF3/UF4 Curriculum Project
-- Features: UUID primary keys, many-to-many relationships, data validation

-- Create database
CREATE DATABASE IF NOT EXISTS fitness_tracker;
USE fitness_tracker;

-- Drop existing tables to ensure clean schema
DROP TABLE IF EXISTS user_exercise_logs;
DROP TABLE IF EXISTS workout_plan_exercises;
DROP TABLE IF EXISTS user_workout_plans;
DROP TABLE IF EXISTS weight_history;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS workout_plans;
DROP TABLE IF EXISTS users;

-- Create users table with encrypted sensitive data
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes for performance
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (is_active)
);

-- Create user_profiles table with comprehensive health data
CREATE TABLE user_profiles (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL UNIQUE,
  weight_kg DECIMAL(5,2) CHECK (weight_kg >= 30 AND weight_kg <= 300),
  height_cm DECIMAL(5,2) CHECK (height_cm >= 100 AND height_cm <= 250),
  width_cm DECIMAL(5,2) CHECK (width_cm >= 30 AND width_cm <= 300),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  activity_level ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active') DEFAULT 'moderately_active',
  fitness_goal ENUM('lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle', 'improve_endurance') DEFAULT 'maintain_weight',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Create exercises table with comprehensive exercise data
CREATE TABLE exercises (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category ENUM('cardio', 'strength', 'flexibility', 'balance', 'sports') NOT NULL DEFAULT 'cardio',
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  calories_per_minute DECIMAL(4,2) NOT NULL CHECK (calories_per_minute > 0),
  difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
  met_value DECIMAL(4,2) NOT NULL CHECK (met_value > 0),
  equipment_needed VARCHAR(255),
  muscle_groups JSON,
  instructions TEXT,
  created_by VARCHAR(36) NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_category (category),
  INDEX idx_difficulty (difficulty),
  INDEX idx_created_by (created_by),
  INDEX idx_public (is_public)
);

-- Create workout_plans table
CREATE TABLE workout_plans (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category ENUM('weight_loss', 'muscle_gain', 'endurance', 'strength', 'flexibility', 'general_fitness') DEFAULT 'general_fitness',
  difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
  estimated_duration_minutes INT,
  target_calories INT,
  created_by VARCHAR(36) NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_category (category),
  INDEX idx_difficulty (difficulty),
  INDEX idx_created_by (created_by),
  INDEX idx_public (is_public)
);

-- Create workout_plan_exercises table (many-to-many relationship)
CREATE TABLE workout_plan_exercises (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  workout_plan_id VARCHAR(36) NOT NULL,
  exercise_id VARCHAR(36) NOT NULL,
  exercise_order INT NOT NULL,
  sets INT DEFAULT 1,
  reps INT,
  duration_minutes INT,
  rest_seconds INT DEFAULT 60,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  UNIQUE KEY unique_workout_exercise_order (workout_plan_id, exercise_order),
  INDEX idx_workout_plan (workout_plan_id),
  INDEX idx_exercise (exercise_id)
);

-- Create weight_history table for tracking weight changes
CREATE TABLE weight_history (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL CHECK (weight_kg >= 30 AND weight_kg <= 300),
  recorded_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_date (user_id, recorded_date),
  UNIQUE KEY unique_user_date (user_id, recorded_date)
);

-- Create user_workout_plans table (many-to-many relationship)
CREATE TABLE user_workout_plans (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  workout_plan_id VARCHAR(36) NOT NULL,
  assigned_date DATE NOT NULL,
  completed_date DATE NULL,
  status ENUM('assigned', 'in_progress', 'completed', 'paused') DEFAULT 'assigned',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_workout_plan_id (workout_plan_id),
  INDEX idx_status (status)
);

-- Create user_exercise_logs table for tracking individual exercise sessions
CREATE TABLE user_exercise_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  exercise_id VARCHAR(36) NOT NULL,
  workout_plan_id VARCHAR(36) NULL,
  session_date DATE NOT NULL,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  calories_burned INT,
  sets_completed INT,
  reps_completed INT,
  weight_used_kg DECIMAL(5,2),
  distance_km DECIMAL(6,3),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE SET NULL,
  INDEX idx_user_date (user_id, session_date),
  INDEX idx_exercise (exercise_id),
  INDEX idx_workout_plan (workout_plan_id)
);

-- Schema creation complete
-- Use seed.sql file to populate with sample data
