const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  addExpense,
  getExpenses,
  deleteExpense
} = require("../controllers/expenseController");
const protect = require("../middleware/authMiddleware"); 

// router.post("/", authMiddleware, addExpense);
// router.get("/", authMiddleware, getExpenses);
// router.delete("/:id", authMiddleware, deleteExpense);

router.route("/")
  .post(protect, addExpense)
  .get(protect, getExpenses);

router.route("/:id")
  // .put(protect, updateExpense)
  .delete(protect, deleteExpense);
module.exports = router;
