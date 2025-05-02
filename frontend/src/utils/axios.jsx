// utils/axios.js
import axios from 'axios';

// Create axios instance with custom configuration
const api = axios.create({
  baseURL: 'https://nutritrack-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: false, // Set to false since we're using wildcard CORS
  retry: 3, // Number of retries
  retryDelay: 1000 // Delay between retries in milliseconds
});

// Add retry interceptor
api.interceptors.response.use(null, async (error) => {
  const { config } = error;
  
  // If config doesn't exist or retry option is not set, reject
  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  // Set variable for keeping track of retry count
  config.__retryCount = config.__retryCount || 0;

  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    return Promise.reject(error);
  }

  // Increase the retry count
  config.__retryCount += 1;

  // Create new promise to see which to retry the request
  const backoff = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, config.retryDelay || 1000);
  });

  // Return the promise in which recalls axios to retry the request
  await backoff;
  return api(config);
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    console.log('Request config:', config);
    
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
    console.log('Response received:', response);
    return response;
  },
  (error) => {
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
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
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
