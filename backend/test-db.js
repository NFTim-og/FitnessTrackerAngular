import { query } from './src/db/database.js';

async function testDatabase() {
  try {
    console.log('🔍 Testing database content...');
    
    // Check exercises
    const exercises = await query('SELECT COUNT(*) as count FROM exercises');
    console.log(`📊 Exercises count: ${exercises[0].count}`);
    
    if (exercises[0].count > 0) {
      const sampleExercises = await query('SELECT id, name, category, difficulty FROM exercises LIMIT 5');
      console.log('📋 Sample exercises:');
      sampleExercises.forEach(ex => {
        console.log(`   - ${ex.name} (${ex.category}, ${ex.difficulty})`);
      });
    }
    
    // Check workout plans
    const workoutPlans = await query('SELECT COUNT(*) as count FROM workout_plans');
    console.log(`📊 Workout plans count: ${workoutPlans[0].count}`);
    
    if (workoutPlans[0].count > 0) {
      const samplePlans = await query('SELECT id, name, category, difficulty FROM workout_plans LIMIT 5');
      console.log('📋 Sample workout plans:');
      samplePlans.forEach(plan => {
        console.log(`   - ${plan.name} (${plan.category}, ${plan.difficulty})`);
      });
    }
    
    // Check users
    const users = await query('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Users count: ${users[0].count}`);
    
    if (users[0].count > 0) {
      const sampleUsers = await query('SELECT id, email, role FROM users LIMIT 5');
      console.log('👥 Sample users:');
      sampleUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`);
      });
    }
    
    console.log('✅ Database test completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
