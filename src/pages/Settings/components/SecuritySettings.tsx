import { Box, Typography, Button, alpha, useTheme } from '@mui/material';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/auth/auth.slice';
import { useNavigate } from 'react-router-dom';
import {
  Logout as LogoutIcon,
  ShieldOutlined as SecurityIcon,
} from '@mui/icons-material';
import { SectionCard, SectionHeader, SectionTitle } from '../Settings.styles';

export const SecuritySettings = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
    </Box>
  );
};
