import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskFormState as useHomeTaskFormState } from '@/pages/Home/components/CreateTaskModal/hooks/useTaskFormState';
import { useTaskFormState as useDetailTaskFormState } from '@/pages/Tasks/components/TaskDetailModal/hooks/useTaskFormState';
import type { Task } from '@/redux/tasks/task.types';

const baseTask = (overrides: Partial<Task> = {}): Task => ({
  id: 't-1',
  user_id: 'u-1',
  title: 'Existing task',
  notes: '',
  priority_level: 2,
  deadline: '2026-01-01T00:00:00.000Z',
  status: 'Todo',
  category: 'General',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('useTaskFormState (Home / CreateTaskModal variant)', () => {
  it('defaults currentDate to now when there is no initialTask', () => {
    const { result } = renderHook(() =>
      useHomeTaskFormState({ initialTask: null, initialStart: null }),
    );
    expect(result.current.currentDate).toBeInstanceOf(Date);
    expect(Number.isNaN(result.current.currentDate!.getTime())).toBe(false);
  });

  it('treats a garbage deadline as no date instead of an Invalid Date', () => {
    // getInitialState guards `new Date(deadline)` with an isNaN check — an
    // Invalid Date used to flow into handleSave/handleUpdate's
    // `.toISOString()` calls (see useTaskMutations.crashBugs.test.ts).
    const { result } = renderHook(() =>
      useHomeTaskFormState({
        initialTask: baseTask({ deadline: 'not-a-real-date' }),
        initialStart: null,
      }),
    );
    expect(result.current.currentDate).toBeNull();
  });

  it('opens a task without a date undated instead of giving it today', () => {
    const { result } = renderHook(() =>
      useHomeTaskFormState({
        initialTask: baseTask({ deadline: null }),
        initialStart: null,
      }),
    );
    expect(result.current.currentDate).toBeNull();
  });

  it('validateForm rejects an empty title', () => {
    const { result } = renderHook(() =>
      useHomeTaskFormState({ initialTask: null, initialStart: null }),
    );
    act(() => {
      result.current.setDuration('30m');
    });
    let isValid = true;
    act(() => {
      isValid = result.current.validateForm();
    });
    expect(isValid).toBe(false);
    expect(result.current.errors.title).toBeTruthy();
  });

  it('validateForm enforces the >=15 minute minimum duration', () => {
    const { result } = renderHook(() =>
      useHomeTaskFormState({ initialTask: null, initialStart: null }),
    );
    act(() => {
      result.current.setTitle('Valid title');
      result.current.setDuration('5m');
    });
    let isValid = true;
    act(() => {
      isValid = result.current.validateForm();
    });
    expect(isValid).toBe(false);
    expect(result.current.errors.duration).toMatch(/15 minutes/);
  });

  it('validateForm rejects malformed duration text', () => {
    const { result } = renderHook(() =>
      useHomeTaskFormState({ initialTask: null, initialStart: null }),
    );
    act(() => {
      result.current.setTitle('Valid title');
      result.current.setDuration('lots');
    });
    let isValid = true;
    act(() => {
      isValid = result.current.validateForm();
    });
    expect(isValid).toBe(false);
  });

  it('handleAddCollaborator ignores a duplicate email (case/whitespace-insensitive)', () => {
    const { result } = renderHook(() =>
      useHomeTaskFormState({ initialTask: null, initialStart: null }),
    );
    act(() => {
      result.current.handleAddCollaborator('  Test@Example.com ');
    });
    act(() => {
      result.current.handleAddCollaborator('test@example.com');
    });
    expect(result.current.collaborators).toHaveLength(1);
  });

  it('handleAddCollaborator silently no-ops for an empty/whitespace-only email', () => {
    const { result } = renderHook(() =>
      useHomeTaskFormState({ initialTask: null, initialStart: null }),
    );
    act(() => {
      result.current.handleAddCollaborator('   ');
    });
    expect(result.current.collaborators).toHaveLength(0);
  });

  it('timeSlotDisplay is empty, never Invalid Date text, when the source deadline was garbage', () => {
    const { result } = renderHook(() =>
      useHomeTaskFormState({
        initialTask: baseTask({ deadline: 'garbage' }),
        initialStart: null,
      }),
    );
    expect(result.current.timeSlotDisplay).toBe('');
    expect(result.current.timeSlotDisplay).not.toMatch(/invalid/i);
  });
});

describe('useTaskFormState (TaskDetailModal variant) — custom behavior for task details', () => {
  it('allows duration under 15 minutes in TaskDetailModal variant', () => {
    const { result } = renderHook(() =>
      useDetailTaskFormState({ initialTask: null, initialStart: null }),
    );
    act(() => {
      result.current.setTitle('Valid title');
      result.current.setDuration('5m');
    });
    let isValid = false;
    act(() => {
      isValid = result.current.validateForm();
    });
    expect(isValid).toBe(true);
    expect(result.current.errors.duration).toBeUndefined();
  });

  it('defaults currentDate to null when initialTask has an invalid deadline and no estimated_start_date', () => {
    const { result } = renderHook(() =>
      useDetailTaskFormState({
        initialTask: baseTask({ deadline: 'not-a-real-date' }),
        initialStart: null,
      }),
    );
    expect(result.current.currentDate).toBeNull();
  });

  it('prefers a valid estimated_start_date over a garbage deadline when both are present', () => {
    const { result } = renderHook(() =>
      useDetailTaskFormState({
        initialTask: baseTask({
          deadline: 'garbage-deadline',
          estimated_start_date: '2026-03-01T09:00:00.000Z',
        }),
        initialStart: null,
      }),
    );
    expect(result.current.currentDate!.toISOString()).toBe(
      '2026-03-01T09:00:00.000Z',
    );
  });
});
