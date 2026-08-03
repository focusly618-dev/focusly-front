import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'graydark';

export type ColorModeContextType = {
  toggleColorMode: () => void;
  setMode: (mode: ThemeMode) => void;
  mode: ThemeMode;
};

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  setMode: () => {},
  mode: 'dark',
});
