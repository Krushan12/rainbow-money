import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight,
  Percent,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useClients } from '../contexts/ClientContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import { dummyPortfolioData } from '../data/dummyPortfolioData';
import AssetAllocationPie from '../components/Charts/AssetAllocationPie';
import RiskReturnScatter from '../components/Charts/RiskReturnScatter';
import TopHoldings from '../components/EquityAnalysis/TopHoldings';
import TopBottomFunds from '../components/FundPerformance/TopBottomFunds';

export default function ClientDashboard() {
  const { clientId } = useParams();
  const { clients, selectedClient, setSelectedClient } = useClients();
  const { portfolioData, fetchPortfolioData, loading } = usePortfolio();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Clear any previous errors
        setError(null);
        
        // Find the client by ID
        const client = clients?.find(c => c._id === clientId);
        
        if (!client || !clientId) {
          setError("Please select a valid client to view their portfolio.");
          return;
        }

        if (isInitialLoad) {
          setSelectedClient(client);
          // Note: In production, fetchPortfolioData would make an API call
          // For now, we'll use dummy data since MF Central API isn't ready
          await fetchPortfolioData();
          setIsInitialLoad(false);
        }
      } catch (err) {
        setError("There was an error loading the portfolio data. Please try again.");
        console.error("Portfolio data loading error:", err);
      }
    };

    loadData();
  }, [clientId, clients, setSelectedClient, fetchPortfolioData, isInitialLoad]);

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Unable to Load Portfolio</h2>
        <p className="text-gray-600 text-center mb-4">{error}</p>
      </div>
    );
  }

  // Show loading state
  if (!selectedClient || loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mt-2"></div>
        </div>
      </div>
    );
  }

  // Use dummy data for now, later this will be replaced with real API data
  const displayData = portfolioData || dummyPortfolioData;
  const {
    allocation = {},
    sip_analytics = {},
    risk_return = [],
    top_performers = [],
    bottom_performers = [],
    portfolio_alerts = []
  } = displayData || {};

  const totalValue = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  const metrics = [
    {
      title: "Portfolio Value",
      value: `₹${totalValue.toLocaleString()}`,
      description: "Total portfolio value across all mutual funds",
      icon: <ArrowUpRight className="h-5 w-5" />
    },
    {
      title: "Total Returns",
      value: `${displayData.sip_analytics?.total_return ?? 0}%`,
      description: "Track absolute returns on your investments",
      icon: <Percent className="h-5 w-5" />
    },
    {
      title: "Monthly SIP",
      value: `₹${displayData.sip_analytics?.monthly_sip?.toLocaleString() ?? 0}`,
      description: "Your total monthly SIP amount",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: "Active Alerts",
      value: `${displayData.portfolio_alerts?.length ?? 0} funds`,
      description: "Funds requiring attention",
      icon: <AlertCircle className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{selectedClient.name}'s Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of your investment portfolio
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-lg border bg-card"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {metric.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{metric.title}</p>
                <h4 className="text-2xl font-bold mt-2">{metric.value}</h4>
                <p className="text-sm text-muted-foreground mt-1">{metric.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Portfolio Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border bg-card"
        >
          <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
          <AssetAllocationPie data={allocation} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border bg-card"
        >          <h3 className="text-lg font-semibold mb-4">Top Holdings</h3>
          <TopHoldings data={displayData.top_holdings} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border bg-card"
        >
          <h3 className="text-lg font-semibold mb-4">Fund Performance</h3>
          <TopBottomFunds 
            topPerformers={top_performers} 
            bottomPerformers={bottom_performers} 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-lg border bg-card"
        >
          <h3 className="text-lg font-semibold mb-4">Risk vs Return</h3>
          <RiskReturnScatter data={risk_return} />
        </motion.div>
      </div>

      {/* Portfolio Alerts */}
      {portfolio_alerts.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Portfolio Alerts</h3>
          <div className="space-y-2">
            {portfolio_alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg text-sm ${
                  alert.severity === 'error'
                    ? 'bg-red-50 text-red-700'
                    : alert.severity === 'warning'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                <div className="font-medium">{alert.title}</div>
                <div>{alert.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
