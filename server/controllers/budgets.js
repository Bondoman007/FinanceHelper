const Budget = require("../models/Budget");
const asyncHandler = require("express-async-handler");

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user.id });

  res.json(budgets);
});

// @desc    Add budget
// @route   POST /api/budgets
// @access  Private
const addBudget = asyncHandler(async (req, res) => {
  const { category, amount, month, year } = req.body;

  if (!category || !amount || !month || !year) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check if budget already exists for this category/month/year
  const existingBudget = await Budget.findOne({
    category,
    month,
    year,
    user: req.user._id,
  });

  if (existingBudget) {
    res.status(400);
    throw new Error("Budget already exists for this category and period");
  }

  const budget = await Budget.create({
    category,
    amount,
    month,
    year,
    user: req.user._id,
  });

  res.status(201).json(budget);
});

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error("Budget not found");
  }

  // Check user ownership
  if (budget.user.toString() !== req.user._id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedBudget = await Budget.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedBudget);
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error("Budget not found");
  }

  // Check user ownership
  if (budget.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await budget.deleteOne();

  res.json({ id: req.params.id });
});

module.exports = {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
};
