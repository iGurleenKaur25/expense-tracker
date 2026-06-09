// import { useEffect, useState } from "react";
// import API from "../api/axiosInstance";

// import StatCard from "../components/dashboard/StatCard";
// import ExpenseLoanChart from "../components/dashboard/ExpenseLoanChart";
// import MonthlyExpenseChart from "../components/dashboard/MonthlyExpenseChart";
// import CategoryExpenseChart from "../components/dashboard/CategoryExpenseChart";
// import DateFilter from "../components/dashboard/DateFilter";
// import RecentTransactions from "../components/dashboard/RecentTransactions";

// const Dashboard = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [loans, setLoans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [month, setMonth] = useState("");
//   const [year, setYear] = useState("");

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//  const fetchDashboardData = async () => { try 
//   { 
//     const expenseRes = await API.get("/expenses");
//     const loanRes = await API.get("/loans");
//     setExpenses(expenseRes.data); 
//     setLoans(loanRes.data); }
//     catch (error)
//      { console.error("Dashboard error", error); 
//      } 
//      finally { setLoading(false); } };

//   const filteredExpenses = expenses.filter((expense) => {
//     const date = new Date(expense.date);

//     const monthMatch = month === "" || date.getMonth() === Number(month);
//     const yearMatch = year === "" || date.getFullYear() === Number(year);

//     return monthMatch && yearMatch;
//   });

//   const totalExpense = filteredExpenses.reduce(
//     (sum, e) => sum + Number(e.amount || 0),
//     0
//   );

//   const totalLoanRemaining = loans.reduce(
//     (sum, l) => sum + (Number(l.loanAmount || 0) - Number(l.paidAmount || 0)),
//     0
//   );


  
//   if (loading) return <p>Loading dashboard...</p>;
//   if (error) return <p>{error}</p>;
//   if (!expenses.length) return <p>No data available</p>;

//   return (
//     <div className="dashboard">
//       <h2>Dashboard</h2>

//       <DateFilter
//         month={month}
//         year={year}
//         onMonthChange={setMonth}
//         onYearChange={setYear}
//       />

//       <div className="stats-grid">
//         <StatCard title="Total Expenses" value={`₹${totalExpense}`} />
//         <StatCard title="Loan Remaining" value={`₹${totalLoanRemaining}`} />
//       </div>

//       <div className="charts-grid">
//         <ExpenseLoanChart
//           totalExpense={totalExpense}
//           totalLoanRemaining={totalLoanRemaining}
//         />

//         <MonthlyExpenseChart expenses={filteredExpenses} />
//         <CategoryExpenseChart expenses={filteredExpenses} />
//       </div>

//       <RecentTransactions expenses={filteredExpenses} />
//     </div>
//   );
// };


// export default Dashboard;




import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

import StatCard from "../components/dashboard/StatCard";
import ExpenseLoanChart from "../components/dashboard/ExpenseLoanChart";
import MonthlyExpenseChart from "../components/dashboard/MonthlyExpenseChart";
import CategoryExpenseChart from "../components/dashboard/CategoryExpenseChart";
import DateFilter from "../components/dashboard/DateFilter";

import "../styles/dashboard.css";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const expenseRes = await API.get("/expenses");
      const loanRes = await API.get("/loans");

      setExpenses(expenseRes.data);
      setLoans(loanRes.data);
    } catch (error) {
      console.error("Dashboard error", error);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Apply filters
  const filteredExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date);

    const monthMatch =
      month === "" || date.getMonth() === Number(month);

    const yearMatch =
      year === "" || date.getFullYear() === Number(year);

    return monthMatch && yearMatch;
  });

  const totalExpense = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const totalLoanRemaining = loans.reduce(
    (sum, l) => sum + (l.loanAmount || 0),
    0
  );

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* 📅 Filter */}
      <DateFilter
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      {/* 🔢 Stats */}
      <div className="stats-grid">
        <StatCard title="Total Expenses" value={`₹${totalExpense}`} />
        <StatCard
          title="Loan Remaining"
          value={`₹${totalLoanRemaining}`}
        />
      </div>

      {/* 📊 Charts */}
      <div className="charts-grid">
        <ExpenseLoanChart
          totalExpense={totalExpense}
          totalLoanRemaining={totalLoanRemaining}
        />

        <MonthlyExpenseChart expenses={filteredExpenses} />

        <CategoryExpenseChart expenses={filteredExpenses} />
      </div>
    </div>
  );
};

export default Dashboard;
