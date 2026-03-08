/**
 * Authentication Zustand Store
 * Manages authentication state and user session
 */

import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  // Actions
  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signInWithEmail({ email, password });
      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Sign in failed';
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signUpWithEmail(email, password, name);
      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Sign up failed';
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signInWithGoogle();
      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Google sign in failed';
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  signInWithApple: async () => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signInWithApple();
      set({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Apple sign in failed';
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await authService.signOut();
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Sign out failed';
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const user = await authService.getCurrentUser();
      set({
        user: user || null,
        isAuthenticated: !!user,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
