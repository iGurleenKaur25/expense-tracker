const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
  getIncomeSummary,
} = require("../controllers/incomeController");

router.route("/")
  .post(protect, addIncome)
  .get(protect, getIncome);

router.get("/summary", protect, getIncomeSummary);

router.route("/:id")
  .put(protect, updateIncome)
  .delete(protect, deleteIncome);

module.exports = router;