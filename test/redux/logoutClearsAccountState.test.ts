import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';

// Integration test on purpose: real store, real auth.slice `logout` thunk.
// Regression guard for a cross-account data leak: logging out only ever
// cleared the `auth` slice (isLogged/user/authProvider). `task.tasks` and
// `calendar.reduxEvents` were left untouched in memory, so logging back in
// with a DIFFERENT account rendered the PREVIOUS account's tasks/events
// until the new user's GET_TASKS query happened to resolve and overwrite
// them. `logout` now also dispatches resetTask()/resetCalendar() and clears
// the Apollo cache.
vi.mock('@/config/env.config', () => ({ API_BASE_URL: 'http://test.local' }));

const { store } = await import('@/redux/store');
const { login, logout } = await import('@/redux/auth/auth.slice');
const { setTasks } = await import('@/redux/tasks/task.slice');
const { setEvents } = await import('@/redux/calendar/calendar.slice');
const { AuthProviders } = await import('@/pages/Public/Login/types/Login.types');
const { default: axiosInstance } = await import('@/api/axiosInstance');
const { client } = await import('@/api/apollo');

const baseTask = {
  id: 't-1',
  user_id: 'account-a',
  title: 'Account A private task',
  notes_encrypted: '',
  priority_level: 2,
  deadline: '2026-01-01T00:00:00.000Z',
  status: 'Todo' as const,
  category: 'General',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

const baseEvent = {
  id: 'ev-1',
  title: 'Account A private event',
  deadline: '2026-01-01T00:00:00.000Z',
  estimated_start_date: '2026-01-01T00:00:00.000Z',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  is_all_day: false,
};

describe('logout clears task/calendar state, not just auth', () => {
  let instanceMock: MockAdapter;

  beforeEach(() => {
    instanceMock = new MockAdapter(axiosInstance);
    instanceMock.onPost('/auth/logout').reply(200, { message: 'ok' });

    store.dispatch(
      login({
        user: { id: 'account-a' },
        provider: AuthProviders.email,
        isLogged: true,
      }),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch(setTasks([baseTask as any]));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch(setEvents([baseEvent as any]));
  });

  afterEach(() => {
    instanceMock.restore();
    vi.restoreAllMocks();
  });

  it('FIXED: wipes task.tasks and calendar.reduxEvents so the next login never renders the previous account data', async () => {
    expect(store.getState().task.tasks).toHaveLength(1);
    expect(store.getState().calendar.reduxEvents).toHaveLength(1);

    const clearStoreSpy = vi.spyOn(client, 'clearStore');

    await store.dispatch(logout());

    const state = store.getState();
    expect(state.auth.isLogged).toBe(false);
    expect(state.auth.user).toBeNull();
    expect(state.task.tasks).toEqual([]);
    expect(state.calendar.reduxEvents).toEqual([]);
    expect(clearStoreSpy).toHaveBeenCalledTimes(1);
  });
});
