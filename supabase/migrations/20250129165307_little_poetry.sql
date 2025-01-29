/*
  # Add user profiles and MET-based calorie calculations
  
  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `weight_kg` (numeric)
      - `height_cm` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_weight_history`
      - `id` (uuid)
      - `user_id` (uuid, references auth.users)
      - `weight_kg` (numeric)
      - `recorded_at` (timestamptz)
  
  2. Table Modifications
    - Add `met_value` to exercises table
  
  3. Security
    - Enable RLS on new tables
    - Add policies for user data access
*/

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

-- Add MET value to exercises
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS met_value numeric NOT NULL DEFAULT 4.0 CHECK (met_value > 0);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_weight_history ENABLE ROW LEVEL SECURITY;

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