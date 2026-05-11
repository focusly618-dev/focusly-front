import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#137fec',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#fff',
      },
      success: {
        main: isDark ? '#4ade80' : '#22c55e',
        light: isDark ? 'rgba(74, 222, 128, 0.15)' : 'rgba(34, 197, 94, 0.15)',
      },
      error: {
        main: isDark ? '#f87171' : '#ef4444',
        light: isDark ? 'rgba(248, 113, 113, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      },
      warning: {
        main: isDark ? '#fbbf24' : '#f59e0b',
        light: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(245, 158, 11, 0.1)',
      },
      background: {
        default: isDark ? '#1b1b1d' : '#f8fafc',
        paper: isDark ? '#23252a' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e0e2e9' : '#0f172a',
        secondary: isDark ? '#a1a1aa' : '#64748b',
        disabled: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.38)',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0',
    },
    typography: {
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      fontSize: 14,
      h1: {
        fontWeight: 700,
        fontSize: '1.875rem',
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: '-0.015em',
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '-0.01em',
      },
      body1: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.8125rem',
        lineHeight: 1.5,
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.4,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '10px 24px',
          },
          containedPrimary: {
            boxShadow: '0 4px 14px 0 rgba(19, 127, 236, 0.39)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(19, 127, 236, 0.23)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: isDark
              ? 'none'
              : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },
  });
};
