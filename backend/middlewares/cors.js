// backend/middlewares/cors.js
import cors from 'cors';

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://nutritrackr.netlify.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked CORS request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
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
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Credentials'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Create the CORS middleware
const corsMiddleware = cors(corsOptions);

// Add debug logging
const debugCors = (req, res, next) => {
  console.log('CORS Debug - Origin:', req.headers.origin);
  console.log('CORS Debug - Method:', req.method);
  console.log('CORS Debug - Headers:', req.headers);
  corsMiddleware(req, res, next);
};

export default debugCors;
