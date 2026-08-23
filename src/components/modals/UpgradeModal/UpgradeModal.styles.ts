import type { CSSProperties } from 'react';
import type { SxProps, Theme } from '@mui/material';

export const dialogPaperSx: SxProps<Theme> = {
  borderRadius: '12px',
  p: 3.5,
  width: '840px',
  maxWidth: 'calc(100vw - 32px)',
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#191919' : '#ffffff',
  backgroundImage: 'none',
  boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25)',
  border: '1px solid',
  borderColor: 'divider',
};

export const planCardSx = (
  variant: 'default' | 'featured',
): SxProps<Theme> => ({
  flex: 1,
  minWidth: '220px',
  p: 2.2,
  borderRadius: '8px',
  border: variant === 'featured' ? '2px solid' : '1px solid',
  borderColor: variant === 'featured' ? 'primary.main' : 'divider',
  bgcolor: (theme: Theme) =>
    variant === 'featured'
      ? theme.palette.mode === 'dark'
        ? 'rgba(99, 102, 241, 0.04)'
        : 'rgba(99, 102, 241, 0.01)'
      : theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.01)'
        : 'rgba(0,0,0,0.005)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  ...(variant === 'featured'
    ? { boxShadow: '0 4px 16px rgba(99, 102, 241, 0.08)' }
    : {}),
});

export const popularBadgeSx: SxProps<Theme> = {
  px: 1,
  py: 0.25,
  borderRadius: '4px',
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  fontSize: '8px',
  fontWeight: 800,
};

export const bulletRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1,
};

export const bulletEmojiSx: SxProps<Theme> = {
  fontSize: '13px',
  lineHeight: 1.3,
};

export const bulletTextSx = (highlighted?: boolean): SxProps<Theme> => ({
  fontSize: '11px',
  lineHeight: 1.4,
  color: highlighted ? 'text.primary' : 'text.secondary',
  fontWeight: highlighted ? 600 : 400,
});

export const bulletSubTextStyle: CSSProperties = {
  fontWeight: 400,
  color: 'var(--mui-palette-text-secondary)',
};

export const headerRowSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
};

export const logoTitleRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const closeIconButtonSx: SxProps<Theme> = {
  color: 'text.secondary',
};

export const closeIconSx: SxProps<Theme> = {
  fontSize: 18,
};

export const introBoxSx: SxProps<Theme> = {
  mb: 3,
};

export const introTextSx: SxProps<Theme> = {
  lineHeight: 1.6,
};

export const plansContainerSx: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr', md: 'repeat(3, 1fr)' },
  gap: 3.5,
};

export const priceSuffixSx: SxProps<Theme> = {
  ml: 0.5,
};

export const dividerSx: SxProps<Theme> = {
  mb: 2,
};

export const featuresListSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.75,
  mb: 3,
};

export const ctaButtonSx = (
  planId: 'free' | 'pro' | 'elite',
): SxProps<Theme> => {
  switch (planId) {
    case 'pro':
      return {
        textTransform: 'none',
        fontWeight: 700,
        borderRadius: '6px',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        boxShadow: 'none',
        fontSize: '11px',
        '&:hover': {
          bgcolor: 'primary.dark',
          boxShadow: 'none',
        },
      };
    case 'elite':
      return {
        textTransform: 'none',
        fontWeight: 700,
        borderRadius: '6px',
        borderColor: 'primary.main',
        color: 'primary.main',
        fontSize: '11px',
        '&:hover': {
          borderColor: 'primary.dark',
          bgcolor: 'rgba(99, 102, 241, 0.04)',
        },
      };
    case 'free':
    default:
      return {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '6px',
        color: 'text.disabled',
        borderColor: 'divider',
        fontSize: '11px',
      };
  }
};
