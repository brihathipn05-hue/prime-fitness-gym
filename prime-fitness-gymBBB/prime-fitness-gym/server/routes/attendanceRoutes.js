const express = require('express');
const router = express.Router();
const {
  checkInMember,
  getMyAttendance,
  getMyAttendanceStats,
  getAdminAttendance,
  getAdminAttendanceStats,
  markAdminAttendance,
  updateAdminAttendance,
} = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

// Authenticated Member attendance routes
router.post('/check-in', protect, checkInMember);
router.get('/my', protect, getMyAttendance);
router.get('/my/stats', protect, getMyAttendanceStats);

// Administrator attendance management routes
router.get('/admin', protect, admin, getAdminAttendance);
router.get('/admin/stats', protect, admin, getAdminAttendanceStats);
router.post('/admin/mark', protect, admin, markAdminAttendance);
router.put('/admin/:id', protect, admin, updateAdminAttendance);

module.exports = router;
