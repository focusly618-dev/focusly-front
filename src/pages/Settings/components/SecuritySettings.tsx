import { useTranslation } from 'react-i18next';
import { Box, Typography, Button, alpha, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/auth/auth.slice';
import { useNavigate } from 'react-router-dom';
import { AuthProviders } from '@/pages/Public/Login/types/Login.types';
import { sileo } from '@/utils';
import {
  Logout as LogoutIcon,
  ShieldOutlined as SecurityIcon,
  Google as GoogleIcon,
  MailOutline as MailIcon,
  DeleteForeverOutlined as DeleteIcon,
} from '@mui/icons-material';
import {
  SectionCard,
  SectionHeader,
  SectionTitle,
  Badge,
} from '../Settings.styles';

export const SecuritySettings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { authProvider } = useAppSelector((state) => state.auth);
  const isGoogle = authProvider === AuthProviders.google;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleDeleteAccountRequest = () => {
    sileo.info({
      title: t('securitySettings.toast.title'),
      description: t('securitySettings.toast.desc'),
      fill: 'var(--sileo-info-bg)',
    });
  };

  return (
    <Box>
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <SecurityIcon />
            </Box>
            <Typography>{t('securitySettings.sessionTitle')}</Typography>
          </SectionTitle>
        </SectionHeader>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {t('securitySettings.sessionDesc')}
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
          <Box>
            <Typography
              sx={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              {t('securitySettings.activeSession')}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
            >
              {t('securitySettings.signedInBrowser')}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              color: '#EF4444',
              borderColor: alpha('#EF4444', 0.25),
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '10px',
              px: 3,
              '&:hover': {
                borderColor: '#EF4444',
                bgcolor: alpha('#EF4444', 0.05),
              },
            }}
          >
            {t('securitySettings.signOut')}
          </Button>
        </Box>
      </SectionCard>

      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              {isGoogle ? <GoogleIcon /> : <MailIcon />}
            </Box>
            <Typography>{t('securitySettings.signInMethod')}</Typography>
          </SectionTitle>
        </SectionHeader>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge
            sx={{
              bgcolor: isGoogle
                ? 'rgba(66, 133, 244, 0.08)'
                : 'rgba(99, 102, 241, 0.08)',
              color: isGoogle ? '#4285F4' : '#6366F1',
            }}
          >
            {isGoogle
              ? t('securitySettings.google')
              : t('securitySettings.magicLink')}
          </Badge>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {isGoogle
              ? t('securitySettings.googleDesc')
              : t('securitySettings.magicLinkDesc')}
          </Typography>
        </Box>
      </SectionCard>

      <SectionCard sx={{ border: `1px solid ${alpha('#EF4444', 0.15)}` }}>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper" sx={{ color: '#EF4444' }}>
              <DeleteIcon />
            </Box>
            <Typography>{t('securitySettings.dangerZone')}</Typography>
          </SectionTitle>
        </SectionHeader>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2.5,
            borderRadius: '16px',
            bgcolor: alpha('#EF4444', 0.03),
            border: `1px solid ${alpha('#EF4444', 0.1)}`,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              {t('securitySettings.deleteAccount')}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
            >
              {t('securitySettings.deleteAccountDesc')}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleDeleteAccountRequest}
            startIcon={<DeleteIcon />}
            sx={{
              color: '#EF4444',
              borderColor: alpha('#EF4444', 0.25),
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '10px',
              px: 3,
              '&:hover': {
                borderColor: '#EF4444',
                bgcolor: alpha('#EF4444', 0.05),
              },
            }}
          >
            {t('securitySettings.deleteAccount')}
          </Button>
        </Box>
      </SectionCard>
    </Box>
  );
};
