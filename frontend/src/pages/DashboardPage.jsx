import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight,
  Percent,
  TrendingUp,
  AlertCircle,
  BarChart2,
  PieChart,
  LineChart,
  ScatterChart
} from 'lucide-react';
import AssetAllocationPie from '../components/Charts/AssetAllocationPie';
import RiskReturnScatter from '../components/Charts/RiskReturnScatter';
import TopHoldings from '../components/EquityAnalysis/TopHoldings';
import TopBottomFunds from '../components/FundPerformance/TopBottomFunds';
import { useClients } from '../contexts/ClientContext';
import { sampleReport } from '../data/sampleReport';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const { clients, selectedClient, setSelectedClient } = useClients();
  const [portfolioData, setPortfolioData] = useState(null);
  const isClientDashboard = Boolean(clientId);
  
  useEffect(() => {
    if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setSelectedClient(client);
        setPortfolioData(sampleReport); // Use sample data for client view
      }
    } else {
      setSelectedClient(null);
      setPortfolioData(null);
    }
  }, [clientId, clients, setSelectedClient]);

  const metrics = [
    {
      title: "Portfolio Value",
      value: portfolioData ? `₹${(portfolioData.allocation.Equity + portfolioData.allocation.Debt + portfolioData.allocation.Gold).toLocaleString()}` : "Select a client",
      description: "Total portfolio value across all mutual funds",
      icon: <ArrowUpRight className="h-5 w-5" />
    },
    {
      title: "Total Returns",
      value: portfolioData ? `${portfolioData.sip_analytics.total_return}%` : "Select a client",
      description: "Track absolute returns on your investments",
      icon: <Percent className="h-5 w-5" />
    },
    {
      title: "Monthly SIP",
      value: portfolioData ? `₹${portfolioData.sip_analytics.monthly_sip.toLocaleString()}` : "Select a client",
      description: "Your total monthly SIP amount",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: "Active Alerts",
      value: portfolioData ? `${portfolioData.red_zone_funds.length} funds` : "Select a client",
      description: "Funds requiring attention",
      icon: <AlertCircle className="h-5 w-5" />
    }
  ];

  const features = [
    {
      title: "Portfolio Overview",
      icon: <BarChart2 className="h-5 w-5" />,
      description: "Comprehensive view of investments including current value, returns, and monthly SIP details."
    },
    {
      title: "Asset Allocation",
      icon: <PieChart className="h-5 w-5" />,
      description: "View your portfolio's distribution across asset classes, sectors, and market caps."
    },
    {
      title: "Performance Metrics",
      icon: <LineChart className="h-5 w-5" />,
      description: "Track XIRR, absolute returns, and benchmark comparison."
    },
    {
      title: "Risk Analysis",
      icon: <ScatterChart className="h-5 w-5" />,
      description: "Get detailed risk metrics and portfolio analysis."
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          {isClientDashboard ? `${selectedClient?.name}'s Dashboard` : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {isClientDashboard 
            ? (portfolioData ? "Comprehensive analysis of your investment portfolio" : "Upload CAMS PDF to view portfolio analysis")
            : "Welcome to your investment management dashboard"}
        </p>
      </div>

      {isClientDashboard ? (
        // Client-specific dashboard with portfolio data
        <>
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
          {portfolioData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-lg border bg-card"
              >
                <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
                <AssetAllocationPie data={portfolioData.allocation} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-lg border bg-card"
              >
                <h3 className="text-lg font-semibold mb-4">Top Holdings</h3>
                <TopHoldings data={portfolioData.holdings} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-lg border bg-card"
              >
                <h3 className="text-lg font-semibold mb-4">Fund Performance</h3>
                <TopBottomFunds 
                  topPerformers={portfolioData.top_performers} 
                  bottomPerformers={portfolioData.bottom_performers} 
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-lg border bg-card"
              >
                <h3 className="text-lg font-semibold mb-4">Risk vs Return</h3>
                <RiskReturnScatter data={portfolioData.risk_return} />
              </motion.div>
            </div>
          )}
        </>
      ) : (
        // Main dashboard with features overview
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}