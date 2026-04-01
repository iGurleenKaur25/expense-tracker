const Loan = require('../models/Loan');

exports.addLoan = async (req, res) => {
  try {
    const loan = await Loan.create({
      userId: req.user._id,
      title: req.body.title,
      totalAmount: req.body.totalAmount,
      interestRate: req.body.interestRate,
      emi: req.body.emi,
      remainingAmount: req.body.totalAmount,
      startDate: req.body.startDate
    });

    res.status(201).json(loan);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user._id });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculates EMI
// ✔ Simulates loan month-by-month
// ✔ Shows benefit of extra payments
// ✔ Stores personalized data per user
// ✔ Real finance logic (great for projects & interviews)


exports.simulateLoanClearance = async (req, res) => {
  try {
    const {
      loanAmount,
      interestRate,
      tenureMonths,
      extraPayment = 0
    } = req.body;

    if (!loanAmount || !interestRate || !tenureMonths) {
      return res.status(400).json({
        message: "All loan fields are required"
      });
    }

    const monthlyRate = interestRate / 12 / 100;

    const emi =
      (loanAmount *
        monthlyRate *
        Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    const simulate = (extra) => {
      let balance = loanAmount;
      let totalInterest = 0;
      let months = 0;

      while (balance > 0) {
        const interest = balance * monthlyRate;
        let principalPaid = emi - interest;

        if (principalPaid + extra > balance) {
          principalPaid = balance;
        }

        balance -= (principalPaid + extra);
        totalInterest += interest;
        months++;
      }

      return {
        months,
        totalInterest: Math.round(totalInterest)
      };
    };

    const normal = simulate(0);
    const withExtra = simulate(extraPayment);

    const monthsSaved = normal.months - withExtra.months;
    const interestSaved =
      normal.totalInterest - withExtra.totalInterest;

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + withExtra.months);

    const loan = await Loan.create({
      userId: req.user._id,
      loanAmount,
      interestRate,
      tenureMonths,
      extraPayment,
      emi: Math.round(emi),
      interestSaved,
      monthsSaved,
      estimatedEndDate: endDate
    });

    res.status(200).json({
      message: "Loan simulation successful",
      data: loan
    });

  } catch (error) {
    res.status(500).json({
      message: "Loan simulation failed"
    });
  }
};  
