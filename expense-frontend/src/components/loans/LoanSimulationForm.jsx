import { useState ,useEffect} from "react";
import API from "../../api/axiosInstance";

const LoanSimulationForm = ({ onLoanCreated,editingLoan, onSave }) => {
  const [loanName, setLoanName] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenureMonths, setTenureMonths] = useState("");
  const [extraPayment, setExtraPayment] = useState("");
  
   // ✅ PREFILL FORM
  useEffect(() => {
    if (editingLoan) {
      setLoanName(editingLoan.loanName);
      setLoanAmount(editingLoan.loanAmount);
      setInterestRate(editingLoan.interestRate);
      setTenureMonths(editingLoan.tenureMonths);
      setExtraPayment(editingLoan.extraPayment || "");
    }
  }, [editingLoan]);

const handleSubmit = async (e) => {
  console.log("FORM SUBMITTED");
  e.preventDefault();

  try {
    let res;

    if (editingLoan) {
      res = await API.put(`/loans/${editingLoan._id}`, {
        loanName,
        loanAmount,
        interestRate,
        tenureMonths,
        extraPayment,
      });

      onSave(res.data);
    } else {
      res = await API.post("/loans/simulate", {
        loanName,
        loanAmount,
        interestRate,
        tenureMonths,
        extraPayment,
      });

      console.log(res.data); // 🔍 DEBUG
      onLoanCreated(res.data.data || res.data); // ✅ SAFE FIX
    }

    clearForm();
  } catch (error) {
    console.error("Loan action failed", error);
  }
};
  const clearForm = () => {
    setLoanName("");
    setLoanAmount("");
    setInterestRate("");
    setTenureMonths("");
    setExtraPayment(0);
  };

  return (
    <form onSubmit={handleSubmit} className="loan-form">
      <input
        type="string"
        placeholder="Loan Name"
        value={loanName}
        onChange={(e) => setLoanName(e.target.value)}
        required
      />
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
    <button type="submit">
  {editingLoan ? "Update Loan" : "Simulate & Save Loan"}
</button>
    </form>
  );
};

export default LoanSimulationForm;
