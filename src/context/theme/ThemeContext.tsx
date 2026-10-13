import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { getDesignTokens } from './theme';

import { ColorModeContext, type ThemePreference } from './ColorModeContext';
import { applyModeToDocument } from './documentMode';
import {
  readSavedPreference,
  resolveThemeMode,
  saveThemePreference,
} from './themePreference';
import { useSystemDark } from './useSystemDark';

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreference] =
    useState<ThemePreference>(readSavedPreference);
  const systemDark = useSystemDark();
  // On 'system' this follows the OS live, without the transition below.
  const mode = resolveThemeMode(preference, systemDark);

  useEffect(() => {
    saveThemePreference(preference);
  }, [preference]);

  useEffect(() => {
    applyModeToDocument(mode);
  }, [mode]);

  const applyPreferenceChange = useCallback((next: ThemePreference) => {
    const commit = () => {
      document.body.classList.add('theme-transitioning');
      setPreference(next);
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
  }, []);

  const colorMode = useMemo(
    () => ({
      // From what is on screen to the opposite, as an explicit choice.
      toggleColorMode: () => {
        applyPreferenceChange(mode === 'light' ? 'dark' : 'light');
      },
      setMode: applyPreferenceChange,
      mode,
      preference,
    }),
    [mode, preference, applyPreferenceChange],
  );

  const theme = useMemo(() => getDesignTokens(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};
