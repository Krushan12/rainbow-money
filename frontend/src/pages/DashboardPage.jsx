import React, { useEffect, useState } from 'react';
import { useClients } from '../contexts/ClientContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import { motion } from 'framer-motion';
import { 
  BarChart2,
  PieChart,
  LineChart,
  ScatterChart,
  Wallet,
  TrendingUp,
  Activity,
  Briefcase,
  Clock,
  AlertTriangle,
  FileText,
  BarChart3
} from 'lucide-react';
import { Card } from '../components/ui/card';

export default function DashboardPage() {  const { clients } = useClients();

  const portfolioFeatures = [
    {
      title: "Portfolio Overview",
      icon: <Wallet className="h-5 w-5" />,
      description: "Complete view of portfolio value, asset allocation, and holdings",
      features: [
        "Total portfolio valuation",
        "Asset class distribution",
        "Fund-wise breakdown",
        "Latest NAV tracking"
      ]
    },
    {
      title: "Performance Analytics",
      icon: <TrendingUp className="h-5 w-5" />,
      description: "Detailed performance metrics and returns analysis",
      features: [
        "XIRR calculations",
        "Absolute returns",
        "SIP performance",
        "Benchmark comparison"
      ]
    },
    {
      title: "Risk Assessment",
      icon: <Activity className="h-5 w-5" />,
      description: "Comprehensive risk analysis of your portfolio",
      features: [
        "Risk-return ratios",
        "Volatility measures",
        "Portfolio beta",
        "Category-wise risk"
      ]
    },
    {
      title: "Investment Details",
      icon: <Briefcase className="h-5 w-5" />,
      description: "Detailed investment tracking and analysis",
      features: [
        "Transaction history",
        "SIP scheduler",
        "Investment timeline",
        "Goal tracking"
      ]
    }
  ];

  const analyticsFeatures = [
    {
      title: "Market Cap Analysis",
      icon: <PieChart className="h-5 w-5" />,
      description: "Distribution across market capitalizations",
      features: [
        "Large cap exposure",
        "Mid cap allocation",
        "Small cap investments",
        "Cap-wise performance"
      ]
    },
    {
      title: "Fund Analysis",
      icon: <BarChart2 className="h-5 w-5" />,
      description: "Detailed mutual fund performance tracking",
      features: [
        "Top performing funds",
        "Underperforming funds",
        "Fund ratings",
        "Exit load tracking"
      ]
    },
    {
      title: "Sector Exposure",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "Sector-wise portfolio distribution",
      features: [
        "Sector allocation",
        "Industry exposure",
        "Sector performance",
        "Concentration analysis"
      ]
    },
    {
      title: "Reports & Insights",
      icon: <FileText className="h-5 w-5" />,
      description: "Comprehensive reporting and analysis",
      features: [
        "Portfolio summary",
        "Performance reports",
        "Tax statements",
        "Gain/Loss analysis"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Portfolio Management Dashboard</h1>
        <p className="text-muted-foreground">
          Access detailed portfolio analysis and performance metrics for each client
        </p>
      </div>

      {/* Main Portfolio Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-lg border bg-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {feature.features.map((item, i) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Analytics Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="p-6 rounded-lg border bg-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {feature.features.map((item, i) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Getting Started Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Getting Started</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-sm font-medium">Steps to Access Client Portfolio:</p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">1</span>
                Navigate to Clients page
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">2</span>
                Select or add a new client
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">3</span>
                Upload portfolio statements
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">4</span>
                Access detailed analytics
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <p className="text-sm font-medium">Important Notes:</p>
            </div>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">• Portfolio data is updated daily with latest NAV</li>
              <li className="text-sm text-muted-foreground">• SIP tracking requires regular statement updates</li>
              <li className="text-sm text-muted-foreground">• Reports can be downloaded in PDF format</li>
              <li className="text-sm text-muted-foreground">• Set up alerts for important portfolio events</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}