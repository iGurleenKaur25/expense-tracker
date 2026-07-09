
import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

const CATEGORIES = ["Food", "Travel", "Rent", "Shopping", "Bills", "Health", "Other"];
const PAYMENT_TYPES = ["Cash", "UPI", "Card", "NetBanking", "Other"];

const ExpenseForm = ({ onExpenseSaved, editingExpense, clearEdit }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [paymentType, setPaymentType] = useState("UPI");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title || "");
      setAmount(editingExpense.amount || "");
      setCategory(editingExpense.category || "Food");
      setPaymentType(editingExpense.paymentType || "UPI");
      setNotes(editingExpense.notes || "");
    }
  }, [editingExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let res;
      const payload = { title, amount: Number(amount), category, paymentType, notes, date: new Date() };
      if (editingExpense) {
        res = await API.put(`/expenses/${editingExpense._id}`, payload);
      } else {
        res = await API.post("/expenses", payload);
      }
      onExpenseSaved(res.data);
      clearForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save expense.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTitle(""); setAmount(""); setCategory("Food");
    setPaymentType("UPI"); setNotes(""); setError("");
    if (clearEdit) clearEdit();
  };

  return (
    <div className="expense-form-wrap">
      <style>{`
  .expense-form-wrap {
    background: #fff; border: 1px solid #e5e0d4;
    border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .ef-title { font-size: 0.95rem; font-weight: 600; color: #0f172a; margin: 0 0 1rem; }
  .ef-form { display: flex; flex-direction: column; gap: 0.65rem; }
  .ef-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
  .ef-group { display: flex; flex-direction: column; gap: 0.3rem; }
  .ef-label { font-size: 0.72rem; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em; }
  .ef-input, .ef-select {
    padding: 0.5rem 0.75rem; border: 1.5px solid #e5e0d4;
    border-radius: 8px; font-size: 0.875rem; color: #0f172a;
    background: #fff; outline: none; width: 100%; box-sizing: border-box;
    transition: border-color 0.15s;
  }
  .ef-input:focus, .ef-select:focus { border-color: #0f9d64; }
  .ef-error { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 0.6rem 0.85rem; color: #dc2626; font-size: 0.8rem; }
  .ef-actions { display: flex; gap: 0.6rem; margin-top: 0.25rem; }
  .ef-submit { flex: 1; background: #0f9d64; color: #fff; border: none; border-radius: 8px; padding: 0.55rem 1rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
  .ef-submit:hover:not(:disabled) { background: #0b7a4e; }
  .ef-submit:disabled { background: #a7d9c3; cursor: not-allowed; }
  .ef-cancel { background: #f3f4f6; border: none; border-radius: 8px; padding: 0.55rem 1rem; font-size: 0.875rem; color: #374151; cursor: pointer; }
`}</style>

      <h3 className="ef-title">{editingExpense ? "Edit Expense" : "Add Expense"}</h3>

      <form className="ef-form" onSubmit={handleSubmit}>
        <div className="ef-row">
          <div className="ef-group">
            <label className="ef-label">Title</label>
            <input className="ef-input" type="text" placeholder="e.g. Lunch" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="ef-group">
            <label className="ef-label">Amount (₹)</label>
            <input className="ef-input" type="number" placeholder="e.g. 250" value={amount} onChange={(e) => setAmount(e.target.value)} required min={1} />
          </div>
        </div>

        <div className="ef-row">
          <div className="ef-group">
            <label className="ef-label">Category</label>
            <select className="ef-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="ef-group">
            <label className="ef-label">Payment type</label>
            <select className="ef-select" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              {PAYMENT_TYPES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="ef-group">
          <label className="ef-label">Notes (optional)</label>
          <input className="ef-input" type="text" placeholder="Any extra details…" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {error && <div className="ef-error">{error}</div>}

        <div className="ef-actions">
          <button className="ef-submit" type="submit" disabled={loading}>
            {loading ? "Saving…" : editingExpense ? "Update" : "Add Expense"}
          </button>
          {editingExpense && (
            <button className="ef-cancel" type="button" onClick={clearForm}>Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;