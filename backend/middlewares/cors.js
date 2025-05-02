// backend/middlewares/cors.js
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://nutritrackr.netlify.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  credentials: true,
};

export default cors(corsOptions);
