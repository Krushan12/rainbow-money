import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FundRanking({ data }) {
  const colors = {
    Q1: '#4CAF50', // Green
    Q2: '#2196F3', // Blue
    Q3: '#FFC107', // Yellow
    Q4: '#F44336'  // Red
  };

  // If data is not provided or not an array, show default/empty state
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Fund Quartile Performance</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No ranking data available
        </div>
      </div>
    );
  }

  // Process the data to add fill color
  const processedData = data.map(item => ({
    ...item,
    fillColor: colors[`Q${item.quartile}`] || '#999999'
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Fund Quartile Performance</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <XAxis
              dataKey="fund"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              label={{ 
                value: 'Quartile Ranking', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' } 
              }}
            />
            <Tooltip 
              formatter={(value, name) => {
                return [`Quartile ${value}`, name];
              }}
            />
            <Legend />
            <Bar 
              dataKey="quartile" 
              name="Quartile Ranking" 
              fill="#666666"
              fillOpacity={0.9} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}