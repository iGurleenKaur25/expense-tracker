const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["EMI_DUE", "EMI_OVERDUE", "BUDGET_EXCEEDED", "PAYMENT_SUCCESS", "AI_ADVICE"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);