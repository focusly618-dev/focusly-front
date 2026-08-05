import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { getDesignTokens } from './theme';

import { ColorModeContext, type ThemeMode } from './ColorModeContext';

const VALID_MODES: ThemeMode[] = ['light', 'dark', 'graydark'];

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return VALID_MODES.includes(savedMode as ThemeMode)
      ? (savedMode as ThemeMode)
      : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    document.documentElement.classList.toggle('dark', mode !== 'light');
  }, [mode]);

  const applyModeChange = useCallback(
    (updater: (prevMode: ThemeMode) => ThemeMode) => {
      const commit = () => {
        document.body.classList.add('theme-transitioning');
        setMode(updater);
        setTimeout(() => {
          document.body.classList.remove('theme-transitioning');
        }, 450);
      };

      // Modern browsers with View Transition API
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          commit();
        });
      } else {
        // Fallback for non-supporting browsers
        commit();
      }
    },
    [],
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        applyModeChange((prevMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
      setMode: (nextMode: ThemeMode) => {
        applyModeChange(() => nextMode);
      },
      mode,
    }),
    [mode, applyModeChange],
  );

  const theme = useMemo(() => getDesignTokens(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};
