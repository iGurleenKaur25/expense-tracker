// const Payment = require('../models/Payment');
// const Loan = require('../models/Loan');

// exports.addPayment = async (req, res) => {
//   try {

//     console.log(req.body);
//     const userId = req.user._id;
//     const { loanId, amount, type } = req.body;
//     if (!loanId || !amount || !type) {
//       return res.status(400).json({
//         message: "LoanId, amount and type are required"
//       });
//     }
//         if (amountPaid <= 0) {
//       return res.status(400).json({
//         message: "Invalid payment amount"
//       });
//     }

//     const loan = await Loan.findOne({
//       _id: loanId,
//       userId
//     });
//     if (!loan) {
//       return res.status(404).json({
//         message: "Loan not found"
//       });
//     }

//     if (amountPaid > loan.remainingAmount) {
//       return res.status(400).json({
//         message: "Amount exceeds remaining loan"
//       });
//     }

//     const payment = await Payment.create({
//       userId,
//       loanId,
//       amountPaid,
//       status,
//       paymentType
//     });

//     loan.remainingAmount -= amountPaid;

//     // ✅ Close loan if finished
//     if (loan.remainingAmount === 0) {
//       loan.status = "paid";
//     }

//     await loan.save();
    
//     res.status(201).json({
//       message: "Payment added successfully",
//       data: payment
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to add payment"
//     });
//   }
// };
// exports.getPaymentsByLoan = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { loanId } = req.params;
//     const payments = await Payment.find({
//       loanId,
//       userId
//     })
//     .populate("loanId", "title totalAmount")
//     .sort({ paymentDate: -1 });
//     res.status(200).json({
//       count: payments.length,
//       data: payments
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch payments"
//     });
//   }
// };


const Payment = require('../models/Payment');
const Loan = require('../models/Loan');

exports.addPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    // FIX: destructure field names that match what the frontend sends
    const { loanId, amountPaid, paymentType } = req.body;

    if (!loanId || !amountPaid || !paymentType) {
      return res.status(400).json({
        message: "loanId, amountPaid and paymentType are required"
      });
    }

    // FIX: use amountPaid (was checking undefined `amount`)
    if (amountPaid <= 0) {
      return res.status(400).json({
        message: "Invalid payment amount"
      });
    }

    const loan = await Loan.findOne({ _id: loanId, userId });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (amountPaid > loan.remainingAmount) {
      return res.status(400).json({
        message: "Amount exceeds remaining loan balance"
      });
    }

    // FIX: pass remainingAmount snapshot (required by schema) and correct field names
    const payment = await Payment.create({
      userId,
      loanId,
      amountPaid,
      paymentType,
      status: loan.remainingAmount - amountPaid <= 0 ? "paid" : "active",
      remainingAmount: Math.max(0, loan.remainingAmount - amountPaid)
    });

    loan.remainingAmount -= amountPaid;
    if (loan.remainingAmount <= 0) {
      loan.remainingAmount = 0;
      loan.status = "paid";
    }

    await loan.save();

    res.status(201).json({
      message: "Payment added successfully",
      data: payment
    });
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
      .populate("loanId", "title loanAmount")
      .sort({ paymentDate: -1 });

    res.status(200).json({
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error("getPaymentsByLoan error:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};