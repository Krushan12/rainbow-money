// Function to calculate XIRR using Newton-Raphson method
export function calculateXIRR(transactions) {
  if (!transactions || transactions.length < 2) return 0;

  const DAYS_IN_YEAR = 365.25;
  const MAX_ITERATIONS = 100;
  const PRECISION = 0.000001;

  // Initialize guess rate (10%)
  let rate = 0.1;

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    let f = 0;
    let df = 0;
    const refDate = transactions[0].date;

    for (const txn of transactions) {
      const days = (txn.date - refDate) / (1000 * 60 * 60 * 24);
      const years = days / DAYS_IN_YEAR;
      const amount = txn.type === 'Purchase' ? -txn.netAmount : txn.netAmount;

      const v = Math.pow(1 + rate, years);
      f += amount / v;
      df += -years * amount / Math.pow(v, 2);
    }

    // Newton-Raphson step
    const newRate = rate - f / df;

    // Check for convergence
    if (Math.abs(newRate - rate) < PRECISION) {
      return (newRate * 100).toFixed(2);
    }

    rate = newRate;
  }

  return 0; // Return 0 if no convergence
}

// Function to calculate various return metrics
export function calculateReturns(portfolio) {
  const returns = {
    absolute: 0,
    cagr: 0,
    oneYear: 0,
    threeYear: 0,
    fiveYear: 0
  };

  if (!portfolio || !portfolio.totalInvestment || !portfolio.currentValue) {
    return returns;
  }

  // Calculate absolute returns
  returns.absolute = ((portfolio.currentValue - portfolio.totalInvestment) / portfolio.totalInvestment) * 100;

  // Calculate CAGR
  const years = (new Date() - portfolio.createdAt) / (1000 * 60 * 60 * 24 * 365.25);
  if (years > 0) {
    returns.cagr = (Math.pow(portfolio.currentValue / portfolio.totalInvestment, 1 / years) - 1) * 100;
  }

  // Calculate point-to-point returns (would need historical NAV data for accurate calculation)
  // This is a placeholder for actual implementation
  returns.oneYear = returns.cagr;
  returns.threeYear = returns.cagr;
  returns.fiveYear = returns.cagr;

  return returns;
}

// Function to calculate risk metrics
export function calculateRiskMetrics(returns) {
  if (!returns || returns.length < 2) return { standardDeviation: 0, sharpeRatio: 0, beta: 0 };

  // Calculate average return
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;

  // Calculate standard deviation
  const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / (returns.length - 1);
  const standardDeviation = Math.sqrt(variance);

  // Assuming risk-free rate of 4%
  const riskFreeRate = 4;
  const sharpeRatio = (avgReturn - riskFreeRate) / standardDeviation;

  return {
    standardDeviation,
    sharpeRatio,
    beta: 0 // Would need benchmark data to calculate beta
  };
}
