import type { ElementType } from 'react';
import {
  Box,
  Stack,
  Grid,
  Button,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Keyframes & Animations ---
export const bounceAnimation = {
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
};

export const floatSlowAnimation = {
  '@keyframes floatSlow': {
    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
    '50%': { transform: 'translateY(-6px) rotate(2deg)' },
  },
};

// --- Page Layout ---
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

// --- Generic Section Container ---
export const SectionWrapper = styled(Box, {
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
  maxWidth: 800,
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: theme.spacing(0, 2),
}));

export const SectionBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: '9999px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(96, 165, 250, 0.1)'
      : 'rgba(59, 130, 246, 0.06)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.1)'}`,
  marginBottom: theme.spacing(2),
}));

export const SectionBadgeText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  color: theme.palette.primary.main,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));

// --- Hero Section ---
export const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(12, 0, 8, 0),
  overflow: 'hidden',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 0, 6, 0),
  },
}));

export const HeroBgDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -150,
  right: -150,
  width: 600,
  height: 600,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  filter: 'blur(140px)',
  opacity: theme.palette.mode === 'dark' ? 0.06 : 0.03,
  pointerEvents: 'none',
  zIndex: 0,
}));

export const NewBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: '9999px',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(96, 165, 250, 0.12)' : '#EFF6FF',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(96, 165, 250, 0.2)' : '#DBEAFE'}`,
  width: 'fit-content',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-1px)',
  },
}));

export const NewBadgeText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.8125rem',
  color: theme.palette.mode === 'dark' ? '#60A5FA' : '#1D4ED8',
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '3.75rem', // ~60px
  lineHeight: 1.15,
  letterSpacing: '-0.025em',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
}));

export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '1.125rem',
  lineHeight: 1.6,
  maxWidth: 540,
}));

export const HeroPrimaryButton = styled(Button)<{
  component?: ElementType;
  to?: string;
}>(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#111111',
  color: theme.palette.mode === 'dark' ? '#0F0F10' : '#FFFFFF',
  padding: '12px 24px',
  fontSize: '0.9375rem',
  fontWeight: 600,
  borderRadius: '9999px', // Pill button
  boxShadow: 'none',
  textTransform: 'none',
  transition: 'all 0.25s',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#E4E4E7' : '#1F2937',
    transform: 'translateY(-1.5px)',
  },
}));

export const HeroSecondaryButton = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.mode === 'dark' ? '#202024' : '#FFFFFF',
  padding: '12px 24px',
  fontSize: '0.9375rem',
  fontWeight: 600,
  borderRadius: '9999px', // Pill button
  textTransform: 'none',
  transition: 'all 0.25s',
  '&:hover': {
    borderColor: theme.palette.text.primary,
    backgroundColor: theme.palette.mode === 'dark' ? '#2D2D30' : '#FAFAFA',
    transform: 'translateY(-1.5px)',
  },
}));

// --- CSS Monitor Frame ---
export const MonitorContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  maxWidth: 580,
  margin: '0 auto',
  animation: 'float 6s ease-in-out infinite',
  ...bounceAnimation,
});

export const MonitorScreen = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: 340,
  borderRadius: 14,
  overflow: 'hidden',
  display: 'flex',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 25px 50px -12px rgba(0,0,0,0.8)'
      : '0 25px 50px -12px rgba(0,0,0,0.1)',
  zIndex: 3,
  position: 'relative',
}));

export const MonitorStand = styled(Box)(({ theme }) => ({
  width: 65,
  height: 60,
  backgroundColor: theme.palette.mode === 'dark' ? '#27272A' : '#E5E5E5',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
  clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const MonitorBase = styled(Box)(({ theme }) => ({
  width: 150,
  height: 8,
  backgroundColor: theme.palette.mode === 'dark' ? '#3F3F46' : '#D4D4D8',
  margin: '-4px auto 0 auto',
  borderRadius: '4px 4px 0 0',
  position: 'relative',
  zIndex: 2,
}));

// --- Dashboard Mockup Components ---
export const MockupSidebar = styled(Box)(({ theme }) => ({
  width: 140,
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#18181B' : '#FAFAFA',
  padding: theme.spacing(1.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const MockupSidebarItem = styled(Box)<{ active?: boolean }>(
  ({ theme, active }) => ({
    height: 22,
    borderRadius: 5,
    backgroundColor: active
      ? theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.05)'
        : 'rgba(0,0,0,0.03)'
      : 'transparent',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 0.75),
    gap: 6,
  }),
);

export const MockupSidebarIndicator = styled(Box)<{ color?: string }>(
  ({ color }) => ({
    width: 10,
    height: 10,
    borderRadius: 2.5,
    backgroundColor: color || '#E5E5E5',
  }),
);

export const MockupSidebarText = styled(Box)(({ theme }) => ({
  width: 45,
  height: 6,
  borderRadius: 3,
  backgroundColor: theme.palette.mode === 'dark' ? '#3F3F46' : '#E5E5E5',
}));

export const MockupMain = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

export const MockupHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const MockupTitle = styled(Box)(({ theme }) => ({
  width: 100,
  height: 12,
  borderRadius: 6,
  backgroundColor: theme.palette.text.primary,
  opacity: 0.8,
}));

export const MockupGrid = styled(Grid)({
  flexGrow: 1,
});

export const MockupCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  height: '100%',
  borderRadius: 10,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#18181B' : '#FAFAFA',
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
}));

export const MockupTextLine = styled(Box)<{ width?: number; opacity?: number }>(
  ({ theme, width, opacity }) => ({
    width: width ? `${width}%` : '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.palette.text.secondary,
    opacity: opacity || 0.3,
  }),
);

export const MockupTaskItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: theme.spacing(0.75),
  borderRadius: 6,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

export const MockupCheckbox = styled(Box)(({ theme }) => ({
  width: 12,
  height: 12,
  borderRadius: 3,
  border: `1.2px solid ${theme.palette.text.secondary}`,
  opacity: 0.5,
}));

export const MockupCalendarEvent = styled(Box)({
  backgroundColor: 'rgba(96, 165, 250, 0.15)',
  borderLeft: '3px solid #60A5FA',
  padding: '4px 8px',
  borderRadius: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
});

export const FloatingEmoji = styled(Box)<{
  top: number | string;
  left: number | string;
  delay: number;
}>(({ top, left, delay }) => ({
  position: 'absolute',
  top,
  left,
  fontSize: '1.75rem',
  zIndex: 10,
  animation: 'floatSlow 5s ease-in-out infinite',
  animationDelay: `${delay}s`,
  pointerEvents: 'none',
  userSelect: 'none',
  filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.12))',
  ...floatSlowAnimation,
}));

// --- Features Grid (SaaS layout matching image) ---
export const FeaturesGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(0, 2),
}));

export const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3.5),
  height: '100%',
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.12)'
        : 'rgba(0,0,0,0.1)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 15px 30px -10px rgba(0,0,0,0.5)'
        : '0 15px 30px -10px rgba(0,0,0,0.03)',
  },
}));

export const FeatureIconBox = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: 10,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(96, 165, 250, 0.08)'
      : 'rgba(59, 130, 246, 0.06)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.1)'}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  marginBottom: theme.spacing(0.5),
}));

export const FeatureTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.25rem', // 20px
  letterSpacing: '-0.015em',
});

export const FeatureDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem', // 14px
  lineHeight: 1.5,
}));

export const FeatureMockupMini = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  width: '100%',
  height: 90,
  borderRadius: 8,
  backgroundColor: theme.palette.mode === 'dark' ? '#18181B' : '#FAFAFA',
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
  padding: 10,
}));

// --- AI Section (Black Dark Banner) ---
export const AISectionWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  backgroundColor: '#000000',
  color: '#FFFFFF',
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 0),
  },
}));

export const AIBulletItem = styled(Stack)({
  flexDirection: 'row',
  spacing: 2,
  alignItems: 'flex-start',
  gap: 12,
});

export const AIBulletIcon = styled(Box)({
  color: '#60A5FA',
  fontSize: '1.25rem',
  flexShrink: 0,
});

export const AIBulletTextStack = styled(Stack)({
  spacing: 0.5,
});

// --- Timeline step layout ---
export const TimelineStepWrapper = styled(Grid)({
  alignItems: 'center',
  position: 'relative',
});

export const TimelineDot = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: '#111111',
  color: '#FFFFFF',
  border: `4px solid ${theme.palette.background.default}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.875rem',
  zIndex: 2,
  position: 'relative',
}));

export const TimelineLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: '50%',
  width: 2,
  backgroundColor: theme.palette.divider,
  zIndex: 0,
  transform: 'translateX(-50%)',
}));

// --- Pricing Grid & Cards ---
export const PricingGrid = styled(Grid)({
  maxWidth: 1000,
  margin: '0 auto',
});

export const PricingCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'featured',
})<{ featured?: boolean }>(({ theme, featured }) => ({
  padding: theme.spacing(5, 4),
  height: '100%',
  borderRadius: 16,
  border: featured
    ? `2px solid ${theme.palette.text.primary}`
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  transition: 'all 0.25s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 15px 30px rgba(0,0,0,0.5)'
        : '0 15px 30px rgba(0,0,0,0.02)',
  },
}));

export const PricingCardBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -12,
  left: '50%',
  transform: 'translateX(-50%)',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: '9999px',
  backgroundColor: theme.palette.text.primary,
  color: theme.palette.background.default,
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));

// --- Testimonial Section ---
export const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3.5),
  borderRadius: 14,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}));

// --- Accordion FAQ ---
export const FaqAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  backgroundImage: 'none',
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px !important',
  marginBottom: `${theme.spacing(1.5)} !important`,
  '&::before': { display: 'none' },
  '&.Mui-expanded': {
    borderColor: theme.palette.text.primary,
  },
}));

export const FaqSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(1.5, 2.5),
  '& .MuiAccordionSummary-content': {
    margin: '0 !important',
  },
}));

export const FaqDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(0, 2.5, 2.5, 2.5),
  color: theme.palette.text.secondary,
  fontSize: '0.9375rem',
  lineHeight: 1.6,
}));

// --- Footer ---
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

export const Footer = styled(Box)(({ theme }) => ({
  borderTop: '1px solid',
  borderColor: theme.palette.divider,
  padding: theme.spacing(4, 0),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
}));

export const FooterText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
