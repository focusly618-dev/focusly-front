import React, { useEffect, useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  Link,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { ColorModeContext } from '@/context';
import { brand, byMode, emerald, slate } from '@/styles/mui';
import { useLogin } from './Login.hook';

// Dark surfaces of the login screen.
const dark = {
  card: '#18191e',
  border: '#25272e',
  borderHover: '#2e3037',
  input: '#14151a',
  inputHover: '#17181f',
  tabs: '#121316',
  tabSelected: '#22242c',
  hover: '#1e2025',
  text: '#F3F4F6',
  muted: '#8A8F98',
  placeholder: '#6B7280',
} as const;

const mutedText = byMode(slate[500], dark.muted);
const strongText = byMode(slate[900], dark.text);
const accent = byMode(brand.main, brand.dark);

const labelSx = {
  display: 'block',
  mb: 0.75,
  fontSize: '12px',
  fontWeight: 600,
  color: byMode(slate[700], dark.text),
} as const;

const inputSx = {
  width: '100%',
  px: 1.5,
  py: 1.25,
  fontSize: '14px',
  borderRadius: '12px',
  border: '1px solid',
  borderColor: byMode(slate[200], dark.border),
  bgcolor: byMode(slate[50], dark.input),
  color: byMode(slate[900], dark.text),
  transition: 'all 0.15s ease',
  '&:hover': { bgcolor: byMode(slate[50], dark.inputHover) },
  '&.Mui-focused': {
    borderColor: accent,
    boxShadow: byMode(`0 0 0 2px ${brand.main}4d`, `0 0 0 2px ${brand.dark}4d`),
  },
  '& input': { p: 0 },
  '& input::placeholder': {
    color: byMode(slate[400], dark.placeholder),
    opacity: 1,
  },
} as const;

const inputIconSx = {
  fontSize: 18,
  color: byMode(slate[400], dark.muted),
} as const;

const secondaryButtonSx = {
  textTransform: 'none',
  fontWeight: 500,
  border: '1px solid',
  borderColor: byMode(slate[200], dark.border),
  bgcolor: byMode('#ffffff', dark.input),
  color: byMode(slate[700], dark.text),
  transition: 'all 0.15s ease',
  '&:hover': {
    bgcolor: byMode(slate[50], dark.hover),
    borderColor: byMode(slate[200], dark.borderHover),
  },
} as const;

const footerLinkSx = {
  fontSize: '12px',
  color: mutedText,
  textDecoration: 'none',
  transition: 'color 0.15s ease',
  '&:hover': { color: byMode(slate[800], dark.text) },
} as const;

const legalLinkSx = {
  color: accent,
  fontWeight: 600,
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
} as const;

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true">
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.683 5.482 18 9 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.579c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.463.894 11.426 0 9 0 5.482 0 2.438 2.317.957 5.27l3.007 2.332C4.672 5.163 6.656 3.579 9 3.579z"
      fill="#EA4335"
    />
  </svg>
);

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const colorMode = useContext(ColorModeContext);
  const {
    loginGoogle,
    isLoading,
    email,
    fullName,
    isRegistering,
    handleEmailChange,
    handleFullNameChange,
    onSignIn,
    linkSent,
    setLinkSent,
    completeMagicLinkSignIn,
    toggleRegister,
  } = useLogin();

  useEffect(() => {
    // Check if returning from email magic link
    void completeMagicLinkSignIn();
  }, [completeMagicLinkSignIn]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSignIn();
    }
  };

  const handleTabChange = (_e: React.MouseEvent, tab: string | null) => {
    if (!tab) return;
    const isSignupTab = tab === 'signup';
    if ((isSignupTab && !isRegistering) || (!isSignupTab && isRegistering)) {
      toggleRegister();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
        transition: 'background 0.3s ease',
        background: byMode(
          `linear-gradient(to bottom right, ${slate[50]}, ${slate[100]}, ${emerald[50]}33)`,
          'linear-gradient(to bottom right, #0b0f14, #111215, #0f1715)',
        ),
      }}
    >
      {/* Ambient background glows */}
      <Box
        sx={{
          position: 'absolute',
          top: -160,
          left: -160,
          width: 384,
          height: 384,
          borderRadius: '50%',
          bgcolor: `${emerald[500]}1a`,
          filter: 'blur(64px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -160,
          right: -160,
          width: 384,
          height: 384,
          borderRadius: '50%',
          bgcolor: byMode('rgba(20, 184, 166, 0.1)', `${brand.main}26`),
          filter: 'blur(64px)',
          pointerEvents: 'none',
        }}
      />

      {/* Theme Toggle Button Top Right */}
      <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 20 }}>
        <IconButton
          aria-label={t('login.toggleTheme')}
          onClick={colorMode.toggleColorMode}
          sx={{
            p: 1,
            border: '1px solid',
            borderColor: byMode(slate[200], dark.border),
            bgcolor: byMode('rgba(255, 255, 255, 0.8)', `${dark.card}e6`),
            backdropFilter: 'blur(12px)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'background-color 0.15s ease',
            '&:hover': {
              bgcolor: byMode('rgba(255, 255, 255, 0.9)', dark.tabSelected),
            },
          }}
        >
          {colorMode.mode !== 'light' ? (
            <LightModeIcon sx={{ fontSize: 18, color: '#fbbf24' }} />
          ) : (
            <DarkModeIcon sx={{ fontSize: 18, color: slate[700] }} />
          )}
        </IconButton>
      </Box>

      {/* Header Logo */}
      <Box
        sx={{
          pt: 4,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <Box
          component={NavLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            '&:hover .login-logo-mark': { transform: 'scale(1.05)' },
          }}
        >
          <Box
            className="login-logo-mark"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: `linear-gradient(to top right, ${brand.main}, ${emerald[600]})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '20px',
              boxShadow: `0 10px 15px -3px ${brand.main}40`,
              transition: 'transform 0.2s ease',
            }}
          >
            F
          </Box>
          <Typography
            component="span"
            sx={{
              fontWeight: 800,
              fontSize: '24px',
              letterSpacing: '-0.025em',
              color: strongText,
            }}
          >
            Focusly
          </Typography>
        </Box>
      </Box>

      {/* Main Card */}
      <Box sx={{ width: '100%', maxWidth: 448, my: 'auto', zIndex: 10, py: 2 }}>
        <Card
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: byMode(`${slate[200]}cc`, dark.border),
            bgcolor: byMode('rgba(255, 255, 255, 0.95)', `${dark.card}f2`),
            backdropFilter: 'blur(24px)',
            boxShadow: byMode(
              '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              '0 20px 60px -15px rgba(0, 0, 0, 0.5)',
            ),
          }}
        >
          {linkSent ? (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  bgcolor: byMode(emerald[50], `${brand.dark}26`),
                  color: byMode(emerald[600], brand.dark),
                  boxShadow: byMode(
                    `0 0 0 8px ${emerald[50]}80`,
                    `0 0 0 8px ${brand.dark}1a`,
                  ),
                }}
              >
                <EmailIcon sx={{ fontSize: 30 }} />
              </Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: '24px',
                  fontWeight: 700,
                  mb: 1,
                  color: strongText,
                }}
              >
                {t('login.checkEmail.title')}
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  lineHeight: 1.625,
                  mb: 3,
                  color: mutedText,
                }}
              >
                {t('login.checkEmail.desc')} <br />
                <Box
                  component="strong"
                  sx={{ fontWeight: 600, color: byMode(slate[800], dark.text) }}
                >
                  {email}
                </Box>
                .
                <br />
                {t('login.checkEmail.instructions')}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setLinkSent(false)}
                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                sx={{ ...secondaryButtonSx, borderRadius: '10px', px: 2 }}
              >
                {t('login.checkEmail.back')}
              </Button>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  px: 4,
                  pt: 4,
                  pb: 1,
                  gap: 2,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    component="h1"
                    sx={{
                      fontSize: '24px',
                      fontWeight: 800,
                      letterSpacing: '-0.025em',
                      mb: 0.5,
                      color: strongText,
                    }}
                  >
                    {isRegistering
                      ? t('login.signUpTitle')
                      : t('login.signInTitle')}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '12px', sm: '14px' },
                      color: mutedText,
                    }}
                  >
                    {t('login.subtitle')}
                  </Typography>
                </Box>

                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  value={isRegistering ? 'signup' : 'signin'}
                  onChange={handleTabChange}
                  sx={{
                    p: 0.5,
                    gap: 0.5,
                    borderRadius: '12px',
                    bgcolor: byMode(slate[100], dark.tabs),
                    border: byMode('none', `1px solid ${dark.border}cc`),
                  }}
                >
                  {(['signin', 'signup'] as const).map((tab) => (
                    <ToggleButton
                      key={tab}
                      value={tab}
                      disableRipple
                      sx={{
                        flex: 1,
                        py: 1,
                        border: '1px solid transparent',
                        borderRadius: '8px !important',
                        fontSize: '14px',
                        fontWeight: 600,
                        textTransform: 'none',
                        color: byMode(slate[600], dark.muted),
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: byMode(slate[600], dark.text),
                        },
                        '&.Mui-selected, &.Mui-selected:hover': {
                          bgcolor: byMode('#ffffff', dark.tabSelected),
                          borderColor: byMode('transparent', dark.borderHover),
                          color: accent,
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        },
                      }}
                    >
                      {tab === 'signin'
                        ? t('login.tabs.signIn')
                        : t('login.tabs.signUp')}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              <Box
                sx={{
                  px: 4,
                  py: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  disabled={isLoading}
                  onClick={() => loginGoogle()}
                  startIcon={<GoogleLogo />}
                  sx={{
                    ...secondaryButtonSx,
                    py: 1.5,
                    borderRadius: '12px',
                    gap: 0.5,
                  }}
                >
                  {t('login.continueWithGoogle')}
                </Button>

                <Divider
                  sx={{
                    my: 0.5,
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: byMode(slate[400], dark.muted),
                    '&::before, &::after': {
                      borderColor: byMode(slate[200], dark.border),
                    },
                  }}
                >
                  {t('login.orWithEmail')}
                </Divider>

                <Box
                  component="form"
                  onSubmit={(e: React.FormEvent) => {
                    e.preventDefault();
                    onSignIn();
                  }}
                  onKeyDown={handleKeyDown}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  {isRegistering && (
                    <Box>
                      <Typography
                        component="label"
                        htmlFor="login-full-name"
                        sx={labelSx}
                      >
                        {t('login.fullName')}
                      </Typography>
                      <InputBase
                        id="login-full-name"
                        placeholder={t('login.fullNamePlaceholder')}
                        disabled={isLoading}
                        value={fullName}
                        onChange={handleFullNameChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <PersonIcon sx={inputIconSx} />
                          </InputAdornment>
                        }
                        sx={inputSx}
                      />
                    </Box>
                  )}

                  <Box>
                    <Typography
                      component="label"
                      htmlFor="login-email"
                      sx={labelSx}
                    >
                      {t('login.email')}
                    </Typography>
                    <InputBase
                      id="login-email"
                      placeholder={t('login.emailPlaceholder')}
                      type="email"
                      disabled={isLoading}
                      value={email}
                      onChange={handleEmailChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <EmailIcon sx={inputIconSx} />
                        </InputAdornment>
                      }
                      sx={inputSx}
                    />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disableElevation
                    disabled={isLoading}
                    sx={{
                      mt: 1,
                      py: 1.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#ffffff',
                      bgcolor: accent,
                      boxShadow: byMode(
                        `0 4px 6px -1px ${brand.main}33`,
                        `0 4px 6px -1px ${brand.dark}40`,
                      ),
                      '&:hover': { bgcolor: byMode(brand.hover, emerald[600]) },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : isRegistering ? (
                      t('login.createAccount')
                    ) : (
                      t('login.signIn')
                    )}
                  </Button>
                </Box>

                {/* Signing in creates the account, so acceptance is stated up front */}
                <Typography
                  sx={{
                    fontSize: '12px',
                    lineHeight: 1.625,
                    textAlign: 'center',
                    color: mutedText,
                  }}
                >
                  <Trans
                    i18nKey="legal.loginNotice"
                    components={{
                      terms: (
                        <Link
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={legalLinkSx}
                        />
                      ),
                      privacy: (
                        <Link
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={legalLinkSx}
                        />
                      ),
                    }}
                  />
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 4,
                  pb: 4,
                  pt: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    fontSize: '12px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    color: mutedText,
                  }}
                >
                  <span>
                    {isRegistering
                      ? t('login.hasAccount')
                      : t('login.noAccount')}
                  </span>
                  <ButtonBase
                    onClick={toggleRegister}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: accent,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {isRegistering
                      ? t('login.signInHere')
                      : t('login.signUpHere')}
                  </ButtonBase>
                </Typography>
              </Box>
            </>
          )}
        </Card>
      </Box>

      {/* Footer Links */}
      <Box
        sx={{
          pb: 3,
          zIndex: 10,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          fontSize: '12px',
          color: mutedText,
        }}
      >
        <Link href="/terms" sx={footerLinkSx}>
          {t('login.termsOfService')}
        </Link>
        <Link href="/privacy" sx={footerLinkSx}>
          {t('login.privacyPolicy')}
        </Link>
        <Link href="#" sx={footerLinkSx}>
          {t('login.helpCenter')}
        </Link>
        <Box
          component="span"
          sx={{ color: byMode(slate[400], dark.placeholder) }}
        >
          {t('login.copyright')}
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
