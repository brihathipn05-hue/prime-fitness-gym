const asyncHandler = require('express-async-handler');
const Attendance = require('../models/Attendance');
const Member = require('../models/Member');
const { getKolkataDateString } = require('../middleware/authMiddleware');

// @desc    Member self check-in for current gym business day
// @route   POST /api/attendance/check-in
// @access  Private (Member)
const checkInMember = asyncHandler(async (req, res) => {
  const member = await Member.findOne({ user: req.user._id });

  if (!member) {
    res.status(404);
    throw new Error('Member profile not found. Please contact administration.');
  }

  // Check membership eligibility (Active status & unexpired)
  const now = new Date();
  if (member.status !== 'Active') {
    res.status(403);
    throw new Error(`Check-in denied: Your membership status is currently '${member.status}'. Please renew your membership.`);
  }

  if (member.endDate < now) {
    res.status(403);
    throw new Error(`Check-in denied: Your membership expired on ${new Date(member.endDate).toLocaleDateString()}. Please renew to access facilities.`);
  }

  // Current Asia/Kolkata gym business date string (YYYY-MM-DD)
  const todayDateStr = getKolkataDateString();

  // Check for duplicate attendance record
  const existingAttendance = await Attendance.findOne({
    member: member._id,
    attendanceDate: todayDateStr,
  });

  if (existingAttendance) {
    const formattedTime = new Date(existingAttendance.checkInTime).toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
    });
    res.status(400);
    throw new Error(`You have already checked in today at ${formattedTime}`);
  }

  try {
    const attendance = await Attendance.create({
      member: member._id,
      user: req.user._id,
      attendanceDate: todayDateStr,
      checkInTime: new Date(),
      markedBy: req.user._id,
      method: 'member-check-in',
    });

    const formattedTime = new Date(attendance.checkInTime).toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
    });

    res.status(201).json({
      success: true,
      message: `Check-in successful at ${formattedTime}`,
      attendance,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      res.status(400);
      throw new Error('You have already checked in today.');
    }
    throw error;
  }
});

// @desc    Get authenticated member's attendance history
// @route   GET /api/attendance/my
// @access  Private (Member)
const getMyAttendance = asyncHandler(async (req, res) => {
  const member = await Member.findOne({ user: req.user._id });

  if (!member) {
    res.status(404);
    throw new Error('Member profile not found');
  }

  const attendanceRecords = await Attendance.find({ member: member._id }).sort({ checkInTime: -1 });

  res.status(200).json({
    success: true,
    count: attendanceRecords.length,
    attendance: attendanceRecords,
  });
});

// @desc    Get authenticated member's attendance stats & today's status
// @route   GET /api/attendance/my/stats
// @access  Private (Member)
const getMyAttendanceStats = asyncHandler(async (req, res) => {
  const member = await Member.findOne({ user: req.user._id });

  if (!member) {
    res.status(404);
    throw new Error('Member profile not found');
  }

  const todayDateStr = getKolkataDateString();
  const todayRecord = await Attendance.findOne({
    member: member._id,
    attendanceDate: todayDateStr,
  });

  const totalVisits = await Attendance.countDocuments({ member: member._id });

  // Current month count (e.g., 'YYYY-MM')
  const currentMonthPrefix = todayDateStr.substring(0, 7);
  const monthVisits = await Attendance.countDocuments({
    member: member._id,
    attendanceDate: { $regex: `^${currentMonthPrefix}` },
  });

  const recentVisits = await Attendance.find({ member: member._id })
    .sort({ checkInTime: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    isCheckedInToday: !!todayRecord,
    todayCheckInTime: todayRecord ? todayRecord.checkInTime : null,
    totalVisits,
    monthVisits,
    recentVisits,
  });
});

// @desc    Admin view all attendance records with filtering, search, and pagination
// @route   GET /api/attendance/admin
// @access  Private/Admin
const getAdminAttendance = asyncHandler(async (req, res) => {
  const { date, search, plan, page = 1, limit = 20 } = req.query;

  const targetDate = date || getKolkataDateString();
  let query = {};

  if (targetDate && targetDate !== 'All') {
    query.attendanceDate = targetDate;
  }

  if (search || (plan && plan !== 'All')) {
    let memberMatch = {};
    if (search) {
      memberMatch.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (plan && plan !== 'All') {
      memberMatch.membershipPlan = plan;
    }

    const matchingMembers = await Member.find(memberMatch).select('_id');
    const memberIds = matchingMembers.map((m) => m._id);
    query.member = { $in: memberIds };
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const totalCount = await Attendance.countDocuments(query);
  const attendanceRecords = await Attendance.find(query)
    .populate('member', 'fullName email membershipPlan phone photoUrl status')
    .populate('markedBy', 'name role')
    .sort({ checkInTime: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    count: attendanceRecords.length,
    totalCount,
    totalPages: Math.ceil(totalCount / limitNum),
    currentPage: pageNum,
    selectedDate: targetDate,
    attendance: attendanceRecords,
  });
});

// @desc    Admin attendance summary statistics
// @route   GET /api/attendance/admin/stats
// @access  Private/Admin
const getAdminAttendanceStats = asyncHandler(async (req, res) => {
  const todayDateStr = getKolkataDateString();

  const todayRecords = await Attendance.find({ attendanceDate: todayDateStr });
  const todayCheckIns = todayRecords.length;

  const uniqueMemberIds = new Set(todayRecords.map((r) => r.member.toString()));
  const uniqueMembersPresentToday = uniqueMemberIds.size;

  const totalMembers = await Member.countDocuments({});

  res.status(200).json({
    success: true,
    todayDate: todayDateStr,
    todayCheckIns,
    uniqueMembersPresentToday,
    totalMembers,
  });
});

// @desc    Admin manually mark attendance for a member
// @route   POST /api/attendance/admin/mark
// @access  Private/Admin
const markAdminAttendance = asyncHandler(async (req, res) => {
  const { memberId, date, time } = req.body;

  if (!memberId) {
    res.status(400);
    throw new Error('Member ID is required');
  }

  const member = await Member.findById(memberId);
  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  const attendanceDate = date || getKolkataDateString();

  const existing = await Attendance.findOne({
    member: member._id,
    attendanceDate,
  });

  if (existing) {
    res.status(400);
    throw new Error(`Attendance for ${member.fullName} on ${attendanceDate} has already been recorded`);
  }

  let checkInTimestamp = new Date();
  if (time) {
    checkInTimestamp = new Date(`${attendanceDate}T${time}:00`);
  }

  const attendance = await Attendance.create({
    member: member._id,
    user: member.user,
    attendanceDate,
    checkInTime: checkInTimestamp,
    markedBy: req.user._id,
    method: 'admin-manual',
  });

  res.status(201).json({
    success: true,
    message: `Attendance marked manually for ${member.fullName}`,
    attendance,
  });
});

// @desc    Admin edit/correct an attendance record
// @route   PUT /api/attendance/admin/:id
// @access  Private/Admin
const updateAdminAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    res.status(404);
    throw new Error('Attendance record not found');
  }

  const { attendanceDate, checkInTime, method } = req.body;

  if (attendanceDate) attendance.attendanceDate = attendanceDate;
  if (checkInTime) attendance.checkInTime = new Date(checkInTime);
  if (method) attendance.method = method;
  attendance.markedBy = req.user._id;

  await attendance.save();

  res.status(200).json({
    success: true,
    message: 'Attendance record updated successfully',
    attendance,
  });
});

module.exports = {
  checkInMember,
  getMyAttendance,
  getMyAttendanceStats,
  getAdminAttendance,
  getAdminAttendanceStats,
  markAdminAttendance,
  updateAdminAttendance,
};
