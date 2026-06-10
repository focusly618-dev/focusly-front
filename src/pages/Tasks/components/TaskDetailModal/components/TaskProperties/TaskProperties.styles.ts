import { alpha, type Theme } from '@mui/material/styles';

export const propertiesContainerSx = {
  mt: 2,
  px: 4,
  mb: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const metadataRowSx = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
  mb: 1,
};

export const metadataChipSx = (isHighPriority = false) => {
  return {
    bgcolor: (theme: Theme) => {
      if (isHighPriority) {
        return theme.palette.mode === 'dark'
          ? alpha('#ef4444', 0.15)
          : alpha('#ef4444', 0.08);
      }
      return theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.04)';
    },
    border: '1px solid',
    borderColor: (theme: Theme) => {
      if (isHighPriority) {
        return theme.palette.mode === 'dark'
          ? alpha('#ef4444', 0.25)
          : alpha('#ef4444', 0.15);
      }
      return 'divider';
    },
    color: (theme: Theme) => {
      if (isHighPriority) {
        return '#ef4444';
      }
      return theme.palette.text.secondary;
    },
    borderRadius: '20px',
    px: 1.5,
    height: '28px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      bgcolor: (theme: Theme) => {
        if (isHighPriority) {
          return theme.palette.mode === 'dark'
            ? alpha('#ef4444', 0.25)
            : alpha('#ef4444', 0.12);
        }
        return theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.08)';
      },
      transform: 'translateY(-0.5px)',
    },
    '& .MuiChip-icon': {
      marginLeft: '-2px',
      color: 'inherit',
      fontSize: '14px',
    },
  };
};

export const colorCircleSx = (color: string) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  bgcolor: color,
  cursor: 'pointer',
  border: '2px solid white',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  '&:hover': { transform: 'scale(1.1)' },
});

export const timerInputSx = () => ({
  width: '70px',
  bgcolor: 'transparent',
  '&:hover': {
    bgcolor: 'action.hover',
  },
  borderRadius: '4px',
  px: 0.5,
  '& .MuiInputBase-input': {
    fontSize: '14px',
    fontWeight: 600,
    color: 'text.primary',
    padding: 0,
  },
});

export const popoverPaperSx = {
  borderRadius: '12px',
  mt: 1,
  boxShadow: 'none',
};

export const timerPopoverPaperSx = {
  minWidth: 80,
  borderRadius: '12px',
};

export const colorPopoverPaperSx = {
  borderRadius: '16px',
  mt: 1,
  boxShadow: 'none',
};

export const colorGridSx = {
  p: 2,
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: 1.5,
};
