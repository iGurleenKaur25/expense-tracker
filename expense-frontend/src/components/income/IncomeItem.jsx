import API from "../../api/axiosInstance";

const SOURCE_COLORS = {
  Salary: { bg: "#dcfce7", color: "#166534" },
  Freelance: { bg: "#e0f2fe", color: "#075985" },
  Business: { bg: "#ede9fe", color: "#5b21b6" },
  Investment: { bg: "#fef3c7", color: "#92400e" },
  Gift: { bg: "#fce7f3", color: "#9d174d" },
  Other: { bg: "#f3f4f6", color: "#374151" },
};

const IncomeItem = ({ income, onDelete, onEdit }) => {
  const colors = SOURCE_COLORS[income.source] || SOURCE_COLORS.Other;

  const handleDelete = async () => {
    try {
      await API.delete(`/income/${income._id}`);
    } catch (err) {
      console.error("Delete failed", err);
    }
    onDelete(income._id);
  };

  return (
    <div className="income-item">
      <style>{`
        .income-item { background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:0.75rem 1rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; font-family:-apple-system, sans-serif; }
        .ii-info { flex:1; min-width:0; }
        .ii-meta { display:flex; align-items:center; gap:0.5rem; margin-top:0.2rem; flex-wrap:wrap; }
        .ii-src { font-size:0.65rem; font-weight:600; padding:0.15rem 0.5rem; border-radius:20px; }
        .ii-date { font-size:0.72rem; color:#9ca3af; }
        .ii-notes { font-size:0.78rem; color:#6b7280; }
        .ii-right { display:flex; align-items:center; gap:0.5rem; flex-shrink:0; }
        .ii-amount { font-size:0.95rem; font-weight:700; color:#16a34a; }
        .ii-edit { background:none; border:1px solid #e5e7eb; border-radius:6px; padding:0.28rem 0.65rem; font-size:0.75rem; color:#374151; cursor:pointer; }
        .ii-edit:hover { background:#f9fafb; }
        .ii-del { background:none; border:1px solid #fecaca; border-radius:6px; padding:0.28rem 0.65rem; font-size:0.75rem; color:#dc2626; cursor:pointer; }
        .ii-del:hover { background:#fef2f2; }
      `}</style>

      <div className="ii-info">
        <div className="ii-meta">
          <span className="ii-src" style={{ background: colors.bg, color: colors.color }}>{income.source}</span>
          <span className="ii-date">{new Date(income.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          {income.notes && <span className="ii-notes">— {income.notes}</span>}
        </div>
      </div>

      <div className="ii-right">
        <span className="ii-amount">+₹{Number(income.amount).toLocaleString("en-IN")}</span>
        <button className="ii-edit" onClick={() => onEdit(income)}>Edit</button>
        <button className="ii-del" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default IncomeItem;