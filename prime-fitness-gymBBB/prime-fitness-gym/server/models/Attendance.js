const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Business date formatted as 'YYYY-MM-DD' in Asia/Kolkata timezone
    attendanceDate: {
      type: String,
      required: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    method: {
      type: String,
      enum: ['member-check-in', 'admin-manual'],
      default: 'member-check-in',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate attendance for the same member on the same gym business date
attendanceSchema.index({ member: 1, attendanceDate: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
