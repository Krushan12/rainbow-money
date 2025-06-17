import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { uploadPortfolio } from '../controllers/upload.controller.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadPortfolio);

export default router;
