import { describe, it, expect } from 'vitest';
import {
  dailyUseRenewal,
  freeMessagesRenewal,
  nextUtcDayStart,
  nextUtcMonthStart,
} from '@/utils/billing/aiRenewal';

// The free messages of October 2026 come back at 2026-11-01 00:00 UTC
const NOV_1_UTC = '2026-11-01T00:00:00+00:00';

describe('when the AI limits start over, in each user’s own time', () => {
  // How date and time are joined ("a las", ",") varies with the engine's
  // locale data, so each place is checked by its day, month and hour
  it('shows the same instant as each place’s local date and time', () => {
    const mexico = freeMessagesRenewal(NOV_1_UTC, 'es', 'America/Mexico_City');
    expect(mexico).toMatch(/^31 de octubre\b.*\b18:00$/);
    const madrid = freeMessagesRenewal(NOV_1_UTC, 'es', 'Europe/Madrid');
    expect(madrid).toMatch(/^1 de noviembre\b.*\b1:00$/);
    const tokyo = freeMessagesRenewal(NOV_1_UTC, 'ja', 'Asia/Tokyo');
    expect(tokyo).toMatch(/^11月1日.*9:00$/);
    const newYork = freeMessagesRenewal(NOV_1_UTC, 'en', 'America/New_York');
    expect(newYork).toMatch(/^October 31\b.*\b8:00\s?PM$/);
  });

  it('works it out the way the backend counts until the backend says', () => {
    const now = new Date('2026-12-31T23:30:00Z');
    expect(nextUtcMonthStart(now).toISOString()).toBe(
      '2027-01-01T00:00:00.000Z',
    );
    expect(nextUtcDayStart(now).toISOString()).toBe('2027-01-01T00:00:00.000Z');
    expect(dailyUseRenewal(null, 'es', 'UTC')).toBe(
      new Intl.DateTimeFormat('es', {
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'UTC',
      }).format(nextUtcDayStart()),
    );
    expect(freeMessagesRenewal('not a date', 'es', 'UTC')).toBe(
      freeMessagesRenewal(null, 'es', 'UTC'),
    );
  });
});
