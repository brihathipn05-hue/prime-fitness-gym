const express = require('express');
const router = express.Router();
const {
  getMembers,
  getAdminDashboardStats,
  getAdminReports,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} = require('../controllers/memberController');
const { protect, admin } = require('../middleware/authMiddleware');

// All member management routes are restricted to logged-in Admins
router.use(protect, admin);

router.get('/dashboard/stats', getAdminDashboardStats);
router.get('/reports', getAdminReports);

router.route('/')
  .get(getMembers)
  .post(createMember);

router.route('/:id')
  .get(getMemberById)
  .put(updateMember)
  .delete(deleteMember);

module.exports = router;
