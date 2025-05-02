// utils/axios.js
import axios from 'axios';

// Create axios instance with retry logic
const api = axios.create({
  baseURL: 'https://nutritrack-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true
});

// Add retry interceptor
api.interceptors.response.use(null, async (error) => {
  const { config, response } = error;
  
  // If it's a network error or timeout, retry
  if (!response && config && !config.__isRetryRequest) {
    config.__isRetryRequest = true;
    try {
      return await api(config);
    } catch (retryError) {
      return Promise.reject(retryError);
    }
  }
  
  return Promise.reject(error);
});

// Auth interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Error:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/signin'; // optionally uncomment
    }
    
    return Promise.reject(error);
  }
);

export default api;
