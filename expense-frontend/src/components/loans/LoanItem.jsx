const LoanItem = ({ loan, onEdit, onDelete }) => {
  const isClosed = loan.status === "CLOSED";
  const isFee = loan.category === "FEE";

  return (
    <div className="loan-item">
  <style>{`
    .loan-item {
      background: #fff; border: 1px solid #e5e0d4;
      border-radius: 12px; padding: 1rem 1.25rem;
      margin-bottom: 0.75rem; font-family: -apple-system, sans-serif;
    }
    .li-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
    .li-name { font-size: 1rem; font-weight: 600; color: #0f172a; margin: 0 0 0.2rem; }
    .li-badge { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; padding: 0.15rem 0.55rem; border-radius: 20px; margin-right: 0.35rem; }
    .li-badge.active { background: #ecfdf5; color: #0f9d64; }
    .li-badge.closed { background: #f0fdf4; color: #16a34a; }
    .li-badge.fee { background: #fefce8; color: #854d0e; }
    .li-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.35rem 1rem; font-size: 0.8rem; color: #6b7280; margin-bottom: 0.85rem; }
    .li-grid span { font-weight: 500; color: #374151; }
    .li-actions { display: flex; gap: 0.5rem; }
    .btn-edit { background: none; border: 1px solid #e5e0d4; border-radius: 7px; padding: 0.35rem 0.85rem; font-size: 0.78rem; color: #374151; cursor: pointer; }
    .btn-edit:hover { background: #faf7f0; }
    .btn-del { background: none; border: 1px solid #fecaca; border-radius: 7px; padding: 0.35rem 0.85rem; font-size: 0.78rem; color: #dc2626; cursor: pointer; }
    .btn-del:hover { background: #fef2f2; }
  `}</style>

      <div className="li-header">
        <div>
          <div className="li-name">{loan.loanName || "Unnamed Loan"}</div>
          {isFee && <span className="li-badge fee">Fee</span>}
          <span className={`li-badge ${isClosed ? "closed" : "active"}`}>
            {isClosed ? "Closed" : "Active"}
          </span>
        </div>
        <div className="li-actions">
          <button className="btn-edit" onClick={() => onEdit(loan)}>Edit</button>
          <button className="btn-del" onClick={() => onDelete(loan._id)}>Delete</button>
        </div>
      </div>

      {isFee ? (
        <div className="li-grid">
          <div>Amount due: <span>₹{(loan.loanAmount || 0).toLocaleString("en-IN")}</span></div>
          <div>Remaining: <span>₹{(loan.remainingAmount || 0).toLocaleString("en-IN")}</span></div>
          <div>Due date: <span>{loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "N/A"}</span></div>
        </div>
      ) : (
        <div className="li-grid">
          <div>Amount: <span>₹{(loan.loanAmount || 0).toLocaleString("en-IN")}</span></div>
          <div>EMI: <span>₹{(loan.emi || 0).toLocaleString("en-IN")}</span></div>
          <div>Interest: <span>{loan.interestRate}%</span></div>
          <div>Tenure: <span>{loan.tenureMonths} months</span></div>
          {loan.monthsSaved > 0 && <div>Months saved: <span style={{ color: "#16a34a" }}>{loan.monthsSaved}</span></div>}
          {loan.interestSaved > 0 && <div>Interest saved: <span style={{ color: "#16a34a" }}>₹{loan.interestSaved.toLocaleString("en-IN")}</span></div>}
          <div>End date: <span>{loan.estimatedEndDate ? new Date(loan.estimatedEndDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "N/A"}</span></div>
        </div>
      )}
    </div>
  );
};

export default LoanItem;