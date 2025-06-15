import express from 'express';
import {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
  getClientStats
} from '../controllers/client.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getClients)
  .post(createClient);

router.get('/stats', getClientStats);

router
  .route('/:id')
  .get(getClient)
  .put(updateClient)
  .delete(deleteClient);

export default router;
