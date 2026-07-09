const Payment = require("../models/Payment");
const Loan = require("../models/Loan");
const Notification = require("../models/Notification");

exports.addPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { loanId, amountPaid, paymentType } = req.body;

    if (!loanId || !amountPaid || !paymentType)
      return res.status(400).json({ message: "loanId, amountPaid and paymentType are required" });
    if (amountPaid <= 0)
      return res.status(400).json({ message: "Invalid payment amount" });

    const loan = await Loan.findOne({ _id: loanId, userId });
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    if (amountPaid > loan.remainingAmount)
      return res.status(400).json({ message: "Amount exceeds remaining balance" });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const isFee = loan.category === "FEE";

    // once-per-cycle check — applies to regular EMI and to fees, not to extra loan payments
    if (paymentType === "EMI" || paymentType === "FEE") {
      const existingPayment = await Payment.findOne({
        loanId, userId, paymentType,
        paymentMonth: currentMonth, paymentYear: currentYear,
      });
      if (existingPayment) {
        const label = isFee ? loan.feeType + " fee" : "EMI";
        return res.status(400).json({
          message: `${label} already paid for ${now.toLocaleString("default", { month: "long" })} ${currentYear}.`,
        });
      }
    }

    const newRemaining = Math.max(0, loan.remainingAmount - amountPaid);

    const payment = await Payment.create({
      userId, loanId, amountPaid, paymentType,
      status: newRemaining <= 0 ? "paid" : "active",
      remainingAmount: newRemaining,
      paymentMonth: currentMonth,
      paymentYear: currentYear,
      category: isFee ? "FEE" : "LOAN",
    });

    if (isFee) {
      // recurring: once fully paid, reset for next cycle instead of closing
      if (newRemaining <= 0) {
        loan.remainingAmount = loan.loanAmount;
        const dueDay = loan.emiDueDay || 5;
        const nextDue = new Date(currentYear, currentMonth + 1, dueDay);
        loan.nextDueDate = nextDue;
        loan.lastEmiMonth = currentMonth;
        loan.lastEmiYear = currentYear;
      } else {
        loan.remainingAmount = newRemaining;
      }
    } else {
      loan.remainingAmount = newRemaining;
      if (newRemaining <= 0) {
        loan.status = "CLOSED";
      } else if (paymentType === "EMI") {
        const dueDay = loan.emiDueDay || 1;
        const nextDue = new Date(currentYear, currentMonth + 1, dueDay);
        loan.nextDueDate = nextDue;
        loan.lastEmiMonth = currentMonth;
        loan.lastEmiYear = currentYear;
      }
    }
    await loan.save();

    await Notification.create({
      userId, type: "PAYMENT_SUCCESS",
      title: "Payment recorded",
      message: `${isFee ? loan.feeType + " fee" : paymentType} of ₹${amountPaid.toLocaleString("en-IN")} paid for "${loan.loanName}".`,
      loanId,
    });

    res.status(201).json({ message: "Payment added successfully", data: payment });
  } catch (error) {
    console.error("addPayment error:", error);
    res.status(500).json({ message: "Failed to add payment" });
  }
};

exports.getPaymentsByLoan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { loanId } = req.params;
    const payments = await Payment.find({ loanId, userId })
      .populate("loanId", "loanName loanAmount")
      .sort({ paymentDate: -1 });
    res.status(200).json({ count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

// all payments for the logged-in user across all loans
exports.getAllPayments = async (req, res) => {
  try {
    const userId = req.user._id;
    const payments = await Payment.find({ userId })
      .populate("loanId", "loanName loanAmount")
      .sort({ paymentDate: -1 });
    res.status(200).json({ count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};