/**
 * Corrected JavaScript-based seeder with proper column names and values
 */

import { query } from './database.js';

/**
 * Seed exercises data with correct difficulty values
 */
async function seedExercises() {
  console.log('💪 Seeding exercises...');
  
  const exercises = [
    {
      id: '850e8400-e29b-41d4-a716-446655440001',
      name: 'Running',
      description: 'Cardiovascular exercise involving running at various intensities',
      category: 'cardio',
      difficulty: 'intermediate',
      duration_minutes: 30,
      calories_per_minute: 10.0,
      met_value: 8.0,
      muscle_groups: 'legs,core',
      equipment_needed: 'none',
      instructions: 'Start with a warm-up walk, then run at a comfortable pace',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440002',
      name: 'Jumping Jacks',
      description: 'Full-body cardio exercise with jumping and arm movements',
      category: 'cardio',
      difficulty: 'beginner',
      duration_minutes: 10,
      calories_per_minute: 8.0,
      met_value: 8.0,
      muscle_groups: 'full_body',
      equipment_needed: 'none',
      instructions: 'Jump while spreading legs and raising arms overhead',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440006',
      name: 'Push-ups',
      description: 'Upper body strength exercise targeting chest, shoulders, and triceps',
      category: 'strength',
      difficulty: 'intermediate',
      duration_minutes: 10,
      calories_per_minute: 5.0,
      met_value: 3.8,
      muscle_groups: 'chest,shoulders,triceps',
      equipment_needed: 'none',
      instructions: 'Lower body to ground, push back up maintaining straight line',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440007',
      name: 'Squats',
      description: 'Lower body strength exercise targeting quadriceps and glutes',
      category: 'strength',
      difficulty: 'beginner',
      duration_minutes: 15,
      calories_per_minute: 4.0,
      met_value: 5.0,
      muscle_groups: 'legs,glutes',
      equipment_needed: 'none',
      instructions: 'Lower hips back and down, keep chest up, return to standing',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440011',
      name: 'Plank',
      description: 'Core strengthening exercise in static hold position',
      category: 'strength',
      difficulty: 'intermediate',
      duration_minutes: 5,
      calories_per_minute: 3.0,
      met_value: 4.0,
      muscle_groups: 'core',
      equipment_needed: 'none',
      instructions: 'Hold straight line from head to heels in forearm position',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440012',
      name: 'Yoga Flow',
      description: 'Flexibility and mindfulness practice with flowing movements',
      category: 'flexibility',
      difficulty: 'beginner',
      duration_minutes: 30,
      calories_per_minute: 2.5,
      met_value: 2.5,
      muscle_groups: 'full_body',
      equipment_needed: 'yoga_mat',
      instructions: 'Flow through poses focusing on breath and flexibility',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    }
  ];

  for (const exercise of exercises) {
    try {
      await query(`
        INSERT INTO exercises (
          id, name, description, category, difficulty, duration_minutes,
          calories_per_minute, met_value, muscle_groups, equipment_needed,
          instructions, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE name = name
      `, [
        exercise.id, exercise.name, exercise.description, exercise.category,
        exercise.difficulty, exercise.duration_minutes, exercise.calories_per_minute,
        exercise.met_value, exercise.muscle_groups, exercise.equipment_needed,
        exercise.instructions, exercise.created_by
      ]);
    } catch (error) {
      if (!error.message.includes('Duplicate entry')) {
        console.error(`Error inserting exercise ${exercise.name}:`, error.message);
      }
    }
  }

  console.log(`✅ Seeded ${exercises.length} exercises`);
}

/**
 * Seed workout plans data with correct column names
 */
async function seedWorkoutPlans() {
  console.log('📋 Seeding workout plans...');
  
  const workoutPlans = [
    {
      id: '950e8400-e29b-41d4-a716-446655440001',
      name: 'Beginner Full Body',
      description: 'Perfect starter workout targeting all major muscle groups',
      category: 'strength',
      difficulty: 'beginner',
      estimated_duration_minutes: 30,
      target_calories: 150,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      exercises: [
        { exercise_id: '850e8400-e29b-41d4-a716-446655440006', exercise_order: 1, sets: 3, reps: 10, duration_minutes: null },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440007', exercise_order: 2, sets: 3, reps: 15, duration_minutes: null },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440011', exercise_order: 3, sets: 3, reps: null, duration_minutes: 1 }
      ]
    },
    {
      id: '950e8400-e29b-41d4-a716-446655440002',
      name: 'Morning Routine',
      description: 'Quick energizing workout to start your day',
      category: 'flexibility',
      difficulty: 'beginner',
      estimated_duration_minutes: 15,
      target_calories: 80,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      exercises: [
        { exercise_id: '850e8400-e29b-41d4-a716-446655440002', exercise_order: 1, sets: 2, reps: 15, duration_minutes: null },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440012', exercise_order: 2, sets: 1, reps: null, duration_minutes: 10 }
      ]
    }
  ];

  for (const plan of workoutPlans) {
    try {
      // Insert workout plan with correct column names
      await query(`
        INSERT INTO workout_plans (
          id, name, description, category, difficulty, estimated_duration_minutes,
          target_calories, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE name = name
      `, [
        plan.id, plan.name, plan.description, plan.category,
        plan.difficulty, plan.estimated_duration_minutes, plan.target_calories,
        plan.created_by
      ]);

      // Insert workout plan exercises with correct column names
      for (const exercise of plan.exercises) {
        await query(`
          INSERT INTO workout_plan_exercises (
            id, workout_plan_id, exercise_id, exercise_order, sets, reps,
            duration_minutes, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          ON DUPLICATE KEY UPDATE exercise_order = exercise_order
        `, [
          `${plan.id}-${exercise.exercise_order}`,
          plan.id,
          exercise.exercise_id,
          exercise.exercise_order,
          exercise.sets,
          exercise.reps,
          exercise.duration_minutes
        ]);
      }
    } catch (error) {
      if (!error.message.includes('Duplicate entry')) {
        console.error(`Error inserting workout plan ${plan.name}:`, error.message);
      }
    }
  }

  console.log(`✅ Seeded ${workoutPlans.length} workout plans`);
}

/**
 * Run complete seeding
 */
async function runCorrectedSeed() {
  try {
    console.log('🚀 Starting corrected JavaScript-based seeding...');
    
    await seedExercises();
    await seedWorkoutPlans();
    
    console.log('✅ Corrected seeding completed successfully!');
    console.log('\n🎯 SEEDED DATA SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💪 EXERCISES: 6 exercises with proper difficulty levels');
    console.log('📋 WORKOUT PLANS: 2 workout plans with exercises');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Corrected seeding failed:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCorrectedSeed()
    .then(() => {
      console.log('🎉 Corrected seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Corrected seeding failed:', error);
      process.exit(1);
    });
}

export { seedExercises, seedWorkoutPlans, runCorrectedSeed };
