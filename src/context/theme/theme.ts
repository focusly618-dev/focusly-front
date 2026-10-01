import { createTheme } from '@mui/material/styles';
import type { ThemeMode } from './ColorModeContext';
import { baselineStyles } from './baseline';

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

  // Surface colors matching new Dark Mode design palette
  const surfaceDefault = isGray ? '#19191A' : isDark ? '#111215' : '#FFFFFF';
  const surfacePaper = isGray ? '#242425' : isDark ? '#18191e' : '#FFFFFF';
  const surfacePaperAlpha = isGray
    ? 'rgba(36, 36, 37, 0.92)'
    : 'rgba(24, 25, 30, 0.94)';
  const surfaceDivider = isGray ? '#333333' : isDark ? '#25272e' : '#E5E5E5';
  const surfaceInputBg = isGray ? '#1F1F20' : '#1e2025';

  return createTheme({
    appMode: mode,
    palette: {
      mode: mode === 'light' ? 'light' : 'dark',
      primary: {
        main: '#008767', // Focusly Emerald Brand
        light: '#10B981',
        dark: '#007357',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#2dd4bf', // Mint teal accent
        light: '#5eead4',
        dark: '#14b8a6',
        contrastText: '#ffffff',
      },
      success: {
        main: '#10B981',
        light: 'rgba(16, 185, 129, 0.12)',
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
        primary: isGray ? '#FFFFFF' : isDark ? '#F3F4F6' : '#111111',
        secondary: isGray ? '#C4C4C8' : isDark ? '#8A8F98' : '#6B7280',
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
      MuiCssBaseline: {
        styleOverrides: baselineStyles,
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '10px 24px',
            transition: 'all 0.2s ease-in-out',
          },
          containedPrimary: {
            boxShadow: 'none',
            background: '#008767',
            color: '#ffffff',
            border: 'none',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0, 135, 103, 0.3)',
              transform: 'translateY(-1px)',
              backgroundColor: '#007357',
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: isDark ? '#3a3d48' : '#D1D5DB',
            '&.Mui-checked': {
              color: '#008767',
            },
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            '&.Mui-checked': {
              color: '#008767',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: '#008767',
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
            backgroundColor: isDark ? surfaceInputBg : undefined,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#2e3037' : '#E5E5E5',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#008767',
            },
            '&.Mui-focused': {
              backgroundColor: isDark ? surfaceInputBg : undefined,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#008767',
                borderWidth: '1.5px',
              },
              boxShadow: '0 0 0 3px rgba(0, 135, 103, 0.15)',
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
              backgroundColor: isDark
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(0, 135, 103, 0.08)',
              color: isDark ? '#34D399' : '#008767',
              '&:hover': {
                backgroundColor: isDark
                  ? 'rgba(16, 185, 129, 0.25)'
                  : 'rgba(0, 135, 103, 0.14)',
              },
            },
          },
        },
      },
    },
  });
};
