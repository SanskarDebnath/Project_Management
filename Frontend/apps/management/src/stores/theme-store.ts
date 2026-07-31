import { create } from 'zustand';
import { THEME_STORAGE_KEY } from '../lib/constants';

interface ThemeState {
  darkMode: boolean;
  highContrast: boolean;
  fontScale: number;
  initTheme: () => void;
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
  setFontScale: (scale: number) => void;
}

/* Legacy theme store initialization commented out below for reference:
export const useThemeStore = create<ThemeState>((set) => ({
  darkMode: true,
  highContrast: false,
  fontScale: 1.0,
  toggleDarkMode: () => set((state) => { ... })
}));
*/

const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem(THEME_STORAGE_KEY || 'pm_theme_preference');
  const isDark = saved === null ? true : saved === 'dark';
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  return isDark;
};

const initialDarkMode = getInitialDarkMode();

export const useThemeStore = create<ThemeState>((set) => ({
  darkMode: initialDarkMode,
  highContrast: false,
  fontScale: 1.0,

  initTheme: () => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY || 'pm_theme_preference');
    const isDark = saved === null ? true : saved === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ darkMode: isDark });
  },

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(THEME_STORAGE_KEY || 'pm_theme_preference', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(THEME_STORAGE_KEY || 'pm_theme_preference', 'light');
      }
      return { darkMode: next };
    }),

  toggleHighContrast: () =>
    set((state) => {
      const next = !state.highContrast;
      if (next) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      return { highContrast: next };
    }),

  setFontScale: (scale: number) => {
    document.documentElement.style.fontSize = `${scale * 100}%`;
    set({ fontScale: scale });
  },
}));

