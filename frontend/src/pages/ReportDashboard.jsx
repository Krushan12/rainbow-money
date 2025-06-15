import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useClients } from '../contexts/ClientContext';
import { motion } from 'framer-motion';
import { sampleReport } from '../data/sampleReport';
import { 
  BarChart2, 
  PieChart, 
  LineChart, 
  Boxes,
  Network,
  Target
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
  const [portfolioData, setPortfolioData] = useState(null);
  const isClientReport = Boolean(clientId);
  
  useEffect(() => {
    if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setSelectedClient(client);
        setPortfolioData(sampleReport);
      }
    } else {
      setSelectedClient(null);
      setPortfolioData(null);
    }
  }, [clientId, clients, setSelectedClient]);

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

      {isClientReport && portfolioData ? (
        // Client-specific reports with portfolio data
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
            <h3 className="text-lg font-semibold mb-4">Market Cap Distribution</h3>
            <MarketCapPie data={portfolioData.market_cap} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg border bg-card"
          >
            <h3 className="text-lg font-semibold mb-4">Sector Allocation</h3>
            <SectorBarChart data={portfolioData.sector_allocation} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg border bg-card"
          >
            <h3 className="text-lg font-semibold mb-4">Risk vs Return</h3>
            <RiskReturnScatter data={portfolioData.risk_return} />
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
            <h3 className="text-lg font-semibold mb-4">Fund Rankings</h3>
            <FundRanking data={portfolioData.fund_rankings} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg border bg-card"
          >
            <h3 className="text-lg font-semibold mb-4">Portfolio Overlap</h3>
            <FundOverlapBar data={portfolioData.overlap} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg border bg-card"
          >
            <h3 className="text-lg font-semibold mb-4">Top Holdings</h3>
            <TopHoldings data={portfolioData.holdings} />
          </motion.div>
        </div>
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