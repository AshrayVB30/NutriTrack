// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Core modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Custom middlewares & routes
import corsMiddleware from './middlewares/cors.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URI;

// Increase timeout to 60 seconds for cold starts
app.timeout = 60000;

// Enable keep-alive with longer timeout
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=60');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Apply CORS middleware first
app.use(corsMiddleware);

// Request logging middleware with timing
app.use((req, res, next) => {
  const start = Date.now();
  console.log('\n=== Request Debug ===');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  // Log response status and timing
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log('\n=== Response Debug ===');
    console.log('Time:', new Date().toISOString());
    console.log('Duration:', duration, 'ms');
    console.log('Status:', res.statusCode);
  });
  
  next();
});

// Body parser middleware with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Warmup endpoint
app.get('/warmup', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/auth', authRoutes);      // Handles /api/auth/signin and /api/auth/signup
app.use('/api/users', userRoutes);

// CORS preflight for all routes
app.options('*', corsMiddleware);

// Root test route
app.get("/", (req, res) => {
  res.json({ 
    message: 'Backend is connected!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'CorsError') {
    return res.status(403).json({
      success: false,
      error: 'CORS Error',
      message: 'Not allowed by CORS'
    });
  }

  if (err.code === 'ECONNABORTED') {
    return res.status(504).json({
      success: false,
      error: 'Gateway Timeout',
      message: 'The server took too long to respond'
    });
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    return res.status(503).json({
      success: false,
      error: 'Database Error',
      message: 'Unable to connect to database'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectWithRetry();
});
