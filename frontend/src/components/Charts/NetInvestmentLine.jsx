import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function NetInvestmentLine({ data }) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis 
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis 
            tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
            width={80}
          />
          <Tooltip 
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, "Amount"]}
            labelFormatter={(month) => `Month: ${month}`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #eee',
              borderRadius: '4px',
              padding: '8px 12px'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingBottom: 20 }}
          />
          <Line 
            type="monotone"
            dataKey="amount"
            name="Investment"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4, fill: '#8884d8' }}
            activeDot={{ 
              r: 6, 
              stroke: '#8884d8',
              strokeWidth: 2,
              fill: '#fff'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}