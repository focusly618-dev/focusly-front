import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Motion-inspired professional design
export const GridTaskCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '12px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 8px 24px rgba(0, 0, 0, 0.4)'
        : '0 8px 24px rgba(0, 0, 0, 0.08)',
  },
}));

export const GridCardHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '4px',
});

export const GridCardFooter = styled(Box)({
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  pt: 2,
  borderTop: '1px solid',
  borderColor: 'divider',
});

export const ProgressBarContainer = styled(Box)({
  width: '100%',
});

export const ProgressLabel = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '6px',
});

export const Tag = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'tagColor' && prop !== 'textColor',
})<{ tagColor?: string; textColor?: string }>(
  ({ theme, tagColor, textColor }) => ({
    padding: '3px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.3px',
    backgroundColor:
      tagColor ||
      (theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.04)'),
    color: textColor || theme.palette.text.secondary,
    border: `1px solid ${theme.palette.divider}`,
  }),
);

export const StatusDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color?: string }>(({ color }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: color || '#6b7280',
  flexShrink: 0,
}));

export const MetaBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  color: 'inherit',
});

export const PriorityBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color?: string }>(({ color }) => ({
  width: '3px',
  height: '14px',
  borderRadius: '2px',
  backgroundColor: color || '#6b7280',
}));
