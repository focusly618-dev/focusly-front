import { describe, it, expect } from 'vitest';
import {
  formFromSettings,
  isSameForm,
  settingsWithForm,
  validateWorkFocus,
} from '@/pages/Profile/sections/workFocus';
import { availabilityFromSettings } from '@/api/AI/apiAIPlanner';

describe('work hours and focus settings', () => {
  it('reads what onboarding saved', () => {
    const form = formFromSettings({
      workHoursConfig: {
        selectedDays: ['Tue', 'Mon', 'Sat'],
        startTime: '08:30',
        endTime: '16:00',
      },
      focusDurationPref: 45,
    });

    // Days come back in week order.
    expect(form).toEqual({
      days: ['Mon', 'Tue', 'Sat'],
      start: '08:30',
      end: '16:00',
      focusMinutes: 45,
    });
  });

  it('falls back to defaults for missing or malformed settings', () => {
    expect(formFromSettings(undefined)).toEqual({
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      start: '09:00',
      end: '17:00',
      focusMinutes: 25,
    });
    expect(
      formFromSettings({
        workHoursConfig: { startTime: '9am' },
        focusDurationPref: 'x',
      }).start,
    ).toBe('09:00');
  });

  it('validates days and hours', () => {
    const ok = formFromSettings(undefined);
    expect(validateWorkFocus(ok)).toBeNull();
    expect(validateWorkFocus({ ...ok, days: [] })).toBe('noDays');
    expect(validateWorkFocus({ ...ok, start: '17:00', end: '09:00' })).toBe(
      'hours',
    );
    expect(validateWorkFocus({ ...ok, start: '10:00', end: '10:00' })).toBe(
      'hours',
    );
  });

  it('compares forms ignoring day order', () => {
    const a = formFromSettings(undefined);
    expect(isSameForm(a, { ...a, days: [...a.days].reverse() })).toBe(true);
    expect(isSameForm(a, { ...a, focusMinutes: 30 })).toBe(false);
  });

  it('keeps every other setting when merging (the PATCH replaces settings whole)', () => {
    const current = {
      calendarConnected: true,
      breakDurationPref: 5,
      workHoursConfig: {
        selectedDays: ['Mon'],
        startTime: '09:00',
        endTime: '17:00',
        enabled: true,
      },
    };
    const form = {
      days: ['Fri', 'Mon'] as const,
      start: '10:00',
      end: '18:00',
      focusMinutes: 50,
    };

    expect(
      settingsWithForm(current, { ...form, days: [...form.days] }),
    ).toEqual({
      calendarConnected: true,
      breakDurationPref: 5,
      focusDurationPref: 50,
      workHoursConfig: {
        enabled: true,
        selectedDays: ['Mon', 'Fri'],
        startTime: '10:00',
        endTime: '18:00',
      },
    });
  });
});

describe('availabilityFromSettings (weekly AI planner)', () => {
  it("turns the user's work hours into per-day availability", () => {
    const availability = availabilityFromSettings({
      workHoursConfig: {
        selectedDays: ['Mon', 'Wed'],
        startTime: '10:00',
        endTime: '15:00',
      },
    });

    expect(availability?.Monday).toEqual({
      available: true,
      start: '10:00',
      end: '15:00',
    });
    expect(availability?.Tuesday).toEqual({ available: false });
    expect(availability?.Wednesday?.available).toBe(true);
    expect(Object.keys(availability ?? {})).toHaveLength(7);
  });

  it('leaves availability unset when there are no work hours, so the server default applies', () => {
    expect(availabilityFromSettings(undefined)).toBeUndefined();
    expect(
      availabilityFromSettings({ workHoursConfig: { selectedDays: [] } }),
    ).toBeUndefined();
  });
});
