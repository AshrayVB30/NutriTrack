// utils/axios.js
import axios from 'axios';

// Create axios instance with custom configuration
const api = axios.create({
  baseURL: 'https://nutritrack-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 60000, // 60 seconds timeout
  withCredentials: false, // Set to false since we're using wildcard CORS
  retry: 3, // Number of retries
  retryDelay: 2000 // Delay between retries in milliseconds
});

// Warmup function to wake up the server
export const warmupServer = async () => {
  try {
    const response = await api.get('/warmup', { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error('Warmup failed:', error);
    return null;
  }
};

// Health check function with timeout
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health', { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return null;
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    console.log('Making request to:', config.url);
    console.log('Request config:', config);
    
    // If it's not a warmup or health check request, ensure server is warmed up
    if (!config.url.includes('/warmup') && !config.url.includes('/health')) {
      const health = await checkBackendHealth();
      if (!health) {
        await warmupServer();
      }
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with improved error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  async (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      
      // Check if it's a timeout error
      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out after', error.config.timeout, 'ms');
        
        // Try to warm up the server
        const warmup = await warmupServer();
        if (!warmup) {
          return Promise.reject(new Error('Backend server is not responding'));
        }
        
        // If warmup succeeds, retry the request
        if (error.config && !error.config.__isRetryRequest) {
          error.config.__isRetryRequest = true;
          try {
            console.log('Retrying request...');
            return await api(error.config);
          } catch (retryError) {
            console.error('Retry failed:', retryError);
            return Promise.reject(retryError);
          }
        }
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

export default api;
