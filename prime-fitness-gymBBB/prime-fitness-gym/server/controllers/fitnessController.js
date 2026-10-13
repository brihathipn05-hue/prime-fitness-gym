const asyncHandler = require('express-async-handler');
const Profile = require('../models/Profile');
const Workout = require('../models/Workout');
const Diet = require('../models/Diet');

// Helper to determine BMI Category & Recommended Goal
const getBMICategoryAndGoal = (bmi) => {
  if (bmi < 18.5) {
    return { category: 'Underweight', recommendedGoal: 'Weight Gain' };
  } else if (bmi >= 18.5 && bmi < 25.0) {
    return { category: 'Normal', recommendedGoal: 'Fitness' };
  } else if (bmi >= 25.0 && bmi < 30.0) {
    return { category: 'Overweight', recommendedGoal: 'Weight Loss' };
  } else {
    return { category: 'Obese', recommendedGoal: 'Weight Loss' };
  }
};

// @desc    Calculate BMI and optionally confirm/save fitness goal
// @route   POST /api/bmi
// @access  Private
const calculateBMI = asyncHandler(async (req, res) => {
  const { height, weight, confirmGoal } = req.body;

  if (!height || !weight || Number(height) <= 0 || Number(weight) <= 0) {
    res.status(400);
    throw new Error('Please provide valid positive values for height (cm) and weight (kg)');
  }

  const heightInMeters = Number(height) / 100;
  const rawBmi = Number(weight) / (heightInMeters * heightInMeters);
  const bmi = Math.round(rawBmi * 100) / 100; // 2 decimal places

  const { category, recommendedGoal } = getBMICategoryAndGoal(bmi);
  const selectedGoal = confirmGoal || recommendedGoal;

  let profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    profile = new Profile({ user: req.user._id });
  }

  // Update profile with calculated metrics
  profile.height = Number(height);
  profile.weight = Number(weight);
  profile.bmi = bmi;
  profile.fitnessGoal = selectedGoal;
  await profile.save();

  res.status(200).json({
    success: true,
    bmi,
    category,
    recommendedGoal,
    confirmedGoal: selectedGoal,
    message: `BMI calculated: ${bmi} (${category}). Fitness goal set to ${selectedGoal}.`,
  });
});

// @desc    Get personalized 7-day workout plan matching member's confirmed goal
// @route   GET /api/workouts
// @access  Private
const getWorkoutPlan = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile || !profile.fitnessGoal || profile.fitnessGoal === 'Not Set') {
    res.status(400);
    throw new Error('Please calculate and confirm your BMI fitness goal first to receive a personalized workout plan');
  }

  const workoutPlan = await Workout.findOne({ fitnessGoal: profile.fitnessGoal });

  if (!workoutPlan) {
    res.status(404);
    throw new Error(`Workout plan for goal '${profile.fitnessGoal}' is currently being updated`);
  }

  res.status(200).json({
    success: true,
    fitnessGoal: profile.fitnessGoal,
    workoutPlan,
  });
});

// @desc    Get personalized diet plan matching member's confirmed goal
// @route   GET /api/diet
// @access  Private
const getDietPlan = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile || !profile.fitnessGoal || profile.fitnessGoal === 'Not Set') {
    res.status(400);
    throw new Error('Please calculate and confirm your BMI fitness goal first to receive a personalized diet plan');
  }

  const dietPlan = await Diet.findOne({ fitnessGoal: profile.fitnessGoal });

  if (!dietPlan) {
    res.status(404);
    throw new Error(`Diet plan for goal '${profile.fitnessGoal}' is currently being updated`);
  }

  res.status(200).json({
    success: true,
    fitnessGoal: profile.fitnessGoal,
    dietPlan,
    disclaimer: 'General sample wellness nutrition plan. Consult a certified nutritionist or physician before starting any diet program.',
  });
});

module.exports = {
  calculateBMI,
  getWorkoutPlan,
  getDietPlan,
};
