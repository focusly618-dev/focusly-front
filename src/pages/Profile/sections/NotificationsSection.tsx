import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Switch, Typography } from '@mui/material';
import {
  NotificationsActiveOutlined as ChimeIcon,
  PlayArrow as DigitalIcon,
  Coffee as BellIcon,
  Check as ArpeggioIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUser } from '@/redux/auth/auth.slice';
import { useNotificationSounds } from '@/hooks/useNotificationSounds';
import { soundPlayer, type SoundType } from '@/utils';
import {
  Card,
  CardDescription,
  CardTitle,
  Divider,
  OptionCard,
  OptionGrid,
  OptionIcon,
} from '../Profile.styles';
import { SettingRow } from '../components/SettingRow';

type PermissionState = NotificationPermission | 'unsupported';

const readPermission = (): PermissionState =>
  typeof Notification === 'undefined' ? 'unsupported' : Notification.permission;

const SOUNDS: { id: SoundType; labelKey: string; icon: ReactNode }[] = [
  { id: 'taskUpcoming', labelKey: 'classicChime', icon: <ChimeIcon /> },
  { id: 'sessionStart', labelKey: 'digitalTone', icon: <DigitalIcon /> },
  { id: 'breakReminder', labelKey: 'softBell', icon: <BellIcon /> },
  { id: 'sessionEnd', labelKey: 'successArpeggio', icon: <ArpeggioIcon /> },
];

export const NotificationsSection = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { playSound } = useNotificationSounds(0.5);

  // Read by RealTimeProvider: off silences the upcoming-task reminders
  // entirely. Kept on the local user, so it applies to this device.
  const remindersOn = user?.pushEnabled !== false;
  const [permission, setPermission] = useState<PermissionState>(readPermission);
  const [preferredSound, setPreferredSound] = useState<SoundType>(() =>
    soundPlayer.getPreferredSound(),
  );

  const requestPermission = async () => {
    if (permission === 'unsupported') return;
    setPermission(await Notification.requestPermission());
  };

  const chooseSound = (sound: SoundType) => {
    setPreferredSound(sound);
    soundPlayer.setPreferredSound(sound);
    playSound(sound);
  };

  return (
    <>
      <Card>
        <SettingRow
          title={t('profilePage.notifications.remindersTitle')}
          description={t('profilePage.notifications.remindersDesc')}
          control={({ labelId, descriptionId }) => (
            <Switch
              checked={remindersOn}
              onChange={(e) =>
                dispatch(updateUser({ pushEnabled: e.target.checked }))
              }
              slotProps={{
                // Replaces MUI's default input props, so the role goes back in.
                input: {
                  role: 'switch',
                  'aria-labelledby': labelId,
                  'aria-describedby': descriptionId,
                },
              }}
            />
          )}
        />

        <Divider />

        <SettingRow
          title={t('profilePage.notifications.systemTitle')}
          description={t('profilePage.notifications.systemDesc')}
          control={() =>
            permission === 'default' ? (
              <Button
                variant="outlined"
                size="small"
                onClick={requestPermission}
                disabled={!remindersOn}
              >
                {t('profilePage.notifications.allow')}
              </Button>
            ) : null
          }
        >
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              fontWeight: 600,
              color:
                permission === 'granted'
                  ? 'success.main'
                  : permission === 'denied'
                    ? 'warning.main'
                    : 'text.secondary',
            }}
          >
            {t(`profilePage.notifications.permission.${permission}`)}
          </Typography>
        </SettingRow>
      </Card>

      <Card>
        <CardTitle>{t('notificationSettings.sound.title')}</CardTitle>
        <CardDescription>
          {t('profilePage.notifications.soundDesc')}
        </CardDescription>
        <OptionGrid role="radiogroup">
          {SOUNDS.map((sound) => {
            const isActive = preferredSound === sound.id;
            return (
              <OptionCard
                key={sound.id}
                role="radio"
                aria-checked={isActive}
                active={isActive}
                onClick={() => chooseSound(sound.id)}
              >
                <OptionIcon active={isActive}>{sound.icon}</OptionIcon>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {t(`notificationSettings.sound.${sound.labelKey}`)}
                  </Typography>
                  {isActive && (
                    <Typography variant="caption" color="primary.main">
                      {t('common.active')}
                    </Typography>
                  )}
                </Box>
              </OptionCard>
            );
          })}
        </OptionGrid>
      </Card>
    </>
  );
};
