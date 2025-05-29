const express = require('express');
const { getProfile, updateProfile, updatePassword } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { profileValidation } = require('../validations/user.validation');

const router = express.Router();

// Get user profile route
router.get('/profile', protect, getProfile);

// Update user profile route
router.put('/profile', protect, profileValidation, validate, updateProfile);

// Update user password route
router.put('/password', protect, updatePassword);

module.exports = router;
