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
      required: true
    },

    paymentDate: {
      type: Date,
      default: Date.now
    },

    paymentType: {
      type: String,
      enum: ["EMI", "EXTRA"],
      default: "EMI"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoanPayment", loanPaymentSchema);
