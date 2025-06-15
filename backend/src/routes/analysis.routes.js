import express from 'express';
import {
  getFundOverlap,
  getLiquidityAnalysis,
  getRebalancingSuggestions,
  getRiskReturnAnalysis,
  updateNAVs
} from '../controllers/analysis.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/fund-overlap', getFundOverlap);
router.get('/liquidity/:portfolioId', getLiquidityAnalysis);
router.get('/rebalancing/:portfolioId', getRebalancingSuggestions);
router.get('/risk-return/:portfolioId', getRiskReturnAnalysis);
router.post('/update-navs', updateNAVs);

export default router;
