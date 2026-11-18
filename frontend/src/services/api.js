// src/services/api.js
// Axios instance — reads API base URL from environment variable.
// In development: VITE_API_URL = http://localhost:5000/api  (from .env)
// In production:  VITE_API_URL = https://your-backend.railway.app/api  (from .env.production)

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
