import asyncHandler from 'express-async-handler';
import Portfolio from '../models/portfolio.model.js';
import Transaction from '../models/transaction.model.js';
import { calculateXIRR, calculateReturns } from '../utils/calculations.js';

// @desc    Create new portfolio
// @route   POST /api/portfolios
// @access  Private
export const createPortfolio = asyncHandler(async (req, res) => {
  const { client, name, type } = req.body;

  const portfolio = await Portfolio.create({
    client,
    name,
    type
  });

  res.status(201).json({
    success: true,
    data: portfolio
  });
});

// @desc    Get all portfolios for a client
// @route   GET /api/portfolios
// @access  Private
export const getPortfolios = asyncHandler(async (req, res) => {
  const { clientId } = req.query;
  
  const portfolios = await Portfolio.find({ client: clientId })
    .populate('holdings.scheme', 'name code nav navDate')
    .sort('-createdAt');

  res.json({
    success: true,
    count: portfolios.length,
    data: portfolios
  });
});

// @desc    Get single portfolio
// @route   GET /api/portfolios/:id
// @access  Private
export const getPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id)
    .populate('holdings.scheme', 'name code nav navDate returns assetAllocation marketCapAllocation sectorAllocation');

  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  res.json({
    success: true,
    data: portfolio
  });
});

// @desc    Add transaction to portfolio
// @route   POST /api/portfolios/:id/transactions
// @access  Private
export const addTransaction = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id);
  
  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  const transaction = await Transaction.create({
    ...req.body,
    portfolio: portfolio._id
  });

  // Update portfolio calculations
  await portfolio.updateHoldings();

  res.status(201).json({
    success: true,
    data: transaction
  });
});

// @desc    Get portfolio analysis
// @route   GET /api/portfolios/:id/analysis
// @access  Private
export const getPortfolioAnalysis = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findById(req.params.id)
    .populate('holdings.scheme');

  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  const transactions = await Transaction.find({ portfolio: portfolio._id })
    .sort('date');

  // Calculate XIRR
  const xirr = calculateXIRR(transactions);

  // Calculate other metrics
  const analysis = {
    xirr,
    returns: calculateReturns(portfolio),
    assetAllocation: portfolio.assetAllocation,
    marketCapAllocation: portfolio.marketCapAllocation,
    sectorAllocation: portfolio.sectorAllocation,
    holdings: portfolio.holdings.map(h => ({
      scheme: h.scheme.name,
      allocation: (h.currentValue / portfolio.currentValue) * 100,
      returns: ((h.currentValue - (h.units * h.avgCostPrice)) / (h.units * h.avgCostPrice)) * 100
    }))
  };

  res.json({
    success: true,
    data: analysis
  });
});
