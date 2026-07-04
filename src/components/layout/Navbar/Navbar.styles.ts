import {
  styled,
  AppBar,
  Box,
  Link,
  Typography,
  Stack,
  Toolbar,
  Button,
  IconButton,
} from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';

export const Header = styled(AppBar)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(15, 15, 16, 0.75)'
      : 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: 'none',
  color: theme.palette.text.primary,
}));

export const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

export const LogoWrapper = styled(Box)<{
  component?: React.ElementType;
  to?: string;
}>({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  gap: 12,
});

export const LogoIconWrapper = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: 8,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(96, 165, 250, 0.15)'
      : 'rgba(59, 130, 246, 0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

export const LogoIcon = styled(AutoAwesomeIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: 20,
}));

export const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '-0.02em',
  transition: 'color 0.2s',
  '.active &': {
    color: theme.palette.primary.main,
  },
}));

export const NavStack = styled(Stack)(({ theme }) => ({
  display: 'none',
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

export const NavbarLink = styled(Link)<{
  component?: React.ElementType;
  to?: string;
  href?: string;
}>(({ theme }) => ({
  fontSize: '0.9375rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  transition: 'color 0.2s, transform 0.15s',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.text.primary,
    transform: 'translateY(-0.5px)',
  },
  '&.active': {
    color: theme.palette.text.primary,
    fontWeight: 600,
  },
}));

export const GetStartedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.mode === 'dark' ? '#0F0F10' : '#ffffff',
  padding: '8px 18px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9375rem',
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#93C5FD' : '#2563EB',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 4px 20px rgba(96, 165, 250, 0.2)'
        : '0 4px 20px rgba(59, 130, 246, 0.2)',
    transform: 'translateY(-1px)',
  },
}));

export const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: 'flex',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

export const NavLoginButton = styled(Button)({
  fontWeight: 500,
  color: 'inherit',
});
