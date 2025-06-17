import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration based on environment
const allowedOrigins = [
  'http://localhost:5173',      // Local development
  'https://rainbow-money.vercel.app', // Production frontend
];

// Enhanced CORS error handling
app.use(cors({
  origin: function(origin, callback) {
    console.log('Incoming request from origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('No origin header, allowing request');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser with increased limit and error handling
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(morgan('dev'));

// Additional request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  if (req.body && Object.keys(req.body).length) {
    console.log('Request body:', req.body);
  }
  next();
});

// Routes imports
import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Health check route with DB status
app.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
      status: 'ok',
      message: 'Server is running',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Initialize database connection
console.log('Initializing server...');
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
