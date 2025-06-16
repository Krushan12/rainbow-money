import { Card } from "../ui/card";
import { usePortfolio } from "../../contexts/PortfolioContext";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export function PortfolioOverview() {
  const { portfolioData, loading } = usePortfolio();
  if (loading || !portfolioData) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {/* Title skeleton */}
          <div className="h-6 w-48 bg-gray-200 rounded" />
          
          {/* Chart and stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-center">
              <div className="h-48 w-48 rounded-full bg-gray-200" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const totalValue = Object.values(portfolioData.allocation).reduce(
    (sum, value) => sum + value,
    0
  );

  const { sip_analytics } = portfolioData;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Asset Allocation</h4>
          <div className="h-48">
            <CircularProgressbarWithChildren
              value={100}
              styles={buildStyles({
                pathColor: "#1e40af",
                trailColor: "#e2e8f0",
              })}
            >
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ₹{(totalValue / 100000).toFixed(1)}L
                </div>
                <div className="text-sm text-gray-500">Total Value</div>
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">SIP Analytics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Monthly SIP</div>
                <div className="text-lg font-semibold">
                  ₹{(sip_analytics.monthly_sip / 1000).toFixed(1)}K
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Return</div>
                <div className="text-lg font-semibold">
                  {sip_analytics.total_return}%
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Recent Alerts</h4>
            <div className="space-y-2">
              {portfolioData.portfolio_alerts.slice(0, 2).map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm ${
                    alert.severity === "error"
                      ? "bg-red-50 text-red-700"
                      : alert.severity === "warning"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {alert.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
