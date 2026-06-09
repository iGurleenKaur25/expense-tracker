import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

import LoanSimulationForm from "../components/loans/LoanSimulationForm";
import LoanList from "../components/loans/LoanList";
import LoanItem from "../components/loans/LoanItem";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLoan,setEditingLoan] =useState(null);

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
  
  const handleSaveLoan = (savedLoan) => {
  if (editingLoan) {
    setLoans((prev) =>
      prev.map((e) => (e._id === savedLoan._id ? savedLoan : e))
    );
    setEditingLoan(null); // IMPORTANT
  } else {
    setLoans((prev) => [savedLoan, ...prev]);
  }
};

 const handleDeleteLoan = async (id) => {
  try {
    await API.delete(`/loans/${id}`);
    setLoans((prev) => prev.filter((e) => e._id !== id));
  } catch (err) {
    console.error("Delete failed", err);
  }
};

const handleEditLoan = (loan) => {   // ✅ FIXED
  setEditingLoan(loan);
};

  if (loading) return <p>Loading loans...</p>;

  return (
    <div>
      <h2>Loans</h2>

      <LoanSimulationForm 
  onLoanCreated={addLoanToList}
  editingLoan={editingLoan}
  onSave={handleSaveLoan}
/>

     <LoanList 
      loans={loans} 
      onDelete={handleDeleteLoan}
      onEdit={handleEditLoan}
    />
    </div>
  );
};

export default Loans;
