import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { updateUser } from '@/redux/auth/auth.slice';
import { useNotificationSounds } from '@/hooks/useNotificationSounds';
import { soundPlayer, type SoundType } from '@/utils/notificationSounds';
import {
  Box,
  Switch,
  alpha,
  Typography,
  useTheme,
  type Theme,
} from '@mui/material';
import {
  Campaign as CampaignIcon,
  Timer as TimerIcon,
  PlayArrow as PlayArrowIcon,
  Coffee as CoffeeIcon,
  Check as CheckIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  VolumeUp as VolumeUpIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';
import {
  SectionCard,
  SectionHeader,
  SectionTitle,
  SettingItem,
  SettingInfo,
  SettingLabel,
  SettingSublabel,
  Badge,
  AlertGrid,
  AlertCard,
  AlertIconBox,
  SoundSelector,
} from '../Settings.styles';

type AlertType = 'sessionStart' | 'breakReminder' | 'sessionEnd';

export const NotificationSettings = () => {
  const theme = useTheme();
  const themeSwitchStyles = switchStyles(theme);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { playSound } = useNotificationSounds(0.5);

  // Preferred notification sound from localStorage
  const [preferredSound, setPreferredSound] = useState<SoundType>(
    soundPlayer.getPreferredSound(),
  );

  // La preferencia guardada en el perfil del usuario (o true por defecto)
  const savedPreference = user?.pushEnabled !== false;

  const [pushEnabled, setPushEnabled] = useState(
    Notification.permission === 'granted' && savedPreference,
  );
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission>(Notification.permission);

  // Mutually exclusive alert selection - only one can be active
  const [selectedAlert, setSelectedAlert] = useState<AlertType>('sessionStart');

  const handleAlertToggle = (alertType: AlertType) => {
    setSelectedAlert(alertType);
  };

  const handlePreferredSoundChange = (type: SoundType) => {
    setPreferredSound(type);
    soundPlayer.setPreferredSound(type);
    // Play a preview
    playSound(type);
  };

  const handlePushToggle = async () => {
    if (permissionStatus === 'denied') {
      alert(
        'Las notificaciones están bloqueadas en tu navegador. Por favor, actívalas en la configuración del sitio (icono del candado).',
      );
      return;
    }

    if (!pushEnabled) {
      // Intentar activar
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === 'granted') {
        setPushEnabled(true);
        dispatch(updateUser({ pushEnabled: true }));
      }
    } else {
      // Desactivar manualmente en la app
      setPushEnabled(false);
      dispatch(updateUser({ pushEnabled: false }));
    }
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
          <Badge>RFU-09</Badge>
        </SectionHeader>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>In-App Notifications</SettingLabel>
            <SettingSublabel>
              Receive alerts directly within the browser while you work.
            </SettingSublabel>
          </SettingInfo>
          <Switch defaultChecked sx={themeSwitchStyles} />
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Email Summaries</SettingLabel>
            <SettingSublabel>
              Get daily and weekly productivity reports sent to
              user@example.com.
            </SettingSublabel>
          </SettingInfo>
          <Switch defaultChecked sx={themeSwitchStyles} />
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Desktop Push Notifications</SettingLabel>
            <SettingSublabel>
              Native OS notifications even when the browser is minimized.
              {permissionStatus === 'denied' && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}
                >
                  ⚠️ Notifications are blocked in your browser.
                </Typography>
              )}
            </SettingSublabel>
          </SettingInfo>
          <Switch
            checked={pushEnabled}
            onChange={handlePushToggle}
            sx={themeSwitchStyles}
          />
        </SettingItem>
      </SectionCard>

      {/* Notification Sound Selection */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box
              className="icon-wrapper"
              sx={{ color: theme.palette.warning.main }}
            >
              <NotificationsActiveIcon />
            </Box>
            <Typography>Notification Sound</Typography>
          </SectionTitle>
        </SectionHeader>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Select the sound that will play when a task is about to start. This
          choice is saved locally on your device.
        </Typography>

        <AlertGrid sx={{ mb: 2 }}>
          {(
            [
              'taskUpcoming',
              'sessionStart',
              'breakReminder',
              'sessionEnd',
            ] as SoundType[]
          ).map((type) => {
            const labels: Record<SoundType, string> = {
              taskUpcoming: 'Classic Chime',
              sessionStart: 'Digital Tone',
              breakReminder: 'Soft Bell',
              sessionEnd: 'Success Arpeggio',
            };

            const icons: Record<SoundType, React.ElementType> = {
              taskUpcoming: NotificationsActiveIcon,
              sessionStart: PlayArrowIcon,
              breakReminder: CoffeeIcon,
              sessionEnd: CheckIcon,
            };

            const Icon = icons[type];
            const isActive = preferredSound === type;

            return (
              <AlertCard
                key={type}
                active={isActive}
                onClick={() => handlePreferredSoundChange(type)}
                sx={{ cursor: 'pointer' }}
              >
                <AlertIconBox
                  active={isActive}
                  type={
                    type === 'taskUpcoming'
                      ? 'sessionStart'
                      : (type as
                          | 'sessionStart'
                          | 'breakReminder'
                          | 'sessionEnd')
                  }
                >
                  <Icon />
                </AlertIconBox>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {labels[type]}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                  >
                    {isActive ? 'Current Selection' : 'Click to select'}
                  </Typography>
                </Box>
                {isActive && <Badge sx={{ alignSelf: 'center' }}>Active</Badge>}
              </AlertCard>
            );
          })}
        </AlertGrid>
      </SectionCard>

      {/* Session & Break Alerts */}
      <SectionCard>
        <SectionHeader>
          <SectionTitle>
            <Box
              className="icon-wrapper"
              sx={{ color: theme.palette.primary.main }}
            >
              <TimerIcon />
            </Box>
            <Typography>Session & Break Alerts</Typography>
          </SectionTitle>
        </SectionHeader>

        <AlertGrid>
          <AlertCard active={selectedAlert === 'sessionStart'}>
            <AlertIconBox
              active={selectedAlert === 'sessionStart'}
              type="sessionStart"
            >
              <PlayArrowIcon />
            </AlertIconBox>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                  >
                    Session Start
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: 'block',
                      mt: 0.5,
                    }}
                  >
                    Get notified 5 minutes before a scheduled deep work session
                    begins.
                  </Typography>
                </Box>
                <Switch
                  checked={selectedAlert === 'sessionStart'}
                  onChange={() => handleAlertToggle('sessionStart')}
                  size="small"
                  sx={themeSwitchStyles}
                />
              </Box>
              <SoundSelector onClick={() => playSound('sessionStart')}>
                <VolumeUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography>Preview Sound</Typography>
                <KeyboardArrowDownIcon />
              </SoundSelector>
            </Box>
          </AlertCard>

          <AlertCard active={selectedAlert === 'breakReminder'}>
            <AlertIconBox
              active={selectedAlert === 'breakReminder'}
              type="breakReminder"
            >
              <CoffeeIcon />
            </AlertIconBox>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                  >
                    Break Reminders
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: 'block',
                      mt: 0.5,
                    }}
                  >
                    Reminders to take a break when energy levels drop or session
                    ends.
                  </Typography>
                </Box>
                <Switch
                  checked={selectedAlert === 'breakReminder'}
                  onChange={() => handleAlertToggle('breakReminder')}
                  size="small"
                  sx={themeSwitchStyles}
                />
              </Box>
              <SoundSelector onClick={() => playSound('breakReminder')}>
                <VolumeUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography>Preview Sound</Typography>
                <KeyboardArrowDownIcon />
              </SoundSelector>
            </Box>
          </AlertCard>

          <AlertCard active={selectedAlert === 'sessionEnd'}>
            <AlertIconBox
              active={selectedAlert === 'sessionEnd'}
              type="sessionEnd"
            >
              <CheckIcon />
            </AlertIconBox>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                  >
                    Session End
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: 'block',
                      mt: 0.5,
                    }}
                  >
                    Notification when your focus timer hits zero.
                  </Typography>
                </Box>
                <Switch
                  checked={selectedAlert === 'sessionEnd'}
                  onChange={() => handleAlertToggle('sessionEnd')}
                  size="small"
                  sx={themeSwitchStyles}
                />
              </Box>
              <SoundSelector onClick={() => playSound('sessionEnd')}>
                <VolumeUpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography>Preview Sound</Typography>
                <KeyboardArrowDownIcon />
              </SoundSelector>
            </Box>
          </AlertCard>
        </AlertGrid>
      </SectionCard>
    </Box>
  );
};

const switchStyles = (theme: Theme) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: theme.palette.primary.main,
  },
});
