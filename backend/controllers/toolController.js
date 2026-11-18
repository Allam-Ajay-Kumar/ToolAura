// controllers/toolController.js
// Handles public tool browsing and user tool submissions

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Tool = require('../models/Tool');
const Category = require('../models/Category');

// @desc    Get all approved tools (with search and category filter)
// @route   GET /api/tools
// @access  Public
const getApprovedTools = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 12 } = req.query;

  // Build the query filter
  let filter = { status: 'approved' };

  // If search query provided, search in name and description
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // If category filter provided, find tools by category ID or slug
  if (category) {
    // IMPORTANT: Only query by _id if the value is a valid MongoDB ObjectId.
    // If we pass a slug like "writing-productivity" into { _id: category },
    // Mongoose throws a CastError. So we detect which type of value was given.
    const isObjectId = mongoose.Types.ObjectId.isValid(category) && category.length === 24;

    const categoryQuery = isObjectId
      ? { $or: [{ _id: category }, { slug: category }] }  // Could be an ID or slug
      : { slug: category };                                // Definitely a slug

    const categoryDoc = await Category.findOne(categoryQuery);
    if (categoryDoc) {
      filter.category = categoryDoc._id;
    }
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Tool.countDocuments(filter);

  const tools = await Tool.find(filter)
    .populate('category', 'name slug')
    .populate('submittedBy', 'name')
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: tools.length,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
    data: tools,
  });
});

// @desc    Get a single approved tool by ID
// @route   GET /api/tools/:id
// @access  Public
const getToolById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Guard: only query by _id if the value is a valid MongoDB ObjectId.
  // Slugs like "writing-productivity" cannot be cast to ObjectId and would throw.
  const isObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;
  if (!isObjectId) {
    res.status(404);
    throw new Error('Tool not found');
  }

  const tool = await Tool.findById(id)
    .populate('category', 'name slug')
    .populate('submittedBy', 'name');

  if (!tool) {
    res.status(404);
    throw new Error('Tool not found');
  }

  if (tool.status !== 'approved') {
    res.status(404);
    throw new Error('Tool not found');
  }

  res.status(200).json({
    success: true,
    data: tool,
  });
});

// @desc    Submit a new AI tool (goes to pending status)
// @route   POST /api/tools/submit
// @access  Private (logged-in users)
const submitTool = asyncHandler(async (req, res) => {
  const { name, description, category, websiteUrl, logoUrl } = req.body;

  if (!name || !description || !category || !websiteUrl) {
    res.status(400);
    throw new Error('Please provide name, description, category, and website URL');
  }

  // Check if category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    res.status(400);
    throw new Error('Selected category does not exist');
  }

  // Check for duplicate tool name (case-insensitive)
  const existing = await Tool.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (existing) {
    res.status(400);
    throw new Error('A tool with this name already exists or has been submitted');
  }

  const tool = await Tool.create({
    name,
    description,
    category,
    websiteUrl,
    logoUrl: logoUrl || '',
    submittedBy: req.user._id,
    status: 'pending',
  });

  const populatedTool = await Tool.findById(tool._id).populate('category', 'name slug');

  res.status(201).json({
    success: true,
    message: 'Tool submitted successfully! It will appear in the directory once reviewed.',
    data: populatedTool,
  });
});

module.exports = { getApprovedTools, getToolById, submitTool };
