const asyncHandler = require('express-async-handler');
const Profile = require('../models/Profile');
const Member = require('../models/Member');
const User = require('../models/User');

// @desc    Get member profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne({ user: req.user._id });
  let member = await Member.findOne({ user: req.user._id });

  if (!profile) {
    profile = await Profile.create({ user: req.user._id });
  }

  res.status(200).json({
    success: true,
    user: req.user,
    member,
    profile,
  });
});

// @desc    Update member profile
// @route   POST /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    profile = new Profile({ user: req.user._id });
  }

  const { fullName, age, gender, height, weight, bloodGroup, phone } = req.body;

  if (age !== undefined) profile.age = Number(age);
  if (gender !== undefined) profile.gender = gender;
  if (height !== undefined) profile.height = Number(height);
  if (weight !== undefined) profile.weight = Number(weight);
  if (bloodGroup !== undefined) profile.bloodGroup = bloodGroup;
  if (phone !== undefined) profile.phone = phone;

  // Handle uploaded photo if file is present
  if (req.file) {
    // If Cloudinary URL was created by upload middleware or local path saved
    profile.photoUrl = req.file.path || `/uploads/${req.file.filename}`;
  } else if (req.body.photoUrl) {
    profile.photoUrl = req.body.photoUrl;
  }

  await profile.save();

  // Also update User name and Member details if member record exists
  if (fullName) {
    await User.findByIdAndUpdate(req.user._id, { name: fullName });
  }

  let member = await Member.findOne({ user: req.user._id });
  if (member) {
    if (fullName) member.fullName = fullName;
    if (phone !== undefined) member.phone = phone;
    if (age !== undefined) member.age = Number(age);
    if (gender !== undefined) member.gender = gender;
    if (height !== undefined) member.height = Number(height);
    if (weight !== undefined) member.weight = Number(weight);
    if (bloodGroup !== undefined) member.bloodGroup = bloodGroup;
    if (profile.photoUrl) member.photoUrl = profile.photoUrl;
    await member.save();
  }

  const updatedUser = await User.findById(req.user._id).select('-password');

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser,
    member,
    profile,
  });
});

module.exports = {
  getProfile,
  updateProfile,
};
