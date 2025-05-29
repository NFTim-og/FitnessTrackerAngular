/**
 * Profile Controller
 * Handles all business logic for user profile operations
 */

const Profile = require('../models/profile.model'); // Import Profile model

/**
 * Get current user's profile
 * Requires authentication
 *
 * @route GET /api/v1/profile
 * @param {Object} req - Express request object
 * @param {Object} req.user - User object from auth middleware
 * @param {string} req.user.id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with profile data or error
 */
exports.getProfile = async (req, res) => {
  try {
    // Find profile by user ID from auth token
    const profile = await Profile.findByUserId(req.user.id);

    // Return 404 if profile not found
    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found'
      });
    }

    // Return successful response with profile data
    return res.status(200).json({
      status: 'success',
      data: {
        profile
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Get profile error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

/**
 * Update current user's profile
 * Requires authentication
 *
 * @route PUT /api/v1/profile
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {number} [req.body.weight_kg] - User weight in kilograms
 * @param {number} [req.body.height_cm] - User height in centimeters
 * @param {Object} req.user - User object from auth middleware
 * @param {string} req.user.id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated profile data or error
 */
exports.updateProfile = async (req, res) => {
  try {
    // Extract profile data from request body
    const { weight_kg, height_cm } = req.body;

    // Validate weight if provided (must be between 30 and 300 kg)
    if (weight_kg !== undefined && (weight_kg < 30 || weight_kg > 300)) {
      return res.status(400).json({
        status: 'error',
        message: 'Weight must be between 30 and 300 kg'
      });
    }

    // Validate height if provided (must be between 100 and 250 cm)
    if (height_cm !== undefined && (height_cm < 100 || height_cm > 250)) {
      return res.status(400).json({
        status: 'error',
        message: 'Height must be between 100 and 250 cm'
      });
    }

    // Update profile in database
    const profile = await Profile.update(req.user.id, {
      weight_kg,
      height_cm
    });

    // Return successful response with updated profile
    return res.status(200).json({
      status: 'success',
      data: {
        profile
      }
    });
  } catch (error) {
    // Log and handle errors
    console.error('Update profile error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};
