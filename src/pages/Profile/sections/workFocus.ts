// Work hours and focus length, as edited on the profile page and stored in
// user.settings. The day codes match what onboarding saves and what the
// scheduler reads (it lowercases them).

export const WEEK_DAYS = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export const FOCUS_MINUTES = { min: 10, max: 120, step: 5 } as const;

export interface WorkFocusForm {
  days: WeekDay[];
  start: string;
  end: string;
  focusMinutes: number;
}

export type WorkFocusError = 'noDays' | 'hours';

const DEFAULTS: WorkFocusForm = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  start: '09:00',
  end: '17:00',
  focusMinutes: 25,
};

const isTime = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{2}:\d{2}$/.test(value);

const clampFocus = (value: number) =>
  Math.min(FOCUS_MINUTES.max, Math.max(FOCUS_MINUTES.min, Math.round(value)));

export const formFromSettings = (settings: unknown): WorkFocusForm => {
  const s = (settings ?? {}) as Record<string, unknown>;
  const config = (s.workHoursConfig ?? {}) as Record<string, unknown>;

  const days = Array.isArray(config.selectedDays)
    ? WEEK_DAYS.filter((day) =>
        (config.selectedDays as unknown[]).includes(day),
      )
    : DEFAULTS.days;
  const focus = Number(s.focusDurationPref);

  return {
    days,
    start: isTime(config.startTime) ? config.startTime : DEFAULTS.start,
    end: isTime(config.endTime) ? config.endTime : DEFAULTS.end,
    focusMinutes:
      Number.isFinite(focus) && focus > 0
        ? clampFocus(focus)
        : DEFAULTS.focusMinutes,
  };
};

export const validateWorkFocus = (
  form: WorkFocusForm,
): WorkFocusError | null => {
  if (form.days.length === 0) return 'noDays';
  // Same-length "HH:mm" strings compare chronologically.
  if (!isTime(form.start) || !isTime(form.end) || form.end <= form.start) {
    return 'hours';
  }
  return null;
};

export const isSameForm = (a: WorkFocusForm, b: WorkFocusForm) =>
  a.start === b.start &&
  a.end === b.end &&
  a.focusMinutes === b.focusMinutes &&
  a.days.length === b.days.length &&
  a.days.every((day) => b.days.includes(day));

/** The form merged into the user's current settings, ready to PATCH whole. */
export const settingsWithForm = (
  current: unknown,
  form: WorkFocusForm,
): Record<string, unknown> => {
  const base = (current ?? {}) as Record<string, unknown>;
  const previousConfig = (base.workHoursConfig ?? {}) as Record<
    string,
    unknown
  >;
  return {
    ...base,
    workHoursConfig: {
      ...previousConfig,
      selectedDays: WEEK_DAYS.filter((day) => form.days.includes(day)),
      startTime: form.start,
      endTime: form.end,
    },
    focusDurationPref: form.focusMinutes,
  };
};
