import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useClients } from '../contexts/ClientContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import { dummyPortfolioData } from '../data/dummyPortfolioData';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  PieChart, 
  LineChart, 
  Boxes,
  Network,
  Target,
  AlertCircle
} from 'lucide-react';
import FundRanking from '../components/FundPerformance/FundRanking';
import TopBottomFunds from '../components/FundPerformance/TopBottomFunds';
import AssetAllocationPie from '../components/Charts/AssetAllocationPie';
import FundOverlapBar from '../components/Charts/FundOverlapBar';
import MarketCapPie from '../components/Charts/MarketCapPie';
import RiskReturnScatter from '../components/Charts/RiskReturnScatter';
import SectorBarChart from '../components/Charts/SectorBarChart';
import TopHoldings from '../components/EquityAnalysis/TopHoldings';

export default function ReportDashboard() {
  const { clientId } = useParams();
  const { clients, selectedClient, setSelectedClient } = useClients();
  const { portfolioData, fetchPortfolioData, loading } = usePortfolio();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const isClientReport = Boolean(clientId);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        
        if (clientId) {
          const client = clients?.find(c => c._id === clientId);
          
          if (!client) {
            setError("Please select a valid client to view their report.");
            return;
          }

          if (isInitialLoad) {
            setSelectedClient(client);
            await fetchPortfolioData();
            setIsInitialLoad(false);
          }
        } else {
          setSelectedClient(null);
        }
      } catch (err) {
        setError("There was an error loading the report data. Please try again.");
        console.error("Report data loading error:", err);
      }
    };

    loadData();
  }, [clientId, clients, setSelectedClient, fetchPortfolioData, isInitialLoad]);

  const reportFeatures = [
    {
      title: "Fund Analysis",
      description: "Detailed analysis of individual fund performance, rankings, and benchmark comparisons.",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      title: "Portfolio Composition",
      description: "Comprehensive breakdown of investments across asset classes and sectors.",
      icon: <PieChart className="h-5 w-5" />,
    },
    {
      title: "Risk Assessment",
      description: "Evaluate portfolio risk metrics and return characteristics.",
      icon: <Target className="h-5 w-5" />,
    },
    {
      title: "Performance Tracking",
      description: "Track your investment journey with historical performance data.",
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      title: "Holdings Analysis",
      description: "Deep dive into equity holdings and market cap distribution.",
      icon: <Boxes className="h-5 w-5" />,
    },
    {
      title: "Overlap Analysis",
      description: "Identify overlapping investments across mutual funds.",
      icon: <Network className="h-5 w-5" />,
    }
  ];

  // Helper function to safely access data
  const getData = () => portfolioData || dummyPortfolioData;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          {isClientReport ? `${selectedClient?.name}'s Reports` : 'Reports'}
        </h1>
        <p className="text-muted-foreground">
          {isClientReport 
            ? "Detailed analysis and reports of the investment portfolio"
            : "Comprehensive investment analysis and reporting tools"}
        </p>
      </div>

      {error ? (
        // Error state
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Unable to Load Report</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
        </div>
      ) : isClientReport ? (
        loading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="p-6 rounded-lg border bg-card"
              >
                <div className="animate-pulse">
                  <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Client-specific reports with portfolio data
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border bg-card"
            >
              <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
              <AssetAllocationPie data={getData().allocation} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border bg-card"
            >
              <h3 className="text-lg font-semibold mb-4">Market Cap Distribution</h3>
              <MarketCapPie data={getData().market_cap} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border bg-card"
            >
              <h3 className="text-lg font-semibold mb-4">Sector Allocation</h3>
              <SectorBarChart data={getData().sector_allocation} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border bg-card"
            >
              <h3 className="text-lg font-semibold mb-4">Risk vs Return</h3>
              <RiskReturnScatter data={getData().risk_return} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border bg-card"
            >
              <h3 className="text-lg font-semibold mb-4">Fund Performance</h3>
              <TopBottomFunds 
                topPerformers={getData().top_performers} 
                bottomPerformers={getData().bottom_performers} 
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border bg-card"
            >
              <h3 className="text-lg font-semibold mb-4">Fund Rankings</h3>
              <FundRanking data={getData().fund_rankings} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border bg-card"
            >
              <h3 className="text-lg font-semibold mb-4">Portfolio Overlap</h3>
              <FundOverlapBar data={getData().overlap} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border bg-card"
            >
              <h3 className="text-lg font-semibold mb-4">Top Holdings</h3>
              <TopHoldings data={getData().top_holdings} />
            </motion.div>
          </div>
        )
      ) : (
        // Main reports page with features overview
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportFeatures.map((feature, index) => (
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