const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Not Specified'],
      default: 'Not Specified',
    },
    height: {
      type: Number, // in cm
      default: 0,
    },
    weight: {
      type: Number, // in kg
      default: 0,
    },
    bloodGroup: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    photoUrl: {
      type: String,
      default: '',
    },
    bmi: {
      type: Number,
      default: null,
    },
    fitnessGoal: {
      type: String,
      enum: ['Weight Loss', 'Weight Gain', 'Fitness', 'Not Set'],
      default: 'Not Set',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
