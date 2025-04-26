const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getCategories).post(protect, addCategory);

router
  .route("/:id")
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
