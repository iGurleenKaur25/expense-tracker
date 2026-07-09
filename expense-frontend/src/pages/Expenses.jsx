// import { useEffect, useState } from "react";
// import API from "../api/axiosInstance";
// import ExpenseForm from "../components/expenses/ExpenseForm";
// import ExpenseList from "../components/expenses/ExpenseList";

// const CATEGORIES = ["All", "Food", "Travel", "Rent", "Shopping", "Bills", "Health", "Other", "Loan EMI", "Loan Extra"];

// const Expenses = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [payments, setPayments] = useState([]);       // NEW
//   const [editingExpense, setEditingExpense] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => { fetchAll(); }, []);

//   const fetchAll = async () => {
//     try {
//       const [expRes, payRes] = await Promise.all([
//         API.get("/expenses"),
//         API.get("/payments/all"),                       // NEW
//       ]);
//       setExpenses(expRes.data || []);
//       setPayments(payRes.data?.data || payRes.data || []);
//     } catch (error) {
//       console.error("Fetch failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Shape loan payments to look like expenses for the list
//   const paymentExpenses = payments.map((p) => ({
//     _id: p._id,
//     title: `${p.paymentType} — ${p.loanId?.loanName || "Loan"}`,
//     amount: p.amountPaid,
//     category: p.paymentType === "EMI" ? "Loan EMI" : "Loan Extra",
//     date: p.paymentDate,
//     notes: `Remaining after payment: ₹${(p.remainingAmount || 0).toLocaleString("en-IN")}`,
//     isLoanPayment: true,   // flag so we don't show edit/delete on these
//   }));

//   // Merge and sort by date descending
//   const allExpenses = [...expenses, ...paymentExpenses]
//     .sort((a, b) => new Date(b.date) - new Date(a.date));

//   const filtered = filter === "All"
//     ? allExpenses
//     : allExpenses.filter((e) => e.category === filter);

//   const totalThisMonth = allExpenses
//     .filter((e) => new Date(e.date).getMonth() === new Date().getMonth() &&
//                    new Date(e.date).getFullYear() === new Date().getFullYear())
//     .reduce((s, e) => s + (e.amount || 0), 0);

//   const totalAll = allExpenses.reduce((s, e) => s + (e.amount || 0), 0);

//   const emiThisMonth = paymentExpenses
//     .filter((e) => new Date(e.date).getMonth() === new Date().getMonth() &&
//                    new Date(e.date).getFullYear() === new Date().getFullYear())
//     .reduce((s, e) => s + (e.amount || 0), 0);

//   const handleSaveExpense = (saved) => {
//     if (editingExpense) {
//       setExpenses((prev) => prev.map((e) => (e._id === saved._id ? saved : e)));
//     } else {
//       setExpenses((prev) => [saved, ...prev]);
//     }
//     setEditingExpense(null);
//   };

//   const handleDeleteExpense = async (id) => {
//     try { await API.delete(`/expenses/${id}`); } catch (err) { console.error(err); }
//     setExpenses((prev) => prev.filter((e) => e._id !== id));
//   };

//   const handleEditExpense = (e) => {
//     if (e.isLoanPayment) return; // can't edit loan payments from here
//     setEditingExpense(e);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   if (loading) return <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "#6b7280" }}>Loading…</div>;

//   return (
//    <div style={{ minHeight: "100vh", background: "#faf7f0", padding: "2rem 1.5rem", fontFamily: "-apple-system, sans-serif" }}>
//       <style>{`
//   .exp-header { margin-bottom: 1.5rem; }
//   .exp-header h1 { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 0 0 0.2rem; }
//   .exp-header p { color: #6b7280; font-size: 0.85rem; margin: 0; }
//   .exp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem; }
//   .exp-stat { background: #fff; border-radius: 12px; padding: 0.85rem 1.1rem; border: 1px solid #e5e0d4; }
//   .exp-stat-label { font-size: 0.68rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem; }
//   .exp-stat-val { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
//   .exp-stat-sub { font-size: 0.68rem; color: #9ca3af; margin-top: 0.2rem; }
//   .filter-bar { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
//   .filter-btn { background: #fff; border: 1px solid #e5e0d4; border-radius: 20px; padding: 0.3rem 0.8rem; font-size: 0.75rem; color: #374151; cursor: pointer; }
//   .filter-btn.active { background: #0f9d64; border-color: #0f9d64; color: #fff; }
//   .exp-list { display: flex; flex-direction: column; gap: 0.5rem; }
//   .exp-empty { text-align: center; padding: 2rem; color: #9ca3af; font-size: 0.875rem; }
// `}</style>

//       <div className="exp-header">
//         <h1>Expenses</h1>
//         <p>All spending including loan EMI payments</p>
//       </div>

//       <div className="exp-stats">
//         <div className="exp-stat">
//           <div className="exp-stat-label">This month</div>
//           <div className="exp-stat-val">₹{totalThisMonth.toLocaleString("en-IN")}</div>
//           <div className="exp-stat-sub">incl. ₹{emiThisMonth.toLocaleString("en-IN")} EMIs</div>
//         </div>
//         <div className="exp-stat">
//           <div className="exp-stat-label">All time</div>
//           <div className="exp-stat-val">₹{totalAll.toLocaleString("en-IN")}</div>
//           <div className="exp-stat-sub">{allExpenses.length} transactions</div>
//         </div>
//         <div className="exp-stat">
//           <div className="exp-stat-label">Loan payments</div>
//           <div className="exp-stat-val" style={{ color: "#2563eb" }}>₹{paymentExpenses.reduce((s,e)=>s+e.amount,0).toLocaleString("en-IN")}</div>
//           <div className="exp-stat-sub">{paymentExpenses.length} payments</div>
//         </div>
//       </div>

//       <ExpenseForm
//         onExpenseSaved={handleSaveExpense}
//         editingExpense={editingExpense}
//         clearEdit={() => setEditingExpense(null)}
//       />

//       <div className="filter-bar">
//         {CATEGORIES.map((c) => (
//           <button key={c} className={`filter-btn${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
//         ))}
//       </div>

//       {filtered.length === 0 ? (
//         <div className="exp-empty">No expenses found{filter !== "All" ? ` in ${filter}` : ""}.</div>
//       ) : (
//         <div className="exp-list">
//           <ExpenseList expenses={filtered} onDelete={handleDeleteExpense} onEdit={handleEditExpense} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Expenses;

import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseList from "../components/expenses/ExpenseList";

const CATEGORIES = ["All", "Food", "Travel", "Rent", "Shopping", "Bills", "Health", "Other", "Loan EMI", "Loan Extra", "Fee"];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [expRes, payRes] = await Promise.all([
        API.get("/expenses"),
        API.get("/payments/all"),
      ]);
      setExpenses(expRes.data || []);
      setPayments(payRes.data?.data || payRes.data || []);
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Shape loan + fee payments to look like expenses for the list
  const paymentExpenses = payments.map((p) => {
    if (p.category === "FEE") {
      return {
        _id: p._id,
        title: `${p.feeType} Fee`,
        amount: p.amountPaid,
        category: "Fee",
        date: p.paymentDate,
        notes: `${p.feeType} fee paid`,
        isLoanPayment: true,
      };
    }
    return {
      _id: p._id,
      title: `${p.paymentType} — ${p.loanId?.loanName || "Loan"}`,
      amount: p.amountPaid,
      category: p.paymentType === "EMI" ? "Loan EMI" : "Loan Extra",
      date: p.paymentDate,
      notes: `Remaining after payment: ₹${(p.remainingAmount || 0).toLocaleString("en-IN")}`,
      isLoanPayment: true,   // flag so we don't show edit/delete on these
    };
  });

  // Merge and sort by date descending
  const allExpenses = [...expenses, ...paymentExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = filter === "All"
    ? allExpenses
    : allExpenses.filter((e) => e.category === filter);

  const totalThisMonth = allExpenses
    .filter((e) => new Date(e.date).getMonth() === new Date().getMonth() &&
                   new Date(e.date).getFullYear() === new Date().getFullYear())
    .reduce((s, e) => s + (e.amount || 0), 0);

  const totalAll = allExpenses.reduce((s, e) => s + (e.amount || 0), 0);

  const emiThisMonth = paymentExpenses
    .filter((e) => e.category !== "Fee" &&
                   new Date(e.date).getMonth() === new Date().getMonth() &&
                   new Date(e.date).getFullYear() === new Date().getFullYear())
    .reduce((s, e) => s + (e.amount || 0), 0);

  const handleSaveExpense = (saved) => {
    if (editingExpense) {
      setExpenses((prev) => prev.map((e) => (e._id === saved._id ? saved : e)));
    } else {
      setExpenses((prev) => [saved, ...prev]);
    }
    setEditingExpense(null);
  };

  const handleDeleteExpense = async (id) => {
    try { await API.delete(`/expenses/${id}`); } catch (err) { console.error(err); }
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  };

  const handleEditExpense = (e) => {
    if (e.isLoanPayment) return; // can't edit loan/fee payments from here
    setEditingExpense(e);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "#6b7280" }}>Loading…</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f0", padding: "2rem 1.5rem", fontFamily: "-apple-system, sans-serif" }}>
      <style>{`
        .exp-header { margin-bottom: 1.5rem; }
        .exp-header h1 { font-size: 1.4rem; font-weight: 700; color: #0f172a; margin: 0 0 0.2rem; }
        .exp-header p { color: #6b7280; font-size: 0.85rem; margin: 0; }
        .exp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem; }
        .exp-stat { background: #fff; border-radius: 12px; padding: 0.85rem 1.1rem; border: 1px solid #e5e0d4; }
        .exp-stat-label { font-size: 0.68rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem; }
        .exp-stat-val { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
        .exp-stat-sub { font-size: 0.68rem; color: #9ca3af; margin-top: 0.2rem; }
        .filter-bar { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
        .filter-btn { background: #fff; border: 1px solid #e5e0d4; border-radius: 20px; padding: 0.3rem 0.8rem; font-size: 0.75rem; color: #374151; cursor: pointer; }
        .filter-btn.active { background: #0f9d64; border-color: #0f9d64; color: #fff; }
        .exp-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .exp-empty { text-align: center; padding: 2rem; color: #9ca3af; font-size: 0.875rem; }
      `}</style>

      <div className="exp-header">
        <h1>Expenses</h1>
        <p>All spending including loan EMI and fee payments</p>
      </div>

      <div className="exp-stats">
        <div className="exp-stat">
          <div className="exp-stat-label">This month</div>
          <div className="exp-stat-val">₹{totalThisMonth.toLocaleString("en-IN")}</div>
          <div className="exp-stat-sub">incl. ₹{emiThisMonth.toLocaleString("en-IN")} EMIs</div>
        </div>
        <div className="exp-stat">
          <div className="exp-stat-label">All time</div>
          <div className="exp-stat-val">₹{totalAll.toLocaleString("en-IN")}</div>
          <div className="exp-stat-sub">{allExpenses.length} transactions</div>
        </div>
        <div className="exp-stat">
          <div className="exp-stat-label">Loan + Fee payments</div>
          <div className="exp-stat-val" style={{ color: "#0f9d64" }}>₹{paymentExpenses.reduce((s,e)=>s+e.amount,0).toLocaleString("en-IN")}</div>
          <div className="exp-stat-sub">{paymentExpenses.length} payments</div>
        </div>
      </div>

      <ExpenseForm
        onExpenseSaved={handleSaveExpense}
        editingExpense={editingExpense}
        clearEdit={() => setEditingExpense(null)}
      />

      <div className="filter-bar">
        {CATEGORIES.map((c) => (
          <button key={c} className={`filter-btn${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="exp-empty">No expenses found{filter !== "All" ? ` in ${filter}` : ""}.</div>
      ) : (
        <div className="exp-list">
          <ExpenseList expenses={filtered} onDelete={handleDeleteExpense} onEdit={handleEditExpense} />
        </div>
      )}
    </div>
  );
};

export default Expenses;