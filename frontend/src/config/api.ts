import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create a configured Axios instance
export const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // This tells the browser to send the HTTP-only refresh cookie
});

// Request Interceptor: Attach the short-lived access token to headers
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: The Silent Refresh Logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to hit the refresh endpoint. The browser will automatically include the HTTP-only cookie.
        const { data } = await axios.post(
          'http://localhost:5000/api/v1/auth/refresh',
          {},
          { withCredentials: true }
        );

        // Save the new access token to Zustand
        useAuthStore.getState().setToken(data.accessToken);

        // Update the failed request's header and try it again
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token is expired or invalid, log the user out completely
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);