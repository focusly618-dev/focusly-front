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
    expect(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  it('FIXED: a negative offset is clamped to 0 instead of writing a stray negative-keyed property', () => {
    const result = mergeGetTasksByUser(['a', 'b', 'c'], ['X'], {
      args: { offset: -1 },
    }) as unknown[];
    expect(result).toEqual(['X', 'b', 'c']);
    expect(
      (result as unknown as Record<string, unknown>)['-1'],
    ).toBeUndefined();
  });

  it('FIXED: a non-array truthy `existing` (corrupted cache entry) is treated as empty instead of throwing', () => {
    const corruptExisting = { foo: 1 };
    const result = mergeGetTasksByUser(corruptExisting, ['a'], {
      args: { offset: 0 },
    });
    expect(result).toEqual(['a']);
  });

  it('propagates null/undefined elements from `incoming` straight into the merged array', () => {
    const result = mergeGetTasksByUser(undefined, [null, undefined, 'c'], {
      args: { offset: 0 },
    });
    expect(result).toEqual([null, undefined, 'c']);
  });

  it('FIXED: a string `existing` (corrupted cache state) is treated as empty instead of silently propagating a string where an array is expected', () => {
    const result = mergeGetTasksByUser('not-an-array', [], {
      args: { offset: 0 },
    });
    expect(result).toEqual([]);
  });
});
