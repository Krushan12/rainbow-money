export default function TopBottomFunds({ topPerformers, bottomPerformers }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="font-medium text-green-600 mb-2">Top 5 Performers</h4>
        <div className="space-y-2">
          {topPerformers.map((fund) => (
            <div key={fund.name} className="flex justify-between">
              <span>{fund.name}</span>
              <span className="font-medium">{fund.xirr}%</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-medium text-red-600 mb-2">Bottom 5 Performers</h4>
        <div className="space-y-2">
          {bottomPerformers.map((fund) => (
            <div key={fund.name} className="flex justify-between">
              <span>{fund.name}</span>
              <span className="font-medium">{fund.xirr}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}