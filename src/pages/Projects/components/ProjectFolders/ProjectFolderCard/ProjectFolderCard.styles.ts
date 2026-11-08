import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/material';
import { surfaceColor } from '@/context';

/**
 * A project card, as the document cards of a project page: the project's
 * color on the left edge and as a soft wash fading to the right, the icon
 * tile beside the name, and a footer of date · status · documents.
 */
export const CardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'baseColor',
})<{ baseColor?: string }>(({ theme, baseColor = '#10B981' }) => {
  const isDark = theme.palette.mode === 'dark';
  const surface = surfaceColor(theme, '#1C1C1E', '#262626', '#FFFFFF');
  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '196px',
    height: '100%',
    minWidth: 0,
    padding: '22px 24px 18px',
    borderRadius: '16px',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E8EAEE'}`,
    borderLeft: `4px solid ${baseColor}`,
    background: `linear-gradient(100deg, ${alpha(baseColor, isDark ? 0.14 : 0.07)} 0%, ${alpha(baseColor, 0)} 55%), ${surface}`,
    boxShadow: isDark
      ? '0 1px 2px rgba(0, 0, 0, 0.4)'
      : '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.03)',
    cursor: 'pointer',
    transition:
      'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: isDark
        ? '0 10px 26px rgba(0, 0, 0, 0.4)'
        : '0 10px 24px rgba(15, 23, 42, 0.07)',
      '& .project-card-arrow': {
        color: baseColor,
        transform: 'translateX(3px)',
      },
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover': { transform: 'none' },
    },
  };
});

/** The icon tile left of the name; customizes the project on click. */
export const FolderIconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'baseColor',
})<{ baseColor?: string }>(({ theme, baseColor = '#10B981' }) => ({
  flexShrink: 0,
  width: '50px',
  height: '50px',
  borderRadius: '13px',
  display: 'grid',
  placeItems: 'center',
  color: baseColor,
  background: `linear-gradient(145deg, ${alpha(baseColor, theme.palette.mode === 'dark' ? 0.32 : 0.2)}, ${alpha(baseColor, theme.palette.mode === 'dark' ? 0.16 : 0.08)})`,
  border: `1px solid ${alpha(baseColor, 0.16)}`,
  transition: 'transform 0.2s ease',
  '&:hover': { transform: 'scale(1.05)' },
}));

export const CardDivider = styled(Box)(({ theme }) => ({
  height: '1px',
  margin: '18px 0 16px',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : '#EEF0F3',
}));

/** One footer fact: an icon (or status dot) and its text. */
export const FooterItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  minWidth: 0,
  fontSize: '13.5px',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  '& svg': { fontSize: '16px', flexShrink: 0 },
}));
