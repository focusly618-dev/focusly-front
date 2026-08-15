import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskFormState as useHomeTaskFormState } from '@/pages/Home/components/CreateTaskModal/hooks/useTaskFormState';
import { useTaskFormState as useDetailTaskFormState } from '@/pages/Tasks/components/TaskDetailModal/hooks/useTaskFormState';
import type { Task } from '@/redux/tasks/task.types';

const baseTask = (overrides: Partial<Task> = {}): Task => ({
  id: 't-1',
  user_id: 'u-1',
  title: 'Existing task',
  notes_encrypted: '',
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

  it('FIXED: falls back to a valid "now" currentDate instead of Invalid Date when initialTask.deadline is a garbage string', () => {
    // getInitialState now guards `new Date(deadline)` with an isNaN check —
    // this used to flow an Invalid Date straight into form state and,
    // downstream, into handleSave/handleUpdate's `.toISOString()` calls
    // (see useTaskMutations.crashBugs.test.ts for the crash that caused).
    const { result } = renderHook(() =>
      useHomeTaskFormState({
        initialTask: baseTask({ deadline: 'not-a-real-date' }),
        initialStart: null,
      }),
    );
    expect(Number.isNaN(result.current.currentDate!.getTime())).toBe(false);
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

  it('timeSlotDisplay produces a real time range instead of Invalid Date text when the source deadline was garbage', () => {
    const { result } = renderHook(() =>
      useHomeTaskFormState({
        initialTask: baseTask({ deadline: 'garbage' }),
        initialStart: null,
      }),
    );
    expect(result.current.timeSlotDisplay).not.toBe('');
    expect(result.current.timeSlotDisplay).not.toMatch(/invalid/i);
  });
});

describe('useTaskFormState (TaskDetailModal variant) — now consistent with the Home variant', () => {
  it('FIXED: validateForm now enforces the same >=15 minute minimum as the Home variant — a 5m duration is rejected here too', () => {
    const { result } = renderHook(() =>
      useDetailTaskFormState({ initialTask: null, initialStart: null }),
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

  it('FIXED: also falls back to a valid "now" currentDate from a garbage initialTask.deadline (same fix, different code path)', () => {
    const { result } = renderHook(() =>
      useDetailTaskFormState({
        initialTask: baseTask({ deadline: 'not-a-real-date' }),
        initialStart: null,
      }),
    );
    expect(Number.isNaN(result.current.currentDate!.getTime())).toBe(false);
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
