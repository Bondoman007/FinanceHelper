const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary,
  getCategorySummary,
} = require("../controllers/transactions");
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getTransactions).post(protect, addTransaction);

router
  .route("/:id")
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

router.get("/summary/monthly", protect, getMonthlySummary);
router.get("/summary/category", protect, getCategorySummary);

module.exports = router;
