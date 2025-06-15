import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function SectorBarChart({ data }) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          layout="vertical" // Horizontal bars often work better for sector names
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" unit="%" />
          <YAxis 
            type="category" 
            dataKey="sector" 
            width={150} // Adjust based on your longest sector name
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, "Allocation"]}
            labelFormatter={(label) => `Sector: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey="allocation" 
            name="Allocation %" 
            fill="#82ca9d" 
            radius={[0, 4, 4, 0]} // Rounded edges on right side
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}