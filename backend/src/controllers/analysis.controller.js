import asyncHandler from 'express-async-handler';
import Portfolio from '../models/portfolio.model.js';
import marketDataService from '../services/marketData.service.js';
import {
  calculateFundOverlap,
  analyzeLiquidity,
  generateRebalancingSuggestions,
  calculateRiskReturnMetrics
} from '../utils/portfolioAnalysis.js';

// @desc    Get fund overlap analysis
// @route   GET /api/analysis/fund-overlap
// @access  Private
export const getFundOverlap = asyncHandler(async (req, res) => {
  const { scheme1Id, scheme2Id } = req.query;
  const overlap = await calculateFundOverlap(scheme1Id, scheme2Id);

  res.json({
    success: true,
    data: overlap
  });
});

// @desc    Get liquidity analysis
// @route   GET /api/analysis/liquidity/:portfolioId
// @access  Private
export const getLiquidityAnalysis = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.portfolioId)
    .populate('holdings.scheme');

  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  const liquidityAnalysis = analyzeLiquidity(portfolio);

  res.json({
    success: true,
    data: liquidityAnalysis
  });
});

// @desc    Get rebalancing suggestions
// @route   GET /api/analysis/rebalancing/:portfolioId
// @access  Private
export const getRebalancingSuggestions = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.portfolioId)
    .populate('holdings.scheme');

  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  const targetAllocation = req.body.targetAllocation || {
    equity: 60,
    debt: 30,
    gold: 5,
    cash: 5
  };

  const suggestions = generateRebalancingSuggestions(portfolio, targetAllocation);

  res.json({
    success: true,
    data: {
      currentAllocation: portfolio.assetAllocation,
      targetAllocation,
      suggestions
    }
  });
});

// @desc    Get risk-return analysis
// @route   GET /api/analysis/risk-return/:portfolioId
// @access  Private
export const getRiskReturnAnalysis = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.portfolioId)
    .populate('holdings.scheme');

  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  // Fetch benchmark data if provided
  let benchmark = null;
  if (req.query.benchmarkIndex) {
    benchmark = await marketDataService.fetchIndexData(req.query.benchmarkIndex);
  }

  const analysis = calculateRiskReturnMetrics(portfolio, benchmark);

  res.json({
    success: true,
    data: analysis
  });
});

// @desc    Update NAVs for all schemes
// @route   POST /api/analysis/update-navs
// @access  Private
export const updateNAVs = asyncHandler(async (req, res) => {
  await marketDataService.updateSchemeNAVs();

  res.json({
    success: true,
    message: 'NAVs updated successfully'
  });
});
