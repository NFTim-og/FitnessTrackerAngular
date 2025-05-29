const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const AppError = require('../utils/error.utils');

/**
 * Get user profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await userModel.getProfile(req.user.id);

    if (!profile) {
      return next(new AppError('Profile not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const profile = await userModel.updateProfile(req.user.id, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user password
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if current password is correct
    const user = await userModel.findUserById(req.user.id);
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordCorrect) {
      return next(new AppError('Current password is incorrect', 401));
    }

    // Update password
    await userModel.updatePassword(req.user.id, newPassword);

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
