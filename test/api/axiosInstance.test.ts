import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// axiosInstance.ts resolves these via dynamic `await import(...)` inside the
// response interceptor (to dodge a circular dependency at bundle startup), so
// the mocks below must be in place before the module under test is imported.
const dispatchMock = vi.fn();
const getStateMock = vi.fn();
const logoutActionMock = vi.fn((reason: string) => ({
  type: 'auth/logout',
  payload: reason,
}));

vi.mock('@/redux/store', () => ({
  store: {
    dispatch: dispatchMock,
    getState: getStateMock,
  },
}));

vi.mock('@/redux/auth/auth.slice', () => ({
  logout: logoutActionMock,
}));

vi.mock('@/config/env.config', () => ({
  API_BASE_URL: 'http://test.local',
}));

const { default: axiosInstance } = await import('@/api/axiosInstance');

function setLoggedInUser(id = 'user-1') {
  getStateMock.mockReturnValue({ auth: { user: { id } } });
}

function setNoUser() {
  getStateMock.mockReturnValue({ auth: { user: null } });
}

describe('axiosInstance auth-refresh interceptor', () => {
  let instanceMock: MockAdapter;
  let rawAxiosMock: MockAdapter;

  beforeEach(() => {
    instanceMock = new MockAdapter(axiosInstance);
    rawAxiosMock = new MockAdapter(axios);
    dispatchMock.mockClear();
    logoutActionMock.mockClear();
    setLoggedInUser();
  });

  afterEach(() => {
    instanceMock.restore();
    rawAxiosMock.restore();
  });

  it('transparently retries the original request after a successful silent refresh', async () => {
    instanceMock
      .onGet('/tasks')
      .replyOnce(401)
      .onGet('/tasks')
      .reply(200, { tasks: [] });
    rawAxiosMock.onPost('http://test.local/auth/refresh').reply(200);

    const response = await axiosInstance.get('/tasks');

    expect(response.status).toBe(200);
    expect(rawAxiosMock.history.post).toHaveLength(1);
  });

  it('deduplicates concurrent 401s behind a single refresh call (no refresh storm)', async () => {
    ['/tasks', '/notifications', '/workspaces'].forEach((path) => {
      instanceMock
        .onGet(path)
        .replyOnce(401)
        .onGet(path)
        .reply(200, { ok: true });
    });
    rawAxiosMock.onPost('http://test.local/auth/refresh').reply(200);

    const results = await Promise.all([
      axiosInstance.get('/tasks'),
      axiosInstance.get('/notifications'),
      axiosInstance.get('/workspaces'),
    ]);

    expect(results.every((r) => r.status === 200)).toBe(true);
    // Three independent requests failed at ~the same time: a naive
    // implementation fires one refresh per failure. Real users on a flaky
    // connection routinely fire several requests at once (dashboard mounting
    // = tasks + notifications + workspaces in parallel), so this must stay 1.
    expect(rawAxiosMock.history.post).toHaveLength(1);
  });

  it('logs the user out and rejects the request when the refresh call itself fails', async () => {
    instanceMock.onGet('/tasks').reply(401);
    rawAxiosMock.onPost('http://test.local/auth/refresh').reply(401);

    await expect(axiosInstance.get('/tasks')).rejects.toBeTruthy();

    expect(logoutActionMock).toHaveBeenCalledWith('expired');
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'auth/logout',
      payload: 'expired',
    });
  });

  it('does not attempt a refresh when no user is present, and just logs out', async () => {
    setNoUser();
    instanceMock.onGet('/tasks').reply(401);

    await expect(axiosInstance.get('/tasks')).rejects.toBeTruthy();

    expect(rawAxiosMock.history.post).toHaveLength(0);
    expect(logoutActionMock).toHaveBeenCalledWith('expired');
  });
});
