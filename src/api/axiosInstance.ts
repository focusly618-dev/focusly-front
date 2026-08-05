import axios from 'axios';
import { API_BASE_URL } from '@/config/env.config';
import { refreshAuthToken, isAuthEndpoint } from './authRefresh';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest?.url)
    ) {
      // Marked before the queue check below so a request that ends up
      // waiting behind an in-flight refresh is just as "already tried" as
      // the one that triggered it — otherwise a second 401 on the same
      // request re-enters this branch and opens a redundant refresh cycle.
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      // Lazy load store and actions to prevent circular dependencies at bundle startup
      const { store } = await import('@/redux/store');
      const { logout } = await import('@/redux/auth/auth.slice');

      const user = store.getState().auth.user;

      if (!user) {
        isRefreshing = false;
        store.dispatch(logout('expired'));
        return Promise.reject(error);
      }

      try {
        // Shared with apollo.ts: whichever layer (REST or GraphQL) hits the
        // 401 first owns the single in-flight refresh call.
        await refreshAuthToken(user.id);
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        store.dispatch(logout('expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
