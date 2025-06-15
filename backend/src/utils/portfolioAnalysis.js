import Scheme from '../models/scheme.model.js';

export async function calculateFundOverlap(scheme1Id, scheme2Id) {
  const [scheme1, scheme2] = await Promise.all([
    Scheme.findById(scheme1Id),
    Scheme.findById(scheme2Id)
  ]);

  if (!scheme1 || !scheme2) {
    throw new Error('One or both schemes not found');
  }

  // Calculate sector overlap
  const sectorOverlap = calculateSectorOverlap(
    scheme1.sectorAllocation,
    scheme2.sectorAllocation
  );

  // Calculate market cap overlap
  const marketCapOverlap = calculateMarketCapOverlap(
    scheme1.marketCapAllocation,
    scheme2.marketCapAllocation
  );

  return {
    sectorOverlap,
    marketCapOverlap,
    overallOverlap: (sectorOverlap + marketCapOverlap) / 2
  };
}

export function calculateSectorOverlap(sectors1, sectors2) {
  let overlap = 0;
  const sectors = new Set([...sectors1.keys(), ...sectors2.keys()]);

  for (const sector of sectors) {
    const weight1 = sectors1.get(sector) || 0;
    const weight2 = sectors2.get(sector) || 0;
    overlap += Math.min(weight1, weight2);
  }

  return overlap;
}

export function calculateMarketCapOverlap(cap1, cap2) {
  return (
    Math.min(cap1.largeCap || 0, cap2.largeCap || 0) +
    Math.min(cap1.midCap || 0, cap2.midCap || 0) +
    Math.min(cap1.smallCap || 0, cap2.smallCap || 0)
  );
}

export function analyzeLiquidity(portfolio) {
  const liquidityProfile = {
    highLiquidity: 0,    // T+1 redemption
    mediumLiquidity: 0,  // T+2 to T+3
    lowLiquidity: 0      // > T+3
  };

  for (const holding of portfolio.holdings) {
    const { scheme, currentValue } = holding;
    
    switch (scheme.type) {
      case 'Equity':
        liquidityProfile.mediumLiquidity += currentValue;
        break;
      case 'Debt':
        if (scheme.category.includes('Liquid') || scheme.category.includes('Overnight')) {
          liquidityProfile.highLiquidity += currentValue;
        } else if (scheme.category.includes('Ultra Short') || scheme.category.includes('Low Duration')) {
          liquidityProfile.mediumLiquidity += currentValue;
        } else {
          liquidityProfile.lowLiquidity += currentValue;
        }
        break;
      default:
        liquidityProfile.mediumLiquidity += currentValue;
    }
  }

  const total = portfolio.currentValue;
  return {
    ...liquidityProfile,
    highLiquidityPercent: (liquidityProfile.highLiquidity / total) * 100,
    mediumLiquidityPercent: (liquidityProfile.mediumLiquidity / total) * 100,
    lowLiquidityPercent: (liquidityProfile.lowLiquidity / total) * 100
  };
}

export function generateRebalancingSuggestions(portfolio, targetAllocation) {
  const currentAllocation = portfolio.assetAllocation;
  const suggestions = [];
  const threshold = 5; // 5% threshold for rebalancing

  // Compare current vs target allocation
  for (const [asset, target] of Object.entries(targetAllocation)) {
    const current = currentAllocation[asset] || 0;
    const diff = target - current;

    if (Math.abs(diff) > threshold) {
      suggestions.push({
        asset,
        currentAllocation: current,
        targetAllocation: target,
        difference: diff,
        action: diff > 0 ? 'Increase' : 'Decrease',
        amountToRebalance: Math.abs(diff * portfolio.currentValue / 100)
      });
    }
  }

  return suggestions;
}

export function calculateVolatility(returns, period = 'monthly') {
  if (!returns || returns.length < 2) return 0;

  const mean = returns.reduce((a, b) => a + b) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b) / (returns.length - 1);
  
  // Annualize volatility based on period
  const annualizationFactor = {
    daily: Math.sqrt(252),
    weekly: Math.sqrt(52),
    monthly: Math.sqrt(12)
  }[period] || 1;

  return Math.sqrt(variance) * annualizationFactor;
}

export function calculateRiskReturnMetrics(portfolio, benchmark) {
  const returns = portfolio.holdings.map(h => ({
    scheme: h.scheme.name,
    return: ((h.currentValue - (h.units * h.avgCostPrice)) / (h.units * h.avgCostPrice)) * 100,
    risk: calculateVolatility(h.scheme.returns.historicalReturns || [])
  }));

  return {
    returns,
    portfolioReturn: portfolio.xirr,
    portfolioRisk: calculateVolatility(portfolio.returns.historicalReturns || []),
    benchmarkComparison: benchmark ? {
      alpha: portfolio.xirr - benchmark.return,
      beta: calculateBeta(portfolio.returns.historicalReturns || [], benchmark.historicalReturns || [])
    } : null
  };
}

function calculateBeta(portfolioReturns, benchmarkReturns) {
  if (portfolioReturns.length !== benchmarkReturns.length) return 0;

  const n = portfolioReturns.length;
  let sumXY = 0, sumX = 0, sumY = 0, sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumXY += portfolioReturns[i] * benchmarkReturns[i];
    sumX += benchmarkReturns[i];
    sumY += portfolioReturns[i];
    sumXX += benchmarkReturns[i] * benchmarkReturns[i];
  }

  return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
}
