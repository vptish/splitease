/**
 * Theme Zustand Store
 * Manages application theme (light/dark/system)
 */

import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  isDark: boolean;
}

interface ThemeActions {
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

const THEME_STORAGE_KEY = 'mybillsplitter2_theme';

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const applyTheme = (theme: ThemeMode): void => {
  if (typeof document === 'undefined') return;

  const isDark = theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark');

  const root = document.documentElement;

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeStore>((set) => ({
  // Initial state
  theme: 'system',
  isDark: false,

  // Actions
  setTheme: (theme: ThemeMode) => {
    set({
      theme,
    });

    // Save to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }

    // Apply theme to DOM
    applyTheme(theme);
  },

  toggleTheme: () => {
    set((state) => {
      const themes: ThemeMode[] = ['light', 'dark', 'system'];
      const currentIndex = themes.indexOf(state.theme);
      const nextTheme = themes[(currentIndex + 1) % themes.length];

      // Save to localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      }

      // Apply theme to DOM
      applyTheme(nextTheme);

      return {
        theme: nextTheme,
      };
    });
  },

  initTheme: () => {
    // Read from localStorage or use default
    let savedTheme: ThemeMode = 'system';

    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        savedTheme = stored;
      }
    }

    // Apply theme
    applyTheme(savedTheme);

    // Calculate initial isDark
    const isDark =
      savedTheme === 'dark' ||
      (savedTheme === 'system' && getSystemTheme() === 'dark');

    set({
      theme: savedTheme,
      isDark,
    });

    // Listen for system theme changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        set((state) => {
          if (state.theme === 'system') {
            const newIsDark = e.matches;
            applyTheme('system');
            return { isDark: newIsDark };
          }
          return state;
        });
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
      }
    }
  },
}));
