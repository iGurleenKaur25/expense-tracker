import { useState } from "react";
import PayEmiModal from "./PayEmiModal";
import PaymentHistory from "./PaymentHistory";

const LoanCard = ({ loan, refreshLoans }) => {
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const paid = (loan.loanAmount || 0) - (loan.remainingAmount || 0);
  const pct = loan.loanAmount > 0 ? Math.round((paid / loan.loanAmount) * 100) : 0;
  const isPaid = loan.status === "paid";

  return (
    <>
      <style>{`
        .loan-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          padding: 1.25rem 1.5rem;
          transition: box-shadow 0.15s;
        }
        .loan-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
        .loan-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .loan-title {
          font-size: 1rem;
          font-weight: 600;
          color: #111;
          margin: 0 0 0.25rem;
        }
        .loan-status {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
        }
        .status-active { background: #eff6ff; color: #1d4ed8; }
        .status-paid { background: #f0fdf4; color: #16a34a; }
        .loan-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem 1rem;
          margin-bottom: 1rem;
        }
        .meta-item { font-size: 0.8rem; }
        .meta-label { color: #9ca3af; margin-bottom: 0.1rem; }
        .meta-value { font-weight: 500; color: #374151; }
        .progress-section { margin-bottom: 1rem; }
        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.35rem;
        }
        .progress-bar-bg {
          height: 6px;
          background: #f3f4f6;
          border-radius: 99px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 99px;
          background: #2563eb;
          transition: width 0.4s ease;
        }
        .progress-bar-fill.done { background: #16a34a; }
        .loan-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #f3f4f6;
        }
        .btn-pay {
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.45rem 1.1rem;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-pay:hover { background: #1d4ed8; }
        .btn-history {
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.45rem 1.1rem;
          font-size: 0.85rem;
          color: #374151;
          cursor: pointer;
          transition: background 0.15s;
        }
        .btn-history:hover { background: #f9fafb; }
        .paid-badge {
          font-size: 0.8rem;
          color: #16a34a;
          font-weight: 500;
        }
      `}</style>

      <div className="loan-card">
        <div className="loan-card-header">
          <div>
            <h2 className="loan-title">{loan.title || "Unnamed Loan"}</h2>
            <span className={`loan-status ${isPaid ? "status-paid" : "status-active"}`}>
              {isPaid ? "✓ Paid off" : "Active"}
            </span>
          </div>
        </div>

        <div className="loan-meta">
          <div className="meta-item">
            <div className="meta-label">Loan amount</div>
            <div className="meta-value">₹{(loan.loanAmount || 0).toLocaleString("en-IN")}</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Monthly EMI</div>
            <div className="meta-value">₹{(loan.emi || 0).toLocaleString("en-IN")}</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Remaining</div>
            <div className="meta-value" style={{ color: isPaid ? "#16a34a" : "#dc2626" }}>
              ₹{(loan.remainingAmount || 0).toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-labels">
            <span>₹{paid.toLocaleString("en-IN")} paid</span>
            <span>{pct}%</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className={`progress-bar-fill${isPaid ? " done" : ""}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="loan-actions">
          {!isPaid && (
            <button className="btn-pay" onClick={() => setShowModal(true)}>
              Pay EMI
            </button>
          )}
          {isPaid && <span className="paid-badge">✓ Fully paid</span>}
          <button className="btn-history" onClick={() => setShowHistory((p) => !p)}>
            {showHistory ? "Hide history" : "View history"}
          </button>
        </div>

        {showHistory && <PaymentHistory loanId={loan._id} />}
      </div>

      {showModal && (
        <PayEmiModal
          loan={loan}
          close={() => setShowModal(false)}
          refreshLoans={refreshLoans}
        />
      )}
    </>
  );
};

export default LoanCard;