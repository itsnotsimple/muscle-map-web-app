const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authenticateToken = require('../utils/authMiddleware');

router.post('/workout/generate', authenticateToken, workoutController.generatePlan);
router.post('/workout/save', authenticateToken, workoutController.savePlan);
router.get('/workout/plans', authenticateToken, workoutController.getPlans);
router.delete('/workout/:id', authenticateToken, workoutController.deletePlan);

module.exports = router;
