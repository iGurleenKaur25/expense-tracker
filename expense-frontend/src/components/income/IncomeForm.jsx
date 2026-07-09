import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

const SOURCES = ["Salary", "Freelance", "Business" ,"Allowance","Investment", "Gift", "Other"];

const IncomeForm = ({ onIncomeSaved, editingIncome, clearEdit }) => {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("Salary");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingIncome) {
      setAmount(editingIncome.amount || "");
      setSource(editingIncome.source || "Salary");
      setNotes(editingIncome.notes || "");
    }
  }, [editingIncome]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { amount: Number(amount), source, notes, date: new Date() };
      let res;
      if (editingIncome) {
        res = await API.put(`/income/${editingIncome._id}`, payload);
      } else {
        res = await API.post("/income", payload);
      }
      onIncomeSaved(res.data);
      clearForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save income.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setAmount(""); setSource("Salary"); setNotes(""); setError("");
    if (clearEdit) clearEdit();
  };

  return (
    <div className="income-form-wrap">
      <style>{`
        .income-form-wrap { background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:1.25rem 1.5rem; margin-bottom:1.5rem; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .if-title { font-size:0.95rem; font-weight:600; color:#111; margin:0 0 1rem; }
        .if-form { display:flex; flex-direction:column; gap:0.65rem; }
        .if-row { display:grid; grid-template-columns:1fr 1fr; gap:0.65rem; }
        .if-group { display:flex; flex-direction:column; gap:0.3rem; }
        .if-label { font-size:0.72rem; font-weight:500; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em; }
        .if-input, .if-select { padding:0.5rem 0.75rem; border:1.5px solid #e5e7eb; border-radius:8px; font-size:0.875rem; color:#111; background:#fff; outline:none; width:100%; box-sizing:border-box; transition:border-color 0.15s; }
        .if-input:focus, .if-select:focus { border-color:#16a34a; }
        .if-error { background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:0.6rem 0.85rem; color:#dc2626; font-size:0.8rem; }
        .if-actions { display:flex; gap:0.6rem; margin-top:0.25rem; }
        .if-submit { flex:1; background:#16a34a; color:#fff; border:none; border-radius:8px; padding:0.55rem 1rem; font-size:0.875rem; font-weight:600; cursor:pointer; }
        .if-submit:hover:not(:disabled) { background:#15803d; }
        .if-submit:disabled { background:#86efac; cursor:not-allowed; }
        .if-cancel { background:#f3f4f6; border:none; border-radius:8px; padding:0.55rem 1rem; font-size:0.875rem; color:#374151; cursor:pointer; }
      `}</style>

      <h3 className="if-title">{editingIncome ? "Edit Income" : "Add Income"}</h3>

      <form className="if-form" onSubmit={handleSubmit}>
        <div className="if-row">
          <div className="if-group">
            <label className="if-label">Amount (₹)</label>
            <input className="if-input" type="number" placeholder="e.g. 50000" value={amount} onChange={(e) => setAmount(e.target.value)} required min={1} />
          </div>
          <div className="if-group">
            <label className="if-label">Source</label>
            <select className="if-select" value={source} onChange={(e) => setSource(e.target.value)}>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="if-group">
          <label className="if-label">Notes (optional)</label>
          <input className="if-input" type="text" placeholder="e.g. June salary" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {error && <div className="if-error">{error}</div>}

        <div className="if-actions">
          <button className="if-submit" type="submit" disabled={loading}>
            {loading ? "Saving…" : editingIncome ? "Update" : "Add Income"}
          </button>
          {editingIncome && <button className="if-cancel" type="button" onClick={clearForm}>Cancel</button>}
        </div>
      </form>
    </div>
  );
};

export default IncomeForm;