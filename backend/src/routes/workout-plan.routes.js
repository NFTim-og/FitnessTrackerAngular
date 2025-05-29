const express = require('express');
const workoutPlanController = require('../controllers/workout-plan.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', workoutPlanController.getAllWorkoutPlans);
router.get('/:id', workoutPlanController.getWorkoutPlan);

// Protected routes
router.use(authMiddleware.protect);
router.post('/', workoutPlanController.createWorkoutPlan);
router.put('/:id', workoutPlanController.updateWorkoutPlan);
router.delete('/:id', workoutPlanController.deleteWorkoutPlan);

module.exports = router;
