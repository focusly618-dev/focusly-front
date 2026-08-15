import { describe, it, expect } from 'vitest';
import {
  parseDuration,
  formatDuration,
  getPriorityFromLevel,
  getPriorityLevel,
  deduplicateLinks,
  normalizeUrl,
} from '@/pages/Home/components/CreateTaskModal/CreateTaskModal.utils';

describe('parseDuration — adversarial input', () => {
  it('returns 0 for null/undefined/non-string input instead of throwing', () => {
    expect(parseDuration(null)).toBe(0);
    expect(parseDuration(undefined)).toBe(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(parseDuration(42 as any)).toBe(0);
  });

  it('returns 0 for an empty or whitespace-only string', () => {
    expect(parseDuration('')).toBe(0);
    expect(parseDuration('   ')).toBe(0);
  });

  it('returns 0 for pure garbage text', () => {
    expect(parseDuration('banana')).toBe(0);
    expect(parseDuration('2 hours please')).toBe(0);
  });

  it('parses plain numbers as minutes', () => {
    expect(parseDuration('45')).toBe(45);
  });

  it('parses "Xh" and "Xm" suffixes', () => {
    expect(parseDuration('2h')).toBe(120);
    expect(parseDuration('30m')).toBe(30);
  });

  it('parses combined "XhYm"', () => {
    expect(parseDuration('2h30m')).toBe(150);
    expect(parseDuration('2h 30m')).toBe(150);
  });

  it('BUG: silently returns 0 for a 4+ digit duration instead of an error (max 3 digits allowed by regex)', () => {
    expect(parseDuration('1000m')).toBe(0);
    expect(parseDuration('1000')).toBe(0);
  });

  it('accepts an absurd but in-range 999h as valid (no upper sanity bound)', () => {
    expect(parseDuration('999h')).toBe(999 * 60);
  });

  it('parses "0m"/"0h" as a valid zero, not garbage', () => {
    expect(parseDuration('0m')).toBe(0);
    expect(parseDuration('0h')).toBe(0);
  });
});

describe('formatDuration', () => {
  it('returns empty string for 0/undefined (0 is falsy) — cannot distinguish "no duration" from "zero duration"', () => {
    expect(formatDuration(0)).toBe('');
    expect(formatDuration(undefined)).toBe('');
  });

  it('formats whole hours, whole minutes and combined correctly', () => {
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(90)).toBe('1h 30m');
  });

  it('does not blow up on a negative input, though the output is nonsensical', () => {
    // BUG-ish: no guard against negative minutes; produces a negative-looking
    // label rather than throwing or clamping to 0.
    expect(() => formatDuration(-30)).not.toThrow();
  });
});

describe('getPriorityFromLevel / getPriorityLevel — round-trip stability', () => {
  it('is stable for level 1 (Low) and level 2 (Med)', () => {
    expect(getPriorityLevel(getPriorityFromLevel(1))).toBe(1);
    expect(getPriorityLevel(getPriorityFromLevel(2))).toBe(2);
  });

  it('BUG: is NOT stable for level 3 — round-trips to 4 (High is treated as a single bucket for 3 and 4)', () => {
    const label = getPriorityFromLevel(3);
    expect(label).toBe('High');
    expect(getPriorityLevel(label)).toBe(4);
    // Concretely: any task edit that recomputes priority_level from the
    // label (as useTaskMutations.handleSave/handleUpdate does) silently
    // bumps a priority_level of 3 up to 4 the moment it round-trips
    // through the UI, with no user action requesting that change.
  });

  it('level 0 (and anything <1) round-trips to 0 via "No priority"', () => {
    expect(getPriorityLevel(getPriorityFromLevel(0))).toBe(0);
    expect(getPriorityLevel(getPriorityFromLevel(-5))).toBe(0);
  });

  it('an unrecognized priority label defaults to level 0 rather than throwing', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getPriorityLevel('Not a real priority' as any)).toBe(0);
  });
});

describe('deduplicateLinks / normalizeUrl', () => {
  it('treats http/https and trailing-slash variants of the same URL as duplicates', () => {
    const links = [
      { title: 'A', url: 'http://example.com/doc' },
      { title: 'B', url: 'https://example.com/doc/' },
    ];
    expect(deduplicateLinks(links)).toHaveLength(1);
  });

  it('keeps distinct URLs', () => {
    const links = [
      { title: 'A', url: 'https://example.com/a' },
      { title: 'B', url: 'https://example.com/b' },
    ];
    expect(deduplicateLinks(links)).toHaveLength(2);
  });

  it('handles an empty array without throwing', () => {
    expect(deduplicateLinks([])).toEqual([]);
  });

  it('CRASH: throws on a link whose url is null/undefined instead of degrading gracefully', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const links = [{ title: 'Broken', url: null as any }];
    expect(() => deduplicateLinks(links)).toThrow();
  });

  it('normalizeUrl strips protocol and trailing slash', () => {
    expect(normalizeUrl('https://example.com/')).toBe('example.com');
    expect(normalizeUrl('http://example.com')).toBe('example.com');
  });
});
