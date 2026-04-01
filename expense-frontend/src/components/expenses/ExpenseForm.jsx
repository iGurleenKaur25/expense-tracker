import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

const ExpenseForm = ({ onExpenseSaved, editingExpense, clearEdit }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  // 🔁 Fill form when editing
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
    }
  }, [editingExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (editingExpense) {
        // 🔄 UPDATE
        res = await API.put(`/expenses/${editingExpense._id}`, {
          title,
          amount,
          category,
        });
      } else {
        res = await API.post("/expenses", {
          title,
          amount,
          category,
          date: new Date(),
        });
      }

      onExpenseSaved(res.data);
      clearForm();
    } catch (error) {
      console.error("Save expense failed", error);
    }
  };

  const clearForm = () => {
    setTitle("");
    setAmount("");
    setCategory("Food");
    clearEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <input
        type="text"
        placeholder="Expense title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Food</option>
        <option>Travel</option>
        <option>Shopping</option>
        <option>Rent</option>
        <option>Other</option>
      </select>

      <button type="submit">
        {editingExpense ? "Update" : "Add"} Expense
      </button>

      {editingExpense && (
        <button type="button" onClick={clearForm}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default ExpenseForm;
