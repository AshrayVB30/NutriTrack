// utils/axios.js
import axios from 'axios';

// ✅ Force localhost URL for development
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
  withCredentials: false
});

// Warmup function
export const warmupServer = async () => {
  try {
    const response = await api.get('/api/warmup');
    return response.data;
  } catch (error) {
    console.error('Warmup failed:', error);
    return null;
  }
};

// Health check function
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/api/health');
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
    
    // Optionally warm up server before main requests
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timed out:', error.message);
      const warmup = await warmupServer();
      if (!warmup) {
        return Promise.reject(new Error('Backend server is not responding'));
      }
      if (!error.config.__isRetryRequest) {
        error.config.__isRetryRequest = true;
        return api(error.config);
      }
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
