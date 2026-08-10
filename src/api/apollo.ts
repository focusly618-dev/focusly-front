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

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    const isUnauthorized =
      (graphQLErrors &&
        graphQLErrors.some(
          ({ message, extensions }) =>
            message.includes('Unauthorized') ||
            message.includes('not authenticated') ||
            extensions?.code === 'UNAUTHENTICATED' ||
            (extensions?.response as { statusCode?: number } | undefined)
              ?.statusCode === 401,
        )) ||
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
            forward(operation).subscribe(observer);
          })
          .catch((refreshError) => {
            store.dispatch(logout('expired'));
            observer.error(refreshError);
          });
      });
    }
  },
);

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getTasksByUser: {
            keyArgs: ['userId', 'filters', 'sort'],
            merge(existing, incoming, { args }) {
              const offset = args?.offset ?? 0;
              const merged = existing ? (existing as unknown[]).slice(0) : [];
              if (Array.isArray(incoming)) {
                for (let i = 0; i < incoming.length; ++i) {
                  merged[offset + i] = incoming[i];
                }
              }
              return merged;
            },
          },
        },
      },
    },
  }),
});
