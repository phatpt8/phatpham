import { create } from 'zustand';
import { api } from '../lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,

  init: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const { user } = await api.auth.me();
      set({ user, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, isLoading: false });
    }
  },

  login: async (username, password) => {
    const { token, user } = await api.auth.login({ username, password });
    localStorage.setItem('token', token);
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },
}));
