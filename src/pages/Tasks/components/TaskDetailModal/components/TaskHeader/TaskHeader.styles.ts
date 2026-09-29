import type { Theme } from '@mui/material/styles';

export const headerContainerSx = (
  hasCustomColor: boolean,
  color: string,
  isFullScreen?: boolean,
) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  px: 3,
  pt: 2,
  pb: hasCustomColor ? 5 : 1,
  minHeight: hasCustomColor ? '110px' : 'auto',
  backgroundColor: hasCustomColor ? color : 'transparent',
  borderTopLeftRadius: isFullScreen ? 0 : '20px',
  borderTopRightRadius: isFullScreen ? 0 : '20px',
  transition: 'all 0.25s ease-in-out',
  position: 'relative',
  ...(hasCustomColor && {
    boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.08)',
  }),
});

export const headerIconButtonSx = (hasCustomColor: boolean) => ({
  color: hasCustomColor ? '#0f172a' : 'text.secondary',
  p: 0.75,
  borderRadius: '8px',
  backgroundColor: hasCustomColor ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
  backdropFilter: hasCustomColor ? 'blur(8px)' : 'none',
  transition: 'all 0.15s ease-in-out',
  '&:hover': {
    color: hasCustomColor ? '#000000' : 'text.primary',
    backgroundColor: hasCustomColor
      ? 'rgba(0, 0, 0, 0.16)'
      : (theme: Theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.05)',
  },
});
