import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

import LoanSimulationForm from "../components/loans/LoanSimulationForm";
import LoanList from "../components/loans/LoanList";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await API.get("/loans");
      setLoans(res.data);
    } catch (error) {
      console.error("Fetch loans failed", error);
    } finally {
      setLoading(false);
    }
  };

  const addLoanToList = (loan) => {
    setLoans((prev) => [loan, ...prev]);
  };

  if (loading) return <p>Loading loans...</p>;

  return (
    <div>
      <h2>Loans</h2>

      <LoanSimulationForm onLoanCreated={addLoanToList} />

      <LoanList loans={loans} />
    </div>
  );
};

export default Loans;
