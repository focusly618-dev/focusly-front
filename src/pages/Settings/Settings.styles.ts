import { styled, Box, Typography, Slider } from '@mui/material';

export const SettingsLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#0C0C0E' : '#FAFAF8',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

export const SettingsSidebar = styled(Box)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  padding: theme.spacing(4, 2),
  borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(2),
    borderRight: 'none',
    borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
    flexDirection: 'row',
    overflowX: 'auto',
    gap: theme.spacing(0.5),
  },
}));

export const SidebarItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: '8px 12px',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: active
    ? theme.palette.mode === 'dark'
      ? '#F4F4F5'
      : '#1F2937'
    : '#6B7280',
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.06)'
      : 'rgba(0, 0, 0, 0.04)'
    : 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  userSelect: 'none',
  '& svg': {
    fontSize: '1.25rem',
    color: active ? '#6366F1' : '#6B7280',
    transition: 'color 0.2s ease',
  },
  '&:hover': {
    backgroundColor: active
      ? theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.06)'
        : 'rgba(0, 0, 0, 0.04)'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.02)'
        : 'rgba(0, 0, 0, 0.02)',
    color: theme.palette.mode === 'dark' ? '#F4F4F5' : '#1F2937',
    '& svg': {
      color: '#6366F1',
    },
  },
}));

export const ContentArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(6, 8),
  maxWidth: 860,
  overflowY: 'auto',
  height: '100vh',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 2),
    height: 'auto',
  },
}));

export const ProfileHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));

export const SettingsTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 800,
  color: theme.palette.mode === 'dark' ? '#F4F4F5' : '#1F2937',
  letterSpacing: '-0.02em',
  marginBottom: '4px',
}));

export const SettingsDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.925rem',
  color: theme.palette.mode === 'dark' ? '#A1A1AA' : '#6B7280',
  lineHeight: 1.5,
}));

export const SectionCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#141417' : '#FFFFFF',
  borderRadius: '20px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 2px 8px rgba(0, 0, 0, 0.2)'
      : '0 1px 3px rgba(0, 0, 0, 0.01), 0 1px 2px rgba(0, 0, 0, 0.005)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 12px 40px rgba(0, 0, 0, 0.3)'
        : '0 8px 30px rgba(0, 0, 0, 0.02)',
  },
}));

export const AICard = styled(SectionCard)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #141417 0%, #17172B 100%)'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F9F9FF 100%)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)'}`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    padding: '1px',
    background:
      'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.02))',
    WebkitMask:
      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
  },
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
}));

export const SectionTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  '& .MuiTypography-root': {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: theme.palette.mode === 'dark' ? '#F4F4F5' : '#1F2937',
    letterSpacing: '-0.01em',
  },
  '& .icon-wrapper': {
    color: '#6366F1',
    display: 'flex',
    alignItems: 'center',
  },
}));

export const Badge = styled(Box)({
  fontSize: '0.7rem',
  fontWeight: 800,
  padding: '3px 8px',
  borderRadius: '6px',
  backgroundColor: 'rgba(99, 102, 241, 0.08)',
  color: '#6366F1',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  display: 'inline-flex',
  alignItems: 'center',
});

// Inline editable field styles
export const InlineEditWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '6px 8px',
  borderRadius: '8px',
  transition: 'background-color 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.02)',
  },
}));

export const InlineLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? '#A1A1AA' : '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));

export const InlineValue = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? '#F4F4F5' : '#1F2937',
  minHeight: '20px',
}));

// Weekly Day Selector
export const WeeklyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

export const DayPill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  backgroundColor: active
    ? '#6366F1'
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.04)'
      : 'rgba(0, 0, 0, 0.03)',
  color: active
    ? '#FFFFFF'
    : theme.palette.mode === 'dark'
      ? '#A1A1AA'
      : '#6B7280',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: active
      ? '#4F46E5'
      : theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.06)',
    transform: 'translateY(-1px)',
  },
}));

// Custom Premium Toggles and Cards
export const SmartToggleCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderRadius: '16px',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.02)'
      : 'rgba(0, 0, 0, 0.02)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)'}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.03)',
  },
}));

export const SmartCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  fontWeight: 700,
  color: theme.palette.mode === 'dark' ? '#F4F4F5' : '#1F2937',
}));

export const SmartCardDesc = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.mode === 'dark' ? '#A1A1AA' : '#6B7280',
}));

// Slider Wrapper
export const SliderHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

export const SliderLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.925rem',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? '#F4F4F5' : '#1F2937',
}));

export const SliderValue = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 800,
  color: '#6366F1',
});

export const PremiumSlider = styled(Slider)(({ theme }) => ({
  color: '#6366F1',
  height: 6,
  padding: '15px 0',
  '& .MuiSlider-track': {
    border: 'none',
    borderRadius: 3,
  },
  '& .MuiSlider-rail': {
    opacity: 0.12,
    backgroundColor: theme.palette.mode === 'dark' ? '#F4F4F5' : '#1F2937',
    borderRadius: 3,
  },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: theme.palette.mode === 'dark' ? '#141417' : '#FFFFFF',
    border: '2px solid #6366F1',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    '&:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 0 0 6px rgba(99, 102, 241, 0.16)',
    },
  },
}));

// Distraction Shield Elements
export const ShieldGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2.5),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const ShieldItemCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderRadius: '16px',
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(99, 102, 241, 0.08)'
      : 'rgba(99, 102, 241, 0.03)'
    : theme.palette.mode === 'dark'
      ? '#141417'
      : '#FFFFFF',
  border: `1px solid ${active ? 'rgba(99, 102, 241, 0.25)' : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}`,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: 'rgba(99, 102, 241, 0.35)',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.01)'
        : 'rgba(99, 102, 241, 0.01)',
  },
}));

export const ShieldInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  '& svg': {
    color: theme.palette.mode === 'dark' ? '#A1A1AA' : '#6B7280',
    fontSize: '1.25rem',
  },
}));

export const ShieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? '#F4F4F5' : '#1F2937',
}));

// Blocklist Panel
export const BlocklistPanel = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.015)'
      : 'rgba(0, 0, 0, 0.015)',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'}`,
  borderRadius: '16px',
  padding: theme.spacing(2.5),
}));

export const BlocklistTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  fontWeight: 700,
  color: theme.palette.mode === 'dark' ? '#A1A1AA' : '#6B7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '12px',
}));

export const BlocklistItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderRadius: '8px',
  backgroundColor: theme.palette.mode === 'dark' ? '#141417' : '#FFFFFF',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'}`,
  marginBottom: '8px',
  '&:last-child': {
    marginBottom: 0,
  },
}));

export const BlocklistDomain = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? '#F4F4F5' : '#1F2937',
}));

// Sound Picker Cards
export const SoundGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: theme.spacing(2),
}));

export const SoundCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: '16px',
  borderRadius: '16px',
  backgroundColor: active
    ? theme.palette.mode === 'dark'
      ? 'rgba(99, 102, 241, 0.08)'
      : 'rgba(99, 102, 241, 0.03)'
    : theme.palette.mode === 'dark'
      ? '#141417'
      : '#FFFFFF',
  border: `1px solid ${active ? 'rgba(99, 102, 241, 0.3)' : theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}`,
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  '&:hover': {
    borderColor: 'rgba(99, 102, 241, 0.45)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
  },
}));

export const SoundCardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const SoundCardIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  width: 32,
  height: 32,
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: active
    ? 'rgba(99, 102, 241, 0.15)'
    : theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.03)',
  color: active
    ? '#6366F1'
    : theme.palette.mode === 'dark'
      ? '#A1A1AA'
      : '#6B7280',
  '& svg': {
    fontSize: '1rem',
  },
}));

export const SoundCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 700,
  color: theme.palette.mode === 'dark' ? '#F4F4F5' : '#1F2937',
}));

// Notifications Alert Card
export const AlertCardGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const AlertCardItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#141417' : '#FFFFFF',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
}));

export const AlertCardIconBox = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(99, 102, 241, 0.08)',
  color: '#6366F1',
  flexShrink: 0,
  '& svg': {
    fontSize: '1.25rem',
  },
});

export const SoundPreviewButton = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  marginTop: theme.spacing(1.5),
  fontSize: '0.75rem',
  fontWeight: 700,
  color: theme.palette.mode === 'dark' ? '#A1A1AA' : '#6B7280',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '6px',
  transition: 'all 0.2s',
  '& svg': {
    fontSize: '0.85rem',
  },
  '&:hover': {
    color: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
  },
}));

export const UserProfileSummary = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2.5),
  padding: theme.spacing(3),
  borderRadius: '24px',
  backgroundColor: theme.palette.mode === 'dark' ? '#141417' : '#FFFFFF',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
  marginBottom: theme.spacing(4),
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 2px 8px rgba(0, 0, 0, 0.2)'
      : '0 1px 3px rgba(0,0,0,0.01)',
}));
