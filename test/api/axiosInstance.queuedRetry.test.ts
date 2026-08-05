import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// Kept in its own file on purpose: axiosInstance.ts holds `isRefreshing` and
// `failedQueue` as module-level mutable state, and this scenario is exactly
// about that state machine. Vitest gives every test FILE its own fresh
// module registry, so this guarantees no leftover refresh-in-progress state
// from unrelated tests can leak in and make the outcome timing-dependent.
const dispatchMock = vi.fn();
const getStateMock = vi.fn(() => ({ auth: { user: { id: 'user-1' } } }));
const logoutActionMock = vi.fn((reason: string) => ({
  type: 'auth/logout',
  payload: reason,
}));

vi.mock('@/redux/store', () => ({
  store: { dispatch: dispatchMock, getState: getStateMock },
}));

vi.mock('@/redux/auth/auth.slice', () => ({
  logout: logoutActionMock,
}));

vi.mock('@/config/env.config', () => ({
  API_BASE_URL: 'http://test.local',
}));

const { default: axiosInstance } = await import('@/api/axiosInstance');

describe('axiosInstance queued (follower) request retry flag', () => {
  let instanceMock: MockAdapter;
  let rawAxiosMock: MockAdapter;

  beforeEach(() => {
    instanceMock = new MockAdapter(axiosInstance);
    rawAxiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    instanceMock.restore();
    rawAxiosMock.restore();
  });

  it('marks a queued request as retried too, so a second 401 on it rejects instead of opening a second refresh cycle', async () => {
    // Leader ('/tasks') and follower ('/notifications') 401 at the same
    // instant — realistic on dashboard mount, which fires several requests
    // in parallel. Refresh succeeds, but the follower's retry 401s again:
    // in real life this happens when the refreshed cookie hasn't propagated
    // to every in-flight connection yet, or the follower legitimately lacks
    // permission for its own route. Either way it must fail cleanly, not
    // spend a second refresh attempt it never earned.
    instanceMock.onGet('/tasks').replyOnce(401).onGet('/tasks').reply(200);
    instanceMock
      .onGet('/notifications')
      .replyOnce(401)
      .onGet('/notifications')
      .reply(401);
    rawAxiosMock.onPost('http://test.local/auth/refresh').reply(200);

    const [tasksResult, notificationsResult] = await Promise.allSettled([
      axiosInstance.get('/tasks'),
      axiosInstance.get('/notifications'),
    ]);

    expect(tasksResult.status).toBe('fulfilled');
    expect(notificationsResult.status).toBe('rejected');
    // Regression guard: `_retry` must be set before the "already
    // refreshing, get in line" queue check, not after it, so a queued
    // follower is just as "already tried" as the leader that queued it.
    expect(rawAxiosMock.history.post).toHaveLength(1);
  });
});
