import { useState } from "react";
import PayEmiModal from "./PayEmiModal";
import PaymentHistory from "./PaymentHistory";
import DueDateBadge from "./DueDateBadge";

const LoanCard = ({ loan, refreshLoans }) => {
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const remaining = loan.remainingAmount ?? loan.loanAmount ?? 0;
  const paid = (loan.loanAmount || 0) - remaining;
  const pct = loan.loanAmount > 0 ? Math.min(100, Math.round((paid / loan.loanAmount) * 100)) : 0;
  const isClosed = loan.status === "CLOSED";
  const isFee = loan.category === "FEE";

  return (
    <>
     <style>{`
  .loan-card { background:#fff; border-radius:14px; border:1px solid #e5e0d4; padding:1.25rem 1.5rem; transition:box-shadow 0.15s; }
  .loan-card:hover { box-shadow:0 4px 16px rgba(0,0,0,0.07); }
  .lc-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem; }
  .lc-title-wrap { display:flex; flex-direction:column; gap:0.4rem; }
  .lc-title { font-size:1rem; font-weight:600; color:#0f172a; margin:0; }
  .lc-badges { display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; }
  .lc-badge { display:inline-block; font-size:0.68rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; padding:0.18rem 0.6rem; border-radius:20px; }
  .badge-active { background:#ecfdf5; color:#0f9d64; }
  .badge-closed { background:#f0fdf4; color:#16a34a; }
  .badge-fee { background:#fefce8; color:#854d0e; }
  .lc-meta { display:grid; grid-template-columns:repeat(3,1fr); gap:0.5rem 1rem; margin-bottom:1rem; }
  .lc-meta.fee { grid-template-columns:repeat(2,1fr); }
  .meta-label { font-size:0.7rem; color:#9ca3af; margin-bottom:0.15rem; }
  .meta-val { font-size:0.85rem; font-weight:600; color:#374151; }
  .meta-val.red { color:#dc2626; }
  .meta-val.green { color:#16a34a; }
  .prog-wrap { margin-bottom:1rem; }
  .prog-labels { display:flex; justify-content:space-between; font-size:0.72rem; color:#9ca3af; margin-bottom:0.35rem; }
  .prog-bg { height:6px; background:#f3f4f6; border-radius:99px; overflow:hidden; }
  .prog-fill { height:100%; border-radius:99px; background:#0f9d64; transition:width 0.5s ease; }
  .prog-fill.done { background:#16a34a; }
  .sim-row { display:grid; grid-template-columns:1fr 1fr; gap:0.4rem 0.75rem; margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid #f3f4f6; }
  .sim-item .sim-label { font-size:0.7rem; color:#9ca3af; }
  .sim-item .sim-val { font-size:0.8rem; font-weight:500; color:#374151; }
  .sim-item .sim-val.green { color:#16a34a; }
  .lc-footer { display:flex; align-items:center; gap:0.6rem; padding-top:0.85rem; border-top:1px solid #f3f4f6; }
  .btn-pay { background:#0f9d64; color:#fff; border:none; border-radius:8px; padding:0.45rem 1.1rem; font-size:0.82rem; font-weight:500; cursor:pointer; }
  .btn-pay:hover { background:#0b7a4e; }
  .btn-hist { background:none; border:1px solid #e5e0d4; border-radius:8px; padding:0.45rem 1rem; font-size:0.82rem; color:#374151; cursor:pointer; }
  .btn-hist:hover { background:#faf7f0; }
  .closed-badge { font-size:0.8rem; color:#16a34a; font-weight:500; }
`}</style>

      <div className="loan-card">
        <div className="lc-header">
          <div className="lc-title-wrap">
            <h2 className="lc-title">{loan.loanName || "Unnamed Loan"}</h2>
            <div className="lc-badges">
              {isFee && <span className="lc-badge badge-fee">Fee</span>}
              <span className={`lc-badge ${isClosed ? "badge-closed" : "badge-active"}`}>
                {isClosed ? "✓ Closed" : "Active"}
              </span>
              <DueDateBadge nextDueDate={loan.nextDueDate} isClosed={isClosed} />
            </div>
          </div>
        </div>

        {isFee ? (
          <div className="lc-meta fee">
            <div><div className="meta-label">Amount due</div><div className="meta-val">₹{(loan.loanAmount||0).toLocaleString("en-IN")}</div></div>
            <div><div className="meta-label">Remaining</div><div className={`meta-val ${isClosed?"green":"red"}`}>₹{remaining.toLocaleString("en-IN")}</div></div>
          </div>
        ) : (
          <div className="lc-meta">
            <div><div className="meta-label">Loan amount</div><div className="meta-val">₹{(loan.loanAmount||0).toLocaleString("en-IN")}</div></div>
            <div><div className="meta-label">Monthly EMI</div><div className="meta-val">₹{(loan.emi||0).toLocaleString("en-IN")}</div></div>
            <div><div className="meta-label">Remaining</div><div className={`meta-val ${isClosed?"green":"red"}`}>₹{remaining.toLocaleString("en-IN")}</div></div>
          </div>
        )}

        <div className="prog-wrap">
          <div className="prog-labels"><span>₹{paid.toLocaleString("en-IN")} paid</span><span>{pct}%</span></div>
          <div className="prog-bg"><div className={`prog-fill${isClosed?" done":""}`} style={{width:`${pct}%`}} /></div>
        </div>

        {!isFee && (loan.monthsSaved > 0 || loan.interestSaved > 0) && (
          <div className="sim-row">
            <div className="sim-item"><div className="sim-label">Months saved</div><div className="sim-val green">{loan.monthsSaved} mo</div></div>
            <div className="sim-item"><div className="sim-label">Interest saved</div><div className="sim-val green">₹{(loan.interestSaved||0).toLocaleString("en-IN")}</div></div>
            <div className="sim-item"><div className="sim-label">Est. end</div><div className="sim-val">{loan.estimatedEndDate ? new Date(loan.estimatedEndDate).toLocaleDateString("en-IN",{month:"short",year:"numeric"}) : "—"}</div></div>
            <div className="sim-item"><div className="sim-label">Tenure</div><div className="sim-val">{loan.tenureMonths} months</div></div>
          </div>
        )}

        <div className="lc-footer">
          {!isClosed && <button className="btn-pay" onClick={() => setShowModal(true)}>{isFee ? "Pay Fee" : "Pay EMI"}</button>}
          {isClosed && <span className="closed-badge">✓ Fully paid</span>}
          <button className="btn-hist" onClick={() => setShowHistory(p => !p)}>
            {showHistory ? "Hide history" : "View history"}
          </button>
        </div>

        {showHistory && <PaymentHistory loanId={loan._id} />}
      </div>

      {showModal && (
        <PayEmiModal loan={{...loan, remainingAmount: remaining}} close={() => setShowModal(false)} refreshLoans={refreshLoans} />
      )}
    </>
  );
};

export default LoanCard;
