import type { ThemeMode } from './ColorModeContext';

/** Each mode's page background (theme.ts surfaceDefault). */
export const THEME_COLORS: Record<ThemeMode, string> = {
  light: '#FFFFFF',
  dark: '#111215',
  graydark: '#19191A',
};

/**
 * Mirrors the theme mode onto <html> for what lives outside MUI: the CSS
 * variables in index.css and notifications.css, and native controls
 * (scrollbars, time pickers) through color-scheme. Graydark keeps the `dark`
 * class, since it is a dark theme, and adds `graydark` for its own surfaces.
 * Also the theme-color meta, which colors the installed app's title bar and
 * mobile browsers' toolbars.
 */
export const applyModeToDocument = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle('light', mode === 'light');
  root.classList.toggle('dark', mode !== 'light');
  root.classList.toggle('graydark', mode === 'graydark');
  root.style.colorScheme = mode === 'light' ? 'light' : 'dark';
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[mode]);
};
