import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { updateUser } from '@/redux/auth/auth.slice';
import { useNotificationSounds } from '@/hooks/useNotificationSounds';
import { soundPlayer, type SoundType } from '@/utils/notificationSounds';
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
      alert(
        'Notifications are blocked in your browser. Please enable them in your browser site settings.',
      );
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
            <Typography>Delivery Channels</Typography>
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
                  In-App Notifications
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
                >
                  Receive focus session alerts directly in the app.
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
                  Email Summary
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
                >
                  Daily and weekly summaries sent to{' '}
                  {user?.email || 'alex@email.com'}
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
                  Desktop Push Notifications
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}
                >
                  OS-native notifications when the browser is minimized.
                </Typography>
                {permissionStatus === 'denied' && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: 'block', mt: 0.5, fontWeight: 700 }}
                  >
                    ⚠️ Push notifications are blocked by your browser.
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
            <Typography>Notification Sound</Typography>
          </SectionTitle>
        </SectionHeader>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Pick a notification chime. Click a card to preview and set it.
        </Typography>

        <SoundGrid>
          {(
            [
              {
                id: 'taskUpcoming',
                label: 'Classic Chime',
                icon: <NotificationsActiveIcon />,
              },
              {
                id: 'sessionStart',
                label: 'Digital Tone',
                icon: <PlayArrowIcon />,
              },
              { id: 'breakReminder', label: 'Soft Bell', icon: <CoffeeIcon /> },
              {
                id: 'sessionEnd',
                label: 'Success Arpeggio',
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
                      Active
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
            <Typography>Session & Break Alerts</Typography>
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
                  Session Start
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
                Alert triggered 5 minutes before your scheduled deep work block.
              </Typography>
              <SoundPreviewButton onClick={() => playSound('sessionStart')}>
                <VolumeUpIcon />
                <Typography variant="caption">Preview Sound</Typography>
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
                  Break Reminder
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
                Notification when energy blocks drop or a focus block is
                complete.
              </Typography>
              <SoundPreviewButton onClick={() => playSound('breakReminder')}>
                <VolumeUpIcon />
                <Typography variant="caption">Preview Sound</Typography>
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
                  Session End
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
                Alert triggered immediately when focus timer hits zero.
              </Typography>
              <SoundPreviewButton onClick={() => playSound('sessionEnd')}>
                <VolumeUpIcon />
                <Typography variant="caption">Preview Sound</Typography>
              </SoundPreviewButton>
            </Box>
          </AlertCardItem>
        </AlertCardGrid>
      </SectionCard>
    </Box>
  );
};
