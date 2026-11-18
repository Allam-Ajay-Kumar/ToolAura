// controllers/userController.js
// Handles user-specific operations: submissions, favourites, profile

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Tool = require('../models/Tool');

// @desc    Get tools submitted by the logged-in user
// @route   GET /api/users/submissions
// @access  Private
const getMySubmissions = asyncHandler(async (req, res) => {
  const tools = await Tool.find({ submittedBy: req.user._id })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tools.length,
    data: tools,
  });
});

// @desc    Get logged-in user's favourite tools
// @route   GET /api/users/favourites
// @access  Private
const getMyFavourites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'favourites',
    match: { status: 'approved' },
    populate: { path: 'category', select: 'name slug' },
  });

  res.status(200).json({
    success: true,
    count: user.favourites.length,
    data: user.favourites,
  });
});

// @desc    Add a tool to favourites
// @route   POST /api/users/favourites/:toolId
// @access  Private
const addToFavourites = asyncHandler(async (req, res) => {
  const { toolId } = req.params;

  const tool = await Tool.findById(toolId);
  if (!tool || tool.status !== 'approved') {
    res.status(404);
    throw new Error('Tool not found');
  }

  const user = await User.findById(req.user._id);

  // Check if already in favourites
  if (user.favourites.includes(toolId)) {
    res.status(400);
    throw new Error('Tool is already in your favourites');
  }

  user.favourites.push(toolId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Added to favourites',
    data: user.favourites,
  });
});

// @desc    Remove a tool from favourites
// @route   DELETE /api/users/favourites/:toolId
// @access  Private
const removeFromFavourites = asyncHandler(async (req, res) => {
  const { toolId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user.favourites.includes(toolId)) {
    res.status(400);
    throw new Error('Tool is not in your favourites');
  }

  user.favourites = user.favourites.filter((id) => id.toString() !== toolId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Removed from favourites',
    data: user.favourites,
  });
});

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json({ success: true, data: user });
});

module.exports = {
  getMySubmissions,
  getMyFavourites,
  addToFavourites,
  removeFromFavourites,
  getUserProfile,
};
