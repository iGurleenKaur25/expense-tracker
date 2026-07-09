
import API from "../../api/axiosInstance";

const CATEGORY_COLORS = {
  Food: { bg: "#fef3c7", color: "#92400e" },
  Travel: { bg: "#ede9fe", color: "#5b21b6" },
  Rent: { bg: "#fee2e2", color: "#991b1b" },
  Shopping: { bg: "#fce7f3", color: "#9d174d" },
  Bills: { bg: "#e0f2fe", color: "#075985" },
  Health: { bg: "#dcfce7", color: "#166534" },
  Other: { bg: "#f3f4f6", color: "#374151" },
};

const ExpenseItem = ({ expense, onDelete, onEdit }) => {
  const colors = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;

  const handleDelete = async () => {
    try {
      await API.delete(`/expenses/${expense._id}`);
      onDelete(expense._id);
    } catch (error) {
      console.error("Delete failed", error);
      onDelete(expense._id);
    }
  };

  return (
    <div className="expense-item">
     <style>{`
  .expense-item {
    background: #fff; border: 1px solid #e5e0d4; border-radius: 10px;
    padding: 0.75rem 1rem; display: flex; align-items: center;
    justify-content: space-between; gap: 1rem;
    font-family: -apple-system, sans-serif;
  }
  .ei-left { display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 0; }
  .ei-info { flex: 1; min-width: 0; }
  .ei-title { font-size: 0.875rem; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ei-meta { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.2rem; flex-wrap: wrap; }
  .ei-cat { font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 20px; }
  .ei-date { font-size: 0.72rem; color: #9ca3af; }
  .ei-ptype { font-size: 0.65rem; color: #6b7280; }
  .ei-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
  .ei-amount { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
  .ei-edit { background: none; border: 1px solid #e5e0d4; border-radius: 6px; padding: 0.28rem 0.65rem; font-size: 0.75rem; color: #374151; cursor: pointer; }
  .ei-edit:hover { background: #faf7f0; }
  .ei-del { background: none; border: 1px solid #fecaca; border-radius: 6px; padding: 0.28rem 0.65rem; font-size: 0.75rem; color: #dc2626; cursor: pointer; }
  .ei-del:hover { background: #fef2f2; }
`}</style>

      <div className="ei-left">
        <div className="ei-info">
          <div className="ei-title">{expense.title}</div>
          <div className="ei-meta">
            <span className="ei-cat" style={{ background: colors.bg, color: colors.color }}>
              {expense.category}
            </span>
            {expense.paymentType && (
              <span className="ei-ptype">{expense.paymentType}</span>
            )}
            <span className="ei-date">
              {new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </div>
        </div>
      </div>

      <div className="ei-right">
        <span className="ei-amount">₹{Number(expense.amount).toLocaleString("en-IN")}</span>
        <button className="ei-edit" onClick={() => onEdit(expense)}>Edit</button>
        <button className="ei-del" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default ExpenseItem;