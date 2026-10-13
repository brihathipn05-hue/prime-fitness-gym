const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  setsReps: { type: String, required: true },
  rest: { type: String, default: '60 secs' },
});

const dayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  title: { type: String, required: true },
  exercises: [exerciseSchema],
  guidance: { type: String, default: '' },
});

const workoutSchema = new mongoose.Schema(
  {
    fitnessGoal: {
      type: String,
      enum: ['Weight Loss', 'Weight Gain', 'Fitness'],
      required: true,
      unique: true,
    },
    schedule: [dayScheduleSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Workout', workoutSchema);
