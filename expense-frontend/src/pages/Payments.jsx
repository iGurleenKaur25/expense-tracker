// import { useEffect, useState } from "react";
// import API from "../api/axiosInstance";
// import LoanCard from "../components/payments/LoanCard";


// const Payments = () => {
//   const [loans, setLoans] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔹 Fetch Loans
//   const fetchLoans = async () => {
//     try {
//       const res = await API.get("/loans");
//       console.log("Loans Response:", res.data);

//       setLoans(res.data?.data || res.data || []);
//     } catch (err) {
//       console.log("Error fetching loans", err);
      
//     } finally {
//       setLoading(false);
//     }
    
//   };

//   useEffect(() => {
//     fetchLoans();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold mb-4">Loan Payments</h1>

//       {loading ? (
//         <p>Loading loans...</p>
//       ) :!loans || loans.length === 0 ? (
//         <p>No loans found</p>
//       ) : (
//         loans.map((loan) => (
//           <LoanCard
//             key={loan._id}
//             loan={loan}
//             refreshLoans={fetchLoans}
//           />
//         ))
//       )}
//     </div>
//   );
// };

// export default Payments;
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

  useEffect(() => {
    fetchLoans();
  }, []);

  const totalLoaned = loans.reduce((s, l) => s + (l.loanAmount || 0), 0);
  const totalRemaining = loans.reduce((s, l) => s + (l.remainingAmount || 0), 0);
  const activeLoans = loans.filter((l) => l.status !== "paid").length;

  return (
    <div className="payments-page">
      <style>{`
        .payments-page {
          min-height: 100vh;
          background: #f6f7f9;
          padding: 2rem 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .page-header {
          margin-bottom: 1.5rem;
        }
        .page-header h1 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111;
          margin: 0 0 0.25rem;
        }
        .page-header p {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }
        .stat-card {
          background: #fff;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          border: 1px solid #e5e7eb;
        }
        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.4rem;
        }
        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111;
        }
        .stat-value.danger { color: #dc2626; }
        .stat-value.success { color: #16a34a; }
        .loans-list { display: flex; flex-direction: column; gap: 1rem; }
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #6b7280;
        }
        .empty-state svg { margin-bottom: 1rem; opacity: 0.4; }
        .empty-state p { font-size: 0.95rem; margin: 0; }
        .skeleton-card {
          background: #fff;
          border-radius: 12px;
          height: 160px;
          border: 1px solid #e5e7eb;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          color: #dc2626;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .retry-btn {
          margin-left: auto;
          background: none;
          border: 1px solid #dc2626;
          color: #dc2626;
          border-radius: 6px;
          padding: 0.25rem 0.75rem;
          font-size: 0.8rem;
          cursor: pointer;
        }
      `}</style>

      <div className="page-header">
        <h1>Loan Payments</h1>
        <p>Track and manage your EMIs in one place</p>
      </div>

      {!loading && loans.length > 0 && (
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-label">Total Loaned</div>
            <div className="stat-value">₹{totalLoaned.toLocaleString("en-IN")}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Remaining</div>
            <div className={`stat-value ${totalRemaining > 0 ? "danger" : "success"}`}>
              ₹{totalRemaining.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Loans</div>
            <div className="stat-value">{activeLoans}</div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button className="retry-btn" onClick={fetchLoans}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="loans-list">
          {[1, 2].map((i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : loans.length === 0 && !error ? (
        <div className="empty-state">
          <svg width="48" height="48" fill="none" stroke="#6b7280" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
          </svg>
          <p>No loans found. Add a loan to get started.</p>
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