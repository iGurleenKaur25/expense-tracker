const Expense = require("../models/Expenses");

const calculateFinancialStats = (expenses) => {

    let total = 0;

    const categoryTotals = {};

    let highestExpense = null;

    const monthlyTotals = {};

    for (const expense of expenses) {

        // Total
        total += expense.amount;


        // Category
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }

        categoryTotals[expense.category] += expense.amount;


        // Monthly spending
        const month = new Date(expense.date)
            .toISOString()
            .slice(0, 7);

        if (!monthlyTotals[month]) {
            monthlyTotals[month] = 0;
        }

        monthlyTotals[month] += expense.amount;


        // Highest individual expense
        if (
            !highestExpense ||
            expense.amount > highestExpense.amount
        ) {
            highestExpense = expense;
        }
    }


    // Highest category
    let highestCategory = null;
    let highestCategoryAmount = 0;

    for (const category in categoryTotals) {

        if (categoryTotals[category] > highestCategoryAmount) {

            highestCategory = category;
            highestCategoryAmount =
                categoryTotals[category];
        }
    }

     const months = Object.keys(monthlyTotals).sort();

let monthlyComparison = null;

if (months.length >= 2) {
    const currentMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];

    const currentAmount = monthlyTotals[currentMonth];
    const previousAmount = monthlyTotals[previousMonth];

    const difference = currentAmount - previousAmount;

    const percentageChange =
        previousAmount > 0
            ? (difference / previousAmount) * 100
            : 0;

    monthlyComparison = {
        currentMonth,
        previousMonth,
        currentAmount,
        previousAmount,
        difference,
        percentageChange
    };
}
    // Average
    const average =
        expenses.length > 0
            ? total / expenses.length
            : 0;


    return {
        total,
        categoryTotals,
        highestCategory,
        highestCategoryAmount,
        highestExpense,
        average,
        monthlyTotals,
          monthlyComparison
    };
};


const askAI = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        // Get only this user's expenses
        const expenses = await Expense.find({
            userId: req.user._id
        }).sort({ date: -1 });

        // Send only useful financial information to AI
        const expenseData = expenses.map((expense) => ({
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            paymentType: expense.paymentType,
            date: expense.date,
            notes: expense.notes
        }));

        const financialStats = calculateFinancialStats(expenseData);

        // Send question + expense data to FastAPI
        const response = await fetch(
            "https://expense-tracker-ai-5i1q.onrender.com/ask",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: question,
                    expenses: expenseData,
                    financial_stats: financialStats
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        console.error("AI ERROR:", error);

        res.status(500).json({
            message: "Could not process AI request",
             error: error.message
        });
    }
};

module.exports = {
    askAI
};