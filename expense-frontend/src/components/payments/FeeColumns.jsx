import { useState } from "react";
import API from "../../api/axiosInstance";

const FEE_TYPES = ["Hostel", "Mess"];

const FeeColumns = ({ onPaid }) => {
  const [amounts, setAmounts] = useState({ Hostel: "", Mess: "" });
  const [loadingType, setLoadingType] = useState(null);
  const [error, setError] = useState("");
  const [successType, setSuccessType] = useState(null);

  const handleChange = (type, value) => {
    setAmounts((prev) => ({ ...prev, [type]: value }));
  };

  const handlePay = async (type) => {
    const amount = Number(amounts[type]);
    if (!amount || amount <= 0) {
      setError(`Enter a valid amount for ${type} fee`);
      return;
    }
    setError("");
    setLoadingType(type);
    try {
      await API.post("/payments/fee", { feeType: type, amount });
      setAmounts((prev) => ({ ...prev, [type]: "" }));
      setSuccessType(type);
      setTimeout(() => setSuccessType(null), 2000);
      if (onPaid) onPaid();
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Try again.");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="fee-wrap">
      <style>{`
        .fee-wrap { margin-bottom: 1.75rem; }
        .fee-title { font-size: 0.95rem; font-weight: 600; color: #0f172a; margin: 0 0 0.85rem; }
        .fee-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem; }
        .fee-col { background: #fff; border: 1px solid #e5e0d4; border-radius: 12px; padding: 1rem 1.1rem; display: flex; flex-direction: column; gap: 0.6rem; }
        .fee-col-name { font-size: 0.8rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.04em; }
        .fee-input { padding: 0.5rem 0.7rem; border: 1.5px solid #e5e0d4; border-radius: 8px; font-size: 0.875rem; color: #0f172a; outline: none; width: 100%; box-sizing: border-box; }
        .fee-input:focus { border-color: #0f9d64; }
        .fee-pay-btn { background: #0f9d64; color: #fff; border: none; border-radius: 8px; padding: 0.5rem; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
        .fee-pay-btn:hover:not(:disabled) { background: #0b7a4e; }
        .fee-pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .fee-success { font-size: 0.75rem; color: #16a34a; font-weight: 600; }
        .fee-error { font-size: 0.78rem; color: #dc2626; margin-top: 0.5rem; }
        @media (max-width: 700px) { .fee-cols { grid-template-columns: 1fr; } }
      `}</style>

      <div className="fee-title">Hostel & Fee Payments</div>
      <div className="fee-cols">
        {FEE_TYPES.map((type) => (
          <div className="fee-col" key={type}>
            <span className="fee-col-name">{type} Fee</span>
            <input
              type="number"
              className="fee-input"
              placeholder="Amount (₹)"
              value={amounts[type]}
              onChange={(e) => handleChange(type, e.target.value)}
              min="1"
            />
            <button
              className="fee-pay-btn"
              onClick={() => handlePay(type)}
              disabled={loadingType === type}
            >
              {loadingType === type ? "Paying…" : "Pay"}
            </button>
            {successType === type && <span className="fee-success">✓ Paid successfully</span>}
          </div>
        ))}
      </div>
      {error && <div className="fee-error">{error}</div>}
    </div>
  );
};

export default FeeColumns;