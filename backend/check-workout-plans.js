import { query } from './src/db/database.js';

async function checkWorkoutPlans() {
  try {
    console.log('🔍 Checking workout plans in database...\n');
    
    const plans = await query('SELECT id, name, description, created_by FROM workout_plans LIMIT 10');
    console.log(`📋 Workout Plans in database: ${plans.length}`);
    plans.forEach(plan => {
      console.log(`- ${plan.name} (ID: ${plan.id}, Created by: ${plan.created_by})`);
    });
    
    const exercises = await query('SELECT COUNT(*) as count FROM workout_plan_exercises');
    console.log(`\n🔗 Workout plan exercises relationships: ${exercises[0].count}`);
    
    const users = await query('SELECT id, email, role FROM users WHERE role = "admin"');
    console.log(`\n👥 Admin users: ${users.length}`);
    users.forEach(user => {
      console.log(`- ${user.email} (ID: ${user.id})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkWorkoutPlans();
