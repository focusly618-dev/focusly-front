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

export const metadataChipSx = (colorCode?: string) => {
  return {
    bgcolor: (theme: Theme) => {
      const defaultColor = colorCode || '#6b7280';
      return theme.palette.mode === 'dark'
        ? alpha(defaultColor, 0.12)
        : alpha(defaultColor, 0.08);
    },
    border: '1px solid',
    borderColor: (theme: Theme) => {
      const defaultColor = colorCode || '#6b7280';
      return theme.palette.mode === 'dark'
        ? alpha(defaultColor, 0.2)
        : alpha(defaultColor, 0.15);
    },
    color: (theme: Theme) => {
      const defaultColor = colorCode || '#6b7280';
      return theme.palette.mode === 'dark'
        ? alpha(defaultColor, 0.9)
        : defaultColor;
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
        const defaultColor = colorCode || '#6b7280';
        return theme.palette.mode === 'dark'
          ? alpha(defaultColor, 0.18)
          : alpha(defaultColor, 0.12);
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

export const timerInputSx = (isReal?: boolean) => ({
  width: '80px',
  bgcolor: 'background.default',
  borderRadius: '10px',
  px: 1,
  '& .MuiInputBase-input': {
    fontSize: '15px',
    fontWeight: 700,
    color: isReal ? 'info.main' : 'text.primary',
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
