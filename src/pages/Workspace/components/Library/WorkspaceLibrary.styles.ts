import { styled, Box, Typography, Card, alpha, lighten } from '@mui/material';

export const LibraryContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#121318' : '#fafbfd',
  padding: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

export const LibraryHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
  },
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: 800,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
  letterSpacing: '-0.5px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '22px',
  },
}));

export const HeaderSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.secondary,
}));

export const SearchBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.03)',
  borderRadius: '8px',
  padding: '6px 14px',
  width: '380px',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#fff',
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
  '& input': {
    border: 'none',
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    outline: 'none',
    fontSize: '14px',
    fontWeight: 500,
    width: '100%',
    marginLeft: theme.spacing(1),
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.6,
    },
  },
}));

export const ActionCapsule = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.04)',
  borderRadius: '32px',
  padding: '4px',
  gap: '4px',
  border: `1px solid ${theme.palette.divider}`,
  marginLeft: theme.spacing(1),
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.06)',
  },
}));

export const CapsuleIconButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: active ? '#137fec' : 'transparent',
  borderRadius: '50%',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: active ? '#fff' : theme.palette.text.secondary,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: active ? '0 4px 12px rgba(19, 127, 236, 0.4)' : 'none',
  '&:hover': {
    backgroundColor: active ? '#1565c0' : 'rgba(255, 255, 255, 0.08)',
    color: active ? '#fff' : theme.palette.text.primary,
  },
  '&:active': {
    transform: 'scale(0.9)',
  },
}));

export const FilterTabs = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  alignItems: 'center',
  flexWrap: 'wrap',
}));

export const FolderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(1),
}));

export const FolderSectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '& .MuiTypography-root': {
    fontSize: '11px',
    fontWeight: 900,
    color: theme.palette.primary.main,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
}));

export const FolderList = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'nowrap',
  alignItems: 'center',
  padding: '20px 12px', // Sufficient space for large shadows and hover lift
  margin: '0 -12px', // Pull back the container so it aligns with other content
  overflowX: 'auto',
  overflowY: 'hidden', // Required when overflowX is auto
  // Simple, subtle native scrollbar styling
  '&::-webkit-scrollbar': {
    height: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(0,0,0,0.1)',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
}));

export const FolderCapsule = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'color',
})<{ active?: boolean; color?: string }>(({ theme, active, color }) => {
  const isDark = theme.palette.mode === 'dark';
  const baseColor = color || theme.palette.primary.main;
  const visibleColor = isDark ? lighten(baseColor, 0.3) : baseColor;

  return {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px 10px 10px',
    height: '64px',
    borderRadius: '40px',
    backgroundColor: active
      ? isDark
        ? alpha(visibleColor, 0.12)
        : alpha(baseColor, 0.1)
      : isDark
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.02)',
    border: `1px solid ${active ? visibleColor : 'transparent'}`,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: '180px',
    flexShrink: 0,
    position: 'relative',
    '&:hover .folder-options-btn': {
      opacity: 1,
      transform: 'scale(0.6)',
    },
    boxShadow: isDark
      ? '0 2px 8px rgba(0,0,0,0.2)'
      : '0 2px 8px rgba(0,0,0,0.05)',
    '&:hover': {
      backgroundColor: active
        ? isDark
          ? alpha(visibleColor, 0.18)
          : alpha(baseColor, 0.15)
        : isDark
          ? 'rgba(255, 255, 255, 0.07)'
          : 'rgba(0, 0, 0, 0.05)',
      transform: 'translateY(-4px)',
      boxShadow: isDark
        ? `0 25px 50px -12px ${alpha(visibleColor, 0.3)}, 0 12px 20px -8px rgba(0,0,0,0.5)`
        : `0 25px 50px -12px ${alpha(baseColor, 0.18)}, 0 12px 20px -8px rgba(0,0,0,0.08)`,
    },
  };
});

export const FolderIconCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color?: string }>(({ theme, color }) => {
  const isDark = theme.palette.mode === 'dark';
  const baseColor = color || theme.palette.primary.main;
  const visibleColor = isDark ? lighten(baseColor, 0.3) : baseColor;

  return {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(visibleColor, isDark ? 0.2 : 0.1),
    color: visibleColor,
    marginRight: '12px',
    boxShadow: `0 4px 12px ${alpha(visibleColor, isDark ? 0.3 : 0.15)}`,
  };
});

export const AddFolderCapsule = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 20px',
  height: '64px',
  borderRadius: '40px',
  border: `2px dashed ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'}`,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  gap: theme.spacing(1),
  flexShrink: 0,
  minWidth: '160px',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
    '& .MuiTypography-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
      transform: 'rotate(90deg)',
    },
  },
  '& .MuiTypography-root': {
    fontSize: '13px',
    fontWeight: 800,
    color: theme.palette.text.secondary,
    letterSpacing: '0.5px',
  },
  '& .MuiSvgIcon-root': {
    transition: 'all 0.3s',
  },
}));

export const MoreFoldersCapsule = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px 16px',
  height: '64px',
  borderRadius: '40px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.04)',
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  flexShrink: 0,
  minWidth: '150px',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
    '& .MuiTypography-root': {
      color: '#fff',
    },
    '& .more-count-circle': {
      backgroundColor: '#fff',
      color: theme.palette.primary.main,
    },
  },
}));

export const MoreFoldersCircle = styled(Box)(({ theme }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  fontSize: '11px',
  fontWeight: 800,
  marginRight: theme.spacing(1.5),
  transition: 'all 0.3s',
}));

export const FolderOptionsIconButton = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
  color: theme.palette.text.secondary,
  opacity: 0,
  transform: 'scale(0.8)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  zIndex: 2,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    boxShadow: `0 4px 8px ${theme.palette.primary.main}44`,
  },
  '&:active': {
    transform: 'scale(0.9)',
  },
}));

export const FilterButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(59, 130, 246, 0.15)'
      : 'rgba(19, 127, 236, 0.08)'
    : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  border: `1px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
  '&:hover': {
    backgroundColor: active
      ? theme.palette.mode === 'dark'
        ? 'rgba(59, 130, 246, 0.2)'
        : 'rgba(19, 127, 236, 0.12)'
      : theme.palette.action.hover,
  },
}));

export const GridContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'layout',
})<{ layout?: 'gallery' | 'list' | 'grid' }>(({ theme, layout }) => {
  const scrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.15)',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.25)',
      },
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
  };

  if (layout === 'list') {
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      overflowY: 'auto',
      paddingBottom: '24px',
      paddingTop: '16px',
      ...scrollbarStyles,
    };
  }
  return {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    overflowY: 'auto',
    paddingBottom: '24px',
    paddingTop: '16px',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
    ...scrollbarStyles,
  };
});

export const WorkspaceCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'gradient' && prop !== 'compact',
})<{ gradient?: string; compact?: boolean }>(({ theme, gradient, compact }) => {
  const isDark = theme.palette.mode === 'dark';
  const isGradient = gradient?.startsWith('linear-gradient');
  return {
    backgroundColor: isGradient
      ? 'transparent'
      : gradient || (isDark ? 'rgba(26, 31, 43, 0.7)' : '#ffffff'),
    backgroundImage: isGradient ? gradient : 'none',
    backgroundSize: 'cover',
    backdropFilter: isGradient ? 'none' : 'blur(12px)',
    borderRadius: '12px',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    minHeight: compact ? '130px' : '300px',
    height: '100%',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid ${
      gradient
        ? isDark
          ? 'rgba(255, 255, 255, 0.25)'
          : 'rgba(0, 0, 0, 0.15)'
        : isDark
          ? 'rgba(255, 255, 255, 0.06)'
          : 'rgba(0, 0, 0, 0.06)'
    }`,
    backgroundClip: 'padding-box',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: isDark
      ? '0 4px 20px -2px rgba(0, 0, 0, 0.3)'
      : '0 2px 8px -1px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
    '&::before': isGradient
      ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.15) 100%)',
          backdropFilter: 'blur(8px)',
          zIndex: 0,
        }
      : {},
    '& > *': {
      position: 'relative',
      zIndex: 1,
    },
    '&:hover': {
      transform: 'translateY(-1.5px)',
      boxShadow: isDark
        ? '0 12px 30px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(99, 102, 241, 0.15)'
        : '0 8px 24px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
      borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(0, 0, 0, 0.15)',
      '& .arrow-button': {
        color: theme.palette.primary.main,
        transform: 'translateX(2px)',
      },
    },
  };
});

export const TaskPill = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)',
  borderRadius: '12px',
  padding: '8px 12px',
  marginTop: 'auto',
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    '& .arrow-button': {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
}));

export const TaskPillLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '9px',
  fontWeight: 800,
  textTransform: 'uppercase',
  marginBottom: '2px',
  letterSpacing: '0.5px',
  lineHeight: 1,
}));

export const TaskPillTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '12px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '180px',
}));

export const HoverArrowButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  marginLeft: 'auto',
  transition: 'all 0.2s ease',
}));

export const CreateCard = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  border: `1px dashed ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '180px',
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.2s',
  backgroundColor: 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

// Redesigned components for modern SaaS Teams UI
export const FolderTabsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  overflowX: 'auto',
  flex: 1,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  WebkitOverflowScrolling: 'touch',
}));

export const FolderTabItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'color',
})<{ active?: boolean; color?: string }>(({ theme, active }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: '12px 18px',
    cursor: 'pointer',
    position: 'relative',
    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
    fontWeight: active ? 700 : 500,
    fontSize: '14px',
    transition: 'all 0.2s ease',
    borderBottom: `2.5px solid ${active ? theme.palette.text.primary : 'transparent'}`,
    whiteSpace: 'nowrap',
    marginBottom: '-1px',
    '&:hover': {
      color: theme.palette.text.primary,
    },
  };
});

export const CardAvatarCircle = styled(Box)(({ theme }) => ({
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.04)',
  border: `1px solid ${theme.palette.divider}`,
  fontSize: '20px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  flexShrink: 0,
}));

export const BadgeChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'bgColor',
})<{ color?: string; bgColor?: string }>(({ theme, color, bgColor }) => ({
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'capitalize',
  color: color || theme.palette.text.primary,
  backgroundColor: bgColor || 'rgba(0, 0, 0, 0.05)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const PropertyGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  paddingTop: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const PropertyItem = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const PropertyLabel = styled(Typography)(({ theme }) => ({
  fontSize: '10px',
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  opacity: 0.8,
}));

export const PropertyValue = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 600,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));
