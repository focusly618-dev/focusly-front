import type { Theme } from '@mui/material/styles';
import { isColorDark } from '../../TaskDetailModal.utils';

export const headerContainerSx = (
  hasCustomColor: boolean,
  color: string,
  isFullScreen?: boolean,
) => {
  const isDark = hasCustomColor && isColorDark(color);
  return {
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
      boxShadow: isDark
        ? 'inset 0 -1px 0 rgba(255, 255, 255, 0.12)'
        : 'inset 0 -1px 0 rgba(0, 0, 0, 0.08)',
    }),
  };
};

export const headerIconButtonSx = (hasCustomColor: boolean, color?: string) => {
  const isDark = hasCustomColor && isColorDark(color);
  return {
    color: hasCustomColor ? (isDark ? '#ffffff' : '#0f172a') : 'text.secondary',
    p: 0.75,
    borderRadius: '8px',
    backgroundColor: hasCustomColor
      ? isDark
        ? 'rgba(255, 255, 255, 0.16)'
        : 'rgba(0, 0, 0, 0.08)'
      : 'transparent',
    backdropFilter: hasCustomColor ? 'blur(8px)' : 'none',
    transition: 'all 0.15s ease-in-out',
    '&:hover': {
      color: hasCustomColor ? (isDark ? '#ffffff' : '#000000') : 'text.primary',
      backgroundColor: hasCustomColor
        ? isDark
          ? 'rgba(255, 255, 255, 0.28)'
          : 'rgba(0, 0, 0, 0.16)'
        : (theme: Theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.05)',
    },
  };
};
