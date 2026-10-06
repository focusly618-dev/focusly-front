import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Link, Stack } from '@mui/material';
import {
  Logout as LogoutIcon,
  DeleteForeverOutlined as DeleteIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/auth/auth.slice';
import { UserDelete } from '@/api/User/apiUser';
import { ModalDelete } from '@/components/modals';
import { notify } from '@/utils';
import { Card, CardDescription, DangerCard, Divider } from '../Profile.styles';
import { SettingRow } from '../components/SettingRow';

const formatDate = (value: unknown, locale: string) => {
  if (typeof value !== 'string') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
};

export const PrivacySection = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const acceptedOn = formatDate(user?.termsAcceptedAt, i18n.language);
  const acceptedVersion =
    typeof user?.termsVersion === 'string' ? user.termsVersion : null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    setIsDeleting(true);
    try {
      await UserDelete(user.id);
      setIsDeleteOpen(false);
      // The account no longer exists: a new sign-up with the same email starts fresh.
      localStorage.removeItem('onboardingCompleted');
      await dispatch(logout());
      navigate('/');
      notify.success({
        title: t('securitySettings.deleteConfirm.success'),
      });
    } catch {
      notify.error({
        title: t('securitySettings.deleteConfirm.error'),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const legalLinks = [
    { href: '/terms', label: t('legal.termsTitle') },
    { href: '/privacy', label: t('legal.privacyTitle') },
  ];

  return (
    <>
      <Card>
        <SettingRow
          title={t('securitySettings.activeSession')}
          description={t('profilePage.privacy.sessionDesc')}
          control={() => (
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              {t('profilePage.logout')}
            </Button>
          )}
        />
      </Card>

      <Card>
        <SettingRow
          title={t('legal.settingsTitle')}
          description={t('legal.settingsDesc')}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 3 }}
            sx={{ mt: 1.5 }}
          >
            {legalLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {label}
                <OpenInNewIcon sx={{ fontSize: 16 }} />
              </Link>
            ))}
          </Stack>
          {acceptedOn && (
            <>
              <Divider />
              <CardDescription>
                {acceptedVersion
                  ? t('profilePage.privacy.termsAccepted', {
                      date: acceptedOn,
                      version: acceptedVersion,
                    })
                  : t('profilePage.privacy.termsAcceptedNoVersion', {
                      date: acceptedOn,
                    })}
              </CardDescription>
            </>
          )}
        </SettingRow>
      </Card>

      <DangerCard>
        <SettingRow
          title={t('securitySettings.deleteAccount')}
          description={t('profilePage.privacy.deleteDesc')}
        >
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => setIsDeleteOpen(true)}
            >
              {t('securitySettings.deleteAccount')}
            </Button>
          </Box>
        </SettingRow>
      </DangerCard>

      <ModalDelete
        open={isDeleteOpen}
        onClose={() => !isDeleting && setIsDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
        title={t('securitySettings.deleteConfirm.title')}
        subtitle={t('securitySettings.deleteConfirm.subtitle')}
        description={t('securitySettings.deleteConfirm.desc')}
        confirmLabel={t('securitySettings.deleteConfirm.confirm')}
        cancelLabel={t('securitySettings.deleteConfirm.cancel')}
      />
    </>
  );
};
