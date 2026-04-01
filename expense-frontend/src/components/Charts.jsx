import { PieChart, Pie, Tooltip } from "recharts";

const Charts = ({ data }) => (
  <PieChart width={300} height={300}>
    <Pie data={data} dataKey="amount" nameKey="category" />
    <Tooltip />
  </PieChart>
);

export default Charts;
