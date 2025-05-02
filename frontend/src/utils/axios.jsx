// utils/axios.js
import axios from 'axios';

// ✅ Use the deployed backend URL
const api = axios.create({
  baseURL: 'https://nutritrack-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
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
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/signin'; // optionally uncomment
    }
    return Promise.reject(error);
  }
);

export default api;
