import type { SxProps, Theme } from '@mui/material';

export const dialogPaperSx = (sx?: SxProps<Theme>): SxProps<Theme> => ({
  borderRadius: '24px',
  backgroundImage: 'none',
  bgcolor: 'background.paper',
  p: 1,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  ...sx,
});

export const titleRowSx: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: '1.4rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  pt: 3,
  pb: 2,
};

export const titleLeftSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

export const iconBoxSx = (iconBgColor?: string): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 110,
  height: 60,
  borderRadius: '16px',
  bgcolor: iconBgColor || 'primary.main',
  color: 'white',
  boxShadow: iconBgColor ? `0 8px 16px ${iconBgColor}44` : 'none',
});

export const subtitleSx: SxProps<Theme> = {
  opacity: 0.8,
  fontSize: '0.95rem',
  fontWeight: 400,
};

export const closeButtonSx: SxProps<Theme> = {
  color: 'text.secondary',
};

export const contentSx = (hasActions: boolean): SxProps<Theme> => ({
  pb: hasActions ? 1 : 3,
});

export const actionsSx: SxProps<Theme> = {
  p: 4,
  pt: 1,
};
