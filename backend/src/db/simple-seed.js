/**
 * Simple JavaScript-based seeder for exercises and workout plans
 * This bypasses the SQL parsing issues and directly inserts data
 */

import { query } from './database.js';

/**
 * Seed exercises data
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
      id: '850e8400-e29b-41d4-a716-446655440003',
      name: 'Cycling',
      description: 'Low-impact cardio exercise using a bicycle or stationary bike',
      category: 'cardio',
      difficulty: 'intermediate',
      duration_minutes: 45,
      calories_per_minute: 7.0,
      met_value: 6.8,
      muscle_groups: 'legs,core',
      equipment_needed: 'bicycle',
      instructions: 'Maintain steady pace with proper posture',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440004',
      name: 'Burpees',
      description: 'High-intensity full-body exercise combining squat, plank, and jump',
      category: 'cardio',
      difficulty: 'hard',
      duration_minutes: 15,
      calories_per_minute: 12.0,
      met_value: 8.0,
      muscle_groups: 'full_body',
      equipment_needed: 'none',
      instructions: 'Squat down, jump back to plank, do push-up, jump forward, jump up',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440005',
      name: 'Mountain Climbers',
      description: 'Dynamic cardio exercise in plank position',
      category: 'cardio',
      difficulty: 'medium',
      duration_minutes: 10,
      calories_per_minute: 9.0,
      met_value: 8.0,
      muscle_groups: 'core,legs',
      equipment_needed: 'none',
      instructions: 'In plank position, alternate bringing knees to chest rapidly',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440006',
      name: 'Push-ups',
      description: 'Upper body strength exercise targeting chest, shoulders, and triceps',
      category: 'strength',
      difficulty: 'medium',
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
      difficulty: 'easy',
      duration_minutes: 15,
      calories_per_minute: 4.0,
      met_value: 5.0,
      muscle_groups: 'legs,glutes',
      equipment_needed: 'none',
      instructions: 'Lower hips back and down, keep chest up, return to standing',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440008',
      name: 'Deadlifts',
      description: 'Compound strength exercise targeting posterior chain',
      category: 'strength',
      difficulty: 'hard',
      duration_minutes: 20,
      calories_per_minute: 6.0,
      met_value: 6.0,
      muscle_groups: 'back,legs,glutes',
      equipment_needed: 'barbell',
      instructions: 'Lift weight from ground to hip level with straight back',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440009',
      name: 'Pull-ups',
      description: 'Upper body strength exercise targeting back and biceps',
      category: 'strength',
      difficulty: 'hard',
      duration_minutes: 10,
      calories_per_minute: 7.0,
      met_value: 8.0,
      muscle_groups: 'back,biceps',
      equipment_needed: 'pull_up_bar',
      instructions: 'Hang from bar, pull body up until chin clears bar',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440010',
      name: 'Lunges',
      description: 'Lower body strength exercise with single-leg focus',
      category: 'strength',
      difficulty: 'medium',
      duration_minutes: 15,
      calories_per_minute: 5.0,
      met_value: 4.0,
      muscle_groups: 'legs,glutes',
      equipment_needed: 'none',
      instructions: 'Step forward, lower back knee, return to standing',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440011',
      name: 'Plank',
      description: 'Core strengthening exercise in static hold position',
      category: 'strength',
      difficulty: 'medium',
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
      difficulty: 'easy',
      duration_minutes: 30,
      calories_per_minute: 2.5,
      met_value: 2.5,
      muscle_groups: 'full_body',
      equipment_needed: 'yoga_mat',
      instructions: 'Flow through poses focusing on breath and flexibility',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440013',
      name: 'Stretching',
      description: 'Static stretching routine for flexibility and recovery',
      category: 'flexibility',
      difficulty: 'easy',
      duration_minutes: 15,
      calories_per_minute: 1.5,
      met_value: 2.3,
      muscle_groups: 'full_body',
      equipment_needed: 'none',
      instructions: 'Hold each stretch for 30 seconds, breathe deeply',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440014',
      name: 'Pilates',
      description: 'Core-focused exercise system emphasizing control and precision',
      category: 'flexibility',
      difficulty: 'medium',
      duration_minutes: 45,
      calories_per_minute: 3.0,
      met_value: 3.0,
      muscle_groups: 'core,full_body',
      equipment_needed: 'mat',
      instructions: 'Focus on controlled movements and core engagement',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440015',
      name: 'Single Leg Stand',
      description: 'Balance exercise to improve stability and proprioception',
      category: 'balance',
      difficulty: 'easy',
      duration_minutes: 10,
      calories_per_minute: 2.0,
      met_value: 2.5,
      muscle_groups: 'legs,core',
      equipment_needed: 'none',
      instructions: 'Stand on one leg, maintain balance for 30 seconds',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440016',
      name: 'Balance Board',
      description: 'Dynamic balance training using unstable surface',
      category: 'balance',
      difficulty: 'medium',
      duration_minutes: 15,
      calories_per_minute: 3.0,
      met_value: 3.0,
      muscle_groups: 'legs,core',
      equipment_needed: 'balance_board',
      instructions: 'Stand on board, maintain balance while performing movements',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440017',
      name: 'Tai Chi',
      description: 'Gentle martial art focusing on balance and mindful movement',
      category: 'balance',
      difficulty: 'easy',
      duration_minutes: 30,
      calories_per_minute: 2.0,
      met_value: 2.3,
      muscle_groups: 'full_body',
      equipment_needed: 'none',
      instructions: 'Perform slow, flowing movements with focus on balance',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440018',
      name: 'Basketball',
      description: 'Team sport combining cardio, agility, and coordination',
      category: 'sports',
      difficulty: 'medium',
      duration_minutes: 60,
      calories_per_minute: 8.0,
      met_value: 6.5,
      muscle_groups: 'full_body',
      equipment_needed: 'basketball',
      instructions: 'Play basketball focusing on movement and skill development',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440019',
      name: 'Tennis',
      description: 'Racquet sport requiring agility, coordination, and endurance',
      category: 'sports',
      difficulty: 'medium',
      duration_minutes: 60,
      calories_per_minute: 7.0,
      met_value: 7.3,
      muscle_groups: 'full_body',
      equipment_needed: 'tennis_racquet',
      instructions: 'Play tennis focusing on technique and movement',
      created_by: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: '850e8400-e29b-41d4-a716-446655440020',
      name: 'Swimming',
      description: 'Full-body low-impact exercise in water',
      category: 'sports',
      difficulty: 'medium',
      duration_minutes: 45,
      calories_per_minute: 9.0,
      met_value: 7.0,
      muscle_groups: 'full_body',
      equipment_needed: 'pool',
      instructions: 'Swim laps using various strokes for full-body workout',
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
 * Seed workout plans data
 */
async function seedWorkoutPlans() {
  console.log('📋 Seeding workout plans...');

  const workoutPlans = [
    {
      id: '950e8400-e29b-41d4-a716-446655440001',
      name: 'Beginner Full Body',
      description: 'Perfect starter workout targeting all major muscle groups',
      category: 'strength',
      difficulty: 'easy',
      duration_minutes: 30,
      estimated_calories: 150,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      exercises: [
        { exercise_id: '850e8400-e29b-41d4-a716-446655440006', order_num: 1, sets: 3, reps: 10, duration_seconds: null },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440007', order_num: 2, sets: 3, reps: 15, duration_seconds: null },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440011', order_num: 3, sets: 3, reps: null, duration_seconds: 30 }
      ]
    },
    {
      id: '950e8400-e29b-41d4-a716-446655440002',
      name: 'HIIT Cardio Blast',
      description: 'High-intensity interval training for maximum calorie burn',
      category: 'cardio',
      difficulty: 'hard',
      duration_minutes: 20,
      estimated_calories: 300,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      exercises: [
        { exercise_id: '850e8400-e29b-41d4-a716-446655440004', order_num: 1, sets: 4, reps: 10, duration_seconds: null },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440005', order_num: 2, sets: 4, reps: null, duration_seconds: 30 },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440002', order_num: 3, sets: 4, reps: 20, duration_seconds: null }
      ]
    },
    {
      id: '950e8400-e29b-41d4-a716-446655440003',
      name: 'Strength Builder',
      description: 'Progressive strength training for muscle development',
      category: 'strength',
      difficulty: 'medium',
      duration_minutes: 45,
      estimated_calories: 250,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      exercises: [
        { exercise_id: '850e8400-e29b-41d4-a716-446655440008', order_num: 1, sets: 4, reps: 8, duration_seconds: null },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440009', order_num: 2, sets: 3, reps: 6, duration_seconds: null },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440006', order_num: 3, sets: 3, reps: 12, duration_seconds: null }
      ]
    },
    {
      id: '950e8400-e29b-41d4-a716-446655440004',
      name: 'Flexibility & Balance',
      description: 'Gentle routine focusing on flexibility and balance improvement',
      category: 'flexibility',
      difficulty: 'easy',
      duration_minutes: 35,
      estimated_calories: 100,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      exercises: [
        { exercise_id: '850e8400-e29b-41d4-a716-446655440012', order_num: 1, sets: 1, reps: null, duration_seconds: 1200 },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440017', order_num: 2, sets: 1, reps: null, duration_seconds: 900 },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440013', order_num: 3, sets: 1, reps: null, duration_seconds: 600 }
      ]
    },
    {
      id: '950e8400-e29b-41d4-a716-446655440005',
      name: 'Endurance Challenge',
      description: 'Cardiovascular endurance training for stamina building',
      category: 'cardio',
      difficulty: 'medium',
      duration_minutes: 50,
      estimated_calories: 400,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      exercises: [
        { exercise_id: '850e8400-e29b-41d4-a716-446655440001', order_num: 1, sets: 1, reps: null, duration_seconds: 1800 },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440003', order_num: 2, sets: 1, reps: null, duration_seconds: 1500 },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440013', order_num: 3, sets: 1, reps: null, duration_seconds: 600 }
      ]
    },
    {
      id: '950e8400-e29b-41d4-a716-446655440006',
      name: 'Core Power',
      description: 'Intensive core strengthening and stability workout',
      category: 'strength',
      difficulty: 'medium',
      duration_minutes: 25,
      estimated_calories: 180,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      exercises: [
        { exercise_id: '850e8400-e29b-41d4-a716-446655440011', order_num: 1, sets: 4, reps: null, duration_seconds: 60 },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440005', order_num: 2, sets: 4, reps: null, duration_seconds: 45 },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440014', order_num: 3, sets: 1, reps: null, duration_seconds: 900 }
      ]
    },
    {
      id: '950e8400-e29b-41d4-a716-446655440007',
      name: 'Sports Performance',
      description: 'Athletic training combining multiple sports activities',
      category: 'sports',
      difficulty: 'medium',
      duration_minutes: 75,
      estimated_calories: 500,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      exercises: [
        { exercise_id: '850e8400-e29b-41d4-a716-446655440018', order_num: 1, sets: 1, reps: null, duration_seconds: 1800 },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440019', order_num: 2, sets: 1, reps: null, duration_seconds: 1800 },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440013', order_num: 3, sets: 1, reps: null, duration_seconds: 900 }
      ]
    },
    {
      id: '950e8400-e29b-41d4-a716-446655440008',
      name: 'Morning Routine',
      description: 'Quick energizing workout to start your day',
      category: 'flexibility',
      difficulty: 'easy',
      duration_minutes: 15,
      estimated_calories: 80,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      exercises: [
        { exercise_id: '850e8400-e29b-41d4-a716-446655440002', order_num: 1, sets: 2, reps: 15, duration_seconds: null },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440013', order_num: 2, sets: 1, reps: null, duration_seconds: 600 },
        { exercise_id: '850e8400-e29b-41d4-a716-446655440015', order_num: 3, sets: 2, reps: null, duration_seconds: 30 }
      ]
    }
  ];

  for (const plan of workoutPlans) {
    try {
      // Insert workout plan
      await query(`
        INSERT INTO workout_plans (
          id, name, description, category, difficulty, duration_minutes,
          estimated_calories, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE name = name
      `, [
        plan.id, plan.name, plan.description, plan.category,
        plan.difficulty, plan.duration_minutes, plan.estimated_calories,
        plan.created_by
      ]);

      // Insert workout plan exercises
      for (const exercise of plan.exercises) {
        await query(`
          INSERT INTO workout_plan_exercises (
            id, workout_plan_id, exercise_id, order_num, sets, reps,
            duration_seconds, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          ON DUPLICATE KEY UPDATE order_num = order_num
        `, [
          `${plan.id}-${exercise.order_num}`,
          plan.id,
          exercise.exercise_id,
          exercise.order_num,
          exercise.sets,
          exercise.reps,
          exercise.duration_seconds
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
async function runSimpleSeed() {
  try {
    console.log('🚀 Starting simple JavaScript-based seeding...');

    await seedExercises();
    await seedWorkoutPlans();

    console.log('✅ Simple seeding completed successfully!');
    console.log('\n🎯 SEEDED DATA SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💪 EXERCISES (20 total):');
    console.log('   🏃 Cardio: Running, Cycling, Swimming, HIIT, etc.');
    console.log('   💪 Strength: Push-ups, Squats, Deadlifts, Pull-ups, etc.');
    console.log('   🧘 Flexibility: Yoga, Pilates, Stretching, etc.');
    console.log('   ⚖️ Balance: Tai Chi, Balance Board, Single Leg Stand');
    console.log('   🏀 Sports: Basketball, Tennis, Swimming');
    console.log('\n📋 WORKOUT PLANS (8 total):');
    console.log('   🔰 Beginner Full Body, Quick Morning Routine');
    console.log('   🔥 HIIT Cardio Blast, Endurance Challenge');
    console.log('   💪 Strength Builder, Core Power');
    console.log('   🧘 Flexibility & Balance, Sports Performance');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Simple seeding failed:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSimpleSeed()
    .then(() => {
      console.log('🎉 Simple seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Simple seeding failed:', error);
      process.exit(1);
    });
}

export { seedExercises, seedWorkoutPlans, runSimpleSeed };
