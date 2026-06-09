import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseList from "../components/expenses/ExpenseList";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (error) {
      console.error("Fetch expenses failed", error);
    } finally {
      setLoading(false);
    }
  };
const handleEditExpense = (expense) => {   // ✅ FIXED
  setEditingExpense(expense);
    window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  const handleSaveExpense = (savedExpense) => {
    if (editingExpense) {
      // 🔄 Update list
      setExpenses((prev) =>
        prev.map((e) => (e._id === savedExpense._id ? savedExpense : e))
      );
    } else {
      // ➕ Add new
      setExpenses((prev) => [savedExpense, ...prev]);
    }
  };

const handleDeleteExpense = async (id) => {
  try {
    await API.delete(`/expenses/${id}`);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  } catch (err) {
    console.error("Delete failed", err);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  }
};
  if (loading) return <p>Loading expenses...</p>;

  return (
    <div className="expenses-page">
      <h2>Expenses</h2>

      <ExpenseForm
        onExpenseSaved={handleSaveExpense}
        editingExpense={editingExpense}
        clearEdit={() => setEditingExpense(null)}
      />

      <ExpenseList
        expenses={expenses}
        onDelete={handleDeleteExpense}
        onEdit={(expense) => setEditingExpense(expense)}
      />
    </div>
  );
};

export default Expenses;
