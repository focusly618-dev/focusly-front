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
      title: 'Account deletion',
      description:
        'Self-serve deletion is not available yet. Contact our support team to permanently delete your account and data.',
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
            <Typography>Account & Session</Typography>
          </SectionTitle>
        </SectionHeader>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Manage your active login session for this workspace. To switch
          accounts or sign out, use the option below.
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
              Active Session
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
            >
              Signed in on this browser.
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
            Sign out of Focusly
          </Button>
        </Box>
      </SectionCard>

      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              {isGoogle ? <GoogleIcon /> : <MailIcon />}
            </Box>
            <Typography>Sign-in Method</Typography>
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
            {isGoogle ? 'Google' : 'Magic Link'}
          </Badge>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {isGoogle
              ? 'You sign in with your Google account. There is no separate Focusly password to manage.'
              : 'You sign in with a passwordless magic link sent to your email.'}
          </Typography>
        </Box>
      </SectionCard>

      <SectionCard sx={{ border: `1px solid ${alpha('#EF4444', 0.15)}` }}>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper" sx={{ color: '#EF4444' }}>
              <DeleteIcon />
            </Box>
            <Typography>Danger Zone</Typography>
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
              Delete Account
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
            >
              Permanently remove your account and all of your data.
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
            Delete Account
          </Button>
        </Box>
      </SectionCard>
    </Box>
  );
};
