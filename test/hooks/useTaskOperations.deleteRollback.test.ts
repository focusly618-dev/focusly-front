import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '@/redux/tasks/task.slice';
import calendarReducer from '@/redux/calendar/calendar.slice';
import authReducer from '@/redux/auth/auth.slice';
import schedulingReducer from '@/redux/scheduling/scheduling.slice';
import type { Task } from '@/redux/tasks/task.types';

const deleteGoogleEvent = vi.fn();
vi.mock('@/api/GoogleCalendar/googleCalendarApi', () => ({
  deleteGoogleEvent: (...args: unknown[]) => deleteGoogleEvent(...args),
  fetchGoogleEvents: vi.fn(),
  updateGoogleEvent: vi.fn(),
  createGoogleEvent: vi.fn(),
}));

let deleteTaskMutationImpl: () => Promise<unknown> = () =>
  Promise.resolve({ data: { deleteTask: true } });

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client')>();
  return {
    ...actual,
    useMutation: () => [() => deleteTaskMutationImpl(), {}],
  };
});

const { useTaskOperations } = await import('@/hooks/useTaskOperations');

const makeStore = (preloadedTask?: Task) =>
  configureStore({
    reducer: {
      auth: authReducer,
      calendar: calendarReducer,
      task: taskReducer,
      scheduling: schedulingReducer,
    },
    preloadedState: {
      auth: {
        isLogged: true,
        user: { id: 'u-1' },
        authProvider: null,
        onboardingCompleted: true,
        sessionExpiredNotice: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      task: {
        tasks: preloadedTask ? [preloadedTask] : [],
        loading: false,
        error: null,
      },
    },
  });

const baseTask: Task = {
  id: 'task-to-delete',
  user_id: 'u-1',
  title: 'Doomed task',
  notes_encrypted: '',
  priority_level: 2,
  deadline: '2026-01-01T00:00:00.000Z',
  status: 'Todo',
  category: 'General',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

describe('executeDeleteTask — optimistic delete with NO rollback on failure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('removes the task from Redux immediately, before the network mutation resolves', async () => {
    let resolveMutation: (v: unknown) => void = () => {};
    deleteTaskMutationImpl = () =>
      new Promise((resolve) => {
        resolveMutation = resolve;
      });

    const store = makeStore(baseTask);
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(Provider, { store, children });

    const { result } = renderHook(() => useTaskOperations(), { wrapper });

    const deletePromise = result.current.executeDeleteTask('task-to-delete');

    // Even though the mutation hasn't resolved yet, the optimistic dispatch
    // has already fired synchronously.
    expect(store.getState().task.tasks).toHaveLength(0);

    resolveMutation({ data: { deleteTask: true } });
    await deletePromise;
  });

  it('FIXED: restores the task to Redux when the delete mutation fails, instead of leaving it permanently gone', async () => {
    // executeDeleteTask dispatches removeTask/removeEvent BEFORE awaiting
    // deleteTaskMutation. It now snapshots the task/event beforehand and,
    // if the mutation subsequently rejects, dispatches a rollback before
    // re-throwing — so the caller still sees (and can show) the error, but
    // Redux no longer disagrees with that error by having already deleted
    // the task.
    deleteTaskMutationImpl = () =>
      Promise.reject(new Error('Task with ID task-to-delete not found'));

    const store = makeStore(baseTask);
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(Provider, { store, children });

    const { result } = renderHook(() => useTaskOperations(), { wrapper });

    await expect(
      result.current.executeDeleteTask('task-to-delete'),
    ).rejects.toThrow('not found');

    // The task is restored after the rollback.
    expect(store.getState().task.tasks).toHaveLength(1);
    expect(store.getState().task.tasks[0].id).toBe('task-to-delete');
  });

  it('throws before dispatching anything when there is no authenticated user (safe path)', async () => {
    const noUserStore = configureStore({
      reducer: {
        auth: authReducer,
        calendar: calendarReducer,
        task: taskReducer,
        scheduling: schedulingReducer,
      },
      preloadedState: {
        auth: {
          isLogged: false,
          user: null,
          authProvider: null,
          onboardingCompleted: false,
          sessionExpiredNotice: false,
        },
        task: { tasks: [baseTask], loading: false, error: null },
      },
    });
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(Provider, { store: noUserStore, children });

    const { result } = renderHook(() => useTaskOperations(), { wrapper });

    await expect(
      result.current.executeDeleteTask('task-to-delete'),
    ).rejects.toThrow('User not authenticated');

    // No optimistic dispatch happened — task is still there.
    expect(noUserStore.getState().task.tasks).toHaveLength(1);
  });

  it('swallows a failing Google Calendar cleanup and still proceeds with the platform delete', async () => {
    deleteGoogleEvent.mockRejectedValue(new Error('Google API down'));
    deleteTaskMutationImpl = () =>
      Promise.resolve({ data: { deleteTask: true } });

    const store = makeStore({ ...baseTask, google_event_id: 'gcal-1' });
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(Provider, { store, children });

    const { result } = renderHook(() => useTaskOperations(), { wrapper });

    await expect(
      result.current.executeDeleteTask('task-to-delete', {
        googleEventId: 'gcal-1',
      }),
    ).resolves.toBeUndefined();

    expect(store.getState().task.tasks).toHaveLength(0);
  });
});
