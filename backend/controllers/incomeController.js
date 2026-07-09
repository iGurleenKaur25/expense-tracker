const Income = require("../models/Income");

exports.addIncome = async (req, res) => {
  const { amount, source, date, notes } = req.body;
  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Valid amount is required" });

  try {
    const income = await Income.create({
      userId: req.user._id,
      amount,
      source: source || "Salary",
      date: date || new Date(),
      notes,
    });
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getIncome = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(income);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) return res.status(404).json({ message: "Income not found" });
    if (income.userId.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    const updated = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, userId: req.user._id });
    if (!income) return res.status(404).json({ message: "Income not found" });
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET monthly income summary for dashboard
exports.getIncomeSummary = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user._id });
    const total = income.reduce((s, i) => s + i.amount, 0);
    res.json({ total, count: income.length, entries: income });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};