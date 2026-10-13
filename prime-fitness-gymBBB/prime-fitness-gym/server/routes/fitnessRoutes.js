const express = require('express');
const router = express.Router();
const { calculateBMI, getWorkoutPlan, getDietPlan } = require('../controllers/fitnessController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/bmi', calculateBMI);
router.get('/workouts', getWorkoutPlan);
router.get('/diet', getDietPlan);

module.exports = router;
