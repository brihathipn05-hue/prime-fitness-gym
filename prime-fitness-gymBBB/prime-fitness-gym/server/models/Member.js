const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
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
    membershipPlan: {
      type: String,
      enum: ['Standard', 'Premium', 'VIP'],
      default: 'Standard',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    durationMonths: {
      type: Number,
      default: 1,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Cancelled'],
      default: 'Active',
    },
    photoUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual property to dynamically check if membership is actually active
memberSchema.virtual('isCurrentlyActive').get(function () {
  if (this.status !== 'Active') return false;
  const now = new Date();
  return this.endDate >= now;
});

module.exports = mongoose.model('Member', memberSchema);
