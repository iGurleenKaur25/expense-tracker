const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  simulateLoanClearance,getLoans,addLoan
} = require("../controllers/loanController");


router.post("/add", authMiddleware, addLoan);
router.get("/get", authMiddleware, getLoans);


router.post("/simulate", authMiddleware, simulateLoanClearance);

module.exports =router;