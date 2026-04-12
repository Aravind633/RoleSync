

import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create a configured Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // This tells the browser to send the HTTP-only cookie
});

// Request Interceptor: Attach the access token to headers if it exists in Zustand
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
  
    if (error.response?.status === 401) {
      console.warn('Session expired or unauthorized. Logging out...');
  
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);