USE fitness_tracker;

-- Insert admin user (password: admin123)
INSERT INTO users (id, email, password, role, first_name, last_name, is_active, email_verified, created_at, updated_at)
VALUES (
  UUID(),
  'admin@example.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O',
  'admin',
  'Admin',
  'User',
  TRUE,
  TRUE,
  NOW(),
  NOW()
);

-- Insert regular user (password: user123)
INSERT INTO users (id, email, password, role, first_name, last_name, is_active, email_verified, created_at, updated_at)
VALUES (
  UUID(),
  'user@example.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O',
  'user',
  'Test',
  'User',
  TRUE,
  TRUE,
  NOW(),
  NOW()
);

-- Get user IDs
SET @admin_id = (SELECT id FROM users WHERE email = 'admin@example.com');
SET @user_id = (SELECT id FROM users WHERE email = 'user@example.com');

-- Insert user profiles
INSERT INTO user_profiles (id, user_id, weight_kg, height_cm, created_at, updated_at)
VALUES (
  UUID(),
  @admin_id,
  75.5,
  180,
  NOW(),
  NOW()
);

INSERT INTO user_profiles (id, user_id, weight_kg, height_cm, created_at, updated_at)
VALUES (
  UUID(),
  @user_id,
  68.2,
  175,
  NOW(),
  NOW()
);

-- Insert weight history
INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, created_at)
VALUES (
  UUID(),
  @admin_id,
  76.2,
  DATE_SUB(NOW(), INTERVAL 30 DAY),
  NOW()
);

INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, created_at)
VALUES (
  UUID(),
  @admin_id,
  75.8,
  DATE_SUB(NOW(), INTERVAL 20 DAY),
  NOW()
);

INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, created_at)
VALUES (
  UUID(),
  @admin_id,
  75.5,
  CURDATE(),
  NOW()
);

INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, created_at)
VALUES (
  UUID(),
  @user_id,
  69.5,
  DATE_SUB(NOW(), INTERVAL 30 DAY),
  NOW()
);

INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, created_at)
VALUES (
  UUID(),
  @user_id,
  68.7,
  DATE_SUB(NOW(), INTERVAL 15 DAY),
  NOW()
);

INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, created_at)
VALUES (
  UUID(),
  @user_id,
  68.2,
  CURDATE(),
  NOW()
);

-- Insert exercises
INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Push-ups',
  'Classic upper body exercise targeting chest, shoulders, and triceps',
  'strength',
  10,
  10.0,
  'intermediate',
  3.8,
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Sit-ups',
  'Core strengthening exercise targeting abdominal muscles',
  'strength',
  10,
  8.0,
  'beginner',
  3.0,
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Squats',
  'Lower body exercise targeting quadriceps, glutes, and hamstrings',
  'strength',
  15,
  10.0,
  'intermediate',
  5.0,
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Lunges',
  'Single-leg exercise for lower body strength and balance',
  'strength',
  12,
  10.0,
  'intermediate',
  4.0,
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Plank',
  'Isometric core exercise for building stability and strength',
  'strength',
  5,
  10.0,
  'advanced',
  4.0,
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Jumping Jacks',
  'Full-body cardio exercise for warming up and conditioning',
  'cardio',
  8,
  10.0,
  'beginner',
  8.0,
  @admin_id,
  NOW(),
  NOW()
);

-- Get exercise IDs
SET @pushups_id = (SELECT id FROM exercises WHERE name = 'Push-ups');
SET @situps_id = (SELECT id FROM exercises WHERE name = 'Sit-ups');
SET @squats_id = (SELECT id FROM exercises WHERE name = 'Squats');
SET @lunges_id = (SELECT id FROM exercises WHERE name = 'Lunges');
SET @plank_id = (SELECT id FROM exercises WHERE name = 'Plank');
SET @jumping_jacks_id = (SELECT id FROM exercises WHERE name = 'Jumping Jacks');

-- Insert workout plans
INSERT INTO workout_plans (id, name, description, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Full Body Workout',
  'A complete workout targeting all major muscle groups',
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO workout_plans (id, name, description, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Upper Body Strength',
  'Focus on building upper body strength',
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO workout_plans (id, name, description, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Core Strength',
  'Focus on building core strength',
  @admin_id,
  NOW(),
  NOW()
);

-- Get workout plan IDs
SET @full_body_id = (SELECT id FROM workout_plans WHERE name = 'Full Body Workout');
SET @upper_body_id = (SELECT id FROM workout_plans WHERE name = 'Upper Body Strength');
SET @core_id = (SELECT id FROM workout_plans WHERE name = 'Core Strength');

-- Insert workout plan exercises
INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, created_at)
VALUES (
  UUID(),
  @full_body_id,
  @pushups_id,
  1,
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, created_at)
VALUES (
  UUID(),
  @full_body_id,
  @situps_id,
  2,
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, created_at)
VALUES (
  UUID(),
  @full_body_id,
  @squats_id,
  3,
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, created_at)
VALUES (
  UUID(),
  @full_body_id,
  @lunges_id,
  4,
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, created_at)
VALUES (
  UUID(),
  @upper_body_id,
  @pushups_id,
  1,
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, created_at)
VALUES (
  UUID(),
  @upper_body_id,
  @jumping_jacks_id,
  2,
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, created_at)
VALUES (
  UUID(),
  @core_id,
  @situps_id,
  1,
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, created_at)
VALUES (
  UUID(),
  @core_id,
  @plank_id,
  2,
  NOW()
);
