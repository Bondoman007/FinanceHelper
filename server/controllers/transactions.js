const Transaction = require("../models/Transaction");
const asyncHandler = require("express-async-handler");

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .populate("category")
    .sort("-date");

  res.json(transactions);
});

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = asyncHandler(async (req, res) => {
  const { description, amount, date, category } = req.body;

  if (!description || !amount || !date || !category) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const transaction = await Transaction.create({
    description,
    amount,
    date,
    category,
    user: req.user._id,
  });

  res.status(201).json(transaction);
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Check user ownership
  if (transaction.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedTransaction);
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found");
  }

  // Check user ownership
  if (transaction.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await transaction.deleteOne();

  res.json({ id: req.params.id });
});

// @desc    Get monthly summary
// @route   GET /api/transactions/summary
// @access  Private
const getMonthlySummary = asyncHandler(async (req, res) => {
  const transactions = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 }, // Optional: include transaction count
      },
    },
    {
      $project: {
        _id: 0, // Exclude the default _id
        month: {
          $dateToString: {
            format: "%Y-%m",
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
              },
            },
          },
        },
        totalAmount: 1,
        count: 1,
      },
    },
    { $sort: { month: 1 } }, // Sort chronologically
  ]);

  res.json(transactions);
});

// @desc    Get category summary
// @route   GET /api/transactions/category-summary
// @access  Private
// controllers/transactionController.js
const getCategorySummary = asyncHandler(async (req, res) => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Hardcoded system categories with colors
  const SYSTEM_CATEGORIES = {
    Food: "#ef4444",
    Transport: "#3b82f6",
    Housing: "#10b981",
    Salary: "#22c55e",
    Freelance: "#84cc16",
  };

  // Get raw summary data
  const summary = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: "expense",
        date: { $gte: firstDay, $lte: lastDay },
        category: { $in: Object.keys(SYSTEM_CATEGORIES) },
      },
    },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  // Transform to expected format
  const result = summary.map((item) => ({
    category: {
      name: item._id,
      color: SYSTEM_CATEGORIES[item._id] || "#666666",
    },
    totalAmount: item.totalAmount,
  }));
  console.log(result);
  res.json(result);
});

// routes/transactionRoutes.js

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary,
  getCategorySummary,
};
