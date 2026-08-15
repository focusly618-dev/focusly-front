import i18n from '@/i18n';

interface ApolloLikeError {
  message?: string;
  graphQLErrors?: { message: string }[];
  networkError?: unknown;
}

interface AxiosLikeError {
  isAxiosError?: boolean;
  message?: string;
  code?: string;
  request?: unknown;
  response?: {
    status?: number;
    data?: { message?: string; detail?: string };
  };
}

const NOT_FOUND_RE = /\bwith id\b.*\bnot found\b|^conversation not found$/i;
const SESSION_RE =
  /no valid refresh token|refresh token missing|token expired|invalid token|not authenticated/i;
const MAGIC_LINK_EXPIRED_RE = /magic link has expired/i;
const MAGIC_LINK_INVALID_RE = /invalid magic link token|invalid token purpose/i;
const GOOGLE_AUTH_RE =
  /invalid google oauth token|failed to refresh google token/i;
const GOOGLE_CALENDAR_RE =
  /failed to (retrieve|create|patch|delete) google calendar event/i;
const AI_UNAVAILABLE_RE =
  /focusly-ai service returned code|failed to delegate .* to focusly-ai/i;
const EMPTY_MESSAGES_RE = /messages array cannot be empty/i;

const isNetworkFailure = (error: unknown): boolean => {
  if (error instanceof TypeError && /fetch/i.test(error.message)) return true;

  const apolloError = error as ApolloLikeError;
  if (apolloError?.networkError && !apolloError.graphQLErrors?.length) {
    return true;
  }

  const axiosError = error as AxiosLikeError;
  if (axiosError?.isAxiosError && axiosError.request && !axiosError.response) {
    return true;
  }

  return false;
};

const isTimeout = (error: unknown): boolean => {
  const axiosError = error as AxiosLikeError;
  return (
    axiosError?.code === 'ECONNABORTED' ||
    /timeout/i.test(axiosError?.message || '')
  );
};

const extractRawMessage = (error: unknown): string => {
  const apolloError = error as ApolloLikeError;
  if (apolloError?.graphQLErrors?.length) {
    return apolloError.graphQLErrors[0].message;
  }

  const axiosError = error as AxiosLikeError;
  if (axiosError?.response?.data) {
    return (
      axiosError.response.data.detail || axiosError.response.data.message || ''
    );
  }

  return (error as { message?: string })?.message || '';
};

/**
 * Turns a raw error (Apollo, Axios, or plain Error) into a translated,
 * user-facing message — never the backend's literal message or a browser
 * network error like "Failed to fetch". `fallback` (if given) is used for
 * errors that don't match a known pattern, ahead of the fully generic message.
 */
export const getFriendlyErrorMessage = (
  error: unknown,
  fallback?: string,
): string => {
  if (isTimeout(error)) return i18n.t('errors.timeout');
  if (isNetworkFailure(error)) return i18n.t('errors.network');

  const raw = extractRawMessage(error);

  if (NOT_FOUND_RE.test(raw)) return i18n.t('errors.notFound');
  if (SESSION_RE.test(raw)) return i18n.t('errors.sessionExpired');
  if (MAGIC_LINK_EXPIRED_RE.test(raw)) return i18n.t('errors.magicLinkExpired');
  if (MAGIC_LINK_INVALID_RE.test(raw)) return i18n.t('errors.magicLinkInvalid');
  if (GOOGLE_AUTH_RE.test(raw)) return i18n.t('errors.googleAuthFailed');
  if (GOOGLE_CALENDAR_RE.test(raw)) return i18n.t('errors.googleCalendarSync');
  if (AI_UNAVAILABLE_RE.test(raw)) return i18n.t('errors.aiUnavailable');
  if (EMPTY_MESSAGES_RE.test(raw)) return i18n.t('errors.emptyMessage');

  return fallback || i18n.t('errors.generic');
};
