import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Skeleton,
  Slider,
  TextField,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUser } from '@/redux/auth/auth.slice';
import { UserGet, UserUpdate, type UserSettings } from '@/api/User/apiUser';
import { sileo } from '@/utils';
import { Card, CardDescription, CardTitle } from '../Profile.styles';
import {
  FOCUS_MINUTES,
  WEEK_DAYS,
  formFromSettings,
  isSameForm,
  settingsWithForm,
  validateWorkFocus,
  type WeekDay,
  type WorkFocusForm,
} from './workFocus';

const DayToggle = styled(ButtonBase)(({ theme }) => ({
  minWidth: 52,
  padding: theme.spacing(1, 1.25),
  borderRadius: 8,
  fontFamily: 'inherit',
  fontSize: '0.825rem',
  fontWeight: 600,
  textTransform: 'capitalize',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  transition: 'all 0.15s ease',
  '&[aria-pressed="true"]': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.text.primary,
  },
  '&:hover': {
    borderColor: alpha(theme.palette.primary.main, 0.6),
  },
  '&.Mui-focusVisible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

// 2024-01-01 was a Monday: offsets give each weekday's localized name.
const dayLabel = (day: WeekDay, locale: string, width: 'short' | 'long') =>
  new Intl.DateTimeFormat(locale, { weekday: width }).format(
    new Date(2024, 0, 1 + WEEK_DAYS.indexOf(day)),
  );

export const WorkFocusSection = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?.id;

  // Loaded fresh: onboarding saves these without updating the local user,
  // so the copy in Redux can be behind.
  const [saved, setSaved] = useState<WorkFocusForm | null>(null);
  const [form, setForm] = useState<WorkFocusForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    UserGet(userId)
      .then((fresh) => {
        if (cancelled) return;
        const initial = formFromSettings(fresh.settings);
        setSaved(initial);
        setForm(initial);
        dispatch(updateUser({ settings: fresh.settings }));
      })
      .catch(() => {
        if (cancelled) return;
        const initial = formFromSettings(user?.settings);
        setSaved(initial);
        setForm(initial);
      });
    return () => {
      cancelled = true;
    };
    // Load once per user; later edits come from this form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const error = form ? validateWorkFocus(form) : null;
  const isDirty = !!form && !!saved && !isSameForm(form, saved);

  const focusMarks = useMemo(
    () =>
      [25, 50, 90].map((value) => ({
        value,
        label: t('profilePage.workFocus.minutes', { count: value }),
      })),
    [t],
  );

  if (!form) {
    return (
      <Card>
        <Skeleton width="40%" height={28} />
        <Skeleton width="80%" />
        <Skeleton variant="rounded" height={44} sx={{ mt: 2 }} />
      </Card>
    );
  }

  const update = (patch: Partial<WorkFocusForm>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  const toggleDay = (day: WeekDay) =>
    update({
      days: form.days.includes(day)
        ? form.days.filter((d) => d !== day)
        : [...form.days, day],
    });

  const handleSave = async () => {
    if (!userId || error || !isDirty) return;
    setIsSaving(true);
    try {
      // The PATCH replaces settings whole: build on the server's latest copy
      // so fields set elsewhere (calendar connection, onboarding) survive.
      const fresh = await UserGet(userId);
      const updated = await UserUpdate(userId, {
        settings: settingsWithForm(
          fresh.settings,
          form,
        ) as unknown as UserSettings,
      });
      dispatch(updateUser({ settings: updated.settings }));
      const next = formFromSettings(updated.settings);
      setSaved(next);
      setForm(next);
      sileo.success({
        title: t('profilePage.workFocus.savedTitle'),
        description: t('profilePage.workFocus.savedDesc'),
        fill: 'var(--sileo-success-bg)',
      });
    } catch {
      sileo.error({
        title: t('profilePage.workFocus.saveError'),
        fill: 'var(--sileo-error-bg)',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Card>
        <CardTitle id="work-days-title">
          {t('profilePage.workFocus.daysTitle')}
        </CardTitle>
        <CardDescription id="work-days-desc">
          {t('profilePage.workFocus.daysDesc')}
        </CardDescription>
        <Box
          role="group"
          aria-labelledby="work-days-title"
          aria-describedby="work-days-desc"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}
        >
          {WEEK_DAYS.map((day) => (
            <DayToggle
              key={day}
              aria-pressed={form.days.includes(day)}
              aria-label={dayLabel(day, i18n.language, 'long')}
              onClick={() => toggleDay(day)}
            >
              {dayLabel(day, i18n.language, 'short')}
            </DayToggle>
          ))}
        </Box>
        {error === 'noDays' && (
          <Typography
            variant="caption"
            color="error"
            sx={{ display: 'block', mt: 1 }}
          >
            {t('profilePage.workFocus.errors.noDays')}
          </Typography>
        )}
      </Card>

      <Card>
        <CardTitle>{t('profilePage.workFocus.hoursTitle')}</CardTitle>
        <CardDescription>
          {t('profilePage.workFocus.hoursDesc')}
        </CardDescription>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, maxWidth: 360 }}>
          <TextField
            label={t('profilePage.workFocus.start')}
            type="time"
            size="small"
            fullWidth
            value={form.start}
            onChange={(e) => update({ start: e.target.value })}
            error={error === 'hours'}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label={t('profilePage.workFocus.end')}
            type="time"
            size="small"
            fullWidth
            value={form.end}
            onChange={(e) => update({ end: e.target.value })}
            error={error === 'hours'}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
        {error === 'hours' && (
          <Typography
            variant="caption"
            color="error"
            sx={{ display: 'block', mt: 1 }}
          >
            {t('profilePage.workFocus.errors.hours')}
          </Typography>
        )}
      </Card>

      <Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <CardTitle id="focus-length-title">
            {t('profilePage.workFocus.focusTitle')}
          </CardTitle>
          <Typography
            sx={{ fontWeight: 700, color: 'primary.main', flexShrink: 0 }}
          >
            {t('profilePage.workFocus.minutes', { count: form.focusMinutes })}
          </Typography>
        </Box>
        <CardDescription id="focus-length-desc">
          {t('profilePage.workFocus.focusDesc')}
        </CardDescription>
        <Box sx={{ px: 1, mt: 2 }}>
          <Slider
            value={form.focusMinutes}
            min={FOCUS_MINUTES.min}
            max={FOCUS_MINUTES.max}
            step={FOCUS_MINUTES.step}
            marks={focusMarks}
            onChange={(_, value) => update({ focusMinutes: value as number })}
            valueLabelDisplay="auto"
            slotProps={{
              input: {
                'aria-labelledby': 'focus-length-title',
                'aria-describedby': 'focus-length-desc',
              },
            }}
          />
        </Box>
      </Card>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1.5,
          mt: 3,
        }}
      >
        {isDirty && (
          <Button
            color="inherit"
            onClick={() => setForm(saved)}
            disabled={isSaving}
          >
            {t('profilePage.workFocus.discard')}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!isDirty || !!error || isSaving}
          sx={{ minWidth: 140 }}
        >
          {isSaving ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            t('profilePage.workFocus.save')
          )}
        </Button>
      </Box>
    </>
  );
};
