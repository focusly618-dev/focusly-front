import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'graydark';
/** What the user picked: a theme, or follow the operating system. */
export type ThemePreference = ThemeMode | 'system';

export type ColorModeContextType = {
  toggleColorMode: () => void;
  setMode: (preference: ThemePreference) => void;
  /** The theme on screen (with 'system' already resolved). */
  mode: ThemeMode;
  preference: ThemePreference;
};

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  setMode: () => {},
  mode: 'dark',
  preference: 'system',
});
