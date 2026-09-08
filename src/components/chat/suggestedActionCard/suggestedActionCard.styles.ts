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

export const previewBoxSx = (
  theme: Theme,
  accentColor: string = theme.palette.primary.main,
): SxProps<Theme> => ({
  mb: 2,
  p: 1.6,
  borderRadius: '10px',
  border: `1px solid ${alpha(accentColor, 0.25)}`,
  borderLeft: `4px solid ${accentColor}`,
  background: surfaceColor(
    theme,
    `linear-gradient(135deg, ${alpha(accentColor, 0.12)} 0%, rgba(15, 23, 42, 0.4) 100%)`,
    `linear-gradient(135deg, ${alpha(accentColor, 0.12)} 0%, rgba(36, 36, 37, 0.4) 100%)`,
    `linear-gradient(135deg, ${alpha(accentColor, 0.08)} 0%, rgba(241, 245, 249, 0.7) 100%)`,
  ),
  backdropFilter: 'blur(6px)',
  boxShadow: `0 2px 10px ${alpha(accentColor, 0.08)}`,
});

export const previewTitleSx: SxProps<Theme> = {
  fontSize: '14px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.01em',
};

export const previewDescriptionSx: SxProps<Theme> = {
  fontSize: '12.5px',
  lineHeight: 1.5,
  mt: 0.6,
  color: 'text.secondary',
};

export const previewMetaRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.8,
  mb: 1.2,
  flexWrap: 'wrap',
};

export const metaChipSx = (color?: string): SxProps<Theme> => ({
  height: 22,
  fontSize: '10.5px',
  fontWeight: 700,
  borderRadius: '6px',
  color: color || 'text.secondary',
  bgcolor: color ? alpha(color, 0.14) : 'action.hover',
  border: `1px solid ${color ? alpha(color, 0.25) : 'transparent'}`,
  '& .MuiChip-icon': {
    color: color || 'inherit',
    ml: 0.5,
  },
});

export const subtasksContainerSx = (theme: Theme): SxProps<Theme> => ({
  mt: 1.4,
  pt: 1.2,
  borderTop: `1px dashed ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 0.6,
});

export const subtasksHeaderSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: 0.3,
};

export const subtasksCountBadgeSx = (theme: Theme): SxProps<Theme> => ({
  fontSize: '10px',
  fontWeight: 700,
  px: 0.8,
  py: 0.1,
  borderRadius: '10px',
  bgcolor: alpha(theme.palette.primary.main, 0.12),
  color: theme.palette.primary.main,
});

export const subtaskItemSx = (theme: Theme): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1,
  py: 0.5,
  px: 1,
  borderRadius: '6px',
  bgcolor: alpha(theme.palette.background.paper, 0.5),
  border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
  transition: 'all 0.15s ease-in-out',
  '&:hover': {
    bgcolor: alpha(theme.palette.primary.main, 0.06),
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
});

export const subtaskTitleSx: SxProps<Theme> = {
  fontSize: '12px',
  fontWeight: 500,
  color: 'text.primary',
  lineHeight: 1.35,
  flex: 1,
};

export const subtaskTimerChipSx = (theme: Theme): SxProps<Theme> => ({
  height: 18,
  fontSize: '9.5px',
  fontWeight: 600,
  borderRadius: '4px',
  bgcolor: alpha(theme.palette.text.secondary, 0.1),
  color: 'text.secondary',
  flexShrink: 0,
});

export const errorTextSx: SxProps<Theme> = {
  mb: 2,
};

export const actionsRowSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 1,
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
  fontSize: '11px',
  borderRadius: '6px',
  py: 0.3,
  px: 1.4,
  borderColor: 'primary.main',
  color: 'primary.main',
  '&:hover': {
    borderColor: 'primary.dark',
    bgcolor: 'rgba(59, 130, 246, 0.08)',
  },
};

export const addIconSx: SxProps<Theme> = {
  fontSize: 15,
};

export const primaryActionButtonSx = (theme: Theme): SxProps<Theme> => ({
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '12px',
  borderRadius: '8px',
  py: 0.6,
  px: 2,
  boxShadow: `0 4px 12px ${theme.palette.primary.main}25`,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: `0 6px 16px ${theme.palette.primary.main}40`,
  },
});
