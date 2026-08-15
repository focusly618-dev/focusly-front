import { describe, it, expect } from 'vitest';
import {
  normalizeGoogleId,
  getBaseGoogleId,
  getAvatarUrl,
  mapCollaborator,
  mapGoogleEventToTask,
  safeISO,
  mapWorkspace,
  mapTags,
  mapResponseToTask,
} from '@/api/Tasks/taskMapper';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import type { GoogleCalendarEvent } from '@/redux/calendar/calendar.types';

describe('safeISO — the core date-safety primitive', () => {
  it('returns null for null/undefined/empty input instead of throwing', () => {
    expect(safeISO(null)).toBeNull();
    expect(safeISO(undefined)).toBeNull();
    expect(safeISO('')).toBeNull();
  });

  it('returns null for a garbage string instead of throwing', () => {
    expect(safeISO('not-a-date')).toBeNull();
    expect(safeISO('2024-13-45')).toBeNull();
  });

  it('appends Z to a naive UTC datetime (no timezone suffix)', () => {
    const result = safeISO('2026-01-01T10:00:00');
    expect(result).toBe('2026-01-01T10:00:00.000Z');
  });

  it('leaves an explicit offset untouched instead of double-appending Z', () => {
    const result = safeISO('2026-01-01T10:00:00-05:00');
    expect(result).toBe(new Date('2026-01-01T10:00:00-05:00').toISOString());
  });

  it('passes through an already-Z-suffixed string unchanged in meaning', () => {
    const result = safeISO('2026-01-01T10:00:00Z');
    expect(result).toBe('2026-01-01T10:00:00.000Z');
  });
});

describe('normalizeGoogleId / getBaseGoogleId', () => {
  it('return empty string for null/undefined instead of throwing', () => {
    expect(normalizeGoogleId(null)).toBe('');
    expect(normalizeGoogleId(undefined)).toBe('');
    expect(getBaseGoogleId(null)).toBe('');
    expect(getBaseGoogleId(undefined)).toBe('');
  });

  it('strips leading underscores', () => {
    expect(normalizeGoogleId('___abc123')).toBe('abc123');
  });

  it('getBaseGoogleId takes only the part before the first underscore after normalizing', () => {
    expect(getBaseGoogleId('__series123_20260101T100000Z')).toBe('series123');
  });
});

describe('mapCollaborator', () => {
  it('defaults name/email to empty string and derives an avatar when missing', () => {
    const result = mapCollaborator({});
    expect(result.name).toBe('');
    expect(result.email).toBe('');
    expect(result.avatar).toContain('ui-avatars.com');
  });

  it('preserves an explicit avatar instead of overwriting it', () => {
    const result = mapCollaborator({ email: 'a@b.com', avatar: 'custom.png' });
    expect(result.avatar).toBe('custom.png');
  });
});

describe('mapTags — handles the string[] | {name}[] union', () => {
  it('returns [] for undefined', () => {
    expect(mapTags(undefined)).toEqual([]);
  });

  it('normalizes a mix of plain strings and {name} objects in the same array', () => {
    expect(mapTags(['urgent', { name: 'work' }])).toEqual(['urgent', 'work']);
  });
});

describe('mapWorkspace', () => {
  it('returns [] when workspace is missing/null', () => {
    expect(mapWorkspace(undefined)).toEqual([]);
  });

  it('prefers `project` over `folder` when both are present', () => {
    const result = mapWorkspace({
      id: 'w-1',
      title: 'WS',
      project: { id: 'p-1', name: 'Project A' },
      folder: { id: 'f-1', name: 'Folder B' },
    });
    expect(result[0].folder).toEqual({ id: 'p-1', name: 'Project A' });
  });
});

describe('mapResponseToTask — adversarial: malformed backend payloads', () => {
  const minimalValid: TaskResponse = {
    id: 't-1',
    user_id: 'u-1',
    title: 'Valid task',
    notes_encrypted: '',
    estimate_timer: 30,
    estimate_minutes: 30,
    priority_level: 2,
    category: 'General',
    deadline: '2026-01-01T00:00:00Z',
    status: 'Todo',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    tags: [],
  };

  it('maps a fully well-formed response without surprises', () => {
    const result = mapResponseToTask(minimalValid);
    expect(result.id).toBe('t-1');
    expect(result.title).toBe('Valid task');
    expect(result.deadline).toBe('2026-01-01T00:00:00.000Z');
  });

  it('CRASH: throws when the response itself is null/undefined (no guard on `t`)', () => {
    // A malformed GraphQL response (e.g. `{ createTask: null }` after a
    // silent server-side failure) reaching this mapper unchecked crashes
    // instead of degrading gracefully.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => mapResponseToTask(null as any)).toThrow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => mapResponseToTask(undefined as any)).toThrow();
  });

  it('FIXED: falls back to an empty string when title is missing, matching every other string field', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const malformed = { ...minimalValid, title: undefined } as any;
    const result = mapResponseToTask(malformed);
    expect(result.title).toBe('');
  });

  it('FIXED: defaults priority_level to 2 when missing, matching the local duplicate mapper elsewhere', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const malformed = { ...minimalValid, priority_level: undefined } as any;
    const result = mapResponseToTask(malformed);
    expect(result.priority_level).toBe(2);
  });

  it('preserves an explicit priority_level of 0 (?? guards against || treating 0 as missing)', () => {
    const result = mapResponseToTask({ ...minimalValid, priority_level: 0 });
    expect(result.priority_level).toBe(0);
  });

  it('FIXED: falls back to "Todo" instead of accepting an arbitrary garbage `status` string', () => {
    const malformed = {
      ...minimalValid,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: 'TotallyMadeUpStatus' as any,
    };
    const result = mapResponseToTask(malformed);
    expect(result.status).toBe('Todo');
  });

  it('still accepts every genuinely valid status value unchanged', () => {
    const result = mapResponseToTask({ ...minimalValid, status: 'Archived' });
    expect(result.status).toBe('Archived');
  });

  it('recovers deadline to "now" instead of crashing when deadline is an invalid string', () => {
    const malformed = { ...minimalValid, deadline: 'not-a-real-date' };
    const result = mapResponseToTask(malformed);
    expect(result.deadline).not.toBe('not-a-real-date');
    expect(new Date(result.deadline).getTime()).not.toBeNaN();
  });

  it('recovers created_at/updated_at/completed_at/deleted_at independently from bad input', () => {
    const malformed = {
      ...minimalValid,
      created_at: 'garbage',
      updated_at: 'garbage',
      completed_at: 'garbage',
      deleted_at: 'garbage',
    };
    const result = mapResponseToTask(malformed);
    expect(new Date(result.created_at).getTime()).not.toBeNaN();
    expect(new Date(result.updated_at).getTime()).not.toBeNaN();
    // completed_at/deleted_at are nullable, so safeISO's null fallback is
    // the correct/expected outcome here (not "now").
    expect(result.completed_at).toBeNull();
    expect(result.deleted_at).toBeNull();
  });

  it('handles tags as a mix of strings and {name} objects without throwing', () => {
    const malformed = {
      ...minimalValid,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tags: ['urgent', { name: 'billing' }] as any,
    };
    expect(() => mapResponseToTask(malformed)).not.toThrow();
    expect(mapResponseToTask(malformed).tags).toEqual(['urgent', 'billing']);
  });

  it('defaults collaborators/links/time_logs to [] when absent, never undefined', () => {
    const result = mapResponseToTask(minimalValid);
    expect(result.collaborators).toEqual([]);
    expect(result.links).toEqual([]);
    expect(result.time_logs).toEqual([]);
  });
});

describe('mapGoogleEventToTask — adversarial: malformed Google Calendar payloads', () => {
  const minimalValid: GoogleCalendarEvent = {
    id: 'g-event-1',
    title: 'Meeting',
    deadline: '2026-01-01T10:00:00Z',
    estimated_start_date: '2026-01-01T09:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    is_all_day: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  it('falls back to "Untitled" for a missing title (this is the exact fallback that produces the "Untitled task" bug users hit)', () => {
    const malformed = {
      ...minimalValid,
      title: undefined,
    } as unknown as GoogleCalendarEvent;
    const result = mapGoogleEventToTask(malformed);
    expect(result.title).toBe('Untitled');
  });

  it('CRASH: throws when the event itself is null/undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => mapGoogleEventToTask(null as any)).toThrow();
  });

  it('derives estimated_end_date from `deadline`, NOT from a (non-existent) estimated_end_date field — asymmetric with mapResponseToTask', () => {
    const result = mapGoogleEventToTask(minimalValid);
    expect(result.estimated_end_date).toBe(
      new Date(minimalValid.deadline).toISOString(),
    );
  });

  it('defaults estimate_timer to 30 when zero (0 is falsy, so an explicit 0-minute event silently becomes 30 minutes)', () => {
    const result = mapGoogleEventToTask({ ...minimalValid, estimate_timer: 0 });
    expect(result.estimate_timer).toBe(30);
  });

  it('is_owner defaults to true only when strictly undefined, preserving an explicit false', () => {
    const owned = mapGoogleEventToTask({
      ...minimalValid,
      is_owner: undefined,
    });
    const notOwned = mapGoogleEventToTask({ ...minimalValid, is_owner: false });
    expect(owned.is_owner).toBe(true);
    expect(notOwned.is_owner).toBe(false);
  });

  it('always tags the mapped task with source: "google" and user_id: "google-user"', () => {
    const result = mapGoogleEventToTask(minimalValid);
    expect(result.source).toBe('google');
    expect(result.user_id).toBe('google-user');
    expect(result.task_type).toBe('GoogleTask');
  });

  it('FIXED: defaults a missing priority_level to 4 ("High" convention), not the orphan 3 that used to silently bump to 4 on first save', () => {
    const result = mapGoogleEventToTask({
      ...minimalValid,
      priority_level: undefined,
    });
    expect(result.priority_level).toBe(4);
  });
});

describe('cross-mapper consistency (the divergence the two mappers create)', () => {
  it('taskMapper.mapResponseToTask normalizes a naive-UTC deadline; a hand-rolled equivalent without safeISO would not', () => {
    const naiveUtc = '2026-06-15T14:30:00'; // no Z, no offset
    const withMapper = mapResponseToTask({
      id: 't-1',
      user_id: 'u-1',
      title: 'x',
      notes_encrypted: '',
      estimate_timer: 30,
      estimate_minutes: 30,
      priority_level: 2,
      category: 'General',
      deadline: naiveUtc,
      status: 'Todo',
      created_at: naiveUtc,
      updated_at: naiveUtc,
      tags: [],
    });
    // Demonstrates the exact drift called out in the investigation:
    // a mapper that skips safeISO would keep the naive string as-is
    // (`naiveUtc`), while the real mapper normalizes to UTC — any second
    // mapping implementation elsewhere that forgets safeISO will disagree
    // with this one on the same input, for the same task.
    expect(withMapper.deadline).not.toBe(naiveUtc);
    expect(withMapper.deadline).toBe(new Date(naiveUtc + 'Z').toISOString());
  });
});

void getAvatarUrl; // exercised indirectly via mapCollaborator above
