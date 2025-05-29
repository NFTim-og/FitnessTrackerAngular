/**
 * User Model
 * Handles database operations and business logic for users
 */

const { query } = require('../db/database'); // Database query function
const { v4: uuidv4 } = require('uuid'); // UUID generator for unique IDs
const bcrypt = require('bcrypt'); // Password hashing library

/**
 * User class
 * Represents a user entity in the system
 */
class User {
  /**
   * Create a new User instance
   * @param {Object} data - User data
   * @param {string} [data.id] - User ID (generated if not provided)
   * @param {string} data.email - User email address
   * @param {string} data.password - User password (hashed)
   * @param {string} [data.role='user'] - User role (default: 'user')
   * @param {Date} [data.created_at] - Creation timestamp
   * @param {Date} [data.updated_at] - Last update timestamp
   */
  constructor(data) {
    this.id = data.id || uuidv4(); // Generate UUID if not provided
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'user'; // Default role is 'user'
    this.created_at = data.created_at || new Date(); // Default to current date
    this.updated_at = data.updated_at || new Date(); // Default to current date
  }

  /**
   * Find a user by ID
   * @param {string} id - User ID to find
   * @returns {Promise<User|null>} User object if found, null otherwise
   * @throws {Error} Database or server error
   */
  static async findById(id) {
    try {
      // Query database for user with matching ID
      const users = await query('SELECT * FROM users WHERE id = ?', [id]);
      // Return User object if found, null otherwise
      return users.length ? new User(users[0]) : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Find a user by email address
   * @param {string} email - Email address to find
   * @returns {Promise<User|null>} User object if found, null otherwise
   * @throws {Error} Database or server error
   */
  static async findByEmail(email) {
    try {
      // Query database for user with matching email
      const users = await query('SELECT * FROM users WHERE email = ?', [email]);
      // Return User object if found, null otherwise
      return users.length ? new User(users[0]) : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Create a new user in the database
   * @param {Object} userData - User data
   * @param {string} userData.email - User email address
   * @param {string} userData.password - User password (will be hashed)
   * @param {string} [userData.role] - User role
   * @returns {Promise<User>} Created user object
   * @throws {Error} Database or server error
   */
  static async create(userData) {
    try {
      // Generate salt and hash password for security
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new User instance with hashed password
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      // Insert user into database
      await query(
        'INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?)',
        [user.id, user.email, user.password, user.role]
      );

      // Return the created user object
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Compare a plain text password with the user's hashed password
   * @param {string} password - Plain text password to compare
   * @returns {Promise<boolean>} True if password matches, false otherwise
   * @throws {Error} If bcrypt comparison fails
   */
  async comparePassword(password) {
    try {
      // Use bcrypt to securely compare passwords without decrypting
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error('Error comparing password:', error);
      throw error; // Rethrow for controller to handle
    }
  }
}

module.exports = User;
