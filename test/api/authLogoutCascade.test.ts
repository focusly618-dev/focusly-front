import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// Integration test on purpose: real store, real auth.slice `logout` thunk,
// real authApi.logoutUser, real axiosInstance. Only the HTTP transport is
// mocked. Regression guard for an easy-to-miss wiring problem:
// `authApi.logoutUser()` (called from inside the `logout` thunk) posts to
// `/auth/logout` through axiosInstance — the SAME instance whose interceptor
// reacts to 401s. If a session is fully expired (refresh token invalid too)
// AND the backend's /auth/logout route also requires a valid session
// (common if it sits behind auth middleware), a naive interceptor treats
// that 401 like any other and dispatches another logout, which POSTs to
// /auth/logout again — a cascading "logout storm" hammering the backend.
// axiosInstance.ts now special-cases auth endpoints (isAuthEndpoint) so a
// 401 from /auth/logout or /auth/refresh just rejects instead of
// re-triggering the whole refresh/logout dance.
vi.mock('@/config/env.config', () => ({ API_BASE_URL: 'http://test.local' }));

const { store } = await import('@/redux/store');
const { login, clearAuth } = await import('@/redux/auth/auth.slice');
const { AuthProviders } =
  await import('@/pages/Public/Login/types/Login.types');
const { default: axiosInstance } = await import('@/api/axiosInstance');

describe('logout cascade when both refresh and /auth/logout are unauthenticated', () => {
  let instanceMock: MockAdapter;
  let rawAxiosMock: MockAdapter;
  let refreshCalls: number;
  let logoutCalls: number;

  beforeEach(() => {
    // auth.slice's logout thunk deliberately console.errors on a failed
    // logoutUser() call; expected noise for this scenario, silenced here.
    vi.spyOn(console, 'error').mockImplementation(() => {});
    instanceMock = new MockAdapter(axiosInstance);
    rawAxiosMock = new MockAdapter(axios);
    refreshCalls = 0;
    logoutCalls = 0;

    store.dispatch(
      login({
        user: { id: 'user-1' },
        provider: AuthProviders.email,
        isLogged: true,
      }),
    );

    // Session is fully expired: silent refresh never succeeds.
    rawAxiosMock.onPost('http://test.local/auth/refresh').reply(() => {
      refreshCalls += 1;
      return [401];
    });

    // The logout endpoint itself sits behind auth and also 401s once the
    // session is gone — this is the piece that closes the loop. A safety
    // valve after 12 calls keeps the test from hanging if the cascade truly
    // never terminates; the assertions below fail long before that matters.
    instanceMock.onPost('/auth/logout').reply(() => {
      logoutCalls += 1;
      return logoutCalls > 12 ? [200, { message: 'ok' }] : [401];
    });

    instanceMock.onGet('/protected').reply(401);
  });

  afterEach(() => {
    instanceMock.restore();
    rawAxiosMock.restore();
    store.dispatch(clearAuth());
    vi.restoreAllMocks();
  });

  it('spends at most one refresh attempt and one logout attempt per expired session, instead of cascading', async () => {
    await expect(axiosInstance.get('/protected')).rejects.toBeTruthy();

    // The interceptor's `store.dispatch(logout('expired'))` is fire-and-forget
    // (not awaited), so give its async chain room to run/cascade.
    await vi.waitFor(
      () => {
        expect(refreshCalls + logoutCalls).toBeGreaterThan(0);
      },
      { timeout: 1000 },
    );
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(refreshCalls).toBeLessThanOrEqual(1);
    expect(logoutCalls).toBeLessThanOrEqual(1);
  });
});
