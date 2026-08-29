import type { SxProps, Theme } from '@mui/material';
import { alpha } from '@mui/material';
import { surfaceColor } from '@/context';

export const cardSx = (theme: Theme): SxProps<Theme> => ({
  mt: 1.5,
  mb: 0.5,
  borderRadius: '12px',
  border: `1px solid ${theme.palette.divider}`,
  background: surfaceColor(
    theme,
    'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.3) 100%)',
    'linear-gradient(135deg, rgba(42, 42, 44, 0.5) 0%, rgba(36, 36, 37, 0.3) 100%)',
    'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%)',
  ),
  backdropFilter: 'blur(8px)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
});

export const cardContentSx: SxProps<Theme> = {
  p: 2,
  '&:last-child': { pb: 2 },
};

export const headerRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.2,
  mb: 1,
};

export const previewBoxSx = (theme: Theme): SxProps<Theme> => ({
  mb: 2,
  p: 1.4,
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  bgcolor: alpha(theme.palette.background.default, 0.4),
});

export const previewTitleSx: SxProps<Theme> = {
  fontSize: '13.5px',
  lineHeight: 1.4,
};

export const previewDescriptionSx: SxProps<Theme> = {
  fontSize: '12.5px',
  lineHeight: 1.45,
  mt: 0.4,
};

export const previewMetaRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.8,
  mt: 1,
  flexWrap: 'wrap',
};

export const metaChipSx = (color?: string): SxProps<Theme> => ({
  height: 20,
  fontSize: '10.5px',
  fontWeight: 700,
  borderRadius: '5px',
  color: color || 'text.secondary',
  bgcolor: color ? alpha(color, 0.14) : 'action.hover',
  '& .MuiChip-icon': {
    color: color || 'inherit',
    ml: 0.5,
  },
});

export const errorTextSx: SxProps<Theme> = {
  mb: 2,
};

export const actionsRowSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
};

export const completedRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
};

export const successRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.8,
  color: 'success.main',
};

export const successIconSx: SxProps<Theme> = {
  fontSize: 16,
};

export const outlinedActionButtonSx: SxProps<Theme> = {
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '10px',
  borderRadius: '6px',
  py: 0.2,
  px: 1.2,
  borderColor: 'primary.main',
  color: 'primary.main',
  '&:hover': {
    borderColor: 'primary.dark',
    bgcolor: 'rgba(59, 130, 246, 0.08)',
  },
};

export const addIconSx: SxProps<Theme> = {
  fontSize: 14,
};

export const primaryActionButtonSx = (theme: Theme): SxProps<Theme> => ({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '11px',
  borderRadius: '6px',
  px: 2.5,
  boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
});
