import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
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
        default: isDark ? '#0F0F10' : '#FFFFFF',
        paper: isDark ? '#202024' : '#FFFFFF', // Cards background
      },
      text: {
        primary: isDark ? '#F5F5F5' : '#111111',
        secondary: isDark ? '#A1A1AA' : '#6B7280',
        disabled: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
      },
      divider: isDark ? '#2D2D30' : '#E5E5E5',
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
            color: isDark ? '#0F0F10' : '#ffffff',
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
            backgroundColor: isDark ? '#202024' : '#ffffff',
            border: isDark ? '1px solid #2D2D30' : '1px solid #E5E5E5',
            boxShadow: isDark
              ? 'none'
              : '0 1px 3px rgba(0, 0, 0, 0.01), 0 4px 12px rgba(0, 0, 0, 0.02)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? 'rgba(32, 32, 36, 0.9)' : undefined,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: isDark ? '1px solid #2D2D30' : '1px solid #E5E5E5',
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
            backgroundColor: isDark ? '#18181B' : undefined, // Surface as background
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#2D2D30' : '#E5E5E5',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#60A5FA' : '#3B82F6',
            },
            '&.Mui-focused': {
              backgroundColor: isDark ? '#0F0F10' : undefined,
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
            backgroundColor: isDark ? 'rgba(32, 32, 36, 0.95)' : undefined,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: isDark ? '1px solid #2D2D30' : '1px solid #E5E5E5',
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
