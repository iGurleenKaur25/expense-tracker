import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const ExpenseLoanChart = ({ totalExpense, totalLoanRemaining }) => {
  const data = [
    { name: "Expenses", value: totalExpense },
    { name: "Loans", value: totalLoanRemaining },
  ];

  const COLORS = ["#ff6b6b", "#4dabf7"];

  return (
    <div className="chart-card">
      <h3>Expenses vs Loans</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseLoanChart;
