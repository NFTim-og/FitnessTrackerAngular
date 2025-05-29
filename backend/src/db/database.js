/**
 * Database connection module
 * Handles MySQL database connection and query execution
 * UF3/UF4 Curriculum Project - ES Modules with enhanced features
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Create a MySQL connection pool with enhanced configuration
 * - Uses environment variables for connection details with fallbacks
 * - Connection pooling improves performance by reusing connections
 * - Auto-reconnection and connection health monitoring
 * - SQL injection protection through parameterized queries
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'fitness_user',
  password: process.env.DB_PASSWORD || 'fitness_password',
  database: process.env.DB_NAME || 'fitness_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  timezone: '+00:00',
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: false,
  debug: process.env.NODE_ENV === 'development' ? ['ComQueryPacket'] : false
});

/**
 * Test database connection
 * Used during server startup to verify database connectivity
 * @returns {Promise<boolean>} True if connection successful, false otherwise
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection(); // Get connection from pool
    console.log('Database connection established successfully');
    connection.release(); // Return connection to the pool
    return true; // Connection successful
  } catch (error) {
    console.error('Error connecting to database:', error);
    return false; // Connection failed
  }
}

/**
 * Execute a SQL query with parameterized values
 * @param {string} sql - SQL query string with placeholders
 * @param {Array} params - Array of parameter values to replace placeholders
 * @returns {Promise<Array>} Query results
 * @throws {Error} If query execution fails
 */
async function query(sql, params) {
  try {
    // Execute query with parameter binding (prevents SQL injection)
    const [results] = await pool.execute(sql, params);
    return results; // Return query results
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; // Rethrow error for handling by caller
  }
}

/**
 * Execute a transaction with multiple queries
 * @param {Function} callback - Function containing transaction logic
 * @returns {Promise<any>} Transaction result
 */
async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Get database statistics
 * @returns {Promise<Object>} Database statistics
 */
async function getStats() {
  try {
    const [stats] = await pool.execute('SHOW STATUS LIKE "Threads_connected"');
    const [processlist] = await pool.execute('SHOW PROCESSLIST');

    return {
      activeConnections: stats[0]?.Value || 0,
      totalProcesses: processlist.length,
      poolConfig: {
        connectionLimit: pool.config.connectionLimit,
        queueLimit: pool.config.queueLimit
      }
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
}

// Export database functions and pool for use in other modules
export {
  pool,
  query,
  testConnection,
  transaction,
  getStats
};
