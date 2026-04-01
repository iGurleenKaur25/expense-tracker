import { useState } from "react";
import API from "../../api/axiosInstance";

const LoanSimulationForm = ({ onLoanCreated }) => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  const [extraPayment, setExtraPayment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/loans/simulate", {
        loanAmount,
        interestRate,
        tenureMonths,
        extraPayment,
      });

      onLoanCreated(res.data.data);
      clearForm();
    } catch (error) {
      console.error("Loan simulation failed", error);
    }
  };

  const clearForm = () => {
    setLoanAmount("");
    setInterestRate("");
    setTenureMonths("");
    setExtraPayment(0);
  };

  return (
    <form onSubmit={handleSubmit} className="loan-form">
      <input
        type="number"
        placeholder="Loan Amount"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Interest Rate (%)"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Tenure (months)"
        value={tenureMonths}
        onChange={(e) => setTenureMonths(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Extra Monthly Payment"
        value={extraPayment}
        onChange={(e) => setExtraPayment(e.target.value)}
      />

      <button type="submit">Simulate & Save Loan</button>
    </form>
  );
};

export default LoanSimulationForm;
