import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#3b82f6' : '#137fec',
        light: isDark ? '#60a5fa' : '#42a5f5',
        dark: isDark ? '#1d4ed8' : '#1565c0',
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
        default: isDark ? '#0B0F14' : '#F8F8F7',
        paper: isDark ? '#111827' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e0e2e9' : '#1C1C1A',
        secondary: isDark ? '#a1a1aa' : '#8A8A85',
        disabled: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)',
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
            transition: 'all 0.2s ease-in-out',
          },
          containedPrimary: {
            boxShadow: isDark
              ? '0 4px 14px 0 rgba(99, 102, 241, 0.3)'
              : '0 4px 14px 0 rgba(19, 127, 236, 0.39)',
            background: isDark
              ? 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)'
              : undefined,
            border: 'none',
            '&:hover': {
              boxShadow: isDark
                ? '0 6px 20px rgba(99, 102, 241, 0.5)'
                : '0 6px 20px rgba(19, 127, 236, 0.23)',
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? '#111827' : '#ffffff',
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.05)'
              : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: isDark
              ? '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.2)'
              : '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? 'rgba(17, 24, 39, 0.85)' : undefined,
            backdropFilter: isDark ? 'blur(16px)' : undefined,
            WebkitBackdropFilter: isDark ? 'blur(16px)' : undefined,
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : undefined,
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
            backgroundColor: isDark ? '#1A1F2B' : undefined,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : undefined,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? 'rgba(255, 255, 255, 0.18)' : undefined,
            },
            '&.Mui-focused': {
              backgroundColor: isDark ? 'rgba(26, 31, 43, 0.9)' : undefined,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? '#6366f1' : undefined,
                borderWidth: '1px',
              },
              boxShadow: isDark
                ? '0 0 0 3px rgba(99, 102, 241, 0.15)'
                : undefined,
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? 'rgba(26, 31, 43, 0.95)' : undefined,
            backdropFilter: isDark ? 'blur(16px)' : undefined,
            WebkitBackdropFilter: isDark ? 'blur(16px)' : undefined,
            border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : undefined,
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
              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : undefined,
              color: isDark ? '#818cf8' : undefined,
              '&:hover': {
                backgroundColor: isDark
                  ? 'rgba(99, 102, 241, 0.25)'
                  : undefined,
              },
            },
          },
        },
      },
    },
  });
};
