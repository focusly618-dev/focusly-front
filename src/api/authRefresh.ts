import axios from 'axios';
import { API_BASE_URL } from '@/config/env.config';

/**
 * Single shared "refresh in progress" lock for the whole app. REST calls
 * (axiosInstance.ts) and GraphQL calls (apollo.ts) both hit 401s independently,
 * and a real page load fires both kinds of requests together. Without a
 * shared lock each layer starts its own refresh call, racing to rotate the
 * same refresh token.
 */
let refreshPromise: Promise<void> | null = null;

export const refreshAuthToken = (userId: string): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_BASE_URL}/auth/refresh`,
        { userId },
        { withCredentials: true },
      )
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

/**
 * Endpoints that are themselves part of the auth machinery. A 401 from one
 * of these must never re-trigger a refresh/logout cycle — that's what
 * previously caused a logout POST that also 401s to dispatch another logout,
 * which POSTs again, cascading.
 */
export const isAuthEndpoint = (url?: string): boolean =>
  !!url && (url.includes('/auth/refresh') || url.includes('/auth/logout'));
