import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import {
  Google as GoogleIcon,
  MailOutline as MailIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUser } from '@/redux/auth/auth.slice';
import { AuthProviders } from '@/pages/Public/Login/types/Login.types';
import { UserUpdate } from '@/api/User/apiUser';
import { useAvatarUpload } from '@/hooks/useAvatarUpload.hook';
import { notify } from '@/utils';
import {
  Card,
  CardDescription,
  CardTitle,
  Divider,
  Pill,
} from '../Profile.styles';

const NAME_MAX_LENGTH = 80;

export const AccountSection = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, authProvider } = useAppSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const {
    fileInputRef,
    isUploadingImage,
    handleImageClick,
    handleFileChange,
    handleRemoveImage,
  } = useAvatarUpload();

  const isGoogle = authProvider === AuthProviders.google;
  const trimmedName = name.trim();
  const isDirty = trimmedName.length > 0 && trimmedName !== (user?.name || '');

  const handleSaveName = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id || !isDirty) return;
    setIsSaving(true);
    try {
      const updated = await UserUpdate(user.id, { name: trimmedName });
      dispatch(
        updateUser({
          name: typeof updated.name === 'string' ? updated.name : trimmedName,
        }),
      );
      notify.success({
        title: t('accountSettings.toast.title'),
        description: t('accountSettings.toast.desc'),
      });
    } catch {
      notify.error({
        title: t('profilePage.account.nameError'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Card>
        <CardTitle>{t('profilePage.account.photoTitle')}</CardTitle>
        <CardDescription>{t('profilePage.account.photoDesc')}</CardDescription>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mt: 2.5 }}>
          <Box sx={{ position: 'relative', width: 72, height: 72 }}>
            <Avatar
              src={user?.picture || undefined}
              alt={user?.name || ''}
              sx={{ width: 72, height: 72, fontSize: '1.75rem' }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            {isUploadingImage && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  bgcolor: 'rgba(0, 0, 0, 0.45)',
                }}
              >
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              </Box>
            )}
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              disabled={isUploadingImage}
              onClick={handleImageClick}
            >
              {t('profilePage.account.upload')}
            </Button>
            {user?.picture && (
              <Button
                size="small"
                color="error"
                disabled={isUploadingImage}
                onClick={handleRemoveImage}
              >
                {t('profilePage.account.remove')}
              </Button>
            )}
          </Box>
        </Box>
      </Card>

      <Card>
        <Box component="form" onSubmit={handleSaveName} noValidate>
          <CardTitle>
            <label htmlFor="profile-name">
              {t('profilePage.account.nameTitle')}
            </label>
          </CardTitle>
          <CardDescription>{t('profilePage.account.nameDesc')}</CardDescription>
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              mt: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <TextField
              id="profile-name"
              size="small"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              slotProps={{ htmlInput: { maxLength: NAME_MAX_LENGTH } }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!isDirty || isSaving}
              sx={{ flexShrink: 0, minWidth: 96 }}
            >
              {isSaving ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                t('common.save')
              )}
            </Button>
          </Box>
        </Box>
      </Card>

      <Card>
        <CardTitle>{t('accountSettings.emailAddress')}</CardTitle>
        <Typography sx={{ mt: 1, fontWeight: 500, wordBreak: 'break-all' }}>
          {user?.email || '—'}
        </Typography>
        <CardDescription>{t('accountSettings.emailManagedBy')}</CardDescription>

        <Divider />

        <CardTitle>{t('securitySettings.signInMethod')}</CardTitle>
        <Box sx={{ mt: 1 }}>
          <Pill>
            {isGoogle ? <GoogleIcon /> : <MailIcon />}
            {isGoogle
              ? t('securitySettings.google')
              : t('securitySettings.magicLink')}
          </Pill>
        </Box>
        <CardDescription>
          {isGoogle
            ? t('securitySettings.googleDesc')
            : t('securitySettings.magicLinkDesc')}
        </CardDescription>
      </Card>
    </>
  );
};
