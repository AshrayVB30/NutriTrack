// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Core modules
import express from 'express';
import mongoose from 'mongoose';

// Custom middlewares & routes
import corsMiddleware from './middlewares/cors.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URI;

// Apply CORS middleware first
app.use(corsMiddleware);

// Parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Routes
app.use('/api/auth', authRoutes);      // Handles /api/auth/signin and /api/auth/signup

// CORS preflight for all routes
app.options('*', corsMiddleware);

// Root test route
app.get("/", (req, res) => {
  res.send("<h1>✅ Backend is Connected Successfully!</h1>");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.name === 'CorsError') {
    res.status(403).json({ 
      message: 'CORS Error',
      details: err.message 
    });
  } else {
    res.status(500).json({ 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
  });
