-- Fitness Tracker Database Seed Data
-- Comprehensive Sample Data for Evaluation
-- This file creates realistic sample data to demonstrate all implemented features

USE fitness_tracker;

-- Clear existing data (for clean seeding)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE user_exercise_logs;
TRUNCATE TABLE workout_plan_exercises;
TRUNCATE TABLE user_workout_plans;
TRUNCATE TABLE weight_history;
TRUNCATE TABLE user_profiles;
TRUNCATE TABLE exercises;
TRUNCATE TABLE workout_plans;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert admin user (password: admin123)
INSERT INTO users (id, email, password, role, first_name, last_name, is_active, email_verified, last_login, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'admin@example.com',
  '$2b$12$WMCY8Np27k6NPKdVWKVhA.urbW8ntGgb1jLWnvMsPJu./DtfD9UZa',
  'admin',
  'Admin',
  'User',
  TRUE,
  TRUE,
  NOW(),
  DATE_SUB(NOW(), INTERVAL 30 DAY),
  NOW()
);

-- Insert regular user (password: user123)
INSERT INTO users (id, email, password, role, first_name, last_name, is_active, email_verified, last_login, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'user@example.com',
  '$2b$12$/7lobqoU.h.b.cKm3rDBDeP4BPNSGcxUOEq2fCtpPA4/RMgRnrkba',
  'user',
  'John',
  'Doe',
  TRUE,
  TRUE,
  NOW(),
  DATE_SUB(NOW(), INTERVAL 60 DAY),
  NOW()
);

-- Insert additional test users for demonstration (password: user123)
INSERT INTO users (id, email, password, role, first_name, last_name, is_active, email_verified, last_login, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'jane.smith@example.com',
  '$2b$12$/7lobqoU.h.b.cKm3rDBDeP4BPNSGcxUOEq2fCtpPA4/RMgRnrkba',
  'user',
  'Jane',
  'Smith',
  TRUE,
  TRUE,
  DATE_SUB(NOW(), INTERVAL 1 DAY),
  DATE_SUB(NOW(), INTERVAL 45 DAY),
  NOW()
);

INSERT INTO users (id, email, password, role, first_name, last_name, is_active, email_verified, last_login, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440004',
  'mike.wilson@example.com',
  '$2b$12$/7lobqoU.h.b.cKm3rDBDeP4BPNSGcxUOEq2fCtpPA4/RMgRnrkba',
  'user',
  'Mike',
  'Wilson',
  TRUE,
  TRUE,
  DATE_SUB(NOW(), INTERVAL 3 DAY),
  DATE_SUB(NOW(), INTERVAL 90 DAY),
  NOW()
);

INSERT INTO users (id, email, password, role, first_name, last_name, is_active, email_verified, last_login, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440005',
  'sarah.johnson@example.com',
  '$2b$12$/7lobqoU.h.b.cKm3rDBDeP4BPNSGcxUOEq2fCtpPA4/RMgRnrkba',
  'user',
  'Sarah',
  'Johnson',
  TRUE,
  TRUE,
  DATE_SUB(NOW(), INTERVAL 7 DAY),
  DATE_SUB(NOW(), INTERVAL 120 DAY),
  NOW()
);

-- Set user IDs for easier reference
SET @admin_id = '550e8400-e29b-41d4-a716-446655440001';
SET @user_id = '550e8400-e29b-41d4-a716-446655440002';
SET @jane_id = '550e8400-e29b-41d4-a716-446655440003';
SET @mike_id = '550e8400-e29b-41d4-a716-446655440004';
SET @sarah_id = '550e8400-e29b-41d4-a716-446655440005';

-- Insert comprehensive user profiles with health data
INSERT INTO user_profiles (id, user_id, weight_kg, height_cm, width_cm, date_of_birth, gender, activity_level, fitness_goal, created_at, updated_at)
VALUES (
  '650e8400-e29b-41d4-a716-446655440001',
  @admin_id,
  75.5,
  180.0,
  60.0,
  '1985-03-15',
  'male',
  'very_active',
  'maintain_weight',
  DATE_SUB(NOW(), INTERVAL 30 DAY),
  NOW()
);

INSERT INTO user_profiles (id, user_id, weight_kg, height_cm, width_cm, date_of_birth, gender, activity_level, fitness_goal, created_at, updated_at)
VALUES (
  '650e8400-e29b-41d4-a716-446655440002',
  @user_id,
  68.2,
  175.0,
  60.0,
  '1990-07-22',
  'male',
  'moderately_active',
  'lose_weight',
  DATE_SUB(NOW(), INTERVAL 60 DAY),
  NOW()
);

  INSERT INTO user_profiles (id, user_id, weight_kg, height_cm, width_cm, date_of_birth, gender, activity_level, fitness_goal, created_at, updated_at)
VALUES (
  '650e8400-e29b-41d4-a716-446655440003',
  @jane_id,
  62.5,
  165.0,
  60.0,
  '1992-11-08',
  'female',
  'lightly_active',
  'build_muscle',
  DATE_SUB(NOW(), INTERVAL 45 DAY),
  NOW()
);

INSERT INTO user_profiles (id, user_id, weight_kg, height_cm, width_cm, date_of_birth, gender, activity_level, fitness_goal, created_at, updated_at)
VALUES (
  '650e8400-e29b-41d4-a716-446655440004',
  @mike_id,
  85.0,
  185.0,
  60.0,
  '1988-01-30',
  'male',
  'extremely_active',
  'gain_weight',
  DATE_SUB(NOW(), INTERVAL 90 DAY),
  NOW()
);

INSERT INTO user_profiles (id, user_id, weight_kg, height_cm, width_cm, date_of_birth, gender, activity_level, fitness_goal, created_at, updated_at)
VALUES (
  '650e8400-e29b-41d4-a716-446655440005',
  @sarah_id,
  58.0,
  160.0,
  60.0,
  '1995-05-12',
  'female',
  'moderately_active',
  'improve_endurance',
  DATE_SUB(NOW(), INTERVAL 120 DAY),
  NOW()
);

-- Insert comprehensive weight history for multiple users
-- Admin user weight tracking (maintaining weight)
INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, notes, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', @admin_id, 76.2, DATE_SUB(CURDATE(), INTERVAL 90 DAY), 'Starting weight', NOW()),
('750e8400-e29b-41d4-a716-446655440002', @admin_id, 76.0, DATE_SUB(CURDATE(), INTERVAL 80 DAY), 'After vacation', NOW()),
('750e8400-e29b-41d4-a716-446655440003', @admin_id, 75.8, DATE_SUB(CURDATE(), INTERVAL 70 DAY), 'Regular training', NOW()),
('750e8400-e29b-41d4-a716-446655440004', @admin_id, 75.9, DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'Slight increase', NOW()),
('750e8400-e29b-41d4-a716-446655440005', @admin_id, 75.6, DATE_SUB(CURDATE(), INTERVAL 50 DAY), 'Back on track', NOW()),
('750e8400-e29b-41d4-a716-446655440006', @admin_id, 75.7, DATE_SUB(CURDATE(), INTERVAL 40 DAY), 'Consistent', NOW()),
('750e8400-e29b-41d4-a716-446655440007', @admin_id, 75.5, DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'Target weight', NOW()),
('750e8400-e29b-41d4-a716-446655440008', @admin_id, 75.4, DATE_SUB(CURDATE(), INTERVAL 20 DAY), 'Maintaining well', NOW()),
('750e8400-e29b-41d4-a716-446655440009', @admin_id, 75.5, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Stable', NOW()),
('750e8400-e29b-41d4-a716-446655440010', @admin_id, 75.5, CURDATE(), 'Current weight', NOW());

-- John Doe weight tracking (losing weight)
INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, notes, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440011', @user_id, 72.0, DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'Starting weight loss journey', NOW()),
('750e8400-e29b-41d4-a716-446655440012', @user_id, 71.5, DATE_SUB(CURDATE(), INTERVAL 50 DAY), 'First results', NOW()),
('750e8400-e29b-41d4-a716-446655440013', @user_id, 70.8, DATE_SUB(CURDATE(), INTERVAL 40 DAY), 'Good progress', NOW()),
('750e8400-e29b-41d4-a716-446655440014', @user_id, 70.2, DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'Steady decline', NOW()),
('750e8400-e29b-41d4-a716-446655440015', @user_id, 69.5, DATE_SUB(CURDATE(), INTERVAL 20 DAY), 'Halfway to goal', NOW()),
('750e8400-e29b-41d4-a716-446655440016', @user_id, 68.9, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Almost there', NOW()),
('750e8400-e29b-41d4-a716-446655440017', @user_id, 68.2, CURDATE(), 'Target achieved!', NOW());

-- Jane Smith weight tracking (building muscle)
INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, notes, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440018', @jane_id, 60.5, DATE_SUB(CURDATE(), INTERVAL 45 DAY), 'Starting muscle building', NOW()),
('750e8400-e29b-41d4-a716-446655440019', @jane_id, 61.0, DATE_SUB(CURDATE(), INTERVAL 35 DAY), 'Gaining lean mass', NOW()),
('750e8400-e29b-41d4-a716-446655440020', @jane_id, 61.8, DATE_SUB(CURDATE(), INTERVAL 25 DAY), 'Strength increasing', NOW()),
('750e8400-e29b-41d4-a716-446655440021', @jane_id, 62.2, DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'Muscle definition', NOW()),
('750e8400-e29b-41d4-a716-446655440022', @jane_id, 62.5, CURDATE(), 'Feeling stronger', NOW());

-- Mike Wilson weight tracking (gaining weight)
INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, notes, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440023', @mike_id, 82.0, DATE_SUB(CURDATE(), INTERVAL 90 DAY), 'Need to gain weight', NOW()),
('750e8400-e29b-41d4-a716-446655440024', @mike_id, 82.8, DATE_SUB(CURDATE(), INTERVAL 75 DAY), 'Increasing calories', NOW()),
('750e8400-e29b-41d4-a716-446655440025', @mike_id, 83.5, DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'Steady progress', NOW()),
('750e8400-e29b-41d4-a716-446655440026', @mike_id, 84.2, DATE_SUB(CURDATE(), INTERVAL 45 DAY), 'Building mass', NOW()),
('750e8400-e29b-41d4-a716-446655440027', @mike_id, 84.8, DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'Good gains', NOW()),
('750e8400-e29b-41d4-a716-446655440028', @mike_id, 85.0, CURDATE(), 'Target reached', NOW());

-- Sarah Johnson weight tracking (endurance focus)
INSERT INTO weight_history (id, user_id, weight_kg, recorded_date, notes, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440029', @sarah_id, 59.0, DATE_SUB(CURDATE(), INTERVAL 120 DAY), 'Starting endurance training', NOW()),
('750e8400-e29b-41d4-a716-446655440030', @sarah_id, 58.5, DATE_SUB(CURDATE(), INTERVAL 90 DAY), 'Leaning out', NOW()),
('750e8400-e29b-41d4-a716-446655440031', @sarah_id, 58.2, DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'Improved cardio', NOW()),
('750e8400-e29b-41d4-a716-446655440032', @sarah_id, 58.0, DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'Optimal weight', NOW()),
('750e8400-e29b-41d4-a716-446655440033', @sarah_id, 58.0, CURDATE(), 'Maintaining for performance', NOW());

-- Insert comprehensive exercises across all categories
-- CARDIO EXERCISES
INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, equipment_needed, muscle_groups, instructions, created_by, is_public, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Running', 'High-intensity cardiovascular exercise for endurance and fat burning', 'cardio', 30, 12.0, 'intermediate', 8.0, 'Running shoes', '["legs", "core", "cardiovascular"]', 'Maintain steady pace, breathe rhythmically, land on midfoot', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440002', 'Jumping Jacks', 'Full-body cardio exercise for warming up and conditioning', 'cardio', 10, 10.0, 'beginner', 7.0, 'None', '["full_body", "cardiovascular"]', 'Jump feet apart while raising arms overhead, return to starting position', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440003', 'Cycling', 'Low-impact cardio exercise great for leg strength and endurance', 'cardio', 45, 8.5, 'beginner', 6.8, 'Bicycle or stationary bike', '["legs", "glutes", "cardiovascular"]', 'Maintain steady cadence, adjust resistance as needed', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440004', 'Burpees', 'High-intensity full-body exercise combining cardio and strength', 'cardio', 15, 15.0, 'advanced', 10.0, 'None', '["full_body", "core", "cardiovascular"]', 'Squat down, jump back to plank, do push-up, jump feet forward, jump up', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440005', 'Mountain Climbers', 'Dynamic cardio exercise targeting core and cardiovascular system', 'cardio', 10, 11.0, 'intermediate', 8.0, 'None', '["core", "shoulders", "cardiovascular"]', 'Start in plank, alternate bringing knees to chest rapidly', @admin_id, TRUE, NOW(), NOW());

-- STRENGTH EXERCISES
INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, equipment_needed, muscle_groups, instructions, created_by, is_public, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440006', 'Push-ups', 'Classic upper body exercise targeting chest, shoulders, and triceps', 'strength', 15, 8.0, 'intermediate', 3.8, 'None', '["chest", "shoulders", "triceps", "core"]', 'Keep body straight, lower chest to ground, push back up', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440007', 'Squats', 'Fundamental lower body exercise targeting quadriceps, glutes, and hamstrings', 'strength', 20, 6.0, 'beginner', 5.0, 'None', '["quadriceps", "glutes", "hamstrings", "core"]', 'Feet shoulder-width apart, lower hips back and down, return to standing', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440008', 'Deadlifts', 'Compound exercise targeting posterior chain muscles', 'strength', 25, 7.0, 'advanced', 6.0, 'Barbell or dumbbells', '["hamstrings", "glutes", "back", "core"]', 'Keep back straight, hinge at hips, lift weight by extending hips and knees', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440009', 'Pull-ups', 'Upper body pulling exercise for back and bicep development', 'strength', 15, 8.5, 'advanced', 8.0, 'Pull-up bar', '["back", "biceps", "shoulders", "core"]', 'Hang from bar, pull body up until chin clears bar, lower with control', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440010', 'Lunges', 'Single-leg exercise for lower body strength and balance', 'strength', 18, 6.5, 'intermediate', 4.0, 'None', '["quadriceps", "glutes", "hamstrings", "calves"]', 'Step forward, lower back knee toward ground, return to standing', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440011', 'Plank', 'Isometric core exercise for building stability and strength', 'strength', 10, 4.0, 'intermediate', 4.0, 'None', '["core", "shoulders", "back"]', 'Hold straight line from head to heels, engage core muscles', @admin_id, TRUE, NOW(), NOW());

-- FLEXIBILITY EXERCISES
INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, equipment_needed, muscle_groups, instructions, created_by, is_public, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440012', 'Yoga Flow', 'Dynamic sequence of yoga poses for flexibility and mindfulness', 'flexibility', 30, 3.0, 'intermediate', 2.5, 'Yoga mat', '["full_body", "core", "flexibility"]', 'Flow through poses with controlled breathing, hold each pose 30 seconds', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440013', 'Static Stretching', 'Traditional stretching routine for improved flexibility', 'flexibility', 20, 2.5, 'beginner', 2.0, 'None', '["full_body", "flexibility"]', 'Hold each stretch for 30-60 seconds, breathe deeply', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440014', 'Pilates', 'Low-impact exercise focusing on core strength and flexibility', 'flexibility', 45, 3.5, 'intermediate', 3.0, 'Mat', '["core", "flexibility", "stability"]', 'Focus on controlled movements and proper breathing', @admin_id, TRUE, NOW(), NOW());

-- BALANCE EXERCISES
INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, equipment_needed, muscle_groups, instructions, created_by, is_public, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440015', 'Single Leg Stand', 'Basic balance exercise to improve stability and proprioception', 'balance', 10, 2.0, 'beginner', 2.0, 'None', '["legs", "core", "stability"]', 'Stand on one leg, maintain balance for 30 seconds, switch legs', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440016', 'Balance Board', 'Dynamic balance training using unstable surface', 'balance', 15, 3.0, 'intermediate', 3.0, 'Balance board', '["legs", "core", "ankles", "stability"]', 'Stand on balance board, maintain stability while performing movements', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440017', 'Tai Chi', 'Slow, controlled movements for balance and mindfulness', 'balance', 30, 2.5, 'beginner', 2.5, 'None', '["full_body", "balance", "flexibility"]', 'Perform slow, flowing movements with focus on balance and breathing', @admin_id, TRUE, NOW(), NOW());

-- SPORTS EXERCISES
INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, equipment_needed, muscle_groups, instructions, created_by, is_public, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440018', 'Basketball', 'Team sport combining cardio, agility, and coordination', 'sports', 60, 8.0, 'intermediate', 6.5, 'Basketball, court', '["full_body", "cardiovascular", "coordination"]', 'Dribble, shoot, and play defense while maintaining constant movement', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440019', 'Tennis', 'Racquet sport for cardiovascular fitness and hand-eye coordination', 'sports', 60, 7.0, 'intermediate', 7.0, 'Tennis racquet, balls, court', '["arms", "legs", "core", "coordination"]', 'Focus on proper form, footwork, and consistent ball contact', @admin_id, TRUE, NOW(), NOW()),
('850e8400-e29b-41d4-a716-446655440020', 'Swimming', 'Full-body low-impact exercise excellent for cardiovascular fitness', 'sports', 45, 11.0, 'intermediate', 8.0, 'Pool, swimwear', '["full_body", "cardiovascular", "endurance"]', 'Maintain proper stroke technique, breathe rhythmically', @admin_id, TRUE, NOW(), NOW());

-- Set exercise IDs for easier reference
SET @running_id = '850e8400-e29b-41d4-a716-446655440001';
SET @jumping_jacks_id = '850e8400-e29b-41d4-a716-446655440002';
SET @cycling_id = '850e8400-e29b-41d4-a716-446655440003';
SET @burpees_id = '850e8400-e29b-41d4-a716-446655440004';
SET @mountain_climbers_id = '850e8400-e29b-41d4-a716-446655440005';
SET @pushups_id = '850e8400-e29b-41d4-a716-446655440006';
SET @squats_id = '850e8400-e29b-41d4-a716-446655440007';
SET @deadlifts_id = '850e8400-e29b-41d4-a716-446655440008';
SET @pullups_id = '850e8400-e29b-41d4-a716-446655440009';
SET @lunges_id = '850e8400-e29b-41d4-a716-446655440010';
SET @plank_id = '850e8400-e29b-41d4-a716-446655440011';
SET @yoga_id = '850e8400-e29b-41d4-a716-446655440012';
SET @stretching_id = '850e8400-e29b-41d4-a716-446655440013';
SET @pilates_id = '850e8400-e29b-41d4-a716-446655440014';
SET @balance_stand_id = '850e8400-e29b-41d4-a716-446655440015';
SET @balance_board_id = '850e8400-e29b-41d4-a716-446655440016';
SET @tai_chi_id = '850e8400-e29b-41d4-a716-446655440017';
SET @basketball_id = '850e8400-e29b-41d4-a716-446655440018';
SET @tennis_id = '850e8400-e29b-41d4-a716-446655440019';
SET @swimming_id = '850e8400-e29b-41d4-a716-446655440020';

-- Insert comprehensive workout plans
INSERT INTO workout_plans (id, name, description, category, difficulty, estimated_duration_minutes, target_calories, created_by, is_public, created_at, updated_at) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'Beginner Full Body', 'Complete beginner-friendly workout targeting all major muscle groups', 'general_fitness', 'beginner', 45, 300, @admin_id, TRUE, NOW(), NOW()),
('950e8400-e29b-41d4-a716-446655440002', 'HIIT Cardio Blast', 'High-intensity interval training for maximum calorie burn', 'weight_loss', 'advanced', 30, 400, @admin_id, TRUE, NOW(), NOW()),
('950e8400-e29b-41d4-a716-446655440003', 'Strength Builder', 'Progressive strength training for muscle development', 'muscle_gain', 'intermediate', 60, 350, @admin_id, TRUE, NOW(), NOW()),
('950e8400-e29b-41d4-a716-446655440004', 'Flexibility & Balance', 'Comprehensive flexibility and balance improvement routine', 'flexibility', 'beginner', 40, 150, @admin_id, TRUE, NOW(), NOW()),
('950e8400-e29b-41d4-a716-446655440005', 'Endurance Challenge', 'Build cardiovascular endurance and stamina', 'endurance', 'intermediate', 75, 500, @admin_id, TRUE, NOW(), NOW()),
('950e8400-e29b-41d4-a716-446655440006', 'Core Power', 'Intensive core strengthening and stability workout', 'strength', 'intermediate', 35, 250, @admin_id, TRUE, NOW(), NOW()),
('950e8400-e29b-41d4-a716-446655440007', 'Sports Performance', 'Athletic training for sports performance enhancement', 'general_fitness', 'advanced', 90, 600, @admin_id, TRUE, NOW(), NOW()),
('950e8400-e29b-41d4-a716-446655440008', 'Quick Morning Routine', 'Energizing morning workout to start your day', 'general_fitness', 'beginner', 20, 150, @user_id, TRUE, NOW(), NOW());

-- Set workout plan IDs for easier reference
SET @beginner_full_body_id = '950e8400-e29b-41d4-a716-446655440001';
SET @hiit_cardio_id = '950e8400-e29b-41d4-a716-446655440002';
SET @strength_builder_id = '950e8400-e29b-41d4-a716-446655440003';
SET @flexibility_balance_id = '950e8400-e29b-41d4-a716-446655440004';
SET @endurance_challenge_id = '950e8400-e29b-41d4-a716-446655440005';
SET @core_power_id = '950e8400-e29b-41d4-a716-446655440006';
SET @sports_performance_id = '950e8400-e29b-41d4-a716-446655440007';
SET @morning_routine_id = '950e8400-e29b-41d4-a716-446655440008';

-- Insert workout plan exercises (many-to-many relationships)
-- Beginner Full Body Workout
INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, sets, reps, duration_minutes, rest_seconds, notes, created_at) VALUES
('a50e8400-e29b-41d4-a716-446655440001', @beginner_full_body_id, @jumping_jacks_id, 1, 3, 20, 5, 60, 'Warm-up exercise', NOW()),
('a50e8400-e29b-41d4-a716-446655440002', @beginner_full_body_id, @squats_id, 2, 3, 15, 10, 90, 'Focus on form', NOW()),
('a50e8400-e29b-41d4-a716-446655440003', @beginner_full_body_id, @pushups_id, 3, 3, 10, 8, 90, 'Modify if needed', NOW()),
('a50e8400-e29b-41d4-a716-446655440004', @beginner_full_body_id, @lunges_id, 4, 3, 12, 8, 90, 'Each leg', NOW()),
('a50e8400-e29b-41d4-a716-446655440005', @beginner_full_body_id, @plank_id, 5, 3, NULL, 2, 60, 'Hold position', NOW()),
('a50e8400-e29b-41d4-a716-446655440006', @beginner_full_body_id, @stretching_id, 6, 1, NULL, 10, 0, 'Cool down', NOW());

-- HIIT Cardio Blast
INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, sets, reps, duration_minutes, rest_seconds, notes, created_at) VALUES
('a50e8400-e29b-41d4-a716-446655440007', @hiit_cardio_id, @jumping_jacks_id, 1, 1, NULL, 3, 30, 'Warm-up', NOW()),
('a50e8400-e29b-41d4-a716-446655440008', @hiit_cardio_id, @burpees_id, 2, 4, 10, 2, 60, 'High intensity', NOW()),
('a50e8400-e29b-41d4-a716-446655440009', @hiit_cardio_id, @mountain_climbers_id, 3, 4, 20, 1, 60, 'Fast pace', NOW()),
('a50e8400-e29b-41d4-a716-446655440010', @hiit_cardio_id, @jumping_jacks_id, 4, 4, 30, 1, 45, 'Maintain intensity', NOW()),
('a50e8400-e29b-41d4-a716-446655440011', @hiit_cardio_id, @running_id, 5, 1, NULL, 15, 0, 'Cool down jog', NOW());

-- Strength Builder
INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, sets, reps, duration_minutes, rest_seconds, notes, created_at) VALUES
('a50e8400-e29b-41d4-a716-446655440012', @strength_builder_id, @jumping_jacks_id, 1, 2, 15, 5, 60, 'Warm-up', NOW()),
('a50e8400-e29b-41d4-a716-446655440013', @strength_builder_id, @squats_id, 2, 4, 12, 15, 120, 'Progressive overload', NOW()),
('a50e8400-e29b-41d4-a716-446655440014', @strength_builder_id, @deadlifts_id, 3, 4, 8, 20, 180, 'Focus on form', NOW()),
('a50e8400-e29b-41d4-a716-446655440015', @strength_builder_id, @pushups_id, 4, 4, 10, 10, 120, 'Chest development', NOW()),
('a50e8400-e29b-41d4-a716-446655440016', @strength_builder_id, @pullups_id, 5, 4, 6, 10, 180, 'Back strength', NOW()),
('a50e8400-e29b-41d4-a716-446655440017', @strength_builder_id, @plank_id, 6, 3, NULL, 3, 90, 'Core stability', NOW());

-- Flexibility & Balance
INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, sets, reps, duration_minutes, rest_seconds, notes, created_at) VALUES
('a50e8400-e29b-41d4-a716-446655440018', @flexibility_balance_id, @tai_chi_id, 1, 1, NULL, 15, 0, 'Mindful movement', NOW()),
('a50e8400-e29b-41d4-a716-446655440019', @flexibility_balance_id, @yoga_id, 2, 1, NULL, 20, 0, 'Flow sequence', NOW()),
('a50e8400-e29b-41d4-a716-446655440020', @flexibility_balance_id, @balance_stand_id, 3, 3, NULL, 2, 30, 'Each leg', NOW()),
('a50e8400-e29b-41d4-a716-446655440021', @flexibility_balance_id, @stretching_id, 4, 1, NULL, 15, 0, 'Deep stretches', NOW());

-- Core Power
INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, sets, reps, duration_minutes, rest_seconds, notes, created_at) VALUES
('a50e8400-e29b-41d4-a716-446655440022', @core_power_id, @mountain_climbers_id, 1, 3, 20, 3, 60, 'Warm-up core', NOW()),
('a50e8400-e29b-41d4-a716-446655440023', @core_power_id, @plank_id, 2, 4, NULL, 3, 90, 'Hold strong', NOW()),
('a50e8400-e29b-41d4-a716-446655440024', @core_power_id, @burpees_id, 3, 3, 8, 5, 120, 'Full body core', NOW()),
('a50e8400-e29b-41d4-a716-446655440025', @core_power_id, @pilates_id, 4, 1, NULL, 20, 0, 'Controlled movements', NOW());

-- Quick Morning Routine
INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, sets, reps, duration_minutes, rest_seconds, notes, created_at) VALUES
('a50e8400-e29b-41d4-a716-446655440026', @morning_routine_id, @jumping_jacks_id, 1, 2, 15, 3, 30, 'Wake up the body', NOW()),
('a50e8400-e29b-41d4-a716-446655440027', @morning_routine_id, @squats_id, 2, 2, 10, 5, 45, 'Activate legs', NOW()),
('a50e8400-e29b-41d4-a716-446655440028', @morning_routine_id, @pushups_id, 3, 2, 8, 4, 45, 'Upper body activation', NOW()),
('a50e8400-e29b-41d4-a716-446655440029', @morning_routine_id, @stretching_id, 4, 1, NULL, 8, 0, 'Gentle stretches', NOW());

-- Insert user workout plan assignments (many-to-many relationships)
INSERT INTO user_workout_plans (id, user_id, workout_plan_id, assigned_date, completed_date, status, notes, created_at, updated_at) VALUES
('b50e8400-e29b-41d4-a716-446655440001', @user_id, @beginner_full_body_id, DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_SUB(CURDATE(), INTERVAL 25 DAY), 'completed', 'Great first workout plan!', NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440002', @user_id, @hiit_cardio_id, DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'completed', 'Challenging but effective', NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440003', @user_id, @core_power_id, DATE_SUB(CURDATE(), INTERVAL 10 DAY), NULL, 'in_progress', 'Working on core strength', NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440004', @jane_id, @strength_builder_id, DATE_SUB(CURDATE(), INTERVAL 45 DAY), DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'completed', 'Excellent strength gains', NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440005', @jane_id, @flexibility_balance_id, DATE_SUB(CURDATE(), INTERVAL 25 DAY), NULL, 'in_progress', 'Improving flexibility daily', NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440006', @mike_id, @sports_performance_id, DATE_SUB(CURDATE(), INTERVAL 60 DAY), DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'completed', 'Athletic performance improved', NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440007', @mike_id, @endurance_challenge_id, DATE_SUB(CURDATE(), INTERVAL 20 DAY), NULL, 'in_progress', 'Building endurance', NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440008', @sarah_id, @morning_routine_id, DATE_SUB(CURDATE(), INTERVAL 120 DAY), DATE_SUB(CURDATE(), INTERVAL 90 DAY), 'completed', 'Perfect morning starter', NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440009', @sarah_id, @endurance_challenge_id, DATE_SUB(CURDATE(), INTERVAL 80 DAY), DATE_SUB(CURDATE(), INTERVAL 50 DAY), 'completed', 'Endurance significantly improved', NOW(), NOW()),
('b50e8400-e29b-41d4-a716-446655440010', @admin_id, @hiit_cardio_id, DATE_SUB(CURDATE(), INTERVAL 15 DAY), NULL, 'in_progress', 'Testing new workout plan', NOW(), NOW());

-- Insert user exercise logs (individual exercise sessions)
INSERT INTO user_exercise_logs (id, user_id, exercise_id, workout_plan_id, session_date, duration_minutes, calories_burned, sets_completed, reps_completed, weight_used_kg, distance_km, notes, created_at) VALUES
-- John Doe's exercise logs
('c50e8400-e29b-41d4-a716-446655440001', @user_id, @running_id, NULL, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 30, 360, NULL, NULL, NULL, 5.0, 'Good pace maintained', NOW()),
('c50e8400-e29b-41d4-a716-446655440002', @user_id, @squats_id, @beginner_full_body_id, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 10, 60, 3, 15, NULL, NULL, 'Form improving', NOW()),
('c50e8400-e29b-41d4-a716-446655440003', @user_id, @pushups_id, @beginner_full_body_id, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 8, 64, 3, 10, NULL, NULL, 'Getting stronger', NOW()),
('c50e8400-e29b-41d4-a716-446655440004', @user_id, @burpees_id, @hiit_cardio_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 15, 225, 4, 10, NULL, NULL, 'Intense workout', NOW()),
('c50e8400-e29b-41d4-a716-446655440005', @user_id, @plank_id, @core_power_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 10, 40, 4, NULL, NULL, NULL, 'Core getting stronger', NOW()),

-- Jane Smith's exercise logs
('c50e8400-e29b-41d4-a716-446655440006', @jane_id, @deadlifts_id, @strength_builder_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 20, 140, 4, 8, 40.0, NULL, 'New personal record', NOW()),
('c50e8400-e29b-41d4-a716-446655440007', @jane_id, @pullups_id, @strength_builder_id, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 10, 85, 4, 6, NULL, NULL, 'Assisted pullups', NOW()),
('c50e8400-e29b-41d4-a716-446655440008', @jane_id, @yoga_id, @flexibility_balance_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 30, 90, 1, NULL, NULL, NULL, 'Relaxing session', NOW()),

-- Mike Wilson's exercise logs
('c50e8400-e29b-41d4-a716-446655440009', @mike_id, @basketball_id, @sports_performance_id, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 60, 480, NULL, NULL, NULL, NULL, 'Great game with friends', NOW()),
('c50e8400-e29b-41d4-a716-446655440010', @mike_id, @swimming_id, @endurance_challenge_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 45, 495, NULL, NULL, NULL, 2.0, 'Freestyle and backstroke', NOW()),
('c50e8400-e29b-41d4-a716-446655440011', @mike_id, @cycling_id, @endurance_challenge_id, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 60, 510, NULL, NULL, NULL, 25.0, 'Long distance ride', NOW()),

-- Sarah Johnson's exercise logs
('c50e8400-e29b-41d4-a716-446655440012', @sarah_id, @running_id, @endurance_challenge_id, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 45, 540, NULL, NULL, NULL, 8.0, 'Best distance yet', NOW()),
('c50e8400-e29b-41d4-a716-446655440013', @sarah_id, @tennis_id, NULL, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 60, 420, NULL, NULL, NULL, NULL, 'Weekly tennis match', NOW()),
('c50e8400-e29b-41d4-a716-446655440014', @sarah_id, @jumping_jacks_id, @morning_routine_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 3, 30, 2, 15, NULL, NULL, 'Morning energy boost', NOW()),

-- Admin's exercise logs
('c50e8400-e29b-41d4-a716-446655440015', @admin_id, @mountain_climbers_id, @hiit_cardio_id, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 10, 110, 4, 20, NULL, NULL, 'Testing new routine', NOW()),
('c50e8400-e29b-41d4-a716-446655440016', @admin_id, @tai_chi_id, NULL, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 30, 75, 1, NULL, NULL, NULL, 'Stress relief session', NOW());

-- Success message
SELECT 'Database seeded successfully with comprehensive sample data!' as message;
