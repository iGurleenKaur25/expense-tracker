const Expense = require('../models/Expenses');
// const jwt = require('jsonwebtoken');

exports.addExpense = async(req , res) =>{
  console.log(req.user);
  const { title, amount, category, date } = req.body;

  // 🔍 Validation
  if (!title || !amount || !category) {
    return res.status(400).json({
      message: "Title, amount and category are required",
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      message: "Amount must be greater than zero",
    });
  }

    try{
        const expense = await Expense.create({
    
            userId :req.user._id,
            title:req.body.title,
            amount :req.body.amount,
            category: req.body.category,
            paymentType: req.body.paymentType,
            date: req.body.date,
            notes: req.body.notes
        })
        res.status(201).json(expense);
        }catch(error){
          // console.log(error);
        res.status(500).json({ message: error.message });
        }
}

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user._id
    }).sort({ date: -1 });

    res.json(expenses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Authorization check
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedExpense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    console.log("Deleting ID:", req.params.id);

    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(200).json({ message: "Already deleted" });
    }

    res.json({ message: "Expense deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};