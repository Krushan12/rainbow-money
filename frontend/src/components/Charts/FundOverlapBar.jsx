import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function FundOverlapBar({ data }) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          layout="vertical" // Vertical layout works better for fund names
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            domain={[0, 100]} // Force 0-100% scale
            unit="%"
          />
          <YAxis 
            type="category" 
            dataKey="fund" 
            width={120} // Adjust based on your longest fund name
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, "Overlap"]}
            labelFormatter={(label) => `Fund: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey="overlap" 
            name="Overlap %" 
            fill="#FF8042" 
            radius={[0, 4, 4, 0]} // Rounded edges on right side
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}