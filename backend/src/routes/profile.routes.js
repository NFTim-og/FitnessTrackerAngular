const express = require('express');
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(authMiddleware.protect);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);

module.exports = router;
