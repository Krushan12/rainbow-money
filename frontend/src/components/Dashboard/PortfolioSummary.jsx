export default function PortfolioSummary({ allocation, performance, marketCap }) {
  const totalValue = Object.values(allocation).reduce((sum, val) => sum + val, 0);
  const avgXirr = performance.reduce((sum, fund) => sum + fund.xirr, 0) / performance.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Asset Allocation Card */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
        <div className="space-y-3">
          {Object.entries(allocation).map(([asset, value]) => (
            <div key={asset} className="flex justify-between">
              <span>{asset}:</span>
              <span className="font-medium">
                ₹{value.toLocaleString('en-IN')} ({(value/totalValue*100).toFixed(1)}%)
              </span>
            </div>
          ))}
          <div className="pt-3 mt-3 border-t">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>₹{totalValue.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fund Performance Card */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Fund Performance</h3>
        <div className="space-y-3">
          {performance.map((fund) => (
            <div key={fund.name} className="flex justify-between">
              <span>{fund.name}:</span>
              <span className={fund.xirr >= 0 ? 'text-green-600' : 'text-red-600'}>
                {fund.xirr.toFixed(2)}%
              </span>
            </div>
          ))}
          <div className="pt-3 mt-3 border-t">
            <div className="flex justify-between">
              <span className="font-medium">Average XIRR:</span>
              <span className={`font-bold ${avgXirr >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {avgXirr.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Cap Card */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Market Cap Distribution</h3>
        <div className="space-y-3">
          {Object.entries(marketCap).map(([cap, percentage]) => (
            <div key={cap} className="flex justify-between">
              <span>{cap}:</span>
              <span className="font-medium">{percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}