const Payment = require('../models/Payment');
const Loan = require('../models/Loan');

exports.addPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { loanId, amount, type } = req.body;
    if (!loanId || !amount || !type) {
      return res.status(400).json({
        message: "LoanId, amount and type are required"
      });
    }
    const loan = await Loan.findOne({
      _id: loanId,
      userId
    });
    if (!loan) {
      return res.status(404).json({
        message: "Loan not found"
      });
    }
    const payment = await Payment.create({
      userId,
      loanId,
      amount,
      type
    });
    res.status(201).json({
      message: "Payment added successfully",
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add payment"
    });
  }
};
exports.getPaymentsByLoan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { loanId } = req.params;
    const payments = await Payment.find({
      loanId,
      userId
    }).sort({ paymentDate: -1 });
    res.status(200).json({
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payments"
    });
  }
};
















































// exports.addPayment = async (req, res) => {
//   const { loanId, amount } = req.body;

//   try {
//     const loan = await Loan.findById(loanId);
//     if (!loan) return res.status(404).json({ message: 'Loan not found' });

//     const payment = await Payment.create({
//       loanId,
//       amount
//     });

//     loan.remainingAmount -= amount;
//     await loan.save();

//     res.status(201).json({
//       payment,
//       remainingAmount: loan.remainingAmount
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// // I structured my backend using controllers for business logic, models for schema, routes for 
// // request mapping, and middleware for authentication. Controllers handle validation, authorization, 
// // database operations, and response formatting.”