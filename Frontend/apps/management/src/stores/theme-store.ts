import { create } from 'zustand';
import { THEME_STORAGE_KEY } from '../lib/constants';

interface ThemeState {
  darkMode: boolean;
  highContrast: boolean;
  fontScale: number;
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
  setFontScale: (scale: number) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  darkMode: true, // Default dark theme for enterprise executive management portal
  highContrast: false,
  fontScale: 1.0,

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
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
