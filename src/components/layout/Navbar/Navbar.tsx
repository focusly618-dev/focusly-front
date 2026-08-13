import React, { useContext } from 'react';
import { Container, Stack, IconButton } from '@mui/material';
import {
  Menu as MenuIcon,
  AutoAwesome as AutoAwesomeIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ColorModeContext } from '@/context';
import { LanguageSelector } from '@/components/ui';
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
  const { t } = useTranslation();
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
            <NavbarLink component={NavLink} to="/features">
              {t('nav.features')}
            </NavbarLink>
            <NavbarLink component={NavLink} to="/how-it-works">
              {t('nav.howItWorks')}
            </NavbarLink>
            <NavbarLink component={NavLink} to="/pricing">
              {t('nav.pricing')}
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
              {t('nav.logIn')}
            </NavbarLink>
            <LanguageSelector variant="icon" />
            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              sx={{ mx: 0.5 }}
            >
              {colorMode.mode !== 'light' ? (
                <LightModeIcon sx={{ fontSize: 20 }} />
              ) : (
                <DarkModeIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
            <GetStartedButton variant="contained">
              {t('nav.getStarted')}
            </GetStartedButton>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { md: 'none' } }}
            alignItems="center"
          >
            <LanguageSelector variant="icon" />
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {colorMode.mode !== 'light' ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
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
