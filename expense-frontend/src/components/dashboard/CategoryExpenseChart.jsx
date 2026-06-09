
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const CategoryExpenseChart = ({ expenses }) => {
  const categoryData = {};

  expenses.forEach((expense) => {
    if (!categoryData[expense.category]) categoryData[expense.category] = 0;
    categoryData[expense.category] += Number(expense.amount || 0);
  });

  const chartData = Object.keys(categoryData).map((cat) => ({
    category: cat,
    amount: categoryData[cat],
  }));

  return (
    <div className="chart-card">
      <h3>Category-wise Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryExpenseChart;
