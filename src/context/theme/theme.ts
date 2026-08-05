import { createTheme } from '@mui/material/styles';
import type { ThemeMode } from './ColorModeContext';

declare module '@mui/material/styles' {
  interface Theme {
    appMode: ThemeMode;
  }
  interface ThemeOptions {
    appMode?: ThemeMode;
  }
}

export const getDesignTokens = (mode: ThemeMode) => {
  const isDark = mode !== 'light';
  const isGray = mode === 'graydark';

  // Surface colors: "graydark" swaps the near-black dark surfaces for neutral grays.
  const surfaceDefault = isGray ? '#19191A' : isDark ? '#0F0F10' : '#FFFFFF';
  const surfacePaper = isGray ? '#242425' : isDark ? '#202024' : '#FFFFFF';
  const surfacePaperAlpha = isGray
    ? 'rgba(36, 36, 37, 0.92)'
    : 'rgba(32, 32, 36, 0.9)';
  const surfaceDivider = isGray ? '#333333' : isDark ? '#2D2D30' : '#E5E5E5';
  const surfaceInputBg = isGray ? '#1F1F20' : '#18181B';

  return createTheme({
    appMode: mode,
    palette: {
      mode: mode === 'light' ? 'light' : 'dark',
      primary: {
        main: isDark ? '#60A5FA' : '#3B82F6', // Accent
        light: isDark ? '#93C5FD' : '#60A5FA',
        dark: isDark ? '#2563EB' : '#1D4ED8',
        contrastText: '#ffffff',
      },
      success: {
        main: '#16A34A',
        light: 'rgba(22, 163, 74, 0.12)',
      },
      error: {
        main: '#EF4444',
        light: 'rgba(239, 68, 68, 0.1)',
      },
      warning: {
        main: '#F59E0B',
        light: 'rgba(245, 158, 11, 0.1)',
      },
      background: {
        default: surfaceDefault,
        paper: surfacePaper, // Cards background
      },
      text: {
        // Gray Dark's lighter surfaces need brighter text to keep the same
        // contrast punch regular Dark gets from its near-black background.
        primary: isGray ? '#FFFFFF' : isDark ? '#F5F5F5' : '#111111',
        secondary: isGray ? '#C4C4C8' : isDark ? '#A1A1AA' : '#6B7280',
        disabled: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
      },
      divider: surfaceDivider,
    },
    typography: {
      fontFamily:
        '"Outfit", "Inter", "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      fontSize: 14,
      h1: {
        fontWeight: 800,
        fontSize: '4rem', // 64px
        letterSpacing: '-0.025em',
        lineHeight: 1.15,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.625rem', // 42px
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem', // 24px
        letterSpacing: '-0.015em',
      },
      body1: {
        fontSize: '1.125rem', // 18px
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.9375rem', // 15px
        lineHeight: 1.5,
      },
      caption: {
        fontSize: '0.8125rem',
        lineHeight: 1.4,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '1rem', // 16px
      },
    },
    shape: {
      borderRadius: 12, // Modernized border radius to 12px
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '10px 24px',
            transition: 'all 0.2s ease-in-out',
          },
          containedPrimary: {
            boxShadow: 'none',
            background: isDark ? '#60A5FA' : '#3B82F6',
            color: isDark ? surfaceDefault : '#ffffff',
            border: 'none',
            '&:hover': {
              boxShadow: isDark
                ? '0 4px 20px rgba(96, 165, 250, 0.25)'
                : '0 4px 20px rgba(59, 130, 246, 0.25)',
              transform: 'translateY(-1px)',
              backgroundColor: isDark ? '#93C5FD' : '#2563EB',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? surfacePaper : '#ffffff',
            border: isDark
              ? `1px solid ${surfaceDivider}`
              : '1px solid #E5E5E5',
            boxShadow: isDark
              ? 'none'
              : '0 1px 3px rgba(0, 0, 0, 0.01), 0 4px 12px rgba(0, 0, 0, 0.02)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? surfacePaperAlpha : undefined,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: isDark
              ? `1px solid ${surfaceDivider}`
              : '1px solid #E5E5E5',
            borderRadius: '16px',
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
              : undefined,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            backgroundColor: isDark ? surfaceInputBg : undefined, // Surface as background
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? surfaceDivider : '#E5E5E5',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#60A5FA' : '#3B82F6',
            },
            '&.Mui-focused': {
              backgroundColor: isDark ? surfaceDefault : undefined,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#60A5FA' : '#3B82F6',
                borderWidth: '1px',
              },
              boxShadow: isDark
                ? '0 0 0 3px rgba(96, 165, 250, 0.15)'
                : '0 0 0 3px rgba(59, 130, 246, 0.15)',
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? surfacePaperAlpha : undefined,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: isDark
              ? `1px solid ${surfaceDivider}`
              : '1px solid #E5E5E5',
            borderRadius: '10px',
            boxShadow: isDark ? '0 10px 20px rgba(0,0,0,0.3)' : undefined,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            margin: '2px 6px',
            padding: '8px 12px',
            transition: 'all 0.15s ease-in-out',
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : undefined,
            },
            '&.Mui-selected': {
              backgroundColor: isDark ? 'rgba(96, 165, 250, 0.15)' : undefined,
              color: isDark ? '#60A5FA' : undefined,
              '&:hover': {
                backgroundColor: isDark
                  ? 'rgba(96, 165, 250, 0.25)'
                  : undefined,
              },
            },
          },
        },
      },
    },
  });
};
