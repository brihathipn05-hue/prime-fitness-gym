const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Breakfast, Lunch, Snacks, Dinner
  timing: { type: String, required: true },
  items: [{ type: String, required: true }],
  calories: { type: Number, required: true },
  protein: { type: String, required: true },
  vegAlternative: { type: String, default: '' },
});

const dietSchema = new mongoose.Schema(
  {
    fitnessGoal: {
      type: String,
      enum: ['Weight Loss', 'Weight Gain', 'Fitness'],
      required: true,
      unique: true,
    },
    calorieTarget: { type: Number, required: true },
    proteinTarget: { type: String, required: true },
    waterTarget: { type: String, required: true },
    meals: [mealSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Diet', dietSchema);
