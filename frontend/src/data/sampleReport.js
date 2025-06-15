// src/data/sampleReport.js
export const sampleReport = {
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
    { sector: "IT", allocation: 12 }
  ],
  risk_return: [
    { fund: "Axis Bluechip", risk: 6.5, return: 12.3 },
    { fund: "SBI Flexicap", risk: 8.2, return: 9.1 }
  ],
  overlap: [
    { fund: "SBI Bluechip", overlap: 42 },
    { fund: "HDFC Flexicap", overlap: 61 }
  ],
  liquidity: {
    Liquid: 80,
    "Semi-liquid": 15,
    Illiquid: 5
  },
  net_investment: [
    { month: "Jan 2023", amount: 20000 },
    { month: "Feb 2023", amount: 15000 },
    { month: "Mar 2023", amount: 25000 }
  ],
    comparative_performance: [
    { scheme: "Axis Bluechip", xirr: 14.5, ci: 13.2 },
    { scheme: "SBI Small Cap", xirr: 18.3, ci: 21.0 }
  ],
  top_performers: [
    { name: "Nippon Small Cap", xirr: 22.7 },
    { name: "HDFC Flexi Cap", xirr: 16.3 }
  ],
  bottom_performers: [
    { name: "Kotak Global", xirr: 4.2 },
    { name: "ICICI Bond", xirr: 5.1 }
  ],
  domestic_global: [
    { name: "Domestic", value: 98 },
    { name: "Global", value: 2 }
  ],
  red_zone_funds: [
    { name: "Franklin Opp", risk: 8.2, return: 6.5, ci_return: 7.8 }
  ],
  fund_rankings: [
    { fund: "HDFC Flexi Cap", quartile: 1 },
    { fund: "Axis Bluechip", quartile: 2 },
    { fund: "SBI Small Cap", quartile: 1 },
    { fund: "ICICI Value Discovery", quartile: 3 },
    { fund: "Kotak Global", quartile: 4 }
  ],
  holdings: {
    stocks: [
      { name: "HDFC Bank", sector: "Financials", percentage: 7.2 },
      { name: "Infosys", sector: "IT", percentage: 6.5 },
      { name: "Reliance Industries", sector: "Energy", percentage: 5.8 },
      { name: "TCS", sector: "IT", percentage: 4.9 },
      { name: "ITC", sector: "FMCG", percentage: 4.2 }
    ],
    amcs: [
      { name: "HDFC Mutual Fund", percentage: 22, funds: 4 },
      { name: "SBI Mutual Fund", percentage: 18, funds: 3 },
      { name: "Axis Mutual Fund", percentage: 15, funds: 2 },
      { name: "ICICI Prudential", percentage: 12, funds: 2 },
      { name: "Nippon India", percentage: 10, funds: 2 }
    ]
  },
  sip_analytics: {
    monthly_sip: 25000,
    total_invested: 300000,
    current_value: 345000,
    total_return: 15,
    sip_breakdown: [
      { fund: 'HDFC Flexi Cap', amount: 10000 },
      { fund: 'Axis Bluechip', amount: 8000 },
      { fund: 'SBI Small Cap', amount: 7000 }
    ]
  },
  recent_transactions: [
    { type: 'SIP', fund: 'HDFC Flexi Cap', amount: 10000, date: '2025-06-10' },
    { type: 'SIP', fund: 'Axis Bluechip', amount: 8000, date: '2025-06-10' },
    { type: 'Withdrawal', fund: 'SBI Gold Fund', amount: -5000, date: '2025-06-05' }
  ],
  portfolio_alerts: [
    {
      type: 'overlap',
      severity: 'warning',
      title: 'High Fund Overlap',
      message: '60% overlap detected between HDFC Flexi Cap and SBI Bluechip'
    },
    {
      type: 'performance',
      severity: 'error',
      title: 'Underperforming Fund',
      message: 'Franklin Opp is underperforming its benchmark by 15%'
    },
    {
      type: 'rebalance',
      severity: 'info',
      title: 'Rebalancing Needed',
      message: 'Equity allocation is 5% above target'
    }
  ]
};
