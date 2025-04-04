// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Core modules
import express from 'express';
import mongoose from 'mongoose';

// Custom middlewares & routes
import corsMiddleware from './middlewares/cors.js'; // Custom CORS config (optional)
import authRoutes from './routes/auth.js'; // 👈 Make sure this handles /signin and /signup
import userRouter from './routes/userRouter.js'; // ✅ This handles /api/users

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(corsMiddleware);

// Routes
app.use('/api/auth', authRoutes);      // e.g., /api/auth/signin
app.use('/api/users', userRouter);     // e.g., /api/users/profile

// Root test route
app.get("/", (req, res) => {
  res.send("<h1>✅ Backend is Connected Successfully!</h1>");
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
