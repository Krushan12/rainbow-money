import React from 'react';

export default function RedZoneFunds({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow lg:col-span-2">
      <h3 className="text-lg font-semibold mb-4 text-red-600">Red Zone Funds</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-red-50">
              <th className="text-left p-2">Scheme</th>
              <th className="text-right p-2">Risk</th>
              <th className="text-right p-2">Return</th>
              <th className="text-right p-2">CI Return</th>
            </tr>
          </thead>
          <tbody>
            {data.map((fund) => (
              <tr key={fund.name} className="border-b">
                <td className="p-2">{fund.name}</td>
                <td className="text-right p-2">{fund.risk.toFixed(1)}</td>
                <td className="text-right p-2">{fund.return.toFixed(1)}%</td>
                <td className="text-right p-2">{fund.ci_return.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}