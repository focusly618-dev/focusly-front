import { describe, it, expect } from 'vitest';
import reducer, {
  setTasks,
  addTask,
  updateTask,
  upsertTask,
  softDeleteTask,
  removeTask,
  removeTasks,
  setLoading,
  setError,
  resetTask,
} from '@/redux/tasks/task.slice';
import type { Task, TaskState } from '@/redux/tasks/task.types';

const baseTask = (overrides: Partial<Task> = {}): Task => ({
  id: 't-1',
  user_id: 'u-1',
  title: 'Sample task',
  notes_encrypted: '',
  priority_level: 2,
  deadline: '2026-01-01T00:00:00.000Z',
  status: 'Todo',
  category: 'General',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const emptyState: TaskState = { tasks: [], loading: false, error: null };

describe('task.slice reducer — CRUD correctness', () => {
  it('setTasks replaces the whole list, including with an empty array', () => {
    const state = reducer(
      { tasks: [baseTask()], loading: false, error: null },
      setTasks([]),
    );
    expect(state.tasks).toEqual([]);
  });

  it('addTask appends without checking for an existing id (can create duplicates)', () => {
    const task = baseTask();
    const state = reducer(
      { tasks: [task], loading: false, error: null },
      addTask(task),
    );
    expect(state.tasks).toHaveLength(2);
    expect(state.tasks[0].id).toBe(state.tasks[1].id);
  });

  it('upsertTask inserts when the id is new', () => {
    const state = reducer(emptyState, upsertTask(baseTask({ id: 'new-1' })));
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].id).toBe('new-1');
  });

  it('upsertTask replaces in place when the id already exists', () => {
    const original = baseTask({ id: 't-1', title: 'Original' });
    const updated = baseTask({ id: 't-1', title: 'Updated' });
    const state = reducer(
      { tasks: [original], loading: false, error: null },
      upsertTask(updated),
    );
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].title).toBe('Updated');
  });

  it('updateTask silently no-ops when the id does not match any task (no error, no change)', () => {
    const original = baseTask({ id: 't-1' });
    const state = reducer(
      { tasks: [original], loading: false, error: null },
      updateTask(baseTask({ id: 'does-not-exist', title: 'Ghost update' })),
    );
    expect(state.tasks).toEqual([original]);
  });

  it('softDeleteTask silently no-ops for an unknown id', () => {
    const original = baseTask({ id: 't-1' });
    const state = reducer(
      { tasks: [original], loading: false, error: null },
      softDeleteTask({ id: 'unknown' }),
    );
    expect(state.tasks[0].deleted_at).toBeUndefined();
  });

  it('softDeleteTask stamps deleted_at on the matching task', () => {
    const original = baseTask({ id: 't-1' });
    const state = reducer(
      { tasks: [original], loading: false, error: null },
      softDeleteTask({ id: 't-1' }),
    );
    expect(state.tasks[0].deleted_at).toBeTruthy();
  });

  it('removeTask on an empty list is a safe no-op', () => {
    const state = reducer(emptyState, removeTask({ id: 'anything' }));
    expect(state.tasks).toEqual([]);
  });

  it('removeTasks with an empty ids array removes nothing', () => {
    const original = baseTask({ id: 't-1' });
    const state = reducer(
      { tasks: [original], loading: false, error: null },
      removeTasks({ ids: [] }),
    );
    expect(state.tasks).toHaveLength(1);
  });

  it('removeTasks tolerates a malformed payload missing `ids` instead of throwing', () => {
    const original = baseTask({ id: 't-1' });
    // Simulates a corrupt dispatch (e.g. a caller that forgot to wrap ids)
    // bypassing the PayloadAction<{ids: string[]}> type via `as any`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const malformedAction = removeTasks({} as any);
    expect(() =>
      reducer(
        { tasks: [original], loading: false, error: null },
        malformedAction,
      ),
    ).not.toThrow();
  });

  it('setError(null) clears a previously set error', () => {
    const state = reducer(
      { tasks: [], loading: false, error: 'boom' },
      setError(null),
    );
    expect(state.error).toBeNull();
  });

  it('setLoading toggles independently of tasks/error', () => {
    const state = reducer(
      { tasks: [baseTask()], loading: false, error: 'boom' },
      setLoading(true),
    );
    expect(state.loading).toBe(true);
    expect(state.tasks).toHaveLength(1);
    expect(state.error).toBe('boom');
  });

  it('resetTask wipes tasks, loading and error together', () => {
    const state = reducer(
      { tasks: [baseTask()], loading: true, error: 'boom' },
      resetTask(),
    );
    expect(state).toEqual(emptyState);
  });
});

describe('task.slice reducer — adversarial / can-it-break-the-app cases', () => {
  it('upsertTask with a task missing `id` (bypassing TS) matches an existing task that also lacks an id, silently corrupting it', () => {
    // A malformed task with no id can slip through when data comes from an
    // untyped source (e.g. a raw fetch response cast without validation).
    const corruptExisting = baseTask({ title: 'First corrupt task' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (corruptExisting as any).id;
    const corruptIncoming = baseTask({ title: 'Second corrupt task' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (corruptIncoming as any).id;

    const state = reducer(
      { tasks: [corruptExisting], loading: false, error: null },
      upsertTask(corruptIncoming),
    );

    // BUG: two unrelated tasks that both happen to lack an id collapse into
    // one, because `findIndex(t => t.id === action.payload.id)` matches
    // `undefined === undefined`. The first task silently disappears.
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].title).toBe('Second corrupt task');
  });

  it('removeTasks with duplicate ids in the payload removes the task exactly once (Set dedupes safely)', () => {
    const original = baseTask({ id: 't-1' });
    const state = reducer(
      { tasks: [original], loading: false, error: null },
      removeTasks({ ids: ['t-1', 't-1', 't-1'] }),
    );
    expect(state.tasks).toEqual([]);
  });

  it('a very large task list does not throw on any CRUD op (stress/perf smoke test)', () => {
    const many = Array.from({ length: 5000 }, (_, i) =>
      baseTask({ id: `t-${i}` }),
    );
    let state: TaskState = { tasks: many, loading: false, error: null };
    expect(() => {
      state = reducer(
        state,
        upsertTask(baseTask({ id: 't-2500', title: 'Updated mid-list' })),
      );
      state = reducer(state, removeTask({ id: 't-4999' }));
    }).not.toThrow();
    expect(state.tasks.find((t) => t.id === 't-2500')?.title).toBe(
      'Updated mid-list',
    );
    expect(state.tasks.find((t) => t.id === 't-4999')).toBeUndefined();
  });
});
