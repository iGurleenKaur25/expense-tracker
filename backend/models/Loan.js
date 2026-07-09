const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    loanName: { type: String, required: true },
    loanAmount: { type: Number, required: true },
    remainingAmount: { type: Number, default: 0 },
    interestRate: { type: Number, default: 0 },   // no longer required — fees have no interest
    tenureMonths: { type: Number },
    extraPayment: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "CLOSED"], default: "ACTIVE" },
    emi: Number,
    interestSaved: Number,
    monthsSaved: Number,
    estimatedEndDate: Date,
    emiDueDay: { type: Number, default: 1 },
    nextDueDate: { type: Date },
    lastEmiMonth: { type: Number },
    lastEmiYear: { type: Number },

    // NEW — distinguishes real loans from student fee entries
    category: { type: String, enum: ["LOAN", "FEE"], default: "LOAN" },
    feeType: { type: String, enum: ["Hostel", "Mess"] }, // only set when category === "FEE"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);