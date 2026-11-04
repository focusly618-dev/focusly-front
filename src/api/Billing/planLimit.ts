// The app's i18next instance (set up by @/i18n at startup), used directly so
// this stays light to import
import i18n from 'i18next';
import { notify } from '@/utils';
import { dailyUseRenewal } from '@/utils/billing/aiRenewal';

// The AI endpoints answer 402 when the free plan doesn't cover a request:
// { detail: { code: "free_limit_reached", limit } } after the month's free
// messages, or { detail: { code: "pro_required", feature } } for Pro-only
// features (the editor assistant). Pro has a daily fair-use limit: 429 with
// { detail: { code: "daily_limit_reached", limit } }.

export type PlanLimitCode =
  | 'free_limit_reached'
  | 'pro_required'
  | 'daily_limit_reached';

const CODES: readonly string[] = [
  'free_limit_reached',
  'pro_required',
  'daily_limit_reached',
];

/** Shown until the backend says (billing status, or the 429 itself). */
const DEFAULT_DAILY_LIMIT = 150;

export class PlanLimitError extends Error {
  readonly code: PlanLimitCode;
  readonly limit?: number;

  constructor(code: PlanLimitCode, limit?: number) {
    super(code);
    this.name = 'PlanLimitError';
    this.code = code;
    this.limit = limit;
  }
}

export const isPlanLimitError = (err: unknown): err is PlanLimitError =>
  err instanceof PlanLimitError;

/** For errors that only kept their message (e.g. aiStreamService events). */
export const isPlanLimitMessage = (message: unknown) =>
  typeof message === 'string' && CODES.includes(message);

/** Whether Pro would lift this limit, so the app offers it. Pro's own daily
 * fair use only waits for tomorrow. */
export const offersPro = (code: unknown) => code !== 'daily_limit_reached';

/** Tells a Pro account its fair use for today is used up. */
export const announceDailyLimit = (limit?: number, resetsAt?: string) => {
  notify.warning({
    title: i18n.t('billing.dailyLimit.title'),
    description: i18n.t('billing.dailyLimit.body', {
      count: limit ?? DEFAULT_DAILY_LIMIT,
      date: dailyUseRenewal(resetsAt, i18n.language || 'es'),
    }),
  });
};

/** Throws a PlanLimitError for a plan limit response; otherwise does nothing. */
export const throwIfPlanLimit = async (response: Response): Promise<void> => {
  if (response.status !== 402 && response.status !== 429) return;
  let detail: { code?: string; limit?: number; resets_at?: string } = {};
  try {
    detail = (await response.json())?.detail ?? {};
  } catch {
    // Not JSON: still a plan limit, if it was a 402.
  }
  if (response.status === 429) {
    if (detail.code !== 'daily_limit_reached') return;
    announceDailyLimit(detail.limit, detail.resets_at);
    throw new PlanLimitError('daily_limit_reached', detail.limit);
  }
  throw new PlanLimitError(
    detail.code === 'pro_required' ? 'pro_required' : 'free_limit_reached',
    detail.limit,
  );
};

const numberFrom = (value: string | null | undefined): number | null => {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

/** What's left of the month's free messages, from the response's header. */
export const remainingFromHeaders = (response: Response): number | null =>
  numberFrom(response.headers.get('X-AI-Messages-Remaining'));

// The day a Pro account was told it's close to its daily limit: once a day
let warnedOn: string | null = null;

/**
 * Pro: warns once a day when a fifth or less of today's fair use is left.
 * `remaining` is the X-AI-Daily-Remaining header's value.
 */
export const noteDailyRemaining = (
  remaining: string | null | undefined,
  limit = DEFAULT_DAILY_LIMIT,
) => {
  const left = numberFrom(remaining);
  if (left === null || left > limit / 5) return;
  const today = new Date().toISOString().slice(0, 10);
  if (warnedOn === today) return;
  warnedOn = today;
  notify.info({
    title: i18n.t('billing.dailyLow.title', { count: left }),
    description: i18n.t('billing.dailyLow.body', {
      count: limit,
      date: dailyUseRenewal(null, i18n.language || 'es'),
    }),
  });
};

/** Tests start each case without the day's warning given. */
export const resetDailyWarning = () => {
  warnedOn = null;
};
