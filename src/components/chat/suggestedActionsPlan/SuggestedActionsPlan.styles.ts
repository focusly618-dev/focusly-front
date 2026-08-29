import type { SxProps, Theme } from '@mui/material';
import { alpha } from '@mui/material';

export const summaryCardContentSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1.5,
  p: '12px !important',
};

export const summaryTextRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.2,
  minWidth: 0,
};

export const previewButtonSx: SxProps<Theme> = {
  flexShrink: 0,
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '11px',
  borderRadius: '6px',
  px: 2,
};

export const dialogPaperSx: SxProps<Theme> = {
  borderRadius: '12px',
  width: '480px',
  maxWidth: 'calc(100vw - 32px)',
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark' ? '#191919' : '#ffffff',
  backgroundImage: 'none',
  boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25)',
  border: '1px solid',
  borderColor: 'divider',
};

export const dialogHeaderSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: 2.5,
  py: 2,
  borderBottom: '1px solid',
  borderColor: 'divider',
};

export const dialogListSx: SxProps<Theme> = {
  maxHeight: '360px',
  overflowY: 'auto',
  px: 1,
  py: 1,
};

export const planRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.2,
  px: 1.5,
  py: 1,
  borderRadius: '8px',
  '&:hover': { bgcolor: 'action.hover' },
};

export const planRowDateChipSx = (color: string): SxProps<Theme> => ({
  flexShrink: 0,
  height: 22,
  fontSize: '10.5px',
  fontWeight: 700,
  borderRadius: '5px',
  bgcolor: alpha(color, 0.14),
  color,
  minWidth: '84px',
});

export const planRowTitleSx: SxProps<Theme> = {
  fontSize: '12.5px',
  lineHeight: 1.4,
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const dialogFooterSx: SxProps<Theme> = {
  px: 2.5,
  py: 2,
  borderTop: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

export const createAllButtonSx: SxProps<Theme> = {
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '12px',
  borderRadius: '6px',
  py: 1,
};
