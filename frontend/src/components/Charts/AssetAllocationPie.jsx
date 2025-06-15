import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function AssetAllocationPie({ data }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  
  return (
    <div className="bg-white p-4 pb-10 rounded ">
      
      <PieChart width={550} height={400}>
        <Pie
          data={chartData}
          cx={275}
          cy={180}  // Adjusted to make space for legend
          innerRadius={100}
          outerRadius={160}
          label
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            bottom: -10,  // Positions the legend properly
            fontSize: '0.875rem', // text-sm
            fontFamily: 'Inter, sans-serif', // Use your font
          }}
          iconSize={12}
          iconType="circle"
          formatter={(value) => (
            <span className="text-gray-600">{value}</span>
          )}
        />
      </PieChart>
    </div>
  );
}