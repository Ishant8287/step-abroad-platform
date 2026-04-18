import { create } from 'zustand';
import { getMe, login, register } from '../api/auth';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  initialize: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ isLoading: true });
      try {
        const response = await getMe();
        set({ user: response.data.user, isAuthenticated: true, error: null });
      } catch (error) {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      } finally {
        set({ isLoading: false });
      }
    }
  },

  loginUser: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await login(credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, error: null });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  registerUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, error: null });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
