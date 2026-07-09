const Loan = require("../models/Loan");
const Notification = require("../models/Notification");

exports.addLoan = async (req, res) => {
  try {
    const { loanName, loanAmount, interestRate, emi, emiDueDay, startDate } = req.body;
    const dueDay = emiDueDay || 1;
    const nextDue = new Date();
    nextDue.setDate(dueDay);
    if (nextDue < new Date()) nextDue.setMonth(nextDue.getMonth() + 1);

    const loan = await Loan.create({
      userId: req.user._id,
      loanName,
      loanAmount,
      remainingAmount: loanAmount,
      interestRate,
      emi,
      emiDueDay: dueDay,
      nextDueDate: nextDue,
      startDate,
    });
    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user._id });

    // Auto-generate EMI_DUE / EMI_OVERDUE notifications — loans only, not fees
    const now = new Date();
    for (const loan of loans) {
      if (loan.status !== "ACTIVE" || !loan.nextDueDate) continue;
      const daysUntil = Math.ceil((loan.nextDueDate - now) / (1000 * 60 * 60 * 24));
      const label = loan.category === "FEE" ? `${loan.feeType} fee` : "EMI";
      const amountDue = loan.category === "FEE" ? loan.loanAmount : loan.emi;

      if (daysUntil <= 3 && daysUntil >= 0) {
        const exists = await require("../models/Notification").findOne({
          userId: req.user._id, loanId: loan._id, type: "EMI_DUE",
          createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) },
        });
        if (!exists) {
          await require("../models/Notification").create({
            userId: req.user._id, loanId: loan._id, type: "EMI_DUE",
            title: `${label} due soon`,
            message: `${label} of ₹${(amountDue || 0).toLocaleString("en-IN")} for "${loan.loanName}" is due in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}.`,
          });
        }
      } else if (daysUntil < 0) {
        const exists = await require("../models/Notification").findOne({
          userId: req.user._id, loanId: loan._id, type: "EMI_OVERDUE",
          createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) },
        });
        if (!exists) {
          await require("../models/Notification").create({
            userId: req.user._id, loanId: loan._id, type: "EMI_OVERDUE",
            title: `${label} overdue`,
            message: `${label} for "${loan.loanName}" was due on ${loan.nextDueDate.toLocaleDateString("en-IN")} and hasn't been paid yet.`,
          });
        }
      }
    }

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    if (loan.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });
    const updated = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    if (loan.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });
    await loan.deleteOne();
    res.json({ message: "Loan deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.simulateLoanClearance = async (req, res) => {
  try {
    const {
      loanName, loanAmount, interestRate,
      tenureMonths,   // mode A: user knows tenure
      emiAmount,      // mode B: user knows EMI → calculate tenure
      extraPayment = 0,
      emiDueDay = 1,
    } = req.body;

    if (!loanName || !loanAmount || !interestRate)
      return res.status(400).json({ message: "loanName, loanAmount and interestRate are required" });
    if (!tenureMonths && !emiAmount)
      return res.status(400).json({ message: "Provide either tenureMonths or emiAmount" });

    const monthlyRate = interestRate / 12 / 100;
    let emi, tenure;

    if (tenureMonths) {
      tenure = tenureMonths;
      emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
            (Math.pow(1 + monthlyRate, tenure) - 1);
    } else {
      emi = emiAmount;
      const minEmi = loanAmount * monthlyRate;
      if (emi <= minEmi)
        return res.status(400).json({ message: `EMI must be greater than ₹${Math.ceil(minEmi)} (monthly interest)` });

      tenure = Math.ceil(
        -Math.log(1 - (loanAmount * monthlyRate) / emi) / Math.log(1 + monthlyRate)
      );
    }

    const simulate = (extra) => {
      let balance = loanAmount, totalInterest = 0, months = 0;
      while (balance > 0 && months < 1200) {
        const interest = balance * monthlyRate;
        let principal = emi - interest;
        if (principal + extra > balance) principal = balance;
        balance -= principal + extra;
        totalInterest += interest;
        months++;
      }
      return { months, totalInterest: Math.round(totalInterest) };
    };

    const normal = simulate(0);
    const withExtra = simulate(extraPayment);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + withExtra.months);

    const now = new Date();
    const nextDue = new Date(now.getFullYear(), now.getMonth(), emiDueDay);
    if (nextDue < now) nextDue.setMonth(nextDue.getMonth() + 1);

    const loan = await Loan.create({
      userId: req.user._id,
      loanName,
      loanAmount,
      remainingAmount: loanAmount,
      interestRate,
      tenureMonths: tenure,
      extraPayment,
      emi: Math.round(emi),
      interestSaved: normal.totalInterest - withExtra.totalInterest,
      monthsSaved: normal.months - withExtra.months,
      estimatedEndDate: endDate,
      emiDueDay,
      nextDueDate: nextDue,
      category: "LOAN",
    });

    res.status(200).json({
      message: "Loan simulation successful",
      data: loan,
      simulation: {
        emi: Math.round(emi),
        tenure,
        totalInterest: normal.totalInterest,
        withExtraPayment: withExtra,
        monthsSaved: normal.months - withExtra.months,
        interestSaved: normal.totalInterest - withExtra.totalInterest,
      },
    });
  } catch (error) {
    console.error("simulateLoanClearance error:", error);
    res.status(500).json({ message: "Loan simulation failed" });
  }
};

// NEW — simple recurring fee for students, no interest/EMI math, fixed monthly amount
exports.addFeeLoan = async (req, res) => {
  try {
    const { feeType, amount, dueDay } = req.body;

    const validTypes = ["Hostel", "Mess"];
    if (!feeType || !validTypes.includes(feeType))
      return res.status(400).json({ message: "feeType must be Hostel, Mess " });
    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const day = dueDay || 5;
    const nextDue = new Date();
    nextDue.setDate(day);
    if (nextDue < new Date()) nextDue.setMonth(nextDue.getMonth() + 1);

    const loan = await Loan.create({
      userId: req.user._id,
      loanName: `${feeType} Fee`,
      loanAmount: amount,
      remainingAmount: amount,
      interestRate: 0,
      emi: null,
      category: "FEE",
      feeType,
      status: "ACTIVE",
      emiDueDay: day,
      nextDueDate: nextDue,
    });

    res.status(201).json({ message: "Fee added successfully", data: loan });
  } catch (error) {
    console.error("addFeeLoan error:", error);
    res.status(500).json({ message: "Failed to add fee" });
  }
};