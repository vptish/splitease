/**
 * useTheme Hook
 * React hook for accessing and manipulating theme state
 */

import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

interface UseThemeReturn {
  theme: 'light' | 'dark' | 'system';
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

/**
 * Hook to access theme state and methods
 * Automatically initializes theme on first mount
 */
export const useTheme = (): UseThemeReturn => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = useThemeStore((state) => state.isDark);
  const setTheme = useThemeStore((state) => state.setTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const initTheme = useThemeStore((state) => state.initTheme);

  // Initialize theme on mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };
};
