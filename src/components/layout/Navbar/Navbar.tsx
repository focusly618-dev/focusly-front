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
  topStackSx,
  logoLinkSx,
  desktopNavStackSx,
  mobileNavStackSx,
  loginLinkSx,
  iconSx,
  themeToggleSx,
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
          sx={topStackSx}
        >
          <LogoWrapper component={NavLink} to="/" sx={logoLinkSx}>
            <LogoIconWrapper>
              <AutoAwesomeIcon sx={iconSx} />
            </LogoIconWrapper>
            <LogoText variant="h6">Focusly</LogoText>
          </LogoWrapper>

          <Stack direction="row" spacing={4} sx={desktopNavStackSx}>
            <NavbarLink component={NavLink} to="/features">
              {t('nav.features')}
            </NavbarLink>
            <NavbarLink component={NavLink} to="/how-it-works">
              {t('nav.howItWorks')}
            </NavbarLink>
            <NavbarLink component={NavLink} to="/pricing">
              {t('nav.pricing')}
            </NavbarLink>
            <NavbarLink component={NavLink} to="/login" sx={loginLinkSx}>
              {t('nav.logIn')}
            </NavbarLink>
            <LanguageSelector variant="icon" />
            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              sx={themeToggleSx}
            >
              {colorMode.mode !== 'light' ? (
                <LightModeIcon sx={iconSx} />
              ) : (
                <DarkModeIcon sx={iconSx} />
              )}
            </IconButton>
            <GetStartedButton variant="contained">
              {t('nav.getStarted')}
            </GetStartedButton>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={mobileNavStackSx}
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
