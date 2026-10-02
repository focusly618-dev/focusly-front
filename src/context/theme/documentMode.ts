import type { ThemeMode } from './ColorModeContext';

/**
 * Mirrors the theme mode onto <html> for what lives outside MUI: the CSS
 * variables in index.css and notifications.css, and native controls
 * (scrollbars, time pickers) through color-scheme. Graydark keeps the `dark`
 * class, since it is a dark theme, and adds `graydark` for its own surfaces.
 */
export const applyModeToDocument = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle('light', mode === 'light');
  root.classList.toggle('dark', mode !== 'light');
  root.classList.toggle('graydark', mode === 'graydark');
  root.style.colorScheme = mode === 'light' ? 'light' : 'dark';
};
