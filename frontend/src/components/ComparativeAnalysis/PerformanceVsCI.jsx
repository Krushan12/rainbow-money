import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PerformanceVsCI({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Scheme vs Comparative Index</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
            <XAxis type="number" unit="%" />
            <YAxis type="category" dataKey="scheme" width={120} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar dataKey="xirr" name="Scheme XIRR" fill="#8884d8" />
            <Bar dataKey="ci" name="Comparative Index" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}