import { Card } from "../ui/card";
import { usePortfolio } from "../../contexts/PortfolioContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function FundPerformance() {
  const { portfolioData, loading } = usePortfolio();
  if (loading || !portfolioData) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {/* Title skeleton */}
          <div className="h-6 w-48 bg-gray-200 rounded" />
          
          {/* Chart skeleton */}
          <div className="h-48 bg-gray-200 rounded" />
          
          {/* Performance lists skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-2">
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

  const { fund_performance, top_performers, bottom_performers } = portfolioData;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "XIRR (%)",
        },
      },
    },
  };

  const data = {
    labels: fund_performance.map((fund) => fund.name),
    datasets: [
      {
        label: "XIRR",
        data: fund_performance.map((fund) => fund.xirr),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Fund Performance</h3>
      <div className="grid grid-cols-1 gap-6">
        <div className="h-48">
          <Bar options={options} data={data} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Top Performers</h4>
            <div className="space-y-2">
              {top_performers.map((fund, index) => (
                <div
                  key={index}
                  className="bg-green-50 p-3 rounded-lg flex justify-between items-center"
                >
                  <span className="text-sm">{fund.name}</span>
                  <span className="text-sm font-semibold text-green-600">
                    {fund.xirr}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Bottom Performers</h4>
            <div className="space-y-2">
              {bottom_performers.map((fund, index) => (
                <div
                  key={index}
                  className="bg-red-50 p-3 rounded-lg flex justify-between items-center"
                >
                  <span className="text-sm">{fund.name}</span>
                  <span className="text-sm font-semibold text-red-600">
                    {fund.xirr}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
