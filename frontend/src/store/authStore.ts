import { create } from 'zustand';
import { api } from '../config/api'; 

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
  
  
  checkAuth: async () => {
    try {
      const response = await api.get(`/auth/me?t=${new Date().getTime()}`);
      const user = response.data.data?.user;
      
      if (user) {
        set({ 
          user: user, 
          isAuthenticated: true, 
          isCheckingAuth: false 
        });
      } else {
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false, 
          isCheckingAuth: false 
        });
      }
    } catch (error) {
      // If the ping fails 
      set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false, 
        isCheckingAuth: false 
      });
    }
  }
}));