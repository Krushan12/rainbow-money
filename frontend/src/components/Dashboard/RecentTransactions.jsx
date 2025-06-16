import { Card } from "../ui/card";
import { usePortfolio } from "../../contexts/PortfolioContext";

export function RecentTransactions() {
  const { portfolioData, loading } = usePortfolio();
  if (loading || !portfolioData) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {/* Title skeleton */}
          <div className="h-6 w-48 bg-gray-200 rounded" />
          
          {/* Transactions list skeleton */}
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-gray-100">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const { recent_transactions } = portfolioData;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <div className="space-y-2">
        {recent_transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 rounded-lg bg-gray-50"
          >
            <div>
              <div className="font-medium">{transaction.fund}</div>
              <div className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </div>
            </div>
            <div
              className={`text-sm font-semibold ${
                transaction.type === "SIP"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {transaction.type === "SIP" ? "+" : ""}₹
              {Math.abs(transaction.amount).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
