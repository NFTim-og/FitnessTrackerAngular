import { query } from './src/db/database.js';

async function checkExercises() {
  try {
    console.log('🔍 Checking exercises in database...');
    
    // Get total count
    const totalCount = await query('SELECT COUNT(*) as count FROM exercises');
    console.log(`📈 Total exercises in database: ${totalCount[0].count}`);
    
    if (totalCount[0].count > 0) {
      // Get sample exercises
      const exercises = await query('SELECT id, name, category, muscle_groups, created_by FROM exercises LIMIT 10');
      console.log(`\n📊 Sample exercises:`);
      exercises.forEach(ex => {
        console.log(`   - ${ex.name} (${ex.category}) - Muscles: ${ex.muscle_groups} - Created by: ${ex.created_by}`);
      });
    } else {
      console.log('❌ No exercises found in database!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkExercises();
