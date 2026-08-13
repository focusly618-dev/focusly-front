import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  useTheme,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateUser } from '@/redux/auth/auth.slice';
import { AuthProviders } from '@/pages/Public/Login/types/Login.types';
import { sileo } from '@/utils';
import {
  PersonOutline as PersonIcon,
  Google as GoogleIcon,
  MailOutline as MailIcon,
} from '@mui/icons-material';
import {
  SectionCard,
  SectionHeader,
  SectionTitle,
  Badge,
} from '../Settings.styles';

export const AccountSettings = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { user, authProvider } = useAppSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || '');

  const isGoogle = authProvider === AuthProviders.google;
  const trimmedName = name.trim();
  const isDirty = trimmedName.length > 0 && trimmedName !== (user?.name || '');

  const handleSave = () => {
    dispatch(updateUser({ name: trimmedName }));
    sileo.success({
      title: t('accountSettings.toast.title'),
      description: t('accountSettings.toast.desc'),
      fill: 'var(--sileo-success-bg)',
    });
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      fontSize: '0.9rem',
      backgroundColor: theme.palette.mode === 'dark' ? '#141417' : '#FFFFFF',
      '& fieldset': {
        borderColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(0, 0, 0, 0.06)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(99, 102, 241, 0.3)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6366F1',
      },
    },
    '& .MuiInputBase-input': {
      color: 'text.primary',
    },
  };

  return (
    <Box>
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <PersonIcon />
            </Box>
            <Typography>{t('accountSettings.identity.title')}</Typography>
          </SectionTitle>
        </SectionHeader>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            src={user?.picture || ''}
            alt={user?.name || 'User'}
            sx={{
              width: 72,
              height: 72,
              border: '2px solid rgba(99, 102, 241, 0.2)',
            }}
          />
          <Box>
            <Badge
              sx={{
                bgcolor: isGoogle
                  ? 'rgba(66, 133, 244, 0.08)'
                  : 'rgba(99, 102, 241, 0.08)',
                color: isGoogle ? '#4285F4' : '#6366F1',
              }}
            >
              {isGoogle ? (
                <GoogleIcon sx={{ fontSize: 12, mr: 0.5 }} />
              ) : (
                <MailIcon sx={{ fontSize: 12, mr: 0.5 }} />
              )}
              {isGoogle
                ? t('accountSettings.identity.googleAccount')
                : t('accountSettings.identity.magicLink')}
            </Badge>
            <Typography
              variant="caption"
              sx={{ display: 'block', color: 'text.secondary', mt: 1 }}
            >
              {t('accountSettings.identity.avatarSynced')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                display: 'block',
                mb: 1,
              }}
            >
              {t('accountSettings.displayName')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                size="small"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={inputStyles}
              />
              {isDirty && (
                <Button
                  variant="contained"
                  onClick={handleSave}
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
                  {t('common.save')}
                </Button>
              )}
            </Box>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                display: 'block',
                mb: 1,
              }}
            >
              {t('accountSettings.emailAddress')}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.95rem',
                fontWeight: 500,
                color: 'text.primary',
              }}
            >
              {user?.email || '—'}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.disabled', mt: 0.5, display: 'block' }}
            >
              {t('accountSettings.emailManagedBy')}
            </Typography>
          </Box>
        </Box>
      </SectionCard>
    </Box>
  );
};
