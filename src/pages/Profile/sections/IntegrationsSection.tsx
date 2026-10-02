import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import {
  CalendarMonth as CalendarIcon,
  SyncOutlined as SyncIcon,
  CheckCircle as ConnectedIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/auth/auth.slice';
import { AuthProviders } from '@/pages/Public/Login/types/Login.types';
import axios from '@/api/axiosInstance';
import { sileo } from '@/utils';
import {
  UserUpdate,
  type UserResponse,
  type UserSettings,
} from '@/api/User/apiUser';
import {
  Card,
  CardDescription,
  CardTitle,
  OptionIcon,
  Pill,
} from '../Profile.styles';

export const IntegrationsSection = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, authProvider } = useAppSelector((state) => state.auth);
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnected =
    authProvider === AuthProviders.google &&
    Boolean((user?.settings as UserSettings | undefined)?.calendarConnected);

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

        const currentSettings = (response.data.user.settings ?? {}) as Record<
          string,
          unknown
        >;
        const updatedUser = await UserUpdate(response.data.user.id, {
          settings: { ...currentSettings, calendarConnected: true },
        } as Partial<UserResponse>);

        dispatch(
          login({
            user: updatedUser,
            isLogged: true,
            provider: AuthProviders.google,
          }),
        );

        sileo.success({
          title: t('integrationsSettings.toast.connectedTitle'),
          description: t('integrationsSettings.toast.connectedDesc'),
          fill: 'var(--sileo-success-bg)',
        });
      } catch (error) {
        console.error('Error connecting Google Calendar:', error);
        sileo.error({
          title: t('integrationsSettings.toast.connectErrorTitle'),
          fill: 'var(--sileo-error-bg)',
        });
      } finally {
        setIsConnecting(false);
      }
    },
    onError: (error: unknown) => {
      console.error(error);
      sileo.error({
        title: t('integrationsSettings.toast.connectFailedTitle'),
        fill: 'var(--sileo-error-bg)',
      });
    },
  });

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <OptionIcon active={isConnected} sx={{ width: 40, height: 40 }}>
          <CalendarIcon />
        </OptionIcon>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <CardTitle>{t('integrationsSettings.googleCalendar')}</CardTitle>
            {isConnected && (
              <Pill>
                <ConnectedIcon />
                {t('common.connected')}
              </Pill>
            )}
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 0.5, color: 'text.primary', wordBreak: 'break-word' }}
          >
            {isConnected
              ? t('integrationsSettings.connectedAs', { email: user?.email })
              : t('integrationsSettings.notConnected')}
          </Typography>
          <CardDescription>
            {t('profilePage.integrations.googleDesc')}
          </CardDescription>
        </Box>
        <Button
          variant={isConnected ? 'outlined' : 'contained'}
          onClick={() => connectGoogle()}
          disabled={isConnecting}
          startIcon={
            isConnecting ? (
              <CircularProgress size={14} color="inherit" />
            ) : isConnected ? (
              <SyncIcon />
            ) : undefined
          }
          sx={{ flexShrink: 0 }}
        >
          {isConnected
            ? t('integrationsSettings.refreshPermissions')
            : t('integrationsSettings.connect')}
        </Button>
      </Box>
    </Card>
  );
};
