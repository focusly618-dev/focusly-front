import { IS_VERCEL_API, VERCEL_API_URL, LOCAL_API_URL } from './vercel.config';

/**
 * Global environment configuration
 * Uses the manual toggle in vercel.config.ts to determine the API endpoint.
 * Toggle IS_VERCEL_API to true for production, false for local dev via proxy.
 */
export const IS_PRODUCTION = import.meta.env.PROD;

export const API_BASE_URL = IS_VERCEL_API ? VERCEL_API_URL : LOCAL_API_URL;

/**
 * Where the public site's loop videos are served: the backend's /media route,
 * which redirects to signed links of its bucket. No trailing slash. Unset, it
 * is that route of the deployed backend; in local dev they're read from
 * /videos in public/, which only exists on machines that generated them.
 */
export const MEDIA_BASE_URL = (
  (import.meta.env.VITE_MEDIA_BASE_URL as string | undefined) ||
  (IS_VERCEL_API && VERCEL_API_URL
    ? `${VERCEL_API_URL.replace(/\/+$/, '')}/media`
    : '')
).replace(/\/+$/, '');
