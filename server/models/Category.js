// models/Category.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a category name"],
      unique: true, // Globally unique names
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    type: {
      type: String,
      required: true,
      enum: ["expense", "income"], // Only allow these types
    },
    color: {
      type: String,
      default: "#6b7280",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
