/**
 * Profile Model
 * Handles database operations for user profiles
 */

const { query } = require('../db/database'); // Database query function
const { v4: uuidv4 } = require('uuid'); // UUID generator for unique IDs

/**
 * Profile class
 * Represents a user profile entity in the system
 */
class Profile {
  /**
   * Create a new Profile instance
   * @param {Object} data - Profile data
   * @param {string} [data.id] - Profile ID (generated if not provided)
   * @param {string} data.user_id - User ID this profile belongs to
   * @param {number} [data.weight_kg] - User weight in kilograms
   * @param {number} [data.height_cm] - User height in centimeters
   * @param {number} [data.width_cm] - User width in centimeters
   * @param {Date} [data.created_at] - Creation timestamp
   * @param {Date} [data.updated_at] - Last update timestamp
   */
  constructor(data) {
    this.id = data.id || uuidv4(); // Generate UUID if not provided
    this.user_id = data.user_id;
    this.weight_kg = data.weight_kg || null; // Default to null if not provided
    this.height_cm = data.height_cm || null; // Default to null if not provided
    this.width_cm = data.width_cm || null; // Default to null if not provided
    this.created_at = data.created_at || new Date(); // Default to current date
    this.updated_at = data.updated_at || new Date(); // Default to current date
  }

  /**
   * Find a profile by user ID
   * @param {string} userId - User ID to find profile for
   * @returns {Promise<Profile|null>} Profile object if found, null otherwise
   * @throws {Error} Database or server error
   */
  static async findByUserId(userId) {
    try {
      // Query database for profile with matching user ID
      const profiles = await query('SELECT * FROM profiles WHERE user_id = ?', [userId]);
      // Return Profile object if found, null otherwise
      return profiles.length ? new Profile(profiles[0]) : null;
    } catch (error) {
      console.error('Error finding profile by user ID:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Create a new profile in the database
   * @param {Object} profileData - Profile data
   * @param {string} profileData.user_id - User ID this profile belongs to
   * @param {number} [profileData.weight_kg] - User weight in kilograms
   * @param {number} [profileData.height_cm] - User height in centimeters
   * @param {number} [profileData.width_cm] - User width in centimeters
   * @returns {Promise<Profile>} Created profile object
   * @throws {Error} Database or server error
   */
  static async create(profileData) {
    try {
      // Create new Profile instance with provided data
      const profile = new Profile(profileData);

      // Insert profile into database
      await query(
        'INSERT INTO profiles (id, user_id, weight_kg, height_cm, width_cm) VALUES (?, ?, ?, ?, ?)',
        [profile.id, profile.user_id, profile.weight_kg, profile.height_cm, profile.width_cm]
      );

      // Return the created profile object
      return profile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error; // Rethrow for controller to handle
    }
  }

  /**
   * Update an existing profile
   * @param {string} userId - User ID whose profile to update
   * @param {Object} profileData - New profile data
   * @param {number} [profileData.weight_kg] - User weight in kilograms
   * @param {number} [profileData.height_cm] - User height in centimeters
   * @param {number} [profileData.width_cm] - User width in centimeters
   * @returns {Promise<Profile>} Updated profile object
   * @throws {Error} If profile not found or database error
   */
  static async update(userId, profileData) {
    try {
      // Find the profile to update
      const profile = await Profile.findByUserId(userId);

      // Throw error if profile not found
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Update only the fields that are provided
      if (profileData.weight_kg !== undefined) profile.weight_kg = profileData.weight_kg;
      if (profileData.height_cm !== undefined) profile.height_cm = profileData.height_cm;
      if (profileData.width_cm !== undefined) profile.width_cm = profileData.width_cm;
      profile.updated_at = new Date(); // Update the timestamp

      // Update profile in database
      await query(
        'UPDATE profiles SET weight_kg = ?, height_cm = ?, width_cm = ?, updated_at = ? WHERE user_id = ?',
        [profile.weight_kg, profile.height_cm, profile.width_cm, profile.updated_at, userId]
      );

      // Return the updated profile
      return profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error; // Rethrow for controller to handle
    }
  }
}

module.exports = Profile;
