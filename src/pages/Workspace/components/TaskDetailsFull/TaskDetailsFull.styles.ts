import { styled, Box, Typography, Button } from '@mui/material';

export const SidebarTopNav = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '24px',
});

export const SidebarBreadcrumbs = styled(Typography)(({ theme }) => ({
  color: theme.palette.info.main,
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  marginBottom: '8px',
}));

export const SidebarTaskTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: '24px',
  lineHeight: 1.3,
}));

export const PropertyGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px',
  marginBottom: '32px',
});

export const PropertyCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}));

export const PropertyLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

export const PropertyValue = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '13px',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

export const SidebarFooter = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  paddingTop: '24px',
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  gap: '12px',
}));

export const ViewTaskButton = styled(Button)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(30, 41, 59, 0.5)'
      : theme.palette.action.selected,
  color: theme.palette.text.primary,
  flex: 1,
  fontWeight: 600,
  fontSize: '11px',
  padding: '12px',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));
export const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  marginBottom: '12px',
}));

export const DescriptionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '32px',
  fontSize: '13px',
  lineHeight: 1.6,
  color: theme.palette.text.primary,
  '& p': {
    margin: 0,
    marginBottom: '8px',
    '&:last-child': { marginBottom: 0 },
  },
  '& ul, & ol': { margin: '8px 0', paddingLeft: '20px' },
}));
