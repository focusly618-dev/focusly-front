import type { Theme } from '@mui/material/styles';

export const resourcesContainerSx = {
  px: 4,
  mb: 1,
};

export const resourcesHeaderSx = (isExpanded: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  mb: isExpanded ? 2 : 0,
});

export const resourceCountSx = {
  ml: 1,
  px: 0.8,
  py: 0.1,
  borderRadius: '6px',
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  fontSize: '10px',
  fontWeight: 800,
};

export const addMeetButtonSx = (hasMeetLink: boolean) => ({
  textTransform: 'none',
  borderRadius: '6px',
  px: 1.5,
  py: 0.25,
  fontSize: '12px',
  fontWeight: 500,
  color: hasMeetLink ? 'text.disabled' : 'text.secondary',
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'transparent',
  '&:hover': {
    bgcolor: 'action.hover',
    borderColor: 'text.secondary',
  },
});

export const addResourceButtonSx = {
  textTransform: 'none',
  borderRadius: '6px',
  px: 1.5,
  py: 0.25,
  fontSize: '12px',
  fontWeight: 500,
  color: 'text.secondary',
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'transparent',
  '&:hover': {
    bgcolor: 'action.hover',
    borderColor: 'text.secondary',
  },
};

export const resourceItemSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  p: 1.2,
  borderRadius: '10px',
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.03)'
      : 'rgba(0,0,0,0.02)',
  border: '1px solid',
  borderColor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.05)',
  transition: 'all 0.2s',
};

export const resourceIconContainerSx = (isImage: boolean, color?: string) => ({
  width: 32,
  height: 32,
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: isImage ? 'transparent' : color,
  color: '#fff',
  flexShrink: 0,
  overflow: 'hidden',
});

export const resourceLinkButtonSx = {
  color: 'primary.main',
  '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
};

export const resourceRemoveButtonSx = {
  color: 'text.secondary',
  opacity: 0.5,
  '&:hover': { color: 'error.main', opacity: 1 },
};

export const addResourceFormSx = {
  p: 2,
  borderRadius: '8px',
  bgcolor: (theme: Theme) =>
    theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.03)',
  border: '1px dashed',
  borderColor: 'primary.main',
  mb: 2,
};
