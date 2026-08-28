import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  Observable,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { store } from '@/redux/store';
import { logout } from '@/redux/auth/auth.slice';
import { API_BASE_URL } from '@/config/env.config';
import { refreshAuthToken } from './authRefresh';

const httpLink = createHttpLink({
  uri: `${API_BASE_URL}/graphql`,
  credentials: 'include',
});

interface GraphQLErrorLike {
  message: string;
  extensions?: Record<string, unknown>;
}

const looksUnauthorized = (errors?: readonly GraphQLErrorLike[]) =>
  !!errors?.some(
    ({ message, extensions }) =>
      message.includes('Unauthorized') ||
      message.includes('not authenticated') ||
      extensions?.code === 'UNAUTHENTICATED' ||
      (extensions?.response as { statusCode?: number } | undefined)
        ?.statusCode === 401,
  );

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    const isUnauthorized =
      looksUnauthorized(graphQLErrors) ||
      (networkError &&
        'statusCode' in networkError &&
        networkError.statusCode === 401);

    if (isUnauthorized) {
      const user = store.getState().auth.user;

      if (!user) {
        store.dispatch(logout('expired'));
        return;
      }

      // Shared with axiosInstance.ts: whichever layer (REST or GraphQL)
      // hits the 401 first owns the single in-flight refresh call; the
      // other just awaits the same promise instead of racing its own.
      return new Observable((observer) => {
        refreshAuthToken(user.id)
          .then(() => {
            // Manually inspecting the retried result (rather than piping
            // `forward(operation)` straight to `observer`) matters: a
            // retry's errors don't re-enter this onError handler — Apollo
            // only calls it for the ORIGINAL request in the chain — so
            // without this check, a token that's still rejected right
            // after a "successful" refresh (e.g. the account was removed,
            // or the refresh endpoint lied) would silently hand the caller
            // a stale "still unauthorized" error forever, with no logout
            // and no session-expired notice ever firing.
            forward(operation).subscribe({
              next: (result) => {
                if (looksUnauthorized(result.errors)) {
                  store.dispatch(logout('expired'));
                }
                observer.next(result);
              },
              error: (err) => observer.error(err),
              complete: () => observer.complete(),
            });
          })
          .catch((refreshError) => {
            store.dispatch(logout('expired'));
            observer.error(refreshError);
          });
      });
    }
  },
);

export const mergeGetTasksByUser = (
  existing: unknown,
  incoming: unknown,
  { args }: { args: Record<string, unknown> | null },
) => {
  const rawOffset = (args?.offset as number | undefined) ?? 0;
  // A negative offset has no sane insertion point in a plain array — treat
  // it the same as "no offset" rather than writing a stray negative/
  // string-keyed property.
  const offset = rawOffset > 0 ? rawOffset : 0;
  const merged = Array.isArray(existing) ? existing.slice(0) : [];
  if (Array.isArray(incoming)) {
    for (let i = 0; i < incoming.length; ++i) {
      merged[offset + i] = incoming[i];
    }
  }
  return merged;
};

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getTasksByUser: {
            keyArgs: ['userId', 'filters', 'sort'],
            merge: mergeGetTasksByUser,
          },
        },
      },
    },
  }),
});
