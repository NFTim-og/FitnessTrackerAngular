/*
  # Unified Schema for Fitness Tracker App

  1. Tables
    - user_roles: Store user roles (admin/user)
    - exercises: Store exercise definitions with MET values
    - workout_plans: Store workout plan definitions
    - workout_exercises: Junction table for workout plans and exercises
    - user_workout_plans: Track user's workout plans
    - user_profiles: Store user profile information
    - user_weight_history: Track user weight history

  2. Security
    - Enable RLS on all tables
    - Set up policies for user access control
    - Create indexes for performance
*/

-- Create custom types
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id uuid PRIMARY KEY REFERENCES auth.users,
    role user_role NOT NULL DEFAULT 'user',
    created_at timestamptz DEFAULT now()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    duration integer NOT NULL CHECK (duration > 0),
    calories integer NOT NULL CHECK (calories >= 0),
    difficulty difficulty_level NOT NULL,
    met_value numeric NOT NULL DEFAULT 4.0 CHECK (met_value > 0),
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

-- Create workout_exercises table (junction table)
CREATE TABLE IF NOT EXISTS workout_exercises (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_plan_id uuid REFERENCES workout_plans ON DELETE CASCADE NOT NULL,
    exercise_id uuid REFERENCES exercises ON DELETE CASCADE NOT NULL,
    "order" integer NOT NULL,
    UNIQUE(workout_plan_id, exercise_id)
);

-- Create user_workout_plans table
CREATE TABLE IF NOT EXISTS user_workout_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    workout_plan_id uuid REFERENCES workout_plans ON DELETE CASCADE NOT NULL,
    started_at timestamptz DEFAULT now(),
    UNIQUE(user_id, workout_plan_id)
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users,
    weight_kg numeric NOT NULL CHECK (weight_kg > 0),
    height_cm numeric NOT NULL CHECK (height_cm > 0),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create weight history table
CREATE TABLE IF NOT EXISTS user_weight_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    weight_kg numeric NOT NULL CHECK (weight_kg > 0),
    recorded_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_weight_history ENABLE ROW LEVEL SECURITY;

-- Policies for user_roles
CREATE POLICY "Users can view their own role"
    ON user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
    ON user_roles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage roles"
    ON user_roles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

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

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policies for user_weight_history
CREATE POLICY "Users can view their own weight history"
    ON user_weight_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight history"
    ON user_weight_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to update user_profiles updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_created_by ON exercises(created_by);
CREATE INDEX IF NOT EXISTS idx_workout_plans_created_by ON workout_plans(created_by);
CREATE INDEX IF NOT EXISTS idx_user_workout_plans_user_id ON user_workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_plan_id ON workout_exercises(workout_plan_id);
CREATE INDEX IF NOT EXISTS idx_user_weight_history_user_id ON user_weight_history(user_id);