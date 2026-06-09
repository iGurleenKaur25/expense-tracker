// import { useEffect, useState } from "react";
// // import API from "../api/axiosInstance";
// import API from "../../api/axiosInstance";
// const PaymentHistory = ({ loanId }) => {
//   const [payments, setPayments] = useState([]);

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   const fetchPayments = async () => {
//     try {
//       const res = await API.get(`/payments/loan/${loanId}`);
//       setPayments(res.data.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="mt-3">
//       <h4 className="font-semibold">Payment History</h4>

//       {payments.length === 0 ? (
//         <p>No payments yet</p>
//       ) : (
//         <ul>
//           {payments.map((p) => (
//             <li key={p._id}>
//               ₹{p.amountPaid} -{" "}
//               {new Date(p.paymentDate).toLocaleDateString()}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default PaymentHistory;

import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

const PaymentHistory = ({ loanId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get(`/payments/loan/${loanId}`);
        setPayments(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch payments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [loanId]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric"
    });

  return (
    <div style={{ marginTop: "1.25rem" }}>
      <style>{`
        .history-header {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #6b7280;
          margin-bottom: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #f3f4f6;
        }
        .history-list { display: flex; flex-direction: column; gap: 0.4rem; }
        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 0.85rem;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 0.82rem;
        }
        .history-item-left { display: flex; align-items: center; gap: 0.6rem; }
        .history-type {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.15rem 0.5rem;
          border-radius: 20px;
          background: #eff6ff;
          color: #1d4ed8;
        }
        .history-type.extra {
          background: #fefce8;
          color: #854d0e;
        }
        .history-date { color: #9ca3af; }
        .history-amount { font-weight: 600; color: #111; }
        .history-empty { color: #9ca3af; font-size: 0.8rem; text-align: center; padding: 0.75rem 0; }
        .history-skeleton {
          height: 36px; border-radius: 8px;
          background: #f3f4f6; animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div className="history-header">Payment history</div>

      {loading ? (
        <div className="history-list">
          {[1, 2].map((i) => <div key={i} className="history-skeleton" />)}
        </div>
      ) : payments.length === 0 ? (
        <div className="history-empty">No payments recorded yet</div>
      ) : (
        <div className="history-list">
          {payments.map((p) => (
            <div key={p._id} className="history-item">
              <div className="history-item-left">
                <span className={`history-type${p.paymentType === "EXTRA" ? " extra" : ""}`}>
                  {p.paymentType}
                </span>
                <span className="history-date">{formatDate(p.paymentDate)}</span>
              </div>
              <span className="history-amount">
                +₹{(p.amountPaid || 0).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;