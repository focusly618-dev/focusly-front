import type { ElementType } from 'react';
import { Box, Stack, Button, Typography, Paper, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Animations ---
export const bounceAnimation = {
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-8px)' },
  },
};

// --- Page wrappers ---
export const PageWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'hidden',
}));

export const MainContent = styled('main')({
  flexGrow: 1,
});

export const FeaturesHero = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0, 8, 0),
  textAlign: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: 'relative',
}));

export const HeroBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: '9999px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(96, 165, 250, 0.1)'
      : 'rgba(59, 130, 246, 0.06)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.1)'}`,
  marginBottom: theme.spacing(2.5),
}));

export const HeroBadgeText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  color: theme.palette.primary.main,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));

// --- Sections ---
export const FeatureSectionWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<{ bgColor?: string }>(({ theme, bgColor }) => ({
  padding: theme.spacing(12, 0),
  backgroundColor: bgColor || 'transparent',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 0),
  },
}));

export const SectionHeader = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  textAlign: 'center',
  marginBottom: theme.spacing(8),
  maxWidth: 700,
  marginLeft: 'auto',
  marginRight: 'auto',
}));

// --- Component Cards ---
export const FeatureBlockCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'dark',
})<{ dark?: boolean }>(({ theme, dark }) => ({
  padding: theme.spacing(5),
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: dark ? '#0A0A0B' : theme.palette.background.paper,
  color: dark ? '#FFFFFF' : theme.palette.text.primary,
  boxShadow: 'none',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.25s',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 20px 40px rgba(0,0,0,0.5)'
        : '0 20px 40px rgba(0,0,0,0.02)',
  },
}));

// --- CSS Devices Mockups ---
export const MacbookFrame = styled(Box)({
  width: '100%',
  maxWidth: 480,
  margin: '0 auto',
  position: 'relative',
  animation: 'float 6s ease-in-out infinite',
  ...bounceAnimation,
});

export const MacbookScreen = styled(Paper)(({ theme }) => ({
  width: '100%',
  aspectRatio: '1882 / 869',
  borderRadius: '12px 12px 0 0',
  overflow: 'hidden',
  border: `4px solid ${theme.palette.mode === 'dark' ? '#27272A' : '#18181B'}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  position: 'relative',
}));

export const MacbookKeyboard = styled(Box)(({ theme }) => ({
  width: '106%',
  height: 10,
  backgroundColor: theme.palette.mode === 'dark' ? '#3F3F46' : '#D4D4D8',
  marginLeft: '-3%',
  borderRadius: '0 0 8px 8px',
  position: 'relative',
  borderTop: `1px solid ${theme.palette.divider}`,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '45%',
    width: '10%',
    height: 4,
    backgroundColor: theme.palette.mode === 'dark' ? '#18181B' : '#A1A1AA',
    borderRadius: '0 0 4px 4px',
  },
}));

// --- CSS Monitor for Workspaces ---
export const DesktopMonitorFrame = styled(Box)({
  position: 'relative',
  width: '100%',
  maxWidth: 420,
  margin: '0 auto',
});

export const DesktopMonitorScreen = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: 240,
  borderRadius: 10,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
}));

export const DesktopMonitorStand = styled(Box)(({ theme }) => ({
  width: 45,
  height: 40,
  backgroundColor: theme.palette.mode === 'dark' ? '#27272A' : '#E5E5E5',
  margin: '0 auto',
  clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
  zIndex: 1,
  position: 'relative',
}));

export const DesktopMonitorBase = styled(Box)(({ theme }) => ({
  width: 100,
  height: 6,
  backgroundColor: theme.palette.mode === 'dark' ? '#3F3F46' : '#D4D4D8',
  margin: '-4px auto 0 auto',
  borderRadius: '3px 3px 0 0',
  position: 'relative',
  zIndex: 2,
}));

// --- Dark analytics section elements ---
export const AnalyticsDarkSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  backgroundColor: '#000000',
  color: '#FFFFFF',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const DarkReviewCard = styled(Paper)({
  backgroundColor: '#0A0A0B',
  border: '1px solid #27272A',
  borderRadius: 14,
  padding: '24px 32px',
  color: '#FFFFFF',
  boxShadow: 'none',
  height: '100%',
});

export const AnalyticsProgressBar = styled(Box)({
  height: 6,
  width: '100%',
  borderRadius: 3,
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  position: 'relative',
  overflow: 'hidden',
});

export const AnalyticsProgressBarFill = styled(Box)<{ width: string }>(
  ({ width }) => ({
    height: '100%',
    width,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  }),
);

// --- CTA Call To Action Banner ---
export const CtaBanner = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(10, 8),
  borderRadius: 24,
  backgroundColor: '#3B82F6', // Vibrant blue background
  color: '#FFFFFF',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'none',
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 4),
  },
}));

export const CtaPrimaryButton = styled(Button)<{
  component?: ElementType;
  to?: string;
}>({
  backgroundColor: '#FFFFFF',
  color: '#3B82F6',
  padding: '12px 28px',
  borderRadius: '9999px',
  fontWeight: 700,
  fontSize: '0.9375rem',
  textTransform: 'none',
  transition: 'transform 0.2s',
  '&:hover': {
    backgroundColor: '#F3F4F6',
    transform: 'translateY(-1.5px)',
  },
});

export const CtaSecondaryButton = styled(Button)<{
  component?: ElementType;
  to?: string;
}>({
  border: '1.5px solid #FFFFFF',
  color: '#FFFFFF',
  padding: '12px 28px',
  borderRadius: '9999px',
  fontWeight: 700,
  fontSize: '0.9375rem',
  textTransform: 'none',
  transition: 'transform 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-1.5px)',
  },
});

// --- Footer styled duplicates ---
export const FooterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0, 6, 0),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

export const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  fontSize: '0.875rem',
  transition: 'color 0.15s',
  '&:hover': {
    color: theme.palette.text.primary,
  },
}));
