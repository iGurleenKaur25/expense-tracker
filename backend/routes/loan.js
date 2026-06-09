const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  simulateLoanClearance,getLoans,addLoan,updateLoan,deleteLoan
} = require("../controllers/loanController");


router.route("/")
.post( authMiddleware, addLoan)
.get(authMiddleware, getLoans);
router.post("/simulate", authMiddleware, simulateLoanClearance);
router.put("/:id", authMiddleware, updateLoan);
router.delete("/:id", authMiddleware, deleteLoan);

module.exports =router;