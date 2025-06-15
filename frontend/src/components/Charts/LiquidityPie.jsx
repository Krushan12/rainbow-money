import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function LiquidityPie({ data }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  
  return (
    <div>
      
      <PieChart width={550} height={400}>
        <Pie
          data={chartData}
          cx={275}
          cy={180}
          outerRadius={140}
          label={({ name, value }) => `${name} (${value}%)`}
          labelLine={true}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </div>
  );
}