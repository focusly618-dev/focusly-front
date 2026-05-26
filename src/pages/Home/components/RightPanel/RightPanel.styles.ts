import { Box, styled } from '@mui/material';

interface PanelContainerProps {
  isOpen: boolean;
}

export const PanelContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<PanelContainerProps>(({ theme, isOpen }) => ({
  width: isOpen ? 320 : 60,
  transition: 'width 0.3s ease',
  backgroundColor: theme.palette.background.paper,
  borderLeft: `1px solid ${theme.palette.divider}`,
  height: '100vh',
  padding: theme.spacing(3),
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  overflow: 'hidden',
  position: 'relative',
  flexShrink: 0,
}));

export const Card = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: 12,
  padding: 24,
  border: `1px solid ${theme.palette.divider}`,
}));
