import { useState } from "react";
import API from "../../api/axiosInstance";

const PayEmiModal = ({ loan, close, refreshLoans }) => {
  const isFee = loan.category === "FEE";
  const [amount, setAmount] = useState(String(isFee ? loan.loanAmount : loan.emi || ""));
  const [paymentType, setPaymentType] = useState(isFee ? "FEE" : "EMI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const remaining = loan.remainingAmount || 0;
  const parsed = Number(amount);
  const isValid = parsed > 0 && parsed <= remaining;

  const now = new Date();
  const alreadyPaidThisCycle =
    loan.lastEmiMonth === now.getMonth() && loan.lastEmiYear === now.getFullYear();

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setError("");
    try {
      await API.post("/payments", {
        loanId: loan._id,
        amountPaid: parsed,
        paymentType,
      });
      refreshLoans();
      close();
    } catch (err) {
      setError(err?.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const presets = isFee
    ? [{ label: "Full amount", value: loan.loanAmount }].filter((p) => p.value > 0 && p.value <= remaining)
    : [
        { label: "EMI", value: loan.emi },
        { label: "2× EMI", value: (loan.emi || 0) * 2 },
        { label: "Full balance", value: remaining },
      ].filter((p) => p.value > 0 && p.value <= remaining);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <style>{`
  .modal-box { background:#fff; border-radius:16px; padding:1.5rem; width:100%; max-width:380px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  .modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; }
  .modal-title { font-size:1rem; font-weight:600; color:#0f172a; margin:0; }
  .close-btn { background:none; border:none; cursor:pointer; color:#9ca3af; font-size:1.25rem; line-height:1; padding:0.25rem; }
  .modal-label { font-size:0.75rem; font-weight:500; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em; display:block; margin-bottom:0.4rem; }
  .balance-hint { font-size:0.8rem; color:#6b7280; margin-bottom:1rem; }
  .balance-hint strong { color:#0f172a; }
  .emi-warn { background:#fef3c7; border:1px solid #fde68a; border-radius:8px; padding:0.65rem 0.85rem; color:#92400e; font-size:0.78rem; margin-bottom:1rem; line-height:1.4; }
  .presets { display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem; }
  .preset-btn { background:#f3f4f6; border:1px solid #e5e0d4; border-radius:6px; padding:0.3rem 0.75rem; font-size:0.75rem; color:#374151; cursor:pointer; transition:background 0.1s; }
  .preset-btn:hover { background:#faf7f0; }
  .preset-btn.active { background:#ecfdf5; border-color:#a7f3d0; color:#0f9d64; }
  .amount-input { width:100%; padding:0.6rem 0.9rem; font-size:1.1rem; font-weight:500; border:1.5px solid #e5e0d4; border-radius:10px; outline:none; box-sizing:border-box; margin-bottom:0.5rem; transition:border-color 0.15s; }
  .amount-input:focus { border-color:#0f9d64; }
  .amount-input.invalid { border-color:#dc2626; }
  .input-error { font-size:0.75rem; color:#dc2626; margin-bottom:0.75rem; }
  .type-row { display:flex; gap:0.5rem; margin-bottom:1.25rem; }
  .type-btn { flex:1; padding:0.45rem 0; font-size:0.8rem; font-weight:500; border-radius:8px; border:1.5px solid #e5e0d4; cursor:pointer; background:#fff; color:#374151; transition:all 0.1s; }
  .type-btn.selected { background:#ecfdf5; border-color:#a7f3d0; color:#0f9d64; }
  .type-btn.disabled { opacity:0.4; cursor:not-allowed; }
  .error-banner { background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:0.75rem; color:#dc2626; font-size:0.8rem; margin-bottom:1rem; }
  .modal-footer { display:flex; gap:0.75rem; }
  .btn-cancel { flex:1; padding:0.6rem; background:#f3f4f6; border:none; border-radius:8px; font-size:0.875rem; color:#374151; cursor:pointer; font-weight:500; }
  .btn-confirm { flex:2; padding:0.6rem; background:#0f9d64; color:#fff; border:none; border-radius:8px; font-size:0.875rem; font-weight:600; cursor:pointer; transition:background 0.15s; }
  .btn-confirm:hover:not(:disabled) { background:#0b7a4e; }
  .btn-confirm:disabled { background:#a7d9c3; cursor:not-allowed; }
`}</style>

      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">{isFee ? `Pay ${loan.feeType} Fee` : "Make a payment"}</h2>
          <button className="close-btn" onClick={close} aria-label="Close">×</button>
        </div>

        <p className="balance-hint">
          {isFee ? "Amount due" : "Remaining balance"}: <strong>₹{remaining.toLocaleString("en-IN")}</strong>
        </p>

        {alreadyPaidThisCycle && (
          isFee ? (
            <div className="emi-warn">
              ✅ You've already paid this month's {loan.feeType.toLowerCase()} fee. It'll be due again next month.
            </div>
          ) : (
            <div className="emi-warn">
              ⏰ You've already paid this month's EMI. You can still make an <strong>Extra payment</strong> below.
            </div>
          )
        )}

        {!isFee && (
          <>
            <label className="modal-label">Quick amounts</label>
            <div className="presets">
              {presets.map((p) => (
                <button key={p.label} className={`preset-btn${parsed === p.value ? " active" : ""}`} onClick={() => setAmount(String(p.value))}>
                  {p.label} — ₹{p.value.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </>
        )}

        <label className="modal-label">Amount (₹)</label>
        <input
          type="number"
          className={`amount-input${amount && !isValid ? " invalid" : ""}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min={1}
          max={remaining}
          readOnly={isFee}
        />
        {amount && !isValid && (
          <p className="input-error">
            {parsed <= 0 ? "Enter an amount greater than ₹0" : `Cannot exceed remaining balance of ₹${remaining.toLocaleString("en-IN")}`}
          </p>
        )}

        {!isFee && (
          <>
            <label className="modal-label">Payment type</label>
            <div className="type-row">
              <button
                className={`type-btn${paymentType === "EMI" ? " selected" : ""}${alreadyPaidThisCycle ? " disabled" : ""}`}
                onClick={() => !alreadyPaidThisCycle && setPaymentType("EMI")}
                disabled={alreadyPaidThisCycle}
              >
                Regular EMI
              </button>
              <button className={`type-btn${paymentType === "EXTRA" ? " selected" : ""}`} onClick={() => setPaymentType("EXTRA")}>
                Extra payment
              </button>
            </div>
          </>
        )}

        {error && <div className="error-banner">{error}</div>}

        <div className="modal-footer">
          <button className="btn-cancel" onClick={close}>Cancel</button>
          <button className="btn-confirm" onClick={handleSubmit} disabled={!isValid || loading || (isFee && alreadyPaidThisCycle)}>
            {loading ? "Processing…" : `Pay ₹${parsed > 0 ? parsed.toLocaleString("en-IN") : "—"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayEmiModal;