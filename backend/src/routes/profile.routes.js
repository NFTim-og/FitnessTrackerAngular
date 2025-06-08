import express from 'express';
import * as profileController from '../controllers/profile.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);

export default router;
