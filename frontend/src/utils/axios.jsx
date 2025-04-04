// utils/axios.js
import axios from 'axios';

// Create a custom Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/signup',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to request headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login page if needed
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // You can redirect to login page here if using within a component
      // window.location.href = '/signin';
    }
    
    return Promise.reject(error);
  }
);

export default api;