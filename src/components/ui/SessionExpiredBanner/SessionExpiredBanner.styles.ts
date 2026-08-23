import type { SxProps, Theme } from '@mui/material';
import { alpha } from '@mui/material';
import { surfaceColor } from '@/context';

export const bannerWrapperSx: SxProps<Theme> = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: (currentTheme) => currentTheme.zIndex.snackbar + 1,
  px: { xs: 1.5, sm: 2 },
  pt: { xs: 1.5, sm: 2 },
};

export const bannerCardSx = (theme: Theme, isDark: boolean): SxProps<Theme> => ({
  mx: 'auto',
  maxWidth: 960,
  borderRadius: '18px',
  border: `1px solid ${alpha(theme.palette.warning.main, isDark ? 0.32 : 0.22)}`,
  background: isDark
    ? `linear-gradient(135deg, ${alpha(surfaceColor(theme, '#0f172a', '#242425', theme.palette.background.paper), 0.96)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`
    : `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.12)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
  boxShadow: isDark
    ? '0 18px 48px rgba(0, 0, 0, 0.35)'
    : '0 18px 42px rgba(15, 23, 42, 0.12)',
  backdropFilter: 'blur(14px)',
});

export const contentStackSx: SxProps<Theme> = {
  px: { xs: 2, sm: 2.5 },
  py: { xs: 1.5, sm: 1.75 },
};

export const iconWrapperSx = (theme: Theme, isDark: boolean): SxProps<Theme> => ({
  width: 42,
  height: 42,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '12px',
  color: theme.palette.warning.main,
  backgroundColor: alpha(theme.palette.warning.main, isDark ? 0.14 : 0.16),
  border: `1px solid ${alpha(theme.palette.warning.main, isDark ? 0.2 : 0.18)}`,
});

export const textContainerSx: SxProps<Theme> = { flex: 1, minWidth: 0 };

export const titleSx = (theme: Theme): SxProps<Theme> => ({
  fontSize: { xs: '0.92rem', sm: '0.98rem' },
  fontWeight: 800,
  color: theme.palette.text.primary,
  lineHeight: 1.35,
});

export const descriptionSx = (theme: Theme): SxProps<Theme> => ({
  mt: 0.25,
  fontSize: { xs: '0.78rem', sm: '0.86rem' },
  color: theme.palette.text.secondary,
});

export const dismissButtonSx = (theme: Theme, isDark: boolean): SxProps<Theme> => ({
  color: theme.palette.text.secondary,
  flexShrink: 0,
  '&:hover': {
    backgroundColor: alpha(theme.palette.text.primary, isDark ? 0.08 : 0.06),
    color: theme.palette.text.primary,
  },
});
