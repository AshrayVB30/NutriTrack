// backend/middlewares/cors.js
import cors from 'cors';

// More permissive CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: '*',
  exposedHeaders: '*',
  maxAge: 600,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Create the CORS middleware
const corsMiddleware = cors(corsOptions);

// Add detailed debug logging
const debugCors = (req, res, next) => {
  // Log all incoming requests
  console.log('\n=== CORS Debug ===');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  // Add CORS headers manually
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling preflight request');
    res.status(200).end();
    return;
  }
  
  corsMiddleware(req, res, next);
};

export default debugCors;
