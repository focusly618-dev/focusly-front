import type { ElementType } from 'react';
import {
  Box,
  Button,
  InputBase,
  Paper,
  Typography,
  styled,
  Link,
} from '@mui/material';

// --- Global Page Wrapper ---
export const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflowX: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#0F0F10' : '#F9FAFB',
  color: theme.palette.text.primary,
}));

export const LogoWrapper = styled(Box)<{
  component?: ElementType;
  to?: string;
}>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(4),
}));

export const LogoBox = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: 8,
  backgroundColor: theme.palette.text.primary,
  color: theme.palette.background.default,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: '1.125rem',
}));

export const LoginCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  zIndex: 10,
  width: '100%',
  maxWidth: 480,
  padding: theme.spacing(6, 5),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      : '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 3),
    margin: theme.spacing(2),
  },
}));

export const LoginHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

export const FormLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '0.875rem',
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  display: 'block',
  textAlign: 'left',
}));

export const StyledInput = styled(InputBase)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-input': {
    borderRadius: 8,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.divider}`,
    fontSize: '0.9375rem',
    width: '100%',
    padding: '12px 16px',
    color: theme.palette.text.primary,
    transition: 'all 0.2s',
    '&:focus': {
      borderColor: theme.palette.text.primary,
    },
    '&::placeholder': {
      color: theme.palette.text.disabled,
      opacity: 1,
    },
  },
}));

export const SignInButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  width: '100%',
  padding: '12px 16px',
  backgroundColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
  color: theme.palette.mode === 'dark' ? '#000000' : '#FFFFFF',
  fontWeight: 600,
  fontSize: '0.9375rem',
  textTransform: 'none',
  borderRadius: 8,
  boxShadow: 'none',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#E4E4E7' : '#1F2937',
  },
  '&:disabled': {
    backgroundColor: theme.palette.divider,
    color: theme.palette.text.disabled,
  },
}));

export const DividerWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  margin: theme.spacing(4, 0),
  textAlign: 'center',
}));

export const DividerLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  width: '100%',
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: 0,
}));

export const DividerText = styled('span')(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  padding: '0 16px',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));

export const GoogleSocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '12px 16px',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  color: theme.palette.text.primary,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9375rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  transition: 'all 0.2s',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#F9FAFB',
    borderColor: theme.palette.text.primary,
  },
  '& .MuiButton-startIcon': {
    margin: 0,
  },
}));

export const FooterContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(3),
  flexWrap: 'wrap',
}));

export const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.8125rem',
  textDecoration: 'none',
  transition: 'color 0.2s',
  '&:hover': {
    color: theme.palette.text.primary,
  },
}));
