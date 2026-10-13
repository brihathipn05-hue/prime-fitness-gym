const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routes & controllers
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const profileRoutes = require('./routes/profileRoutes');
const fitnessRoutes = require('./routes/fitnessRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const { protect, admin } = require('./middleware/authMiddleware');
const { getAdminDashboardStats } = require('./controllers/memberController');

// Initialize Express App
const app = express();

// Connect Database
connectDB();

// Body parser & Cookie parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // fallback for dev
      }
    },
    credentials: true,
  })
);

// Serve uploads directory for profile photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api', fitnessRoutes); // /api/bmi, /api/workouts, /api/diet
app.use('/api/attendance', attendanceRoutes);

// Dedicated Admin Dashboard API endpoint
app.get('/api/admin/dashboard', protect, admin, getAdminDashboardStats);

// Base route test
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Prime Fitness Gym API is running smoothly',
    timestamp: new Date(),
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
