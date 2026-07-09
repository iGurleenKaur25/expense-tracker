

const mongoose = require("mongoose");

const loanPaymentSchema = new mongoose.Schema(
  {
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan" }, // no longer required — fees don't have a loan
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amountPaid: { type: Number, required: true, min: [1, "Payment must be greater than 0"] },
    remainingAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "paid"], default: "active" },
    paymentType: { type: String, enum: ["EMI", "EXTRA", "FEE"], default: "EMI" },
    paymentDate: { type: Date, default: Date.now },
    paymentMonth: { type: Number },   // 0-11
    paymentYear: { type: Number },

    // NEW — fee-specific fields, only set when paymentType === "FEE"
    category: { type: String, enum: ["LOAN", "FEE"], default: "LOAN" },
    feeType: { type: String, enum: ["Hostel", "Mess"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", loanPaymentSchema);