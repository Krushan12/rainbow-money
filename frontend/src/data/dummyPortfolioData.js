// src/data/dummyPortfolioData.js
export const dummyPortfolioData = {
  allocation: {
    Equity: 600000,
    Debt: 300000,
    Gold: 100000
  },
  fund_performance: [
    { name: "HDFC Flexi Cap", xirr: 13.2 },
    { name: "Axis Bluechip", xirr: 9.5 },
    { name: "SBI Gold Fund", xirr: 7.1 }
  ],
  market_cap: {
    "Large Cap": 30,
    "Mid Cap": 35,
    "Small Cap": 35
  },
  sector_allocation: [
    { sector: "Consumer Discretionary", allocation: 25 },
    { sector: "Financials", allocation: 15 },
    { sector: "IT", allocation: 12 },
    { sector: "Healthcare", allocation: 10 },
    { sector: "Industrials", allocation: 8 }
  ],
  risk_return: [
    { fund: "Axis Bluechip", risk: 6.5, return: 12.3 },
    { fund: "SBI Flexicap", risk: 8.2, return: 9.1 },
    { fund: "HDFC Flexi Cap", risk: 7.8, return: 13.2 },
    { fund: "SBI Gold Fund", risk: 5.1, return: 7.1 }
  ],
  overlap: [
    { fund: "SBI Bluechip", overlap: 42 },
    { fund: "HDFC Flexicap", overlap: 61 },
    { fund: "Axis Bluechip", overlap: 38 }
  ],
  liquidity: {
    Liquid: 80,
    "Semi-liquid": 15,
    Illiquid: 5
  },
  net_investment: [
    { month: "Jan 2023", amount: 20000 },
    { month: "Feb 2023", amount: 15000 },
    { month: "Mar 2023", amount: 25000 },
    { month: "Apr 2023", amount: 18000 },
    { month: "May 2023", amount: 22000 },
    { month: "Jun 2023", amount: 30000 }
  ],
  top_holdings: {
    stocks: [
      { name: "HDFC Bank", sector: "Banking", percentage: 8.5 },
      { name: "Infosys", sector: "IT", percentage: 7.2 },
      { name: "TCS", sector: "IT", percentage: 6.8 },
      { name: "Reliance Industries", sector: "Oil & Gas", percentage: 6.5 },
      { name: "ICICI Bank", sector: "Banking", percentage: 5.9 }
    ],
    amcs: [
      { name: "HDFC Mutual Fund", percentage: 28.5 },
      { name: "SBI Mutual Fund", percentage: 22.3 },
      { name: "Axis Mutual Fund", percentage: 18.7 },
      { name: "ICICI Prudential", percentage: 16.4 },
      { name: "Kotak Mutual Fund", percentage: 14.1 }
    ]
  },
  summary: {
    total_value: 1000000,
    total_invested: 850000,
    xirr: 12.5,
    risk_score: 7.2
  },
  sip_analytics: {
    total_return: 15.8,
    monthly_sip: 25000,
    total_sips: 24,
    average_return: 12.4
  },
  portfolio_alerts: [
    { id: 1, type: "underperforming", fund: "HDFC Mid-Cap Fund", message: "Underperforming benchmark by 5%" },
    { id: 2, type: "overlap", fund: "Axis Bluechip", message: "High overlap with existing portfolio" }
  ],
  top_performers: [
    { name: "HDFC Flexi Cap", return: 15.2, benchmark_diff: 3.5 },
    { name: "Axis Bluechip", return: 14.8, benchmark_diff: 3.1 },
    { name: "ICICI Tech Fund", return: 13.9, benchmark_diff: 2.2 }
  ],
  bottom_performers: [
    { name: "SBI Gold Fund", return: 5.2, benchmark_diff: -2.1 },
    { name: "HDFC Mid-Cap", return: 6.8, benchmark_diff: -1.5 },
    { name: "Kotak Small Cap", return: 7.4, benchmark_diff: -0.8 }
  ],
  fund_rankings: [
    { name: "HDFC Flexi Cap", rank: 1, category_rank: 3, category_total: 68 },
    { name: "Axis Bluechip", rank: 2, category_rank: 5, category_total: 42 },
    { name: "ICICI Tech Fund", rank: 3, category_rank: 2, category_total: 15 }
  ],
  comparative_performance: {
    funds: ["HDFC Flexi Cap", "Axis Bluechip", "SBI Blue Chip"],
    periods: ["1Y", "3Y", "5Y"],
    data: [
      [12.5, 15.2, 10.8],
      [14.8, 16.5, 13.2],
      [13.2, 14.8, 12.5]
    ]
  },
  red_zone_funds: [
    {
      name: "SBI Gold Fund",
      issue: "Underperforming benchmark",
      severity: "high",
      action: "Review allocation"
    },
    {
      name: "HDFC Mid-Cap",
      issue: "High expense ratio",
      severity: "medium",
      action: "Consider alternatives"
    }
  ],
  domestic_global: {
    domestic: 85,
    international: 15,
    regions: {
      "US": 8,
      "Europe": 4,
      "Asia Pacific": 3
    }
  }
};
