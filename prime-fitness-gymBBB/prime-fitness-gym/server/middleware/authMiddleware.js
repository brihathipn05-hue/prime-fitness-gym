const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Middleware to protect routes via JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check HTTP-only cookie first, then Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no session token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'prime_fitness_gym_secret_key_2026_super_secure');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      throw new Error('User not found for provided token');
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, invalid or expired token');
  }
});

// Middleware to restrict access to Admins only
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied: Administrator privileges required');
  }
};

// Helper function to format current date in Asia/Kolkata timezone (YYYY-MM-DD)
const getKolkataDateString = (dateObj = new Date()) => {
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-CA', options); // returns YYYY-MM-DD
  return formatter.format(dateObj);
};

module.exports = { protect, admin, getKolkataDateString };
