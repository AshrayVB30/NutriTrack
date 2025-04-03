import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Load MongoDB URI from .env
const MONGO_URL = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Start the server after successful MongoDB connection
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
  });

// Serve plain HTML with a success message
app.get("/", (req, res) => {
  res.send("<h1>✅ Backend is Connected Successfully!</h1>");
});

