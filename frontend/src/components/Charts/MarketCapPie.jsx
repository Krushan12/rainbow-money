import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function MarketCapPie({ data }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  return (
    <div>
      
      <PieChart width={550} height={400}>
        <Pie
          data={chartData}
          cx={200}
          cy={150}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}