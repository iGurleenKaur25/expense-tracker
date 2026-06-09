import { useState } from "react";
import API from "../../api/axiosInstance";

const PayEmiModal = ({ loan, close, refreshLoans }) => {
  const [amount, setAmount] = useState(String(loan.emi || ""));
  const [paymentType, setPaymentType] = useState("EMI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const remaining = loan.remainingAmount || 0;
  const parsed = Number(amount);
  const isValid = parsed > 0 && parsed <= remaining;

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      await API.post("/payments", {
        loanId: loan._id,
        amountPaid: parsed,
        paymentType
      });
      refreshLoans();
      close();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    { label: "EMI", value: loan.emi },
    { label: "2× EMI", value: (loan.emi || 0) * 2 },
    { label: "Full balance", value: remaining }
  ].filter((p) => p.value > 0 && p.value <= remaining);

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "1rem"
      }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <style>{`
        .modal-box {
          background: #fff;
          border-radius: 16px;
          padding: 1.5rem;
          width: 100%;
          max-width: 380px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .modal-title { font-size: 1rem; font-weight: 600; color: #111; margin: 0; }
        .close-btn {
          background: none; border: none; cursor: pointer;
          color: #9ca3af; font-size: 1.25rem; line-height: 1; padding: 0.25rem;
        }
        .modal-label {
          font-size: 0.75rem; font-weight: 500; color: #6b7280;
          text-transform: uppercase; letter-spacing: 0.04em;
          display: block; margin-bottom: 0.4rem;
        }
        .balance-hint {
          font-size: 0.8rem; color: #6b7280; margin-bottom: 1rem;
        }
        .balance-hint strong { color: #111; }
        .presets {
          display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;
        }
        .preset-btn {
          background: #f3f4f6; border: 1px solid #e5e7eb;
          border-radius: 6px; padding: 0.3rem 0.75rem;
          font-size: 0.75rem; color: #374151; cursor: pointer;
          transition: background 0.1s;
        }
        .preset-btn:hover { background: #e5e7eb; }
        .preset-btn.active { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
        .amount-input {
          width: 100%; padding: 0.6rem 0.9rem;
          font-size: 1.1rem; font-weight: 500;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          outline: none; box-sizing: border-box; margin-bottom: 0.5rem;
          transition: border-color 0.15s;
        }
        .amount-input:focus { border-color: #2563eb; }
        .amount-input.invalid { border-color: #dc2626; }
        .input-error { font-size: 0.75rem; color: #dc2626; margin-bottom: 0.75rem; }
        .type-row {
          display: flex; gap: 0.5rem; margin-bottom: 1.25rem;
        }
        .type-btn {
          flex: 1; padding: 0.45rem 0;
          font-size: 0.8rem; font-weight: 500;
          border-radius: 8px; border: 1.5px solid #e5e7eb;
          cursor: pointer; background: #fff; color: #374151;
          transition: all 0.1s;
        }
        .type-btn.selected {
          background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8;
        }
        .error-banner {
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 8px; padding: 0.75rem; color: #dc2626;
          font-size: 0.8rem; margin-bottom: 1rem;
        }
        .modal-footer { display: flex; gap: 0.75rem; }
        .btn-cancel {
          flex: 1; padding: 0.6rem;
          background: #f3f4f6; border: none;
          border-radius: 8px; font-size: 0.875rem;
          color: #374151; cursor: pointer; font-weight: 500;
        }
        .btn-confirm {
          flex: 2; padding: 0.6rem;
          background: #2563eb; color: #fff;
          border: none; border-radius: 8px;
          font-size: 0.875rem; font-weight: 600;
          cursor: pointer; transition: background 0.15s;
        }
        .btn-confirm:hover:not(:disabled) { background: #1d4ed8; }
        .btn-confirm:disabled { background: #93c5fd; cursor: not-allowed; }
      `}</style>

      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">Make a payment</h2>
          <button className="close-btn" onClick={close} aria-label="Close">×</button>
        </div>

        <p className="balance-hint">
          Remaining balance: <strong>₹{remaining.toLocaleString("en-IN")}</strong>
        </p>

        <label className="modal-label">Quick amounts</label>
        <div className="presets">
          {presets.map((p) => (
            <button
              key={p.label}
              className={`preset-btn${parsed === p.value ? " active" : ""}`}
              onClick={() => setAmount(String(p.value))}
            >
              {p.label} — ₹{p.value.toLocaleString("en-IN")}
            </button>
          ))}
        </div>

        <label className="modal-label">Amount (₹)</label>
        <input
          type="number"
          className={`amount-input${amount && !isValid ? " invalid" : ""}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min={1}
          max={remaining}
        />
        {amount && !isValid && (
          <p className="input-error">
            {parsed <= 0
              ? "Enter an amount greater than ₹0"
              : `Cannot exceed remaining balance of ₹${remaining.toLocaleString("en-IN")}`}
          </p>
        )}

        <label className="modal-label">Payment type</label>
        <div className="type-row">
          {["EMI", "EXTRA"].map((t) => (
            <button
              key={t}
              className={`type-btn${paymentType === t ? " selected" : ""}`}
              onClick={() => setPaymentType(t)}
            >
              {t === "EMI" ? "Regular EMI" : "Extra payment"}
            </button>
          ))}
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="modal-footer">
          <button className="btn-cancel" onClick={close}>Cancel</button>
          <button
            className="btn-confirm"
            onClick={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading ? "Processing…" : `Pay ₹${parsed > 0 ? parsed.toLocaleString("en-IN") : "—"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayEmiModal;