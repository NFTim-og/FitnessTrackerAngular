/**
 * Database Seed Script
 * Populates the database with sample data for development and testing
 * UF3/UF4 Curriculum Project
 */

import { query } from './database.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

/**
 * Seed the database with sample data
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await clearExistingData();

    // Create users
    const users = await createUsers();

    // Create user profiles
    await createUserProfiles(users);

    // Create exercises
    const exercises = await createExercises(users.admin.id);

    // Create workout plans
    const workoutPlans = await createWorkoutPlans(users.admin.id);

    // Link exercises to workout plans
    await linkExercisesToWorkoutPlans(workoutPlans, exercises);

    // Create sample weight history
    await createWeightHistory(users);

    // Create sample exercise logs
    await createExerciseLogs(users, exercises, workoutPlans);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Users Created:');
    console.log('👤 Admin: admin@fitness.com / password: admin123');
    console.log('👤 User: user@fitness.com / password: user123');
    console.log('👤 Trainer: trainer@fitness.com / password: trainer123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

/**
 * Clear existing data from all tables
 */
async function clearExistingData() {
  console.log('🧹 Clearing existing data...');

  const tables = [
    'user_exercise_logs',
    'user_workout_plans',
    'workout_plan_exercises',
    'weight_history',
    'user_profiles',
    'exercises',
    'workout_plans',
    'users'
  ];

  for (const table of tables) {
    await query(`DELETE FROM ${table}`);
  }
}

/**
 * Create sample users
 */
async function createUsers() {
  console.log('👥 Creating users...');

  const hashedPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);
  const trainerPassword = await bcrypt.hash('trainer123', 12);

  const adminId = uuidv4();
  const userId = uuidv4();
  const trainerId = uuidv4();

  // Create admin user
  await query(`
    INSERT INTO users (id, email, password, role, first_name, last_name, is_active, email_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [adminId, 'admin@fitness.com', hashedPassword, 'admin', 'Admin', 'User', true, true]);

  // Create regular user
  await query(`
    INSERT INTO users (id, email, password, role, first_name, last_name, is_active, email_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [userId, 'user@fitness.com', userPassword, 'user', 'John', 'Doe', true, true]);

  // Create trainer user
  await query(`
    INSERT INTO users (id, email, password, role, first_name, last_name, is_active, email_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [trainerId, 'trainer@fitness.com', trainerPassword, 'user', 'Jane', 'Smith', true, true]);

  return {
    admin: { id: adminId, email: 'admin@fitness.com' },
    user: { id: userId, email: 'user@fitness.com' },
    trainer: { id: trainerId, email: 'trainer@fitness.com' }
  };
}

/**
 * Create user profiles
 */
async function createUserProfiles(users) {
  console.log('📊 Creating user profiles...');

  const profiles = [
    {
      userId: users.admin.id,
      weight: 75.5,
      height: 180,
      dateOfBirth: '1985-06-15',
      gender: 'male',
      activityLevel: 'moderately_active',
      fitnessGoal: 'maintain_weight'
    },
    {
      userId: users.user.id,
      weight: 68.2,
      height: 165,
      dateOfBirth: '1992-03-22',
      gender: 'male',
      activityLevel: 'lightly_active',
      fitnessGoal: 'lose_weight'
    },
    {
      userId: users.trainer.id,
      weight: 62.8,
      height: 170,
      dateOfBirth: '1988-11-08',
      gender: 'female',
      activityLevel: 'very_active',
      fitnessGoal: 'build_muscle'
    }
  ];

  for (const profile of profiles) {
    await query(`
      INSERT INTO user_profiles (id, user_id, weight_kg, height_cm, date_of_birth, gender, activity_level, fitness_goal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [uuidv4(), profile.userId, profile.weight, profile.height, profile.dateOfBirth, profile.gender, profile.activityLevel, profile.fitnessGoal]);
  }
}

/**
 * Create sample exercises
 */
async function createExercises(adminId) {
  console.log('💪 Creating exercises...');

  const exercises = [
    {
      name: 'Push-ups',
      description: 'Classic upper body exercise targeting chest, shoulders, and triceps',
      category: 'strength',
      duration: 10,
      caloriesPerMinute: 8.5,
      difficulty: 'intermediate',
      metValue: 3.8,
      equipment: 'None',
      muscleGroups: JSON.stringify(['chest', 'shoulders', 'triceps', 'core']),
      instructions: '1. Start in plank position\n2. Lower body until chest nearly touches floor\n3. Push back up to starting position'
    },
    {
      name: 'Squats',
      description: 'Fundamental lower body exercise for legs and glutes',
      category: 'strength',
      duration: 15,
      caloriesPerMinute: 6.0,
      difficulty: 'beginner',
      metValue: 5.0,
      equipment: 'None',
      muscleGroups: JSON.stringify(['quadriceps', 'glutes', 'hamstrings', 'calves']),
      instructions: '1. Stand with feet shoulder-width apart\n2. Lower body as if sitting back into chair\n3. Return to standing position'
    },
    {
      name: 'Running',
      description: 'Cardiovascular exercise for endurance and calorie burning',
      category: 'cardio',
      duration: 30,
      caloriesPerMinute: 12.0,
      difficulty: 'intermediate',
      metValue: 8.0,
      equipment: 'Running shoes',
      muscleGroups: JSON.stringify(['legs', 'core', 'cardiovascular']),
      instructions: '1. Start with warm-up walk\n2. Gradually increase pace\n3. Maintain steady rhythm\n4. Cool down with walking'
    }
  ];

  const exerciseIds = [];
  for (const exercise of exercises) {
    const id = uuidv4();
    await query(`
      INSERT INTO exercises (id, name, description, category, duration_minutes, calories_per_minute, difficulty, met_value, equipment_needed, muscle_groups, instructions, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, exercise.name, exercise.description, exercise.category, exercise.duration, exercise.caloriesPerMinute, exercise.difficulty, exercise.metValue, exercise.equipment, exercise.muscleGroups, exercise.instructions, adminId]);

    exerciseIds.push({ id, name: exercise.name });
  }

  return exerciseIds;
}

/**
 * Create sample workout plans
 */
async function createWorkoutPlans(adminId) {
  console.log('📋 Creating workout plans...');

  const workoutPlans = [
    {
      name: 'Beginner Full Body',
      description: 'Perfect starter workout for beginners covering all major muscle groups',
      category: 'general_fitness',
      difficulty: 'beginner',
      estimatedDuration: 45,
      targetCalories: 300
    },
    {
      name: 'Weight Loss Circuit',
      description: 'High-intensity circuit training designed for maximum calorie burn',
      category: 'weight_loss',
      difficulty: 'intermediate',
      estimatedDuration: 35,
      targetCalories: 450
    },
    {
      name: 'Strength Builder',
      description: 'Progressive strength training for muscle development',
      category: 'muscle_gain',
      difficulty: 'advanced',
      estimatedDuration: 60,
      targetCalories: 400
    }
  ];

  const planIds = [];
  for (const plan of workoutPlans) {
    const id = uuidv4();
    await query(`
      INSERT INTO workout_plans (id, name, description, category, difficulty, estimated_duration_minutes, target_calories, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, plan.name, plan.description, plan.category, plan.difficulty, plan.estimatedDuration, plan.targetCalories, adminId]);

    planIds.push({ id, name: plan.name });
  }

  return planIds;
}

/**
 * Link exercises to workout plans
 */
async function linkExercisesToWorkoutPlans(workoutPlans, exercises) {
  console.log('🔗 Linking exercises to workout plans...');

  // Find specific exercises and plans
  const pushups = exercises.find(e => e.name === 'Push-ups');
  const squats = exercises.find(e => e.name === 'Squats');
  const running = exercises.find(e => e.name === 'Running');

  const beginnerPlan = workoutPlans.find(p => p.name === 'Beginner Full Body');
  const weightLossPlan = workoutPlans.find(p => p.name === 'Weight Loss Circuit');
  const strengthPlan = workoutPlans.find(p => p.name === 'Strength Builder');

  const links = [
    // Beginner Full Body Plan
    { planId: beginnerPlan.id, exerciseId: squats.id, order: 1, sets: 3, reps: 12, rest: 60 },
    { planId: beginnerPlan.id, exerciseId: pushups.id, order: 2, sets: 3, reps: 8, rest: 60 },

    // Weight Loss Circuit Plan
    { planId: weightLossPlan.id, exerciseId: running.id, order: 1, duration: 20, rest: 120 },
    { planId: weightLossPlan.id, exerciseId: squats.id, order: 2, sets: 4, reps: 15, rest: 45 },
    { planId: weightLossPlan.id, exerciseId: pushups.id, order: 3, sets: 3, reps: 12, rest: 45 },

    // Strength Builder Plan
    { planId: strengthPlan.id, exerciseId: squats.id, order: 1, sets: 5, reps: 8, rest: 90 },
    { planId: strengthPlan.id, exerciseId: pushups.id, order: 2, sets: 4, reps: 10, rest: 90 }
  ];

  for (const link of links) {
    await query(`
      INSERT INTO workout_plan_exercises (id, workout_plan_id, exercise_id, exercise_order, sets, reps, duration_minutes, rest_seconds)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [uuidv4(), link.planId, link.exerciseId, link.order, link.sets || null, link.reps || null, link.duration || null, link.rest]);
  }
}

/**
 * Create sample weight history
 */
async function createWeightHistory(users) {
  console.log('⚖️ Creating weight history...');

  const today = new Date();
  const weights = [
    { userId: users.user.id, weight: 70.0, daysAgo: 30 },
    { userId: users.user.id, weight: 69.5, daysAgo: 23 },
    { userId: users.user.id, weight: 69.0, daysAgo: 16 },
    { userId: users.user.id, weight: 68.8, daysAgo: 9 },
    { userId: users.user.id, weight: 68.2, daysAgo: 2 }
  ];

  for (const weight of weights) {
    const recordDate = new Date(today);
    recordDate.setDate(recordDate.getDate() - weight.daysAgo);

    await query(`
      INSERT INTO weight_history (id, user_id, weight_kg, recorded_date)
      VALUES (?, ?, ?, ?)
    `, [uuidv4(), weight.userId, weight.weight, recordDate.toISOString().split('T')[0]]);
  }
}

/**
 * Create sample exercise logs
 */
async function createExerciseLogs(users, exercises, workoutPlans) {
  console.log('📝 Creating exercise logs...');

  const today = new Date();
  const logs = [
    {
      userId: users.user.id,
      exerciseId: exercises.find(e => e.name === 'Running').id,
      workoutPlanId: workoutPlans.find(p => p.name === 'Weight Loss Circuit').id,
      daysAgo: 1,
      duration: 25,
      calories: 300,
      distance: 3.2
    },
    {
      userId: users.user.id,
      exerciseId: exercises.find(e => e.name === 'Squats').id,
      workoutPlanId: workoutPlans.find(p => p.name === 'Beginner Full Body').id,
      daysAgo: 2,
      duration: 15,
      calories: 90,
      sets: 3,
      reps: 12
    }
  ];

  for (const log of logs) {
    const sessionDate = new Date(today);
    sessionDate.setDate(sessionDate.getDate() - log.daysAgo);

    await query(`
      INSERT INTO user_exercise_logs (id, user_id, exercise_id, workout_plan_id, session_date, duration_minutes, calories_burned, sets_completed, reps_completed, distance_km)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [uuidv4(), log.userId, log.exerciseId, log.workoutPlanId, sessionDate.toISOString().split('T')[0], log.duration, log.calories, log.sets || null, log.reps || null, log.distance || null]);
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
