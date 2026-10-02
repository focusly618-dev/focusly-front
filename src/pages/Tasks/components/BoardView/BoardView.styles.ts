import { Box, Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { surfaceColor } from '@/context';

export const BoardContainer = styled(Box)(({ theme }) => {
  return {
    display: 'flex',
    gap: theme.spacing(2.5),
    overflowX: 'auto',
    paddingBottom: theme.spacing(3),
    width: '100%',
    alignItems: 'flex-start',
    height: '100%',
    minHeight: '600px',
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: surfaceColor(theme, '#2e3037', '#3E3E3E', '#cbd5e1'),
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: surfaceColor(theme, '#3a3d48', '#4D4D4D', '#94a3b8'),
    },
  };
});

export const ColumnWrapper = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: surfaceColor(theme, '#15161b', '#202020', '#f8fafc'),
    border: `1px solid ${surfaceColor(theme, '#25272e', '#333333', '#e2e8f0')}`,
    boxShadow: isDark
      ? '0 4px 16px -2px rgba(0, 0, 0, 0.4)'
      : '0 1px 4px rgba(0, 0, 0, 0.04)',
    width: '320px',
    minWidth: '280px',
    height: '100%',
    borderRadius: '14px',
    padding: '14px',
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100vw - 48px)',
      minWidth: '280px',
    },
    flexShrink: 0,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };
});

export const ColumnHeader = styled(Box)<{ borderColor?: string }>(({
  theme,
  borderColor,
}) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(1.5),
    marginBottom: theme.spacing(1.75),
    borderBottom: `1px solid ${surfaceColor(theme, '#25272e', '#333333', '#e2e8f0')}`,
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '42px',
      height: '2.5px',
      backgroundColor:
        borderColor || (isDark ? '#10b981' : theme.palette.primary.main),
      borderRadius: '2px',
    },
  };
});

export const ColumnTitle = styled(Typography)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    fontWeight: 700,
    fontSize: '13.5px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: isDark ? '#F3F4F6' : theme.palette.text.primary,
  };
});

export const TaskCountBadge = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    backgroundColor: surfaceColor(theme, '#25272e', '#333333', '#e2e8f0'),
    color: isDark ? '#8A8F98' : theme.palette.text.secondary,
    borderRadius: '20px',
    padding: '2px 8px',
    fontSize: '11.5px',
    fontWeight: 700,
  };
});

export const DroppableArea = styled(Box)<{ isOver?: boolean }>(({
  theme,
  isOver,
}) => {
  const isDark = theme.palette.mode === 'dark';
  const primaryColor = isDark ? '#10b981' : theme.palette.primary.main;
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    minHeight: '220px',
    maxHeight: 'calc(100vh - 250px)',
    height: '100%',
    padding: '4px',
    borderRadius: '10px',
    backgroundColor: isOver
      ? isDark
        ? 'rgba(0, 135, 103, 0.08)'
        : 'rgba(0, 135, 103, 0.04)'
      : 'transparent',
    border: isOver
      ? `1.5px dashed ${primaryColor}`
      : '1.5px dashed transparent',
    transition: 'all 0.2s ease-in-out',
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '5px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: surfaceColor(theme, '#2e3037', '#3E3E3E', '#cbd5e1'),
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: surfaceColor(theme, '#3a3d48', '#4D4D4D', '#94a3b8'),
    },
  };
});

export const DropIndicator = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  const color = isDark ? '#10b981' : '#008767';
  return {
    height: '3px',
    backgroundColor: color,
    borderRadius: '2px',
    margin: '4px 0',
    boxShadow: `0 0 10px ${alpha(color, 0.7)}`,
    animation: 'pulse 1.5s ease-in-out infinite',
    '@keyframes pulse': {
      '0%, 100%': {
        opacity: 1,
        transform: 'scaleX(1)',
      },
      '50%': {
        opacity: 0.6,
        transform: 'scaleX(0.96)',
      },
    },
  };
});

export const TaskPlaceholder = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => {
  const isDark = theme.palette.mode === 'dark';
  const primaryColor = isDark ? '#10b981' : theme.palette.primary.main;
  return {
    minHeight: '130px',
    height: '100%',
    maxHeight: '180px',
    border: isActive
      ? `2px dashed ${primaryColor}`
      : `1.5px dashed ${surfaceColor(theme, '#2a2d36', '#3B3B3B', '#cbd5e1')}`,
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '16px',
    backgroundColor: isActive
      ? isDark
        ? alpha('#10b981', 0.12)
        : alpha('#008767', 0.06)
      : surfaceColor(theme, '#191a20', '#252525', '#f8fafc'),
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
    '&:hover': {
      borderColor: surfaceColor(theme, '#3a3e4a', '#4E4E4E', '#94a3b8'),
      backgroundColor: surfaceColor(theme, '#1b1d24', '#282828', '#f1f5f9'),
    },
  };
});

export const DraggingCardPreview = styled(Box)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    backgroundColor: surfaceColor(theme, '#1c1d24', '#292929', '#ffffff'),
    border: `2px solid ${isDark ? '#10b981' : '#008767'}`,
    borderRadius: '12px',
    padding: '16px',
    boxShadow: isDark
      ? '0 20px 40px -10px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 135, 103, 0.25)'
      : '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
    transform: 'rotate(2deg)',
    cursor: 'grabbing',
    opacity: 0.98,
  };
});
