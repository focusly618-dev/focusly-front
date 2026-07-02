import React, { useContext } from 'react';
import { Container, Stack, IconButton } from '@mui/material';
import {
  Menu as MenuIcon,
  AutoAwesome as AutoAwesomeIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { ColorModeContext } from '@/context';
import {
  Header,
  LogoWrapper,
  LogoIconWrapper,
  LogoText,
  NavbarLink,
  GetStartedButton,
  MobileMenuButton,
} from './Navbar.styles';

const Navbar: React.FC = () => {
  const colorMode = useContext(ColorModeContext);

  return (
    <Header position="sticky">
      <Container maxWidth="lg">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ height: 64 }}
        >
          <LogoWrapper
            component={NavLink}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            <LogoIconWrapper>
              <AutoAwesomeIcon sx={{ fontSize: 20 }} />
            </LogoIconWrapper>
            <LogoText variant="h6">Focusly</LogoText>
          </LogoWrapper>

          <Stack
            direction="row"
            spacing={4}
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          >
            <NavbarLink component={NavLink} to="/how-it-works">
              How it works
            </NavbarLink>
            <NavbarLink component={NavLink} to="/pricing">
              Pricing
            </NavbarLink>
            <NavbarLink component={NavLink} to="/about">
              About
            </NavbarLink>
            <NavbarLink
              component={NavLink}
              to="/login"
              sx={{
                color: 'text.primary',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                ml: 2,
              }}
            >
              Log In
            </NavbarLink>
            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              sx={{ mx: 1 }}
            >
              {colorMode.mode === 'dark' ? (
                <LightModeIcon sx={{ fontSize: 20 }} />
              ) : (
                <DarkModeIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
            <GetStartedButton variant="contained">Get Started</GetStartedButton>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { md: 'none' } }}
            alignItems="center"
          >
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {colorMode.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <MobileMenuButton>
              <MenuIcon />
            </MobileMenuButton>
          </Stack>
        </Stack>
      </Container>
    </Header>
  );
};

export default Navbar;
