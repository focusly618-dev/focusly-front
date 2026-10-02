import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/material';
import { surfaceColor } from '@/context';

export const CardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'baseColor',
})<{ baseColor?: string }>(({ theme, baseColor = '#10B981' }) => ({
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.08)'
      : '1px solid #E5E7EB',
  borderLeft: `3.5px solid ${baseColor}`,
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  minHeight: '235px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: surfaceColor(theme, '#1C1C1E', '#262626', '#FFFFFF'),
  boxShadow:
    theme.palette.mode === 'dark' ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.03)',
  '&:hover': {
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 8px 24px rgba(0,0,0,0.35)'
        : '0 8px 20px rgba(0, 0, 0, 0.06)',
    transform: 'translateY(-2px)',
  },
}));

export const FolderIconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'baseColor',
})<{ baseColor?: string }>(({ baseColor = '#10B981' }) => ({
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(baseColor, 0.1),
  color: baseColor,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: alpha(baseColor, 0.16),
  },
}));

export const WorkspacePreviewBox = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.05)'
      : '1px solid #F1F5F9',
  borderRadius: '10px',
  padding: '10px 12px',
  marginTop: '10px',
  marginBottom: 'auto',
}));

export const StatusBar = styled(Box)(({ theme }) => ({
  padding: '10px 16px',
  borderTop:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.06)'
      : '1px solid #F1F5F9',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottomLeftRadius: '16px',
  borderBottomRightRadius: '16px',
  backgroundColor: 'transparent',
}));
