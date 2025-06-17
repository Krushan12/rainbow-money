import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function RiskReturnScatter({ data }) {
  // If data is not provided or not an array, show default/empty state
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded">
        <h3 className="text-lg font-semibold mb-4">Risk vs Return Analysis</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded">
      <h3 className="text-lg font-semibold mb-4">Risk vs Return Analysis</h3>
      <div className="h-[300px]">
        <ScatterChart width={500} height={300}>
          <CartesianGrid />
          <XAxis dataKey="risk" name="Risk" unit="%" />
          <YAxis dataKey="return" name="Return" unit="%" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Funds" data={data} fill="#ffc658" />
        </ScatterChart>
      </div>
    </div>
  );
}