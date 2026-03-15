import { create } from 'zustand';
import { api } from '../config/api'; // 👈 Don't forget to import your api!

interface User {
  _id: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  
  setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
  setToken: (token) => set({ accessToken: token }),
  logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  
  // 👇 THE MISSING FUNCTION 👇
  checkAuth: async () => {
    try {
      // Ping the backend to see if our HttpOnly cookie is still valid
      const response = await api.get('/auth/me');
      set({ 
        user: response.data.data.user, 
        isAuthenticated: true, 
        isCheckingAuth: false // Stop the loading spinner!
      });
    } catch (error) {
      // If the ping fails (e.g., 401 Unauthorized), ensure the user is logged out
      set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false, 
        isCheckingAuth: false // Stop the loading spinner!
      });
    }
  }
}));