import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import IncomeForm from "../components/income/IncomeForm";
import IncomeList from "../components/income/IncomeList";

const Income = () => {
  const [income, setIncome] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchIncome(); }, []);

  const fetchIncome = async () => {
    try {
      const res = await API.get("/income");
      setIncome(res.data);
    } catch (err) {
      console.error("Fetch income failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIncome = (saved) => {
    if (editingIncome) {
      setIncome((prev) => prev.map((i) => (i._id === saved._id ? saved : i)));
    } else {
      setIncome((prev) => [saved, ...prev]);
    }
    setEditingIncome(null);
  };

  const handleDeleteIncome = (id) => {
    setIncome((prev) => prev.filter((i) => i._id !== id));
  };

  const handleEditIncome = (i) => {
    setEditingIncome(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalThisMonth = income
    .filter((i) => new Date(i.date).getMonth() === new Date().getMonth())
    .reduce((s, i) => s + (i.amount || 0), 0);
  const totalAll = income.reduce((s, i) => s + (i.amount || 0), 0);

  if (loading) return <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "#6b7280" }}>Loading income…</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f0", padding: "2rem 1.5rem", fontFamily: "-apple-system, sans-serif" }}>
  <style>{`
    .inc-header { margin-bottom:1.5rem; }
    .inc-header h1 { font-size:1.6rem; font-weight:700; color:#0f172a; margin:0 0 0.2rem; }
    .inc-header p { color:#6b7280; font-size:0.85rem; margin:0; }
    .inc-stats { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.5rem; }
    .inc-stat { background:#fff; border-radius:12px; padding:0.85rem 1.1rem; border:1px solid #e5e0d4; }
    .inc-stat-label { font-size:0.8rem; color:#9ca3af; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.3rem; }
    .inc-stat-val { font-size:1.3rem; font-weight:700; color:#16a34a; }
  `}</style>

      <div className="inc-header">
        <h1>Income</h1>
        <p>Track money coming in</p>
      </div>

      <div className="inc-stats">
        <div className="inc-stat">
          <div className="inc-stat-label">This month</div>
          <div className="inc-stat-val">₹{totalThisMonth.toLocaleString("en-IN")}</div>
        </div>
        <div className="inc-stat">
          <div className="inc-stat-label">All time</div>
          <div className="inc-stat-val">₹{totalAll.toLocaleString("en-IN")}</div>
        </div>
      </div>

      <IncomeForm onIncomeSaved={handleSaveIncome} editingIncome={editingIncome} clearEdit={() => setEditingIncome(null)} />

      <IncomeList income={income} onDelete={handleDeleteIncome} onEdit={handleEditIncome} />
    </div>
  );
};

export default Income;