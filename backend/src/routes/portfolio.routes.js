import express from 'express';
import {
  createPortfolio,
  getPortfolios,
  getPortfolio,
  addTransaction,
  getPortfolioAnalysis
} from '../controllers/portfolio.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getPortfolios)
  .post(createPortfolio);

router
  .route('/:id')
  .get(getPortfolio);

router
  .route('/:id/transactions')
  .post(addTransaction);

router
  .route('/:id/analysis')
  .get(getPortfolioAnalysis);

export default router;
