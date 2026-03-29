const express = require('express');
const router = express.Router();
const muscleController = require('../controllers/muscleController');
const authenticateToken = require('../utils/authMiddleware');

// Защитен с JWT — само логнат потребител може да seed-ва (production: добави admin проверка)
router.get('/muscles/seed', authenticateToken, muscleController.seedDatabase);
router.get('/muscles/:key', muscleController.getMuscleByKey);

module.exports = router;