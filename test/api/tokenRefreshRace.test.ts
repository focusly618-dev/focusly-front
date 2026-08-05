import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { gql } from '@apollo/client';

// REST (axiosInstance.ts) and GraphQL (apollo.ts) share a single
// refreshAuthToken() lock (src/api/authRefresh.ts) instead of each keeping
// its own private "one refresh at a time" guard. A real page load fires
// both kinds of requests together (e.g. a REST call for user prefs
// alongside a GraphQL query for tasks) — if the token expires right then
// and each layer raced its own refresh, and the backend rotates/invalidates
// the previous refresh token on use (common practice), the loser of that
// race would get a hard failure and force-log out a user whose session was
// actually fine.
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
const { client } = await import('@/api/apollo');

const PING_QUERY = gql`
  query Ping {
    ping
  }
`;

describe('REST vs GraphQL refresh race', () => {
  let restMock: MockAdapter;
  let rawAxiosMock: MockAdapter;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    restMock = new MockAdapter(axiosInstance);
    rawAxiosMock = new MockAdapter(axios);

    let graphqlCallCount = 0;
    fetchMock = vi.fn(async () => {
      graphqlCallCount += 1;
      const body =
        graphqlCallCount === 1
          ? {
              errors: [
                {
                  message: 'not authenticated',
                  extensions: { code: 'UNAUTHENTICATED' },
                },
              ],
            }
          : { data: { ping: 'pong' } };

      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    restMock.restore();
    rawAxiosMock.restore();
    vi.unstubAllGlobals();
  });

  it('shares a single refresh call between a simultaneous REST 401 and a GraphQL UNAUTHENTICATED error', async () => {
    restMock.onGet('/tasks').replyOnce(401).onGet('/tasks').reply(200, {});
    // A small delay mirrors a real network round trip: Apollo's link chain
    // has more internal plumbing than the axios interceptor, so without
    // this the REST refresh can complete before the GraphQL error link even
    // gets a chance to ask for one — masking the race this test targets.
    rawAxiosMock
      .onPost('http://test.local/auth/refresh')
      .reply(
        () => new Promise((resolve) => setTimeout(() => resolve([200]), 20)),
      );

    const graphqlResult = new Promise((resolve, reject) => {
      client
        .query({ query: PING_QUERY, fetchPolicy: 'no-cache' })
        .then(resolve, reject);
    });

    const [restResult, gqlResult] = await Promise.allSettled([
      axiosInstance.get('/tasks'),
      graphqlResult,
    ]);

    expect(restResult.status).toBe('fulfilled');
    expect(gqlResult.status).toBe('fulfilled');
    // Regression guard: axiosInstance.ts and apollo.ts must share the same
    // refreshAuthToken() lock instead of each racing its own refresh call.
    expect(rawAxiosMock.history.post).toHaveLength(1);
  });
});
