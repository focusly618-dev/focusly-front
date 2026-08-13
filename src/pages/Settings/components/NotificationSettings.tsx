import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@/redux/store';
import { updateUser } from '@/redux/auth/auth.slice';
import { useNotificationSounds } from '@/hooks/useNotificationSounds';
import { soundPlayer, type SoundType } from '@/utils';
import { Box, Switch, Typography, Stack } from '@mui/material';
import {
  CampaignOutlined as CampaignIcon,
  TimerOutlined as TimerIcon,
  PlayArrow as PlayArrowIcon,
  Coffee as CoffeeIcon,
  Check as CheckIcon,
  VolumeUp as VolumeUpIcon,
  NotificationsActiveOutlined as NotificationsActiveIcon,
  NotificationsNoneOutlined as InAppIcon,
  EmailOutlined as EmailIcon,
  MessageOutlined as PushIcon,
} from '@mui/icons-material';
import {
  SectionCard,
  SectionHeader,
  SectionTitle,
  SoundGrid,
  SoundCard,
  SoundCardHeader,
  SoundCardIcon,
  SoundCardTitle,
  AlertCardGrid,
  AlertCardItem,
  AlertCardIconBox,
  SoundPreviewButton,
  Badge,
} from '../Settings.styles';

type AlertType = 'sessionStart' | 'breakReminder' | 'sessionEnd';

export const NotificationSettings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { playSound } = useNotificationSounds(0.5);

  // Preferred notification sound from localStorage
  const [preferredSound, setPreferredSound] = useState<SoundType>(
    soundPlayer.getPreferredSound(),
  );

  // User push preferences
  const savedPreference = user?.pushEnabled !== false;
  const [pushEnabled, setPushEnabled] = useState(
    Notification.permission === 'granted' && savedPreference,
  );
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission>(Notification.permission);

  const [activeAlerts, setActiveAlerts] = useState<Record<AlertType, boolean>>({
    sessionStart: true,
    breakReminder: true,
    sessionEnd: true,
  });

  const toggleAlert = (alertType: AlertType) => {
    setActiveAlerts((prev) => ({
      ...prev,
      [alertType]: !prev[alertType],
    }));
  };

  const handlePreferredSoundChange = (type: SoundType) => {
    setPreferredSound(type);
    soundPlayer.setPreferredSound(type);
    playSound(type);
  };

  const handlePushToggle = async () => {
    if (permissionStatus === 'denied') {
      alert(t('notificationSettings.pushBlockedAlert'));
      return;
    }

    if (!pushEnabled) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === 'granted') {
        setPushEnabled(true);
        dispatch(updateUser({ pushEnabled: true }));
      }
    } else {
      setPushEnabled(false);
      dispatch(updateUser({ pushEnabled: false }));
    }
  };

  const switchStyles = {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#6366F1',
      '&:hover': {
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#6366F1',
    },
  };

  return (
    <Box>
      {/* Delivery Channels */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <CampaignIcon />
            </Box>
            <Typography>{t('notificationSettings.channels.title')}</Typography>
          </SectionTitle>
        </SectionHeader>

        <Stack spacing={2.5}>
          {/* In-App */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <InAppIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.925rem',
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  {t('notificationSettings.channels.inApp.title')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
                >
                  {t('notificationSettings.channels.inApp.desc')}
                </Typography>
              </Box>
            </Box>
            <Switch defaultChecked sx={switchStyles} />
          </Box>

          {/* Email summaries */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <EmailIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.925rem',
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  {t('notificationSettings.channels.email.title')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
                >
                  {t('notificationSettings.channels.email.desc', {
                    email: user?.email || 'alex@email.com',
                  })}
                </Typography>
              </Box>
            </Box>
            <Switch defaultChecked sx={switchStyles} />
          </Box>

          {/* Desktop Push */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <PushIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.925rem',
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  {t('notificationSettings.channels.push.title')}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
                >
                  {t('notificationSettings.channels.push.desc')}
                </Typography>
                {permissionStatus === 'denied' && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: 'block', mt: 0.5, fontWeight: 700 }}
                  >
                    {t('notificationSettings.channels.push.blocked')}
                  </Typography>
                )}
              </Box>
            </Box>
            <Switch
              checked={pushEnabled}
              onChange={handlePushToggle}
              sx={switchStyles}
            />
          </Box>
        </Stack>
      </SectionCard>

      {/* Sound Selection Card */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <NotificationsActiveIcon />
            </Box>
            <Typography>{t('notificationSettings.sound.title')}</Typography>
          </SectionTitle>
        </SectionHeader>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {t('notificationSettings.sound.desc')}
        </Typography>

        <SoundGrid>
          {(
            [
              {
                id: 'taskUpcoming',
                label: t('notificationSettings.sound.classicChime'),
                icon: <NotificationsActiveIcon />,
              },
              {
                id: 'sessionStart',
                label: t('notificationSettings.sound.digitalTone'),
                icon: <PlayArrowIcon />,
              },
              {
                id: 'breakReminder',
                label: t('notificationSettings.sound.softBell'),
                icon: <CoffeeIcon />,
              },
              {
                id: 'sessionEnd',
                label: t('notificationSettings.sound.successArpeggio'),
                icon: <CheckIcon />,
              },
            ] as { id: SoundType; label: string; icon: React.ReactNode }[]
          ).map((snd) => {
            const isActive = preferredSound === snd.id;
            return (
              <SoundCard
                key={snd.id}
                active={isActive}
                onClick={() => handlePreferredSoundChange(snd.id)}
              >
                <SoundCardHeader>
                  <SoundCardIcon active={isActive}>{snd.icon}</SoundCardIcon>
                  {isActive && (
                    <Badge sx={{ fontSize: '8px', px: 1, py: 0.1 }}>
                      {t('common.active')}
                    </Badge>
                  )}
                </SoundCardHeader>
                <SoundCardTitle>{snd.label}</SoundCardTitle>
              </SoundCard>
            );
          })}
        </SoundGrid>
      </SectionCard>

      {/* Session Alerts */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box className="icon-wrapper">
              <TimerIcon />
            </Box>
            <Typography>{t('notificationSettings.alerts.title')}</Typography>
          </SectionTitle>
        </SectionHeader>

        <AlertCardGrid>
          {/* Session Start */}
          <AlertCardItem>
            <AlertCardIconBox>
              <PlayArrowIcon />
            </AlertCardIconBox>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.925rem',
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  {t('notificationSettings.alerts.sessionStart.title')}
                </Typography>
                <Switch
                  checked={activeAlerts.sessionStart}
                  onChange={() => toggleAlert('sessionStart')}
                  size="small"
                  sx={switchStyles}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
              >
                {t('notificationSettings.alerts.sessionStart.desc')}
              </Typography>
              <SoundPreviewButton onClick={() => playSound('sessionStart')}>
                <VolumeUpIcon />
                <Typography variant="caption">
                  {t('notificationSettings.alerts.preview')}
                </Typography>
              </SoundPreviewButton>
            </Box>
          </AlertCardItem>

          {/* Break Reminder */}
          <AlertCardItem>
            <AlertCardIconBox>
              <CoffeeIcon />
            </AlertCardIconBox>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.925rem',
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  {t('notificationSettings.alerts.breakReminder.title')}
                </Typography>
                <Switch
                  checked={activeAlerts.breakReminder}
                  onChange={() => toggleAlert('breakReminder')}
                  size="small"
                  sx={switchStyles}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
              >
                {t('notificationSettings.alerts.breakReminder.desc')}
              </Typography>
              <SoundPreviewButton onClick={() => playSound('breakReminder')}>
                <VolumeUpIcon />
                <Typography variant="caption">
                  {t('notificationSettings.alerts.preview')}
                </Typography>
              </SoundPreviewButton>
            </Box>
          </AlertCardItem>

          {/* Session End */}
          <AlertCardItem>
            <AlertCardIconBox>
              <CheckIcon />
            </AlertCardIconBox>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.925rem',
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  {t('notificationSettings.alerts.sessionEnd.title')}
                </Typography>
                <Switch
                  checked={activeAlerts.sessionEnd}
                  onChange={() => toggleAlert('sessionEnd')}
                  size="small"
                  sx={switchStyles}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
              >
                {t('notificationSettings.alerts.sessionEnd.desc')}
              </Typography>
              <SoundPreviewButton onClick={() => playSound('sessionEnd')}>
                <VolumeUpIcon />
                <Typography variant="caption">
                  {t('notificationSettings.alerts.preview')}
                </Typography>
              </SoundPreviewButton>
            </Box>
          </AlertCardItem>
        </AlertCardGrid>
      </SectionCard>
    </Box>
  );
};
