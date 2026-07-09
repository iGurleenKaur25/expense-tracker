import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import LoanCard from "../components/payments/LoanCard";

const Payments = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoans = async () => {
    setError(null);
    try {
      const res = await API.get("/loans");
      setLoans(res.data?.data || res.data || []);
    } catch (err) {
      setError("Couldn't load your loans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLoans(); }, []);

  const totalLoaned = loans.reduce((s, l) => s + (l.loanAmount || 0), 0);
  const totalRemaining = loans.reduce((s, l) => s + (l.remainingAmount || 0), 0);
  const activeLoans = loans.filter((l) => l.status === "ACTIVE").length;
  const totalPaid = totalLoaned - totalRemaining;
  const overallPct = totalLoaned > 0 ? Math.round((totalPaid / totalLoaned) * 100) : 0;

  return (
    <div className="payments-page">
    <style>{`
  .payments-page {
    min-height: 100vh; background: #faf7f0;
    padding: 2rem 1.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .page-header { margin-bottom: 1.5rem; }
  .page-header h1 { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 0 0 0.2rem; }
  .page-header p { color: #6b7280; font-size: 0.85rem; margin: 0; }
  .stats-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
  .stat-card { background: #fff; border-radius: 12px; padding: 1rem 1.25rem; border: 1px solid #e5e0d4; }
  .stat-label { font-size: 0.68rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem; }
  .stat-val { font-size: 1.2rem; font-weight: 700; color: #0f172a; }
  .stat-val.red { color: #dc2626; }
  .stat-val.green { color: #16a34a; }
  .overall-progress { background: #fff; border-radius: 12px; border: 1px solid #e5e0d4; padding: 1rem 1.25rem; margin-bottom: 1.75rem; }
  .op-labels { display: flex; justify-content: space-between; font-size: 0.75rem; color: #6b7280; margin-bottom: 0.4rem; }
  .op-bg { height: 8px; background: #f3f4f6; border-radius: 99px; overflow: hidden; }
  .op-fill { height: 100%; background: #0f9d64; border-radius: 99px; transition: width 0.5s ease; }
  .loans-list { display: flex; flex-direction: column; gap: 1rem; }
  .empty-state { text-align: center; padding: 3rem 1rem; color: #9ca3af; }
  .empty-state p { font-size: 0.9rem; margin-top: 1rem; }
  .skeleton { background: #fff; border-radius: 12px; height: 160px; border: 1px solid #e5e0d4; animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .error-banner { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 1rem 1.25rem; color: #dc2626; font-size: 0.85rem; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
  .retry-btn { margin-left: auto; background: none; border: 1px solid #dc2626; color: #dc2626; border-radius: 6px; padding: 0.25rem 0.75rem; font-size: 0.8rem; cursor: pointer; }
`}</style>

      <div className="page-header">
        <h1>Loan Payments</h1>
        <p>Track and manage your EMIs in one place</p>
      </div>

      {!loading && loans.length > 0 && (
        <>
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-label">Total Loaned</div>
              <div className="stat-val">₹{totalLoaned.toLocaleString("en-IN")}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Remaining</div>
              <div className={`stat-val ${totalRemaining > 0 ? "red" : "green"}`}>
                ₹{totalRemaining.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active Loans</div>
              <div className="stat-val">{activeLoans}</div>
            </div>
          </div>
          <div className="overall-progress">
            <div className="op-labels">
              <span>Overall repayment progress</span>
              <span style={{ fontWeight: 600, color: "#0f172a" }}>{overallPct}%</span>
            </div>
            <div className="op-bg">
              <div className="op-fill" style={{ width: `${overallPct}%` }} />
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button className="retry-btn" onClick={fetchLoans}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="loans-list">{[1, 2].map((i) => <div key={i} className="skeleton" />)}</div>
      ) : loans.length === 0 && !error ? (
        <div className="empty-state">
          <svg width="48" height="48" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
          </svg>
          <p>No loans yet. Go to Loans to add one.</p>
        </div>
      ) : (
        <div className="loans-list">
          {loans.map((loan) => (
            <LoanCard key={loan._id} loan={loan} refreshLoans={fetchLoans} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
         