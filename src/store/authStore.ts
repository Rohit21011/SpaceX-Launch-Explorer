import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { AuthState, User } from "../types";
import { AUTH_TOKEN_KEY } from "../utils/constant";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: !!localStorage.getItem(AUTH_TOKEN_KEY),
      user: null,
      login: (userData: User, token: string) => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        set({ isAuthenticated: true, user: userData });
      },
      logout: () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
    }
  )
);
