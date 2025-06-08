/**
 * Final corrected seeder with proper JSON format for muscle_groups
 */

import { query } from './database.js';

/**
 * Seed exercises with proper JSON format for muscle_groups
 */
async function seedExercises() {
  console.log('💪 Seeding exercises with proper JSON format...');
  
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
      muscle_groups: JSON.stringify(['legs', 'core']),
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
      muscle_groups: JSON.stringify(['full_body']),
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
      muscle_groups: JSON.stringify(['chest', 'shoulders', 'triceps']),
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
      muscle_groups: JSON.stringify(['legs', 'glutes']),
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
      muscle_groups: JSON.stringify(['core']),
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
      muscle_groups: JSON.stringify(['full_body']),
      equipment_needed: 'yoga_mat',
      instructions: 'Flow through poses focusing on breath and flexibility',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440003',
      name: 'Cycling',
      description: 'Low-impact cardio exercise using a bicycle or stationary bike',
      category: 'cardio',
      difficulty: 'intermediate',
      duration_minutes: 45,
      calories_per_minute: 7.0,
      met_value: 6.8,
      muscle_groups: JSON.stringify(['legs', 'core']),
      equipment_needed: 'bicycle',
      instructions: 'Maintain steady pace with proper posture',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440004',
      name: 'Burpees',
      description: 'High-intensity full-body exercise combining squat, plank, and jump',
      category: 'cardio',
      difficulty: 'advanced',
      duration_minutes: 15,
      calories_per_minute: 12.0,
      met_value: 8.0,
      muscle_groups: JSON.stringify(['full_body']),
      equipment_needed: 'none',
      instructions: 'Squat down, jump back to plank, do push-up, jump forward, jump up',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440008',
      name: 'Deadlifts',
      description: 'Compound strength exercise targeting posterior chain',
      category: 'strength',
      difficulty: 'advanced',
      duration_minutes: 20,
      calories_per_minute: 6.0,
      met_value: 6.0,
      muscle_groups: JSON.stringify(['back', 'legs', 'glutes']),
      equipment_needed: 'barbell',
      instructions: 'Lift weight from ground to hip level with straight back',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440013',
      name: 'Stretching',
      description: 'Static stretching routine for flexibility and recovery',
      category: 'flexibility',
      difficulty: 'beginner',
      duration_minutes: 15,
      calories_per_minute: 1.5,
      met_value: 2.3,
      muscle_groups: JSON.stringify(['full_body']),
      equipment_needed: 'none',
      instructions: 'Hold each stretch for 30 seconds, breathe deeply',
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

  console.log(`✅ Seeded ${exercises.length} exercises with proper JSON format`);
}

/**
 * Seed workout plan exercises with correct column names (no updated_at)
 */
async function seedWorkoutPlanExercises() {
  console.log('🔗 Seeding workout plan exercises...');
  
  const workoutPlanExercises = [
    // Beginner Full Body workout exercises
    {
      id: '950e8400-e29b-41d4-a716-446655440001-1',
      workout_plan_id: '950e8400-e29b-41d4-a716-446655440001',
      exercise_id: '850e8400-e29b-41d4-a716-446655440006', // Push-ups
      exercise_order: 1,
      sets: 3,
      reps: 10,
      duration_minutes: null
    },
    {
      id: '950e8400-e29b-41d4-a716-446655440001-2',
      workout_plan_id: '950e8400-e29b-41d4-a716-446655440001',
      exercise_id: '850e8400-e29b-41d4-a716-446655440007', // Squats
      exercise_order: 2,
      sets: 3,
      reps: 15,
      duration_minutes: null
    },
    {
      id: '950e8400-e29b-41d4-a716-446655440001-3',
      workout_plan_id: '950e8400-e29b-41d4-a716-446655440001',
      exercise_id: '850e8400-e29b-41d4-a716-446655440011', // Plank
      exercise_order: 3,
      sets: 3,
      reps: null,
      duration_minutes: 1
    },
    // Morning Routine workout exercises
    {
      id: '950e8400-e29b-41d4-a716-446655440002-1',
      workout_plan_id: '950e8400-e29b-41d4-a716-446655440002',
      exercise_id: '850e8400-e29b-41d4-a716-446655440002', // Jumping Jacks
      exercise_order: 1,
      sets: 2,
      reps: 15,
      duration_minutes: null
    },
    {
      id: '950e8400-e29b-41d4-a716-446655440002-2',
      workout_plan_id: '950e8400-e29b-41d4-a716-446655440002',
      exercise_id: '850e8400-e29b-41d4-a716-446655440012', // Yoga Flow
      exercise_order: 2,
      sets: 1,
      reps: null,
      duration_minutes: 10
    }
  ];

  for (const wpe of workoutPlanExercises) {
    try {
      await query(`
        INSERT INTO workout_plan_exercises (
          id, workout_plan_id, exercise_id, exercise_order, sets, reps, duration_minutes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE exercise_order = exercise_order
      `, [
        wpe.id, wpe.workout_plan_id, wpe.exercise_id, wpe.exercise_order,
        wpe.sets, wpe.reps, wpe.duration_minutes
      ]);
    } catch (error) {
      if (!error.message.includes('Duplicate entry')) {
        console.error(`Error inserting workout plan exercise:`, error.message);
      }
    }
  }

  console.log(`✅ Seeded ${workoutPlanExercises.length} workout plan exercises`);
}

/**
 * Run final complete seeding
 */
async function runFinalSeed() {
  try {
    console.log('🚀 Starting final corrected seeding...');
    
    await seedExercises();
    await seedWorkoutPlanExercises();
    
    console.log('✅ Final seeding completed successfully!');
    console.log('\n🎯 FINAL SEEDED DATA SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💪 EXERCISES: 10 exercises with proper JSON muscle groups');
    console.log('📋 WORKOUT PLANS: 2 workout plans');
    console.log('🔗 WORKOUT PLAN EXERCISES: 5 exercise assignments');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Final seeding failed:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFinalSeed()
    .then(() => {
      console.log('🎉 Final seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Final seeding failed:', error);
      process.exit(1);
    });
}

export { seedExercises, seedWorkoutPlanExercises, runFinalSeed };
