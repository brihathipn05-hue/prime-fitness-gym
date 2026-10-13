const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Member = require('../models/Member');
const Profile = require('../models/Profile');

// Helper to generate JWT Token (1-day expiry)
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'prime_fitness_gym_secret_key_2026_super_secure', {
    expiresIn: '1d',
  });
};

// Helper to set HTTP-only cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

// @desc    Register a new gym member
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  if (confirmPassword && password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Force public registrations to be 'member' role only
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'member',
  });

  if (user) {
    // Create corresponding Member record with default 1-month Standard plan
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const member = await Member.create({
      user: user._id,
      fullName: user.name,
      email: user.email,
      membershipPlan: 'Standard',
      startDate,
      durationMonths: 1,
      endDate,
      status: 'Active',
    });

    // Create corresponding Profile record
    await Profile.create({
      user: user._id,
    });

    sendTokenResponse(user, 201, res);
  } else {
    res.status(400);
    throw new Error('Invalid user registration data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await bcrypt.compare(password, user.password))) {
    sendTokenResponse(user, 200, res);
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

// @desc    Get current logged in user profile & member status
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  let member = null;
  let profile = null;

  if (user.role === 'member') {
    member = await Member.findOne({ user: user._id });
    profile = await Profile.findOne({ user: user._id });
  }

  res.status(200).json({
    success: true,
    user,
    member,
    profile,
  });
});

// @desc    Change password for authenticated user
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new passwords');
  }

  if (confirmNewPassword && newPassword !== confirmNewPassword) {
    res.status(400);
    throw new Error('New passwords do not match');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password entered is incorrect');
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  changePassword,
};
