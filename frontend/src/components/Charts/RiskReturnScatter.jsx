import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function RiskReturnScatter({ data }) {
  return (
    <div className="bg-white p-4 rounded">
      
      <ScatterChart width={500} height={300}>
        <CartesianGrid />
        <XAxis dataKey="risk" name="Risk" unit="%" />
        <YAxis dataKey="return" name="Return" unit="%" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Funds" data={data} fill="#ffc658" />
      </ScatterChart>
    </div>
  );
}