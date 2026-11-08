import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/material';
import { surfaceColor } from '@/context';

export const GridWrapper = styled(Box)(() => ({
  marginTop: '24px',
  paddingBottom: '32px',
}));

// Columns follow the space the grid has (not the window, which also holds
// the sidebar), and every row is as tall as the tallest card, so all cards
// share one size.
export const FoldersGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  // Wide cards, as the document cards of a project page (three to a row on
  // a laptop)
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
  gridAutoRows: '1fr',
  gap: '18px',
  [theme.breakpoints.down('sm')]: {
    gap: '14px',
  },
}));

// The "new project" card: a plain card (not dashed), as "Create Workspace"
// in a project page
export const DashedCard = styled(Box)(({ theme }) => ({
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.08)'
      : '1px solid #E8EAEE',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  minHeight: '196px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: surfaceColor(theme, '#1C1C1E', '#262626', '#FFFFFF'),
  '&:hover': {
    borderColor: '#008767',
    transform: 'translateY(-2px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 8px 20px rgba(0,0,0,0.3)'
        : '0 8px 20px rgba(0, 0, 0, 0.04)',
  },
}));

export const AddCircleIconWrapper = styled(Box)(({ theme }) => ({
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '10px',
  backgroundColor: alpha(
    theme.palette.primary.main,
    theme.palette.mode === 'dark' ? 0.18 : 0.1,
  ),
  color: theme.palette.primary.main,
}));
