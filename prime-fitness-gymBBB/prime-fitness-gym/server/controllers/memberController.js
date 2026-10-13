const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Member = require('../models/Member');
const Profile = require('../models/Profile');
const Attendance = require('../models/Attendance');

// Helper to compute complete stats dynamically from MongoDB
const computeMemberStats = async () => {
  const totalMembers = await Member.countDocuments({});
  const allMembersList = await Member.find({});
  const now = new Date();

  let activeMembersCount = 0;
  let inactiveMembersCount = 0;
  let cancelledMembersCount = 0;
  let expiredMembersCount = 0;

  let standardMembersCount = 0;
  let premiumMembersCount = 0;
  let vipMembersCount = 0;

  let totalRevenue = 0;
  let monthlyRevenue = 0;

  const PLAN_PRICES = {
    Standard: 49,
    Premium: 89,
    VIP: 149,
  };

  allMembersList.forEach((m) => {
    const price = PLAN_PRICES[m.membershipPlan] || 49;
    const duration = m.durationMonths || 1;
    totalRevenue += price * duration;

    // Membership Status breakdown
    if (m.status === 'Cancelled') {
      cancelledMembersCount++;
    } else if (m.status === 'Inactive') {
      inactiveMembersCount++;
    } else if (m.endDate < now) {
      expiredMembersCount++;
    } else if (m.status === 'Active') {
      activeMembersCount++;
      monthlyRevenue += price;
    }

    // Membership Plan breakdown
    if (m.membershipPlan === 'VIP') {
      vipMembersCount++;
    } else if (m.membershipPlan === 'Premium') {
      premiumMembersCount++;
    } else {
      standardMembersCount++;
    }
  });

  return {
    totalMembers,
    activeMembers: activeMembersCount,
    inactiveMembers: inactiveMembersCount,
    cancelledMembers: cancelledMembersCount,
    expiredMemberships: expiredMembersCount,
    standardMembers: standardMembersCount,
    premiumMembers: premiumMembersCount,
    vipMembers: vipMembersCount,
    totalRevenue,
    monthlyRevenue,
  };
};

// @desc    Get all members with search, filtering, and sorting
// @route   GET /api/members
// @access  Private/Admin
const getMembers = asyncHandler(async (req, res) => {
  const { search, plan, status, sortBy, sortOrder } = req.query;

  let query = {};

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  if (plan && plan !== 'All') {
    query.membershipPlan = plan;
  }

  if (status && status !== 'All') {
    if (status === 'Expired') {
      query.status = 'Active';
      query.endDate = { $lt: new Date() };
    } else {
      query.status = status;
    }
  }

  // Sorting
  let sortField = 'createdAt';
  let order = -1;

  if (sortBy) {
    if (['fullName', 'email', 'startDate', 'endDate', 'membershipPlan', 'status'].includes(sortBy)) {
      sortField = sortBy;
    }
  }

  if (sortOrder === 'asc') {
    order = 1;
  }

  const sortOptions = {};
  sortOptions[sortField] = order;

  const members = await Member.find(query).sort(sortOptions);
  const stats = await computeMemberStats();

  res.status(200).json({
    success: true,
    count: members.length,
    stats,
    members,
  });
});

// @desc    Get complete admin dashboard analytics
// @route   GET /api/admin/dashboard or /api/members/dashboard/stats
// @access  Private/Admin
const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const stats = await computeMemberStats();
  const recentMembers = await Member.find({}).sort({ createdAt: -1 }).limit(5);

  res.status(200).json({
    success: true,
    stats,
    recentMembers,
  });
});

// @desc    Get single member details by ID
// @route   GET /api/members/:id
// @access  Private/Admin
const getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id).populate('user', 'name email role createdAt');

  if (!member) {
    res.status(404);
    throw new Error('Member record not found');
  }

  const profile = await Profile.findOne({ user: member.user._id });
  const recentAttendance = await Attendance.find({ member: member._id })
    .sort({ checkInTime: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    member,
    profile,
    recentAttendance,
  });
});

// @desc    Admin add new member
// @route   POST /api/members
// @access  Private/Admin
const createMember = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    phone,
    age,
    gender,
    height,
    weight,
    bloodGroup,
    membershipPlan,
    startDate,
    durationMonths,
    status,
  } = req.body;

  if (!fullName || !fullName.trim() || !email || !email.trim()) {
    res.status(400);
    throw new Error('Full name and email are required');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    res.status(400);
    throw new Error('A user with this email address already exists');
  }

  // Set initial password (provided password or default 'MemberPass123!')
  const tempPassword = password && password.trim() ? password.trim() : 'MemberPass123!';
  if (tempPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(tempPassword, salt);

  const user = await User.create({
    name: fullName.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: 'member',
  });

  const memberStart = startDate ? new Date(startDate) : new Date();
  const months = durationMonths ? parseInt(durationMonths) : 1;
  const memberEnd = new Date(memberStart);
  memberEnd.setMonth(memberEnd.getMonth() + months);

  const member = await Member.create({
    user: user._id,
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    phone: phone ? phone.trim() : '',
    age: age ? parseInt(age) : 0,
    gender: gender || 'Not Specified',
    height: height ? parseFloat(height) : 0,
    weight: weight ? parseFloat(weight) : 0,
    bloodGroup: bloodGroup ? bloodGroup.trim() : '',
    membershipPlan: membershipPlan || 'Standard',
    startDate: memberStart,
    durationMonths: months,
    endDate: memberEnd,
    status: status || 'Active',
  });

  await Profile.create({
    user: user._id,
    age: age ? parseInt(age) : 0,
    gender: gender || 'Not Specified',
    height: height ? parseFloat(height) : 0,
    weight: weight ? parseFloat(weight) : 0,
    bloodGroup: bloodGroup ? bloodGroup.trim() : '',
    phone: phone ? phone.trim() : '',
  });

  res.status(201).json({
    success: true,
    message: 'Member account created successfully',
    member,
  });
});

// @desc    Update member details
// @route   PUT /api/members/:id
// @access  Private/Admin
const updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error('Member record not found');
  }

  const {
    fullName,
    email,
    phone,
    age,
    gender,
    height,
    weight,
    bloodGroup,
    membershipPlan,
    startDate,
    durationMonths,
    status,
  } = req.body;

  if (fullName && fullName.trim()) member.fullName = fullName.trim();
  if (email && email.trim()) member.email = email.toLowerCase().trim();
  if (phone !== undefined) member.phone = phone.trim();
  if (age !== undefined) member.age = parseInt(age) || 0;
  if (gender !== undefined) member.gender = gender;
  if (height !== undefined) member.height = parseFloat(height) || 0;
  if (weight !== undefined) member.weight = parseFloat(weight) || 0;
  if (bloodGroup !== undefined) member.bloodGroup = bloodGroup.trim();
  if (membershipPlan) member.membershipPlan = membershipPlan;
  if (status) member.status = status;

  if (startDate) {
    member.startDate = new Date(startDate);
  }

  if (durationMonths) {
    member.durationMonths = parseInt(durationMonths);
  }

  // Recalculate end date based on start date & duration
  const start = new Date(member.startDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + (member.durationMonths || 1));
  member.endDate = end;

  await member.save();

  // Sync User name and Profile information
  await User.findByIdAndUpdate(member.user, {
    name: member.fullName,
    email: member.email,
  });

  await Profile.findOneAndUpdate(
    { user: member.user },
    {
      age: member.age,
      gender: member.gender,
      height: member.height,
      weight: member.weight,
      bloodGroup: member.bloodGroup,
      phone: member.phone,
    }
  );

  res.status(200).json({
    success: true,
    message: 'Member record updated successfully',
    member,
  });
});

// @desc    Delete member and associated records safely
// @route   DELETE /api/members/:id
// @access  Private/Admin
const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  const userId = member.user;

  // Safely delete related records
  await Attendance.deleteMany({ member: member._id });
  await Profile.deleteOne({ user: userId });
  await Member.deleteOne({ _id: member._id });
  await User.deleteOne({ _id: userId });

  res.status(200).json({
    success: true,
    message: 'Member and associated user data deleted successfully',
  });
});

// @desc    Get detailed reports and analytics for admin
// @route   GET /api/members/reports
// @access  Private/Admin
const getAdminReports = asyncHandler(async (req, res) => {
  const stats = await computeMemberStats();
  const allMembers = await Member.find({});
  const totalAttendanceRecords = await Attendance.countDocuments({});

  // Group registrations by month (last 6 months)
  const monthlyRegistrations = {};
  allMembers.forEach((m) => {
    const month = new Date(m.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyRegistrations[month] = (monthlyRegistrations[month] || 0) + 1;
  });

  // Calculate revenue per plan
  const PLAN_PRICES = { Standard: 49, Premium: 89, VIP: 149 };
  const planRevenue = {
    Standard: stats.standardMembers * PLAN_PRICES.Standard,
    Premium: stats.premiumMembers * PLAN_PRICES.Premium,
    VIP: stats.vipMembers * PLAN_PRICES.VIP,
  };

  res.status(200).json({
    success: true,
    stats,
    totalAttendanceRecords,
    monthlyRegistrations,
    planRevenue,
  });
});

module.exports = {
  getMembers,
  getAdminDashboardStats,
  getAdminReports,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};

