const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true
};

// Initialize database
const initDatabase = async () => {
  try {
    // Create connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    await connection.query(schema);
    console.log('Database schema created successfully');

    // Read seed file
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf8');

      // Execute seed
      await connection.query(seed);
      console.log('Database seeded successfully');
    }

    // Close connection
    await connection.end();
    console.log('Connection closed');
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error.message);
    return false;
  }
};

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(success => {
      if (success) {
        console.log('Database initialization completed successfully');
        process.exit(0);
      } else {
        console.error('Database initialization failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;
