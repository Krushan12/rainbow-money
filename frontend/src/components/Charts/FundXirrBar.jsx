import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function FundXirrBar({ data }) {
  return (
    <div className="bg-white p-4 rounded">
      
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis unit="%" />
        <Tooltip />
        <Legend />
        <Bar dataKey="xirr" fill="#8884d8" />
      </BarChart>
    </div>
  );
}