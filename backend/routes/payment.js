const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addPayment,
  getPaymentsByLoan
} = require("../controllers/paymentController");
router.post("/", authMiddleware, addPayment);
router.get("/loan/:loanId", authMiddleware, getPaymentsByLoan);
module.exports = router;
