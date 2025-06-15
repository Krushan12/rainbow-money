import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FundRanking({ data }) {
  const colors = {
    Q1: '#4CAF50', // Green
    Q2: '#2196F3', // Blue
    Q3: '#FFC107', // Yellow
    Q4: '#F44336'  // Red
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Fund Quartile Performance</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
              fill={(d) => colors[`Q${d.quartile}`]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}