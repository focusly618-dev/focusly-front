import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { gql } from '@apollo/client';

// Regression guard for a real bug: the GraphQL error link (apollo.ts) used
// to retry a 401'd operation once after a successful refresh, but had no
// guard against that SAME operation coming back 401 again post-refresh —
// unlike axiosInstance.ts's REST interceptor (`originalRequest._retry`).
// A token that keeps getting rejected even right after a fresh refresh
// would loop forever: refresh, retry, 401, refresh, retry, 401... hammering
// /auth/refresh and the original query instead of ever giving up and
// logging the user out.
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

const { client } = await import('@/api/apollo');

const PING_QUERY = gql`
  query Ping {
    ping
  }
`;

const unauthenticatedResponse = () =>
  new Response(
    JSON.stringify({
      errors: [
        {
          message: 'not authenticated',
          extensions: { code: 'UNAUTHENTICATED' },
        },
      ],
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );

const okResponse = (data: unknown) =>
  new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

describe('GraphQL error link — retry-after-refresh guard', () => {
  let rawAxiosMock: MockAdapter;
  let refreshCalls: number;
  let graphqlCalls: number;

  beforeEach(() => {
    dispatchMock.mockClear();
    rawAxiosMock = new MockAdapter(axios);
    refreshCalls = 0;
    graphqlCalls = 0;
  });

  afterEach(() => {
    rawAxiosMock.restore();
    vi.unstubAllGlobals();
  });

  it('retries at most once, then logs out — never loops — when the refreshed token still gets rejected (session truly over)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        graphqlCalls += 1;
        return unauthenticatedResponse(); // every attempt 401s, even after "refresh"
      }),
    );

    rawAxiosMock.onPost('http://test.local/auth/refresh').reply(() => {
      refreshCalls += 1;
      return [200]; // refresh call itself succeeds, but the new token is still no good
    });

    await expect(
      client.query({ query: PING_QUERY, fetchPolicy: 'no-cache' }),
    ).rejects.toBeTruthy();

    expect(refreshCalls).toBe(1);
    expect(graphqlCalls).toBe(2); // original attempt + exactly one retry
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/logout', payload: 'expired' }),
    );
  });

  it('recovers silently when the refreshed token is accepted on retry (the normal 15-minute access-token cycle)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        graphqlCalls += 1;
        return graphqlCalls === 1
          ? unauthenticatedResponse()
          : okResponse({ ping: 'pong' });
      }),
    );

    rawAxiosMock.onPost('http://test.local/auth/refresh').reply(() => {
      refreshCalls += 1;
      return [200];
    });

    const result = await client.query({
      query: PING_QUERY,
      fetchPolicy: 'no-cache',
    });

    expect(result.data).toEqual({ ping: 'pong' });
    expect(refreshCalls).toBe(1);
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('logs out immediately, without ever calling refresh, when there is no logged-in user to refresh for', async () => {
    getStateMock.mockReturnValueOnce({ auth: { user: null } });
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        graphqlCalls += 1;
        return unauthenticatedResponse();
      }),
    );
    rawAxiosMock.onPost('http://test.local/auth/refresh').reply(() => {
      refreshCalls += 1;
      return [200];
    });

    await client
      .query({ query: PING_QUERY, fetchPolicy: 'no-cache' })
      .catch(() => undefined);

    expect(refreshCalls).toBe(0);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/logout', payload: 'expired' }),
    );
  });
});
