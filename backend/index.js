// backend/index.js
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use process.env for Node.js environment (not import.meta.env which is Vite-specific)
const API_URL = process.env.API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 60000,
  withCredentials: false,
});

export const warmupServer = async () => {
  try {
    const response = await api.get('/warmup', { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error('Warmup failed:', error);
    return null;
  }
};

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health', { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return null;
  }
};

// For Node.js environment, we need to handle localStorage differently
// since it's not available in Node
const getToken = () => {
  // If running in browser (unlikely for backend/index.js)
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('token');
  }
  // If running in Node.js, we'd need a different approach to store tokens
  // This might be session storage, a file, or another mechanism
  return null;
};

const removeTokens = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  // Implement alternative for Node.js if needed
};

api.interceptors.request.use(
  async (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    console.log('Request config:', config);

    if (!config.url.includes('/warmup') && !config.url.includes('/health')) {
      const health = await checkBackendHealth();
      if (!health) await warmupServer();
    }

    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      console.error('Backend responded with error:', error.response.data);
    } else if (error.request) {
      if (error.code === 'ECONNABORTED') {
        console.error('Timeout of', error.config.timeout, 'ms');

        const warmup = await warmupServer();
        if (!warmup) return Promise.reject(new Error('Backend server is not responding'));

        if (error.config && !error.config.__isRetryRequest) {
          error.config.__isRetryRequest = true;
          try {
            console.log('Retrying request...');
            return await api(error.config);
          } catch (retryError) {
            return Promise.reject(retryError);
          }
        }
      } else {
        console.error('No response received:', error.request);
      }
    } else {
      console.error('Request setup error:', error.message);
    }

    if (error.response?.status === 401) {
      removeTokens();
    }

    return Promise.reject(error);
  }
);

export default api;