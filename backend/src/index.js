import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes imports
import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import analysisRoutes from './routes/analysis.routes.js';

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/analysis', analysisRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Connect to MongoDB and start server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Handle server errors
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
});
