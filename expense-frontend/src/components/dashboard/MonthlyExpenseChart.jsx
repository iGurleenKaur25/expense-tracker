import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const MonthlyExpenseChart = ({ expenses }) => {
  const monthlyData = {};

  expenses.forEach((expense) => {
    const month = new Date(expense.date).toLocaleString("default", { month: "short" });

    if (!monthlyData[month]) monthlyData[month] = 0;
    monthlyData[month] += Number(expense.amount || 0);
  });

  const monthsOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const chartData = monthsOrder
    .filter((m) => monthlyData[m])
    .map((m) => ({ month: m, amount: monthlyData[m] }));

  return (
    <div className="chart-card">
      <h3>Monthly Expense Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyExpenseChart;
