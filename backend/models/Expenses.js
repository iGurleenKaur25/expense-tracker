const mongoose = require("mongoose");


const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    category: { type: String, enum: ["Food","Travel","Rent","Shopping","Bills","Health","Other"], default: "Other" },
    paymentType: { type: String, enum: ["Cash","UPI","Card","NetBanking","Other"], default: "Other" },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
