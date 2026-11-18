// controllers/adminController.js
// Admin-only operations: dashboard stats, submission review, user management

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Tool = require('../models/Tool');
const Category = require('../models/Category');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Admin only
const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalTools, pendingCount, approvedCount, rejectedCount] =
    await Promise.all([
      User.countDocuments({ role: 'user' }),
      Tool.countDocuments(),
      Tool.countDocuments({ status: 'pending' }),
      Tool.countDocuments({ status: 'approved' }),
      Tool.countDocuments({ status: 'rejected' }),
    ]);

  const recentSubmissions = await Tool.find({ status: 'pending' })
    .populate('submittedBy', 'name email')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalTools,
      pendingCount,
      approvedCount,
      rejectedCount,
      recentSubmissions,
    },
  });
});

// @desc    Get all pending submissions
// @route   GET /api/admin/submissions
// @access  Admin only
const getPendingSubmissions = asyncHandler(async (req, res) => {
  const { status = 'pending' } = req.query;

  const submissions = await Tool.find({ status })
    .populate('submittedBy', 'name email')
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: submissions.length,
    data: submissions,
  });
});

// @desc    Approve or reject a submission
// @route   PATCH /api/admin/submissions/:id/status
// @access  Admin only
const reviewSubmission = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Status must be either "approved" or "rejected"');
  }

  if (status === 'rejected' && !rejectionReason) {
    res.status(400);
    throw new Error('Please provide a rejection reason');
  }

  const tool = await Tool.findById(req.params.id);
  if (!tool) {
    res.status(404);
    throw new Error('Submission not found');
  }

  tool.status = status;
  tool.rejectionReason = status === 'rejected' ? rejectionReason : null;
  await tool.save();

  res.status(200).json({
    success: true,
    message: `Tool has been ${status}`,
    data: tool,
  });
});

// @desc    Admin: Create a tool directly (bypasses pending)
// @route   POST /api/admin/tools
// @access  Admin only
const createToolDirectly = asyncHandler(async (req, res) => {
  const { name, description, category, websiteUrl, logoUrl, isFeatured } = req.body;

  if (!name || !description || !category || !websiteUrl) {
    res.status(400);
    throw new Error('Please provide name, description, category, and website URL');
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    res.status(400);
    throw new Error('Selected category does not exist');
  }

  const existing = await Tool.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (existing) {
    res.status(400);
    throw new Error('A tool with this name already exists');
  }

  const tool = await Tool.create({
    name,
    description,
    category,
    websiteUrl,
    logoUrl: logoUrl || '',
    submittedBy: req.user._id,
    status: 'approved',
    isFeatured: isFeatured || false,
  });

  const populated = await Tool.findById(tool._id).populate('category', 'name slug');

  res.status(201).json({
    success: true,
    message: 'Tool added to directory successfully',
    data: populated,
  });
});

// @desc    Admin: Get all tools
// @route   GET /api/admin/tools
// @access  Admin only
const getAllTools = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Tool.countDocuments(filter);

  const tools = await Tool.find(filter)
    .populate('category', 'name slug')
    .populate('submittedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: tools.length,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    data: tools,
  });
});

// @desc    Admin: Update any tool
// @route   PUT /api/admin/tools/:id
// @access  Admin only
const updateTool = asyncHandler(async (req, res) => {
  const tool = await Tool.findById(req.params.id);
  if (!tool) {
    res.status(404);
    throw new Error('Tool not found');
  }

  const { name, description, category, websiteUrl, logoUrl, status, isFeatured, rejectionReason } = req.body;

  if (name) tool.name = name;
  if (description) tool.description = description;
  if (category) tool.category = category;
  if (websiteUrl) tool.websiteUrl = websiteUrl;
  if (logoUrl !== undefined) tool.logoUrl = logoUrl;
  if (status) tool.status = status;
  if (isFeatured !== undefined) tool.isFeatured = isFeatured;
  if (rejectionReason !== undefined) tool.rejectionReason = rejectionReason;

  const updated = await tool.save();
  const populated = await Tool.findById(updated._id).populate('category', 'name slug');

  res.status(200).json({
    success: true,
    message: 'Tool updated successfully',
    data: populated,
  });
});

// @desc    Admin: Delete a tool
// @route   DELETE /api/admin/tools/:id
// @access  Admin only
const deleteTool = asyncHandler(async (req, res) => {
  const tool = await Tool.findById(req.params.id);
  if (!tool) {
    res.status(404);
    throw new Error('Tool not found');
  }

  await tool.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Tool deleted successfully',
  });
});

// @desc    Admin: Get all users
// @route   GET /api/admin/users
// @access  Admin only
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' })
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Admin: Toggle user active status
// @route   PATCH /api/admin/users/:id/status
// @access  Admin only
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot modify admin accounts');
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User account ${user.isActive ? 'activated' : 'deactivated'}`,
    data: { _id: user._id, name: user.name, isActive: user.isActive },
  });
});

module.exports = {
  getAdminDashboardStats,
  getPendingSubmissions,
  reviewSubmission,
  createToolDirectly,
  getAllTools,
  updateTool,
  deleteTool,
  getAllUsers,
  toggleUserStatus,
};
