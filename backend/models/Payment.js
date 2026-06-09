// const mongoose = require("mongoose");
// const loanPaymentSchema = new mongoose.Schema(
//   {
//     loanId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Loan",
//       required: true
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     amountPaid: {
//       type: Number,
//       required: true
//     },
//     status: {
//     type: String,
//     enum: ["active", "paid"],
//     default: "active"
//     },
//     paymentDate: {
//       type: Date,
//       default: Date.now
//     },

//     paymentType: {
//       type: String,
//       enum: ["EMI", "EXTRA"],
//       default: "EMI"
//     },
//     remainingAmount: {
//   type: Number,
//   required: true
// }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Payment", loanPaymentSchema);
const mongoose = require("mongoose");

const loanPaymentSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amountPaid: {
      type: Number,
      required: true,
      min: [1, "Payment must be greater than 0"]
    },
    // Snapshot of remaining balance after this payment
    remainingAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["active", "paid"],
      default: "active"
    },
    paymentType: {
      type: String,
      enum: ["EMI", "EXTRA"],
      default: "EMI"
    },
    paymentDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", loanPaymentSchema);