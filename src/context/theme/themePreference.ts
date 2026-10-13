import type { ThemeMode, ThemePreference } from './ColorModeContext';

export const THEME_STORAGE_KEY = 'themeMode';

const VALID_PREFERENCES: ThemePreference[] = [
  'system',
  'light',
  'dark',
  'graydark',
];

/** First visit (nothing saved): follow the operating system. */
export const DEFAULT_PREFERENCE: ThemePreference = 'system';

/** The saved preference. Mirrored by the pre-paint script in index.html. */
export const readSavedPreference = (): ThemePreference => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return VALID_PREFERENCES.includes(saved as ThemePreference)
      ? (saved as ThemePreference)
      : DEFAULT_PREFERENCE;
  } catch {
    return DEFAULT_PREFERENCE;
  }
};

export const saveThemePreference = (preference: ThemePreference) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage blocked: the theme still applies for this session.
  }
};

/** The theme to paint: 'system' follows the OS between light and dark. */
export const resolveThemeMode = (
  preference: ThemePreference,
  systemDark: boolean,
): ThemeMode =>
  preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
