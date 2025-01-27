/*
  # Initial Schema for Fitness Tracker App

  1. New Tables
    - users (managed by Supabase Auth)
    - exercises
      - id (uuid, primary key)
      - name (text)
      - duration (integer)
      - calories (integer)
      - difficulty (enum)
      - created_by (uuid, references auth.users)
      - created_at (timestamp)
    - workout_plans
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - created_by (uuid, references auth.users)
      - created_at (timestamp)
    - workout_exercises
      - id (uuid, primary key)
      - workout_plan_id (uuid, references workout_plans)
      - exercise_id (uuid, references exercises)
      - order (integer)
    - user_workout_plans
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - workout_plan_id (uuid, references workout_plans)
      - started_at (timestamp)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create custom types
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    duration integer NOT NULL CHECK (duration > 0),
    calories integer NOT NULL CHECK (calories >= 0),
    difficulty difficulty_level NOT NULL,
    created_by uuid REFERENCES auth.users NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(name, created_by)
);

-- Create workout_plans table
CREATE TABLE IF NOT EXISTS workout_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    created_by uuid REFERENCES auth.users NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(name, created_by)
);

-- Create workout_exercises table (junction table for workout_plans and exercises)
CREATE TABLE IF NOT EXISTS workout_exercises (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_plan_id uuid REFERENCES workout_plans ON DELETE CASCADE NOT NULL,
    exercise_id uuid REFERENCES exercises ON DELETE CASCADE NOT NULL,
    "order" integer NOT NULL,
    UNIQUE(workout_plan_id, exercise_id)
);

-- Create user_workout_plans table (for N:M relationship between users and workout plans)
CREATE TABLE IF NOT EXISTS user_workout_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    workout_plan_id uuid REFERENCES workout_plans ON DELETE CASCADE NOT NULL,
    started_at timestamptz DEFAULT now(),
    UNIQUE(user_id, workout_plan_id)
);

-- Enable Row Level Security
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workout_plans ENABLE ROW LEVEL SECURITY;

-- Policies for exercises
CREATE POLICY "Users can view their own exercises"
    ON exercises FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own exercises"
    ON exercises FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own exercises"
    ON exercises FOR UPDATE
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own exercises"
    ON exercises FOR DELETE
    USING (auth.uid() = created_by);

-- Policies for workout_plans
CREATE POLICY "Users can view their own workout plans"
    ON workout_plans FOR SELECT
    USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own workout plans"
    ON workout_plans FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own workout plans"
    ON workout_plans FOR UPDATE
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own workout plans"
    ON workout_plans FOR DELETE
    USING (auth.uid() = created_by);

-- Policies for workout_exercises
CREATE POLICY "Users can view exercises in their workout plans"
    ON workout_exercises FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM workout_plans wp
        WHERE wp.id = workout_exercises.workout_plan_id
        AND wp.created_by = auth.uid()
    ));

CREATE POLICY "Users can manage exercises in their workout plans"
    ON workout_exercises FOR ALL
    USING (EXISTS (
        SELECT 1 FROM workout_plans wp
        WHERE wp.id = workout_exercises.workout_plan_id
        AND wp.created_by = auth.uid()
    ));

-- Policies for user_workout_plans
CREATE POLICY "Users can view their workout plan associations"
    ON user_workout_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their workout plan associations"
    ON user_workout_plans FOR ALL
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_created_by ON exercises(created_by);
CREATE INDEX IF NOT EXISTS idx_workout_plans_created_by ON workout_plans(created_by);
CREATE INDEX IF NOT EXISTS idx_user_workout_plans_user_id ON user_workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_plan_id ON workout_exercises(workout_plan_id);