import { describe, it, expect } from 'vitest';
import {
  dateInputToISO,
  getDueDateHighlight,
  toDateInputValue,
} from '@/pages/Projects/components/ProjectTasks/projectTaskDates';

describe('projectTaskDates', () => {
  it('a picked day is saved and read back as the same day', () => {
    expect(toDateInputValue(dateInputToISO('2026-10-03'))).toBe('2026-10-03');
  });

  it('reads deadlines saved as UTC midnight on their own day, not the day before', () => {
    expect(toDateInputValue('2026-10-03T00:00:00.000Z')).toBe('2026-10-03');
    expect(toDateInputValue('2026-10-03T00:00:00+00:00')).toBe('2026-10-03');
  });

  it('reads deadlines with a time on their local day', () => {
    const localEvening = new Date(2026, 9, 3, 21, 30).toISOString();
    expect(toDateInputValue(localEvening)).toBe('2026-10-03');
  });

  it('flags overdue, today and tomorrow relative to the local day', () => {
    const now = new Date(2026, 9, 3, 15, 0);
    expect(getDueDateHighlight(dateInputToISO('2026-10-02'), now)).toBe(
      'overdue',
    );
    expect(getDueDateHighlight(dateInputToISO('2026-10-03'), now)).toBe(
      'today',
    );
    expect(getDueDateHighlight(dateInputToISO('2026-10-04'), now)).toBe(
      'tomorrow',
    );
    expect(getDueDateHighlight(dateInputToISO('2026-10-10'), now)).toBe(
      'normal',
    );
    expect(getDueDateHighlight(undefined, now)).toBeUndefined();
  });

  it('ignores values that are not dates', () => {
    expect(toDateInputValue('not a date')).toBe('');
    expect(dateInputToISO('')).toBeUndefined();
  });
});
