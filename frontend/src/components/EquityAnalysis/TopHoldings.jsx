import React from 'react';

export default function TopHoldings({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Top Holdings</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Top 5 Stocks</h4>
          <div className="space-y-2">
            {data.stocks.map((stock) => (
              <div key={stock.name} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span>{stock.name}</span>
                  <span className="text-sm text-gray-500">({stock.sector})</span>
                </div>
                <span className="font-medium">{stock.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-2">Top 5 AMCs</h4>
          <div className="space-y-2">
            {data.amcs.map((amc) => (
              <div key={amc.name} className="flex justify-between items-center">
                <span>{amc.name}</span>
                <div className="text-right">
                  <span className="font-medium">{amc.percentage}%</span>
                  <div className="text-sm text-gray-500">
                    {amc.funds} funds
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}