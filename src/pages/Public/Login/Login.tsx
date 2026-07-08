import React, { useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Link,
  Button,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { ColorModeContext } from '@/context';
import {
  PageWrapper,
  LogoWrapper,
  LogoBox,
  LoginCard,
  LoginHeader,
  FormLabel,
  StyledInput,
  SignInButton,
  DividerWrapper,
  DividerLine,
  DividerText,
  GoogleSocialButton,
  FooterContainer,
  FooterLink,
} from './Login.styles';
import { useLogin } from './Login.hook';

export const Login: React.FC = () => {
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

  return (
    <PageWrapper>
      {/* Absolute top right theme toggle */}
      <IconButton
        onClick={colorMode.toggleColorMode}
        color="inherit"
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          width: 40,
          height: 40,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {colorMode.mode === 'dark' ? (
          <LightModeIcon sx={{ fontSize: 18 }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: 18 }} />
        )}
      </IconButton>

      {/* Center Logo */}
      <LogoWrapper
        component={NavLink}
        to="/"
        sx={{ textDecoration: 'none', color: 'inherit' }}
      >
        <LogoBox>F</LogoBox>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
          }}
        >
          Focusly
        </Typography>
      </LogoWrapper>

      <LoginCard elevation={0}>
        {linkSent ? (
          <Box textAlign="center" py={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'rgba(59, 130, 246, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: 'primary.main',
              }}
            >
              <EmailIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography
              variant="h5"
              fontWeight="700"
              color="text.primary"
              gutterBottom
            >
              Check your email
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={3}
              sx={{ lineHeight: 1.5 }}
            >
              We've sent a link to <strong>{email}</strong>. <br />
              Click the link to sign in instantly.
            </Typography>
            <Button
              variant="text"
              onClick={() => setLinkSent(false)}
              sx={{
                color: 'primary.main',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Back to sign in
            </Button>
          </Box>
        ) : (
          <Box>
            <LoginHeader>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.875rem',
                  mb: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {isRegistering ? 'Create account' : 'Welcome back'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your details to access your workspace.
              </Typography>
            </LoginHeader>

            {/* Google Social Button at the top */}
            <GoogleSocialButton
              type="button"
              onClick={() => loginGoogle()}
              disabled={isLoading}
              startIcon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  style={{ marginRight: 6 }}
                >
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
              }
            >
              Google
            </GoogleSocialButton>

            <DividerWrapper>
              <DividerLine />
              <DividerText>Or continue with email</DividerText>
            </DividerWrapper>

            {/* Email form */}
            <Box component="form" onKeyDown={handleKeyDown}>
              {isRegistering && (
                <Box mb={2}>
                  <FormLabel>Full Name</FormLabel>
                  <StyledInput
                    fullWidth
                    placeholder="John Doe"
                    name="fullName"
                    type="text"
                    disabled={isLoading}
                    value={fullName}
                    onChange={handleFullNameChange}
                  />
                </Box>
              )}

              <Box mb={2}>
                <FormLabel>Email Address</FormLabel>
                <StyledInput
                  fullWidth
                  placeholder="name@company.com"
                  name="email"
                  type="email"
                  disabled={isLoading}
                  autoComplete="username"
                  value={email}
                  onChange={handleEmailChange}
                />
              </Box>

              <SignInButton
                variant="contained"
                disableElevation
                onClick={onSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isRegistering ? (
                  'Sign Up'
                ) : (
                  'Sign In'
                )}
              </SignInButton>
            </Box>

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {isRegistering
                  ? 'Already have an account? '
                  : "Don't have an account? "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={toggleRegister}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: 'none',
                    bgcolor: 'transparent',
                    cursor: 'pointer',
                    p: 0,
                  }}
                >
                  {isRegistering ? 'Sign in instead' : 'Sign up for free'}
                </Link>
              </Typography>
            </Box>
          </Box>
        )}
      </LoginCard>

      {/* Footer */}
      <FooterContainer>
        <FooterLink href="#">Terms of Service</FooterLink>
        <FooterLink href="#">Privacy Policy</FooterLink>
        <FooterLink href="#">Help Center</FooterLink>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}
        >
          © 2024 Focusly
        </Typography>
      </FooterContainer>
    </PageWrapper>
  );
};

export default Login;
