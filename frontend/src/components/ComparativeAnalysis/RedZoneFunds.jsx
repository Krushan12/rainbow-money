import React from 'react';

export default function RedZoneFunds({ data }) {
  // If data is not provided or not an array, show default/empty state
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Red Zone Funds</h3>
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          No red zone funds found
        </div>
      </div>
    );
  }

  // Format number safely
  const formatNumber = (num) => {
    if (typeof num !== 'number') return 'N/A';
    return num.toFixed(1);
  };

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
            {data.map((fund, index) => (
              <tr key={fund.name || index} className="border-b">
                <td className="p-2">{fund.name || 'Unknown Fund'}</td>
                <td className="text-right p-2">{formatNumber(fund.risk)}%</td>
                <td className="text-right p-2">{formatNumber(fund.return)}%</td>
                <td className="text-right p-2">{formatNumber(fund.ci_return)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}