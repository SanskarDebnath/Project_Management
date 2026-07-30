import { useThemeStore } from '../stores/theme-store';

export function useAccessibility() {
  const { darkMode, highContrast, fontScale, toggleDarkMode, toggleHighContrast, setFontScale } = useThemeStore();

  return {
    darkMode,
    highContrast,
    fontScale,
    toggleDarkMode,
    toggleHighContrast,
    zoomIn: () => setFontScale(Math.min(fontScale + 0.1, 1.4)),
    zoomOut: () => setFontScale(Math.max(fontScale - 0.1, 0.9)),
    resetZoom: () => setFontScale(1.0),
  };
}
