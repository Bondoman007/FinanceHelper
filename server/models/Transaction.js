const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
      maxlength: [100, "Description cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
      min: [0, "Amount must be positive"],
    },
    date: {
      type: Date,
      required: [true, "Please add a date"],
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
