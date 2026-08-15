import { describe, it, expect, vi } from 'vitest';

vi.mock('@/redux/store', () => ({
  store: { dispatch: vi.fn(), getState: () => ({ auth: { user: null } }) },
}));
vi.mock('@/redux/auth/auth.slice', () => ({ logout: vi.fn() }));
vi.mock('@/config/env.config', () => ({ API_BASE_URL: 'http://test.local' }));

const { mergeGetTasksByUser } = await import('@/api/apollo');

describe('mergeGetTasksByUser — the getTasksByUser cache typePolicy', () => {
  it('merges incoming items at the given offset into a fresh cache entry', () => {
    const result = mergeGetTasksByUser(undefined, ['a', 'b'], {
      args: { offset: 0 },
    });
    expect(result).toEqual(['a', 'b']);
  });

  it('inserts incoming items starting at a non-zero offset, preserving earlier entries', () => {
    const result = mergeGetTasksByUser(['a', 'b'], ['c', 'd'], {
      args: { offset: 2 },
    });
    expect(result).toEqual(['a', 'b', 'c', 'd']);
  });

  it('defaults offset to 0 when args is null/undefined instead of throwing', () => {
    expect(() =>
      mergeGetTasksByUser(undefined, ['a'], { args: null }),
    ).not.toThrow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() =>
      mergeGetTasksByUser(undefined, ['a'], {} as any),
    ).not.toThrow();
  });

  it('BUG: does nothing when `incoming` is the real getTasksByUserPaginated shape ({tasks, totalCount}) instead of a raw array', () => {
    // getTasksByUserPaginated (aliased `result`, used by GET_TASKS/
    // GET_TASKS_PAGINATED) returns `{ tasks: [...], totalCount }`, NOT a
    // bare array — this typePolicy is only registered under the
    // `getTasksByUser` field name, and even if it were reused for the
    // paginated field, `Array.isArray(incoming)` would be false here, so
    // the for-loop never runs and pagination-driven merging silently no-ops.
    const incoming = { tasks: ['a', 'b'], totalCount: 2 };
    const result = mergeGetTasksByUser(['existing'], incoming, {
      args: { offset: 1 },
    });
    expect(result).toEqual(['existing']);
  });

  it('BUG: a negative offset writes to negative/string-keyed indices instead of failing loudly', () => {
    const result = mergeGetTasksByUser(['a', 'b', 'c'], ['X'], {
      args: { offset: -1 },
    }) as unknown[];
    // JS arrays silently accept negative numeric-looking keys as ordinary
    // properties, not real negative indices — this does NOT throw, but it
    // also does not do what a caller would reasonably expect ("insert one
    // before the start"); the array's numeric length/indices are unaffected
    // and a stray `"-1"` property is attached instead.
    expect(result.length).toBe(3);
    expect((result as unknown as Record<string, unknown>)['-1']).toBe('X');
  });

  it('CRASH: throws when `existing` is a non-array truthy object without `.slice`', () => {
    // Simulates a corrupted cache entry (e.g. a previous write with the
    // wrong shape) — `(existing as unknown[]).slice(0)` assumes `.slice`
    // exists on anything truthy.
    const corruptExisting = { foo: 1 };
    expect(() =>
      mergeGetTasksByUser(corruptExisting, ['a'], { args: { offset: 0 } }),
    ).toThrow();
  });

  it('propagates null/undefined elements from `incoming` straight into the merged array', () => {
    const result = mergeGetTasksByUser(undefined, [null, undefined, 'c'], {
      args: { offset: 0 },
    });
    expect(result).toEqual([null, undefined, 'c']);
  });

  it('a string `existing` does not throw (strings have .slice) but silently produces a string, not an array', () => {
    // Another corrupted-cache-state case: `.slice` exists on String.prototype
    // too, so this specific malformed input limps along without crashing,
    // masking the underlying corruption rather than surfacing it.
    const result = mergeGetTasksByUser('not-an-array', [], {
      args: { offset: 0 },
    });
    expect(result).toBe('not-an-array');
  });
});
