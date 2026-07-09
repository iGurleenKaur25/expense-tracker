import { useState, useEffect, useContext } from "react";
import API from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const FEE_TYPES = ["Hostel", "Mess"];

const LoanSimulationForm = ({ onLoanCreated, editingLoan, onSave }) => {
  const { user } = useContext(AuthContext);
  const [entryType, setEntryType] = useState("loan"); // "loan" | "fee"

  const [loanName, setLoanName] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [mode, setMode] = useState("tenure"); // "tenure" | "emi"
  const [tenureMonths, setTenureMonths] = useState("");
  const [emiAmount, setEmiAmount] = useState("");
  const [extraPayment, setExtraPayment] = useState("");
  const [emiDueDay, setEmiDueDay] = useState("5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewTenure, setPreviewTenure] = useState(null);

  // Fee-mode fields
  const [feeType, setFeeType] = useState("Hostel");
  const [feeAmount, setFeeAmount] = useState("");
  const [feeDueDay, setFeeDueDay] = useState("5");

  useEffect(() => {
    if (editingLoan) {
      setLoanName(editingLoan.loanName || "");
      setLoanAmount(editingLoan.loanAmount || "");
      setInterestRate(editingLoan.interestRate || "");
      setTenureMonths(editingLoan.tenureMonths || "");
      setExtraPayment(editingLoan.extraPayment || "");
      setEmiDueDay(editingLoan.emiDueDay || "5");
      setMode("tenure");
      setEntryType(editingLoan.category === "FEE" ? "fee" : "loan");
    }
  }, [editingLoan]);

  useEffect(() => {
    if (mode === "emi" && loanAmount && interestRate && emiAmount) {
      const P = Number(loanAmount), r = Number(interestRate) / 12 / 100, emi = Number(emiAmount);
      const minEmi = P * r;
      if (emi > minEmi) {
        const n = Math.ceil(-Math.log(1 - (P * r) / emi) / Math.log(1 + r));
        setPreviewTenure(isFinite(n) && n > 0 ? n : null);
      } else {
        setPreviewTenure(null);
      }
    } else {
      setPreviewTenure(null);
    }
  }, [mode, loanAmount, interestRate, emiAmount]);

  const clearForm = () => {
    setLoanName(""); setLoanAmount(""); setInterestRate("");
    setTenureMonths(""); setEmiAmount(""); setExtraPayment("");
    setEmiDueDay("5"); setError(""); setPreviewTenure(null);
    setFeeType("Hostel"); setFeeAmount("");
  };

  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!feeAmount || Number(feeAmount) <= 0) {
      setError("Enter a valid fee amount");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/loans/fee", { feeType, amount: Number(feeAmount), dueDay: Number(feeDueDay) || 5 });
      onLoanCreated(res.data.data || res.data);
      clearForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let res;
      if (editingLoan) {
        res = await API.put(`/loans/${editingLoan._id}`, {
          loanName, loanAmount: Number(loanAmount),
          interestRate: Number(interestRate),
          tenureMonths: Number(tenureMonths),
          extraPayment: Number(extraPayment) || 0,
          emiDueDay: Number(emiDueDay),
        });
        onSave(res.data);
      } else {
        const payload = {
          loanName,
          loanAmount: Number(loanAmount),
          interestRate: Number(interestRate),
          extraPayment: Number(extraPayment) || 0,
          emiDueDay: Number(emiDueDay),
        };
        if (mode === "tenure") {
          payload.tenureMonths = Number(tenureMonths);
        } else {
          payload.emiAmount = Number(emiAmount);
        }
        res = await API.post("/loans/simulate", payload);
        onLoanCreated(res.data.data || res.data);
      }
      clearForm();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sim-form-wrap">
  <style>{`
    .sim-form-wrap { background:#fff; border:1px solid #e5e0d4; border-radius:14px; padding:1.25rem 1.5rem; margin-bottom:1.5rem; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .sim-form-title { font-size:1rem; font-weight:600; color:#0f172a; margin:0 0 1rem; }
    .sim-form { display:flex; flex-direction:column; gap:0.65rem; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:0.65rem; }
    .form-group { display:flex; flex-direction:column; gap:0.3rem; }
    .form-label { font-size:0.8rem; font-weight:500; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em; }
    .form-input, .form-select { padding:0.5rem 0.75rem; border:1.5px solid #e5e0d4; border-radius:8px; font-size:0.9rem; color:#0f172a; background:#fff; outline:none; transition:border-color 0.15s; width:100%; box-sizing:border-box; }
    .form-input:focus, .form-select:focus { border-color:#0f9d64; }
    .form-hint { font-size:0.9rem; color:#9ca3af; }
    .form-error { background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:0.6rem 0.85rem; color:#dc2626; font-size:0.8rem; }
    .mode-toggle { display:flex; gap:0.4rem; margin-bottom:0.3rem; }
    .mode-btn { flex:1; padding:0.4rem; font-size:0.75rem; font-weight:500; border-radius:7px; border:1.5px solid #e5e0d4; cursor:pointer; background:#fff; color:#374151; }
    .mode-btn.active { background:#ecfdf5; border-color:#a7f3d0; color:#0f9d64; }
    .preview-box { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:0.5rem 0.75rem; font-size:0.78rem; color:#166534; }
    .form-actions { display:flex; gap:0.6rem; margin-top:0.25rem; }
    .btn-submit { flex:1; background:#0f9d64; color:#fff; border:none; border-radius:8px; padding:0.55rem 1rem; font-size:0.875rem; font-weight:600; cursor:pointer; }
    .btn-submit:hover:not(:disabled) { background:#0b7a4e; }
    .btn-submit:disabled { background:#a7d9c3; cursor:not-allowed; }
    .btn-cancel-form { background:#f3f4f6; border:none; border-radius:8px; padding:0.55rem 1rem; font-size:0.875rem; color:#374151; cursor:pointer; font-weight:500; }
  `}</style>

      <h3 className="sim-form-title">{editingLoan ? "Edit Loan" : "Add & Simulate Loan"}</h3>

      {!editingLoan && user?.userType === "student" && (
        <div className="mode-toggle" style={{ marginBottom: "1rem" }}>
          <button type="button" className={`mode-btn${entryType === "loan" ? " active" : ""}`} onClick={() => setEntryType("loan")}>
            Loan
          </button>
          <button type="button" className={`mode-btn${entryType === "fee" ? " active" : ""}`} onClick={() => setEntryType("fee")}>
            Hostel / Mess / Semester Fee
          </button>
        </div>
      )}

      {entryType === "fee" && !editingLoan ? (
        <form className="sim-form" onSubmit={handleFeeSubmit}>
          <div className="form-group">
            <label className="form-label">Fee type</label>
            <select className="form-select" value={feeType} onChange={(e) => setFeeType(e.target.value)}>
              {FEE_TYPES.map((t) => <option key={t} value={t}>{t} Fee</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" placeholder="e.g. 15000" value={feeAmount} onChange={(e) => setFeeAmount(e.target.value)} required min={1} />
            <span className="form-hint">Fixed amount, paid every month — no interest</span>
          </div>
          <div className="form-group">
            <label className="form-label">Due day of month</label>
            <input className="form-input" type="number" placeholder="e.g. 5" value={feeDueDay} onChange={(e) => setFeeDueDay(e.target.value)} min={1} max={28} />
            <span className="form-hint">You'll get a reminder before this date each month</span>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? "Saving…" : "Add Fee"}
            </button>
          </div>
        </form>
      ) : (
        <form className="sim-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Loan name</label>
            <input className="form-input" type="text" placeholder="e.g. Home Renovation" value={loanName} onChange={(e) => setLoanName(e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Loan amount (₹)</label>
              <input className="form-input" type="number" placeholder="e.g. 100000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} required min={1} />
            </div>
            <div className="form-group">
              <label className="form-label">Interest rate (%)</label>
              <input className="form-input" type="number" placeholder="e.g. 12" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} required min={0.1} step={0.1} />
            </div>
          </div>

          {!editingLoan && (
            <div className="form-group">
              <label className="form-label">How do you want to plan this?</label>
              <div className="mode-toggle">
                <button type="button" className={`mode-btn${mode === "tenure" ? " active" : ""}`} onClick={() => setMode("tenure")}>
                  I know my tenure
                </button>
                <button type="button" className={`mode-btn${mode === "emi" ? " active" : ""}`} onClick={() => setMode("emi")}>
                  I know my EMI
                </button>
              </div>
            </div>
          )}

          {(mode === "tenure" || editingLoan) ? (
            <div className="form-group">
              <label className="form-label">Tenure (months)</label>
              <input className="form-input" type="number" placeholder="e.g. 24" value={tenureMonths} onChange={(e) => setTenureMonths(e.target.value)} required min={1} />
              <span className="form-hint">We'll calculate your monthly EMI</span>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Monthly EMI you can pay (₹)</label>
              <input className="form-input" type="number" placeholder="e.g. 5000" value={emiAmount} onChange={(e) => setEmiAmount(e.target.value)} required min={1} />
              <span className="form-hint">We'll calculate how many months it'll take</span>
              {previewTenure && (
                <div className="preview-box">
                  📅 Estimated tenure: <strong>{previewTenure} months</strong> ({Math.floor(previewTenure / 12)}y {previewTenure % 12}m)
                </div>
              )}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Extra monthly payment (₹)</label>
              <input className="form-input" type="number" placeholder="Optional" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} min={0} />
              <span className="form-hint">Calculates interest & time saved</span>
            </div>
            <div className="form-group">
              <label className="form-label">EMI due day of month</label>
              <input className="form-input" type="number" placeholder="e.g. 5" value={emiDueDay} onChange={(e) => setEmiDueDay(e.target.value)} min={1} max={28} />
              <span className="form-hint">For due-date reminders</span>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? "Saving…" : editingLoan ? "Update Loan" : "Simulate & Save"}
            </button>
            {editingLoan && <button className="btn-cancel-form" type="button" onClick={clearForm}>Cancel</button>}
          </div>
        </form>
      )}
    </div>
  );
};

export default LoanSimulationForm;