// controllers/categoryController.js

const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Tool = require('../models/Tool');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Admin only
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  // Check for duplicate
  const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (exists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await Category.create({ name, description });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Admin only
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (name) category.name = name;
  if (description !== undefined) category.description = description;

  const updated = await category.save();

  res.status(200).json({
    success: true,
    message: 'Category updated',
    data: updated,
  });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin only
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check if any tools use this category
  const toolCount = await Tool.countDocuments({ category: req.params.id });
  if (toolCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete. ${toolCount} tool(s) are using this category.`);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
