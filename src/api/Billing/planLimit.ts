// The AI endpoints answer 402 when the free plan doesn't cover a request:
// { detail: { code: "free_limit_reached", limit } } after the free chat
// messages, or { detail: { code: "pro_required", feature } } for Pro-only
// features (the editor assistant).

export type PlanLimitCode = 'free_limit_reached' | 'pro_required';

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
  message === 'free_limit_reached' || message === 'pro_required';

/** Throws a PlanLimitError for a 402 response; otherwise does nothing. */
export const throwIfPlanLimit = async (response: Response): Promise<void> => {
  if (response.status !== 402) return;
  let detail: { code?: string; limit?: number } = {};
  try {
    detail = (await response.json())?.detail ?? {};
  } catch {
    // Not JSON: still a plan limit.
  }
  throw new PlanLimitError(
    detail.code === 'pro_required' ? 'pro_required' : 'free_limit_reached',
    detail.limit,
  );
};

/** What's left of the free messages, from the chat response's header. */
export const remainingFromHeaders = (response: Response): number | null => {
  const value = response.headers.get('X-AI-Messages-Remaining');
  if (value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};
