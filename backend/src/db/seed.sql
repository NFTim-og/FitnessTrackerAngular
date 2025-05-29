USE fitness_tracker;

-- Insert roles
INSERT INTO roles (name) VALUES ('admin'), ('user');

-- Insert admin user (password: admin123)
INSERT INTO users (id, email, password, role_id, created_at, updated_at)
VALUES (
  UUID(),
  'admin@example.com',
  '$2b$10$3Eo3VxmFwDwQOFCw5QYEzuIw.Tn3HLLKUFGoNyJNUN4tHcN5xKlXu',
  1,
  NOW(),
  NOW()
);

-- Insert regular user (password: user123)
INSERT INTO users (id, email, password, role_id, created_at, updated_at)
VALUES (
  UUID(),
  'user@example.com',
  '$2b$10$3Eo3VxmFwDwQOFCw5QYEzuIw.Tn3HLLKUFGoNyJNUN4tHcN5xKlXu',
  2,
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
INSERT INTO weight_history (id, user_id, weight_kg, recorded_at, created_at, updated_at)
VALUES (
  UUID(),
  @admin_id,
  76.2,
  DATE_SUB(NOW(), INTERVAL 30 DAY),
  NOW(),
  NOW()
);

INSERT INTO weight_history (id, user_id, weight_kg, recorded_at, created_at, updated_at)
VALUES (
  UUID(),
  @admin_id,
  75.8,
  DATE_SUB(NOW(), INTERVAL 20 DAY),
  NOW(),
  NOW()
);

INSERT INTO weight_history (id, user_id, weight_kg, recorded_at, created_at, updated_at)
VALUES (
  UUID(),
  @admin_id,
  75.5,
  NOW(),
  NOW(),
  NOW()
);

INSERT INTO weight_history (id, user_id, weight_kg, recorded_at, created_at, updated_at)
VALUES (
  UUID(),
  @user_id,
  69.5,
  DATE_SUB(NOW(), INTERVAL 30 DAY),
  NOW(),
  NOW()
);

INSERT INTO weight_history (id, user_id, weight_kg, recorded_at, created_at, updated_at)
VALUES (
  UUID(),
  @user_id,
  68.7,
  DATE_SUB(NOW(), INTERVAL 15 DAY),
  NOW(),
  NOW()
);

INSERT INTO weight_history (id, user_id, weight_kg, recorded_at, created_at, updated_at)
VALUES (
  UUID(),
  @user_id,
  68.2,
  NOW(),
  NOW(),
  NOW()
);

-- Insert exercises
INSERT INTO exercises (id, name, duration, calories, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Push-ups',
  10,
  100,
  'medium',
  3.8,
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO exercises (id, name, duration, calories, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Sit-ups',
  10,
  80,
  'easy',
  3.0,
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO exercises (id, name, duration, calories, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Squats',
  15,
  150,
  'medium',
  5.0,
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO exercises (id, name, duration, calories, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Lunges',
  12,
  120,
  'medium',
  4.0,
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO exercises (id, name, duration, calories, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Plank',
  5,
  50,
  'hard',
  4.0,
  @admin_id,
  NOW(),
  NOW()
);

INSERT INTO exercises (id, name, duration, calories, difficulty, met_value, created_by, created_at, updated_at)
VALUES (
  UUID(),
  'Jumping Jacks',
  8,
  80,
  'easy',
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
INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, `order`, created_at, updated_at)
VALUES (
  UUID(),
  @full_body_id,
  @pushups_id,
  1,
  NOW(),
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, `order`, created_at, updated_at)
VALUES (
  UUID(),
  @full_body_id,
  @situps_id,
  2,
  NOW(),
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, `order`, created_at, updated_at)
VALUES (
  UUID(),
  @full_body_id,
  @squats_id,
  3,
  NOW(),
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, `order`, created_at, updated_at)
VALUES (
  UUID(),
  @full_body_id,
  @lunges_id,
  4,
  NOW(),
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, `order`, created_at, updated_at)
VALUES (
  UUID(),
  @upper_body_id,
  @pushups_id,
  1,
  NOW(),
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, `order`, created_at, updated_at)
VALUES (
  UUID(),
  @upper_body_id,
  @jumping_jacks_id,
  2,
  NOW(),
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, `order`, created_at, updated_at)
VALUES (
  UUID(),
  @core_id,
  @situps_id,
  1,
  NOW(),
  NOW()
);

INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, `order`, created_at, updated_at)
VALUES (
  UUID(),
  @core_id,
  @plank_id,
  2,
  NOW(),
  NOW()
);
