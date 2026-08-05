import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/auth/auth.slice';
import { AuthProviders } from '@/pages/Public/Login/types/Login.types';
import axios from '@/api/axiosInstance';
import { sileo } from '@/utils';
import {
  CalendarMonth as CalendarIcon,
  SyncOutlined as SyncIcon,
  CheckCircle as ConnectedIcon,
} from '@mui/icons-material';
import {
  SectionCard,
  SectionHeader,
  SectionTitle,
  Badge,
} from '../Settings.styles';

export const IntegrationsSettings = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { user, authProvider } = useAppSelector((state) => state.auth);
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnected = authProvider === AuthProviders.google;

  const connectGoogle = useGoogleLogin({
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/calendar',
    // @ts-expect-error: prompt is a valid Google OAuth parameter not included in UseGoogleLoginOptionsAuthCodeFlow types
    prompt: 'consent',
    onSuccess: async (codeResponse) => {
      setIsConnecting(true);
      try {
        const response = await axios.post('/auth/google', {
          code: codeResponse.code,
        });

        dispatch(
          login({
            user: response.data.user,
            isLogged: true,
            provider: AuthProviders.google,
          }),
        );

        sileo.success({
          title: 'Google Calendar connected',
          description: 'Your calendar and Meet access have been refreshed.',
          fill: 'var(--sileo-success-bg)',
        });
      } catch (error) {
        console.error('Error connecting Google Calendar:', error);
        sileo.error({
          title: 'Could not connect Google Calendar',
          fill: 'var(--sileo-error-bg)',
        });
      } finally {
        setIsConnecting(false);
      }
    },
    onError: (error: unknown) => {
      console.error(error);
      sileo.error({
        title: 'Google connection failed',
        fill: 'var(--sileo-error-bg)',
      });
    },
  });

  return (
    <Box>
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <CalendarIcon />
            </Box>
            <Typography>Connected Apps</Typography>
          </SectionTitle>
        </SectionHeader>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Manage the external accounts Focusly uses to sync your calendar and
          generate Meet links.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2.5,
            borderRadius: '16px',
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.015)'
                : 'rgba(0, 0, 0, 0.015)',
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(66, 133, 244, 0.08)',
                flexShrink: 0,
              }}
            >
              <CalendarIcon sx={{ color: '#4285F4' }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                Google Calendar & Meet
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
              >
                {isConnected ? `Connected as ${user?.email}` : 'Not connected'}
              </Typography>
            </Box>
          </Box>

          {isConnected ? (
            <Badge
              sx={{ bgcolor: 'rgba(34, 197, 94, 0.08)', color: '#22C55E' }}
            >
              <ConnectedIcon sx={{ fontSize: 12, mr: 0.5 }} />
              Connected
            </Badge>
          ) : (
            <Button
              variant="contained"
              onClick={() => connectGoogle()}
              disabled={isConnecting}
              sx={{
                bgcolor: '#6366F1',
                color: '#FFFFFF',
                borderRadius: '8px',
                px: 3,
                boxShadow: 'none',
                textTransform: 'none',
                fontWeight: 700,
                '&:hover': { bgcolor: '#4F46E5', boxShadow: 'none' },
              }}
            >
              {isConnecting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                'Connect'
              )}
            </Button>
          )}
        </Box>

        {isConnected && (
          <Button
            variant="outlined"
            onClick={() => connectGoogle()}
            disabled={isConnecting}
            startIcon={
              isConnecting ? <CircularProgress size={14} /> : <SyncIcon />
            }
            sx={{
              mt: 2.5,
              color: 'text.secondary',
              borderColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.08)',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '10px',
              '&:hover': {
                borderColor: '#6366F1',
                bgcolor: 'rgba(99, 102, 241, 0.05)',
              },
            }}
          >
            Refresh permissions
          </Button>
        )}
      </SectionCard>
    </Box>
  );
};
