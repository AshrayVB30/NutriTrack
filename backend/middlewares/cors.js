// backend/middlewares/cors.js
import cors from 'cors';

const corsOptions = {
  origin: 'https://nutritrackr.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Debug middleware
const corsMiddleware = (req, res, next) => {
  console.log('CORS Middleware - Origin:', req.headers.origin);
  cors(corsOptions)(req, res, next);
};

export default corsMiddleware;
