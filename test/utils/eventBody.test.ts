import { describe, it, expect } from 'vitest';
import {
  buildEventCreateBody,
  buildEventPatchBody,
  cleanEmails,
  patchNeedsCurrent,
} from '@/components/chat/actionPlan/eventBody';
import type { RawGoogleEvent } from '@/redux/calendar/calendar.types';

const TZ = 'America/Mexico_City';
const at = (local: string) => new Date(local).getTime();
const time = (value?: { dateTime?: string }) =>
  value?.dateTime ? new Date(value.dateTime).getTime() : null;

const current: RawGoogleEvent = {
  id: 'ev1',
  summary: 'Sync con Ana',
  start: { dateTime: new Date('2026-10-05T10:00:00').toISOString() },
  end: { dateTime: new Date('2026-10-05T10:45:00').toISOString() },
  attendees: [
    { email: 'yo@example.com', self: true, responseStatus: 'accepted' },
    { email: 'Ana@example.com', responseStatus: 'accepted' },
    { email: 'luis@example.com', responseStatus: 'tentative' },
  ],
};

describe('cleanEmails', () => {
  it('keeps valid emails once, case-insensitively', () => {
    expect(
      cleanEmails(['ana@x.com', ' ANA@x.com ', 'no-es-correo', '', 'b@y.io']),
    ).toEqual(['ana@x.com', 'b@y.io']);
    expect(cleanEmails(undefined)).toEqual([]);
  });
});

describe('buildEventCreateBody', () => {
  it('builds a timed event with guests and a Meet request', () => {
    const body = buildEventCreateBody(
      {
        title: 'Kickoff',
        start: '2026-10-05T10:00:00',
        duration_minutes: 60,
        attendees: ['ana@example.com', 'inventado'],
        meet: true,
        description: 'Agenda',
      },
      TZ,
    );
    expect(body.summary).toBe('Kickoff');
    expect(time(body.start)).toBe(at('2026-10-05T10:00:00'));
    expect(time(body.end)).toBe(at('2026-10-05T11:00:00'));
    expect(body.start?.timeZone).toBe(TZ);
    expect(body.attendees).toEqual([{ email: 'ana@example.com' }]);
    expect(body.conferenceData?.createRequest?.conferenceSolutionKey).toEqual({
      type: 'hangoutsMeet',
    });
    expect(body.description).toBe('Agenda');
  });

  it('defaults to 30 minutes and has no Meet unless asked', () => {
    const body = buildEventCreateBody({ start: '2026-10-05T10:00:00' }, TZ);
    expect(time(body.end)).toBe(at('2026-10-05T10:30:00'));
    expect(body.conferenceData).toBeUndefined();
    expect(body.attendees).toBeUndefined();
  });

  it('gives all-day events an exclusive end date', () => {
    const body = buildEventCreateBody(
      { title: 'Viaje', all_day: true, start: '2026-10-05', end: '2026-10-07' },
      TZ,
    );
    expect(body.start).toEqual({ date: '2026-10-05' });
    expect(body.end).toEqual({ date: '2026-10-08' });
  });

  it('needs a start', () => {
    expect(() => buildEventCreateBody({ title: 'Sin fecha' }, TZ)).toThrow();
  });
});

describe('buildEventPatchBody', () => {
  it('only sends what changes', () => {
    expect(
      buildEventPatchBody({ id: 'ev1', title: 'Nuevo' }, null, TZ),
    ).toEqual({ summary: 'Nuevo' });
  });

  it('a moved event keeps its length', () => {
    const body = buildEventPatchBody(
      { id: 'ev1', start: '2026-10-06T16:00:00' },
      current,
      TZ,
    );
    expect(time(body.start)).toBe(at('2026-10-06T16:00:00'));
    expect(time(body.end)).toBe(at('2026-10-06T16:45:00'));
  });

  it('adds and removes guests on top of the current list, keeping their answers', () => {
    const body = buildEventPatchBody(
      {
        id: 'ev1',
        add_attendees: ['marta@example.com', 'ana@EXAMPLE.com'],
        remove_attendees: ['LUIS@example.com'],
      },
      current,
      TZ,
    );
    expect(body.attendees).toEqual([
      { email: 'yo@example.com', self: true, responseStatus: 'accepted' },
      { email: 'Ana@example.com', responseStatus: 'accepted' },
      { email: 'marta@example.com' },
    ]);
  });

  it("refuses to touch guests without the event's current list", () => {
    expect(() =>
      buildEventPatchBody({ id: 'ev1', add_attendees: ['a@b.co'] }, null, TZ),
    ).toThrow(/current guests/);
  });

  it('only requests a Meet when the event has none', () => {
    expect(
      buildEventPatchBody({ id: 'ev1', meet: true }, current, TZ)
        .conferenceData,
    ).toBeDefined();
    expect(
      buildEventPatchBody(
        { id: 'ev1', meet: true },
        { ...current, hangoutLink: 'https://meet.google.com/abc' },
        TZ,
      ).conferenceData,
    ).toBeUndefined();
  });

  it('knows when it needs the live event', () => {
    expect(patchNeedsCurrent({ title: 'x' })).toBe(false);
    expect(patchNeedsCurrent({ add_attendees: ['a@b.co'] })).toBe(true);
    expect(patchNeedsCurrent({ start: '2026-10-06T16:00:00' })).toBe(true);
    expect(patchNeedsCurrent({ meet: true })).toBe(true);
  });
});
