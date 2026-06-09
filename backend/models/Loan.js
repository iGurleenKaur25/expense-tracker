// const mongoose = require("mongoose");

// const loanSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   loanAmount: {
//     type: Number,
//     required: true
//   },
//   interestRate: {
//     type: Number,
//     required: true
//   },
//   tenureMonths: {
//     type: Number,
//     required: true
//   },
//   extraPayment: {
//     type: Number,
//     default: 0
//   },
//   status: {
//       type: String,
//       enum: ["ACTIVE", "CLOSED"],
//       default: "ACTIVE"
//   },
//   emi: Number,
//   interestSaved: Number,
//   monthsSaved: Number,
//   estimatedEndDate: Date
// }, { timestamps: true });

// module.exports = mongoose.model("Loan", loanSchema);

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loanName:{ type: string, required: true },
  loanAmount: { type: Number, required: true },
  remainingAmount: { type: Number },          // ← ADD THIS
  interestRate: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  extraPayment: { type: Number, default: 0 },
  status: { type: String, enum: ["ACTIVE", "CLOSED"], default: "ACTIVE" },
  emi: Number,
  interestSaved: Number,
  monthsSaved: Number,
  estimatedEndDate: Date
}, { timestamps: true });
