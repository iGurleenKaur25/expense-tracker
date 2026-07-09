import { useEffect, useRef, useState } from "react";
import API from "../api/axiosInstance";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CAT_COLORS = {
  Food: "#378ADD", Travel: "#7F77DD", Rent: "#D85A30",
  Shopping: "#D4537E", Bills: "#1D9E75", Health: "#BA7517",
  Other: "#888780",
  "Loan EMI": "#2563eb",   // NEW category colour for loan payments
  "Loan Extra": "#7c3aed",
};
const CAT_LIST = Object.keys(CAT_COLORS);

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loans, setLoans] = useState([]);
  const [income, setIncome] = useState([]);
  const [payments, setPayments] = useState([]);   // NEW
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const monthChartRef = useRef(null);
  const catChartRef = useRef(null);
  const compareChartRef = useRef(null);
  const monthInst = useRef(null);
  const catInst = useRef(null);
  const compareInst = useRef(null);
  const chartJsLoaded = useRef(false);

  useEffect(() => {
    if (!document.getElementById("chartjs-cdn")) {
      const script = document.createElement("script");
      script.id = "chartjs-cdn";
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      script.onload = () => { chartJsLoaded.current = true; };
      document.head.appendChild(script);
    } else {
      chartJsLoaded.current = true;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expRes, loanRes, incomeRes, payRes] = await Promise.all([
        API.get("/expenses"),
        API.get("/loans"),
        API.get("/income"),
        API.get("/payments/all"),   // NEW — fetch all payments for this user
      ]);
      setExpenses(expRes.data || []);
      setLoans(loanRes.data || []);
      setIncome(incomeRes.data || []);
      setPayments(payRes.data?.data || payRes.data || []); // NEW
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  // Convert payments → expense-shaped objects so everything downstream
  // can treat them identically
  const paymentAsExpense = (p) => ({
    _id: p._id,
    amount: p.amountPaid,
    category: p.paymentType === "EMI" ? "Loan EMI" : "Loan Extra",
    date: p.paymentDate,
    title: `${p.paymentType} — ${p.loanId?.loanName || "Loan"}`,
    isLoanPayment: true,
  });

  // All outgoing money combined
  const allExpenses = [
    ...expenses,
    ...payments.map(paymentAsExpense),
  ];

  const filterByDate = (arr) =>
    arr.filter((e) => {
      const d = new Date(e.date);
      if (month !== "" && d.getMonth() !== Number(month)) return false;
      if (year !== "" && d.getFullYear() !== Number(year)) return false;
      return true;
    });

  const filteredExpenses = filterByDate(allExpenses);
  const filteredIncome   = filterByDate(income);

  const totalExp    = filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalIncome = filteredIncome.reduce((s, i) => s + Number(i.amount || 0), 0);
  const moneyLeft   = totalIncome - totalExp;
  const savingsPct  = totalIncome > 0 ? Math.round((moneyLeft / totalIncome) * 100) : 0;

  // const totalLoanAmt   = loans.reduce((s, l) => s + (l.loanAmount || 0), 0);
  const totalRemaining = loans.reduce((s, l) => s + (l.remainingAmount || 0), 0);
  // const totalPaid      = totalLoanAmt - totalRemaining;
  // const paidPct        = totalLoanAmt > 0 ? Math.round((totalPaid / totalLoanAmt) * 100) : 0;
  const activeLoans    = loans.filter((l) => l.status === "ACTIVE").length;

  // EMI total for the filtered period (shown as a sub-stat)
  const emiTotal = filteredExpenses
    .filter((e) => e.isLoanPayment)
    .reduce((s, e) => s + Number(e.amount || 0), 0);

  useEffect(() => {
    const tryBuild = () => {
      if (!window.Chart) { setTimeout(tryBuild, 100); return; }
      buildMonthly();
      buildCategory();
      buildCompare();
    };
    tryBuild();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredExpenses, totalExp, totalRemaining]);

  const buildMonthly = () => {
    if (!monthChartRef.current) return;
    const byMonth = new Array(12).fill(0);
    filteredExpenses.forEach((e) => {
      byMonth[new Date(e.date).getMonth()] += Number(e.amount || 0);
    });
    const data = byMonth.map((v) => Math.round(v));
    if (monthInst.current) {
      monthInst.current.data.datasets[0].data = data;
      monthInst.current.update();
      return;
    }
    monthInst.current = new window.Chart(monthChartRef.current, {
      type: "bar",
      data: { labels: MONTHS, datasets: [{ label: "Total spending", data, backgroundColor: "#378ADD", borderRadius: 4, borderSkipped: false }] },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => fmt(ctx.raw) } } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#888" } },
          y: { grid: { color: "rgba(128,128,128,0.1)" }, ticks: { font: { size: 11 }, color: "#888", callback: (v) => "₹" + Math.round(v / 1000) + "k" } },
        },
      },
    });
  };

  const buildCategory = () => {
    if (!catChartRef.current) return;
    const byCat = {};
    CAT_LIST.forEach((c) => (byCat[c] = 0));
    filteredExpenses.forEach((e) => {
      const cat = e.category || "Other";
      if (byCat[cat] !== undefined) byCat[cat] += Number(e.amount || 0);
      else byCat["Other"] += Number(e.amount || 0);
    });
    const labels = CAT_LIST.filter((c) => byCat[c] > 0);
    const data   = labels.map((c) => Math.round(byCat[c]));
    const colors = labels.map((c) => CAT_COLORS[c]);
    if (catInst.current) {
      catInst.current.data.labels = labels;
      catInst.current.data.datasets[0].data = data;
      catInst.current.data.datasets[0].backgroundColor = colors;
      catInst.current.update();
      return;
    }
    catInst.current = new window.Chart(catChartRef.current, {
      type: "doughnut",
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }] },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "65%",
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ctx.label + ": " + fmt(ctx.raw) } } },
      },
    });
  };

  const buildCompare = () => {
    if (!compareChartRef.current) return;
    const data = [Math.round(totalExp), Math.round(totalRemaining)];
    if (compareInst.current) {
      compareInst.current.data.datasets[0].data = data;
      compareInst.current.update();
      return;
    }
    compareInst.current = new window.Chart(compareChartRef.current, {
      type: "bar",
      data: { labels: ["Total spending", "Loan remaining"], datasets: [{ data, backgroundColor: ["#378ADD", "#D85A30"], borderRadius: 4, borderSkipped: false }] },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: "y",
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => fmt(ctx.raw) } } },
        scales: {
          x: { grid: { color: "rgba(128,128,128,0.1)" }, ticks: { font: { size: 11 }, color: "#888", callback: (v) => "₹" + Math.round(v / 1000) + "k" } },
          y: { grid: { display: false }, ticks: { font: { size: 12 }, color: "#888" } },
        },
      },
    });
  };

  useEffect(() => {
    return () => {
      [monthInst, catInst, compareInst].forEach((r) => { if (r.current) { r.current.destroy(); r.current = null; } });
    };
  }, []);

  const catByCat = {};
  CAT_LIST.forEach((c) => (catByCat[c] = 0));
  filteredExpenses.forEach((e) => {
    const cat = e.category || "Other";
    if (catByCat[cat] !== undefined) catByCat[cat] += Number(e.amount || 0);
    else catByCat["Other"] += Number(e.amount || 0);
  });
  const catLabels = CAT_LIST.filter((c) => catByCat[c] > 0);
  const catTotal  = catLabels.reduce((s, c) => s + catByCat[c], 0);

  const bannerColor  = moneyLeft > 0 ? "#16a34a" : moneyLeft === 0 ? "#d97706" : "#dc2626";
  const bannerBg     = moneyLeft > 0 ? "#f0fdf4" : moneyLeft === 0 ? "#fffbeb" : "#fef2f2";
  const bannerBorder = moneyLeft > 0 ? "#bbf7d0" : moneyLeft === 0 ? "#fde68a" : "#fecaca";
  const bannerIcon   = moneyLeft > 0 ? "💰" : moneyLeft === 0 ? "⚖️" : "⚠️";
  const bannerMsg    = moneyLeft > 0
    ? `You're saving ${savingsPct}% of your income — great job!`
    : moneyLeft === 0
    ? "Income equals expenses. Try to save a bit more."
    : `You're spending ₹${Math.abs(moneyLeft).toLocaleString("en-IN")} more than you earn this period.`;

  if (loading) return <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "#6b7280" }}>Loading dashboard…</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f0", padding: "2rem 1.5rem", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
  <style>{`
    .db-header{margin-bottom:1.5rem}
    .db-header h1{font-size:1.4rem;font-weight:700;color:#0f172a;margin:0 0 0.2rem}
    .db-header p{color:#6b7280;font-size:0.85rem;margin:0}
    .db-filter{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem}
    .db-filter label{font-size:12px;color:#6b7280}
    .db-filter select{font-size:13px;padding:5px 10px;border-radius:8px;border:1px solid #e5e0d4;background:#fff;color:#0f172a;cursor:pointer;outline:none}
    .db-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:1.5rem}
    .db-stat{background:#fff;border:1px solid #e5e0d4;border-radius:10px;padding:1rem;position:relative;overflow:hidden}
    .db-stat-label{font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
    .db-stat-val{font-size:1.3rem;font-weight:700;color:#0f172a;line-height:1}
    .db-stat-sub{font-size:11px;color:#9ca3af;margin-top:5px}
    .db-stat-bar{position:absolute;bottom:0;left:0;right:0;height:3px}
    .db-money-banner{border-radius:12px;padding:1rem 1.25rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
    .db-money-left{display:flex;flex-direction:column;gap:0.15rem}
    .db-money-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;opacity:0.7}
    .db-money-val{font-size:1.6rem;font-weight:700;line-height:1}
    .db-money-divider{width:1px;height:40px;background:currentColor;opacity:0.15;flex-shrink:0}
    .db-money-breakdown{display:flex;gap:1.5rem;flex-wrap:wrap}
    .db-money-item{font-size:0.8rem;opacity:0.85}
    .db-money-item span{font-weight:600;display:block;font-size:0.92rem}
    .db-money-msg{margin-left:auto;font-size:0.78rem;opacity:0.75;max-width:220px;line-height:1.4;text-align:right}
    .db-chart-full{background:#fff;border:1px solid #e5e0d4;border-radius:12px;padding:1rem 1.25rem;margin-bottom:1rem}
    .db-charts-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
    .db-chart-half{background:#fff;border:1px solid #e5e0d4;border-radius:12px;padding:1rem 1.25rem}
    .db-chart-title{font-size:11px;font-weight:600;color:#9ca3af;letter-spacing:.05em;text-transform:uppercase;margin-bottom:0.75rem}
    .db-legend{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px;font-size:11px;color:#6b7280}
    .db-legend-dot{width:9px;height:9px;border-radius:2px;flex-shrink:0}
    @media(max-width:600px){.db-charts-2{grid-template-columns:1fr}.db-money-msg{display:none}}
  `}</style>

      <div className="db-header">
        <h1>Dashboard</h1>
        <p>Your financial snapshot</p>
      </div>

      <div className="db-filter">
        <label>Month</label>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">All months</option>
          {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <label>Year</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All years</option>
          {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* MONEY LEFT BANNER */}
      {totalIncome > 0 ? (
        <div className="db-money-banner" style={{ background: bannerBg, border: `1px solid ${bannerBorder}`, color: bannerColor }}>
          <div style={{ fontSize: "1.75rem" }}>{bannerIcon}</div>
          <div className="db-money-left">
            <div className="db-money-label">Money left</div>
            <div className="db-money-val">{fmt(Math.abs(moneyLeft))}{moneyLeft < 0 ? " deficit" : ""}</div>
          </div>
          <div className="db-money-divider" />
          <div className="db-money-breakdown">
            <div className="db-money-item">Income<span>{fmt(totalIncome)}</span></div>
            <div className="db-money-item">Expenses<span>{fmt(totalExp - emiTotal)}</span></div>
            <div className="db-money-item">Loan EMIs<span>{fmt(emiTotal)}</span></div>
            <div className="db-money-item">Total out<span>{fmt(totalExp)}</span></div>
            {savingsPct > 0 && <div className="db-money-item">Saved<span>{savingsPct}%</span></div>}
          </div>
          <div className="db-money-msg">{bannerMsg}</div>
        </div>
      ) : (
        <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "12px", padding: "0.85rem 1.25rem", marginBottom: "1.5rem", fontSize: "0.82rem", color: "#64748b" }}>
          💡 Add your income on the <a href="/income" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>Income page</a> to see how much money you have left after expenses and loan EMIs.
        </div>
      )}

      <div className="db-stats">
        <div className="db-stat">
          <div className="db-stat-label">Total income</div>
          <div className="db-stat-val" style={{ color: "#16a34a" }}>{fmt(totalIncome)}</div>
          <div className="db-stat-sub">{filteredIncome.length} entr{filteredIncome.length !== 1 ? "ies" : "y"}</div>
          <div className="db-stat-bar" style={{ background: "#16a34a" }} />
        </div>
        <div className="db-stat">
          <div className="db-stat-label">Expenses</div>
          <div className="db-stat-val">{fmt(totalExp - emiTotal)}</div>
          <div className="db-stat-sub">{filteredExpenses.filter(e => !e.isLoanPayment).length} transactions</div>
          <div className="db-stat-bar" style={{ background: "#378ADD" }} />
        </div>
        <div className="db-stat">
          <div className="db-stat-label">Loan EMIs paid</div>
          <div className="db-stat-val" style={{ color: "#2563eb" }}>{fmt(emiTotal)}</div>
          <div className="db-stat-sub">{filteredExpenses.filter(e => e.isLoanPayment).length} payment{filteredExpenses.filter(e => e.isLoanPayment).length !== 1 ? "s" : ""}</div>
          <div className="db-stat-bar" style={{ background: "#2563eb" }} />
        </div>
        <div className="db-stat">
          <div className="db-stat-label">Loan remaining</div>
          <div className="db-stat-val" style={{ color: totalRemaining > 0 ? "#dc2626" : "#16a34a" }}>{fmt(totalRemaining)}</div>
          <div className="db-stat-sub">{activeLoans} active loan{activeLoans !== 1 ? "s" : ""}</div>
          <div className="db-stat-bar" style={{ background: "#D85A30" }} />
        </div>
      </div>

      <div className="db-chart-full">
        <div className="db-chart-title">Monthly total spending (expenses + EMIs)</div>
        <div style={{ position: "relative", width: "100%", height: "200px" }}>
          <canvas ref={monthChartRef} role="img" aria-label="Monthly spending bar chart" />
        </div>
      </div>

      <div className="db-charts-2">
        <div className="db-chart-half">
          <div className="db-chart-title">By category (incl. loan payments)</div>
          <div className="db-legend">
            {catLabels.map((c) => (
              <span key={c} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span className="db-legend-dot" style={{ background: CAT_COLORS[c] }} />
                {c} {catTotal > 0 ? Math.round(catByCat[c] / catTotal * 100) : 0}%
              </span>
            ))}
          </div>
          <div style={{ position: "relative", width: "100%", height: "200px" }}>
            <canvas ref={catChartRef} role="img" aria-label="Spending breakdown by category" />
          </div>
        </div>

        <div className="db-chart-half">
          <div className="db-chart-title">Total spending vs loan remaining</div>
          <div className="db-legend">
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span className="db-legend-dot" style={{ background: "#378ADD" }} />Total spending
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span className="db-legend-dot" style={{ background: "#D85A30" }} />Loan remaining
            </span>
          </div>
          <div style={{ position: "relative", width: "100%", height: "200px" }}>
            <canvas ref={compareChartRef} role="img" aria-label="Total spending vs loan remaining" />
          </div>
        </div>
      </div>
    </div>
  );
}
