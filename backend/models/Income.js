const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: [1, "Amount must be greater than 0"] },
    source: {
      type: String,
      enum: ["Salary", "Freelance", "Business", "Allowance","Investment", "Gift", "Other"],
      default: "Salary",
    },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);