const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");

// Predefined system categories (immutable)
const SYSTEM_CATEGORIES = [
  { name: "Food", type: "expense", color: "#ef4444" },
  { name: "Transport", type: "expense", color: "#3b82f6" },
  { name: "Housing", type: "expense", color: "#10b981" },
  { name: "Salary", type: "income", color: "#22c55e" },
  { name: "Freelance", type: "income", color: "#84cc16" },
];

// @desc    Get all system categories (read-only)
// @route   GET /api/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  // Option 1: Fetch from DB (if already seeded)
  // const categories = await Category.find({ isSystem: true });

  // Option 2: Return hardcoded (no DB needed)
  res.json(SYSTEM_CATEGORIES);
});

// Disable all modification operations
const addCategory = (req, res) => {
  res.status(403).json({
    error: "System categories are predefined - cannot add new ones",
  });
};

const updateCategory = (req, res) => {
  res.status(403).json({
    error: "System categories cannot be modified",
  });
};

const deleteCategory = (req, res) => {
  res.status(403).json({
    error: "System categories cannot be deleted",
  });
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
