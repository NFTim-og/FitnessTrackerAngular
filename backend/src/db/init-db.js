import { query, testConnection } from './database.js';

// SQL statements to create tables
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
`;

const createProfilesTable = `
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  weight_kg FLOAT,
  height_cm FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
`;

const createExercisesTable = `
CREATE TABLE IF NOT EXISTS exercises (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  calories INT,
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  met_value FLOAT,
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
)
`;

const createWorkoutPlansTable = `
CREATE TABLE IF NOT EXISTS workout_plans (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
)
`;

const createWorkoutPlanExercisesTable = `
CREATE TABLE IF NOT EXISTS workout_plan_exercises (
  id VARCHAR(36) PRIMARY KEY,
  workout_plan_id VARCHAR(36) NOT NULL,
  exercise_id VARCHAR(36) NOT NULL,
  order_num INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
)
`;

// Sample data for seeding
const sampleUser = `
INSERT INTO users (id, email, password, role)
VALUES ('00000000-0000-0000-0000-000000000099', 'admin@example.com', '$2b$10$X/hX1PxoOUz2YcETYPcnUOXIVvNg9KzHvHFzZ4MYVFRNIyQ6qZmP.', 'admin')
ON DUPLICATE KEY UPDATE email = email
`;

const sampleProfile = `
INSERT INTO profiles (id, user_id, weight_kg, height_cm)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000099', 75.5, 180.0)
ON DUPLICATE KEY UPDATE weight_kg = weight_kg
`;

const sampleExercises = `
INSERT INTO exercises (id, name, duration, calories, difficulty, met_value, created_by)
VALUES
('00000000-0000-0000-0000-000000000001', 'Push-ups', 10, 100, 'medium', 3.8, '00000000-0000-0000-0000-000000000099'),
('00000000-0000-0000-0000-000000000002', 'Sit-ups', 10, 80, 'easy', 3.0, '00000000-0000-0000-0000-000000000099'),
('00000000-0000-0000-0000-000000000003', 'Squats', 15, 150, 'medium', 5.0, '00000000-0000-0000-0000-000000000099'),
('00000000-0000-0000-0000-000000000004', 'Lunges', 12, 120, 'medium', 4.0, '00000000-0000-0000-0000-000000000099'),
('00000000-0000-0000-0000-000000000005', 'Plank', 5, 50, 'hard', 4.0, '00000000-0000-0000-0000-000000000099'),
('00000000-0000-0000-0000-000000000006', 'Jumping Jacks', 8, 80, 'easy', 8.0, '00000000-0000-0000-0000-000000000099')
ON DUPLICATE KEY UPDATE name = name
`;

const sampleWorkoutPlan = `
INSERT INTO workout_plans (id, name, description, created_by)
VALUES ('00000000-0000-0000-0000-000000000001', 'Full Body Workout', 'A complete workout targeting all major muscle groups', '00000000-0000-0000-0000-000000000099')
ON DUPLICATE KEY UPDATE name = name
`;

const sampleWorkoutPlanExercise = `
INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, order_num)
VALUES ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 1)
ON DUPLICATE KEY UPDATE order_num = order_num
`;

// Initialize database
async function initializeDatabase() {
  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Create tables
    console.log('Creating tables...');
    await query(createUsersTable);
    await query(createProfilesTable);
    await query(createExercisesTable);
    await query(createWorkoutPlansTable);
    await query(createWorkoutPlanExercisesTable);
    console.log('Tables created successfully');

    // Seed data
    console.log('Seeding data...');
    await query(sampleUser);
    await query(sampleProfile);
    await query(sampleExercises);
    await query(sampleWorkoutPlan);
    await query(sampleWorkoutPlanExercise);
    console.log('Data seeded successfully');

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
