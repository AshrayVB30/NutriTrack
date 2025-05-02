// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Core modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Custom middleware & routes
import corsMiddleware from './middlewares/cors.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRouter.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Basic CORS pre-setup (handle OPTIONS requests before routes)
app.options('*', corsMiddleware);

// Use middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health & test endpoints
app.get('/warmup', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: '✅ NutriTrack backend is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/auth', authRoutes);  // /signup, /signin, etc.
app.use('/api/user', userRoutes);  // /signup, /signin, etc.

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// MongoDB connection + retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed. Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectWithRetry();
});
