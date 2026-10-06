import { billingApi, type BillingStatus } from '@/api/Billing/billingApi';

// The user's plan and free AI usage, shared by every screen (chat, editor,
// profile), plus the one "Pro plans" dialog any of them can open. The
// backend decides all of it; this only mirrors GET /api/billing/status.

export type UpgradeReason = 'limit' | 'editor' | 'manual';

export interface BillingState {
  userId: string | null;
  status: BillingStatus | null;
  loading: boolean;
  upgrade: { open: boolean; reason: UpgradeReason; checkout: boolean };
}

const INITIAL: BillingState = {
  userId: null,
  status: null,
  loading: false,
  upgrade: { open: false, reason: 'manual', checkout: false },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class BillingService {
  private state: BillingState = INITIAL;
  private listeners = new Set<() => void>();
  private inflight: Promise<BillingStatus | null> | null = null;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.state;

  private set(patch: Partial<BillingState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener());
  }

  private patchStatus(patch: Partial<BillingStatus>) {
    if (this.state.status)
      this.set({ status: { ...this.state.status, ...patch } });
  }

  /** Loads the plan once per user (refresh: read Stripe again). */
  load(userId: string, { refresh = false } = {}) {
    if (this.state.userId !== userId) {
      this.inflight = null;
      this.set({ ...INITIAL, userId });
    }
    if (this.inflight && !refresh) return this.inflight;
    if (this.state.status && !refresh)
      return Promise.resolve(this.state.status);

    this.set({ loading: true });
    const request = billingApi
      .getStatus(refresh)
      .then((status) => {
        if (this.state.userId === userId) this.set({ status });
        return status;
      })
      .catch((err) => {
        console.warn('Could not load the billing status:', err);
        return null;
      })
      .finally(() => {
        if (this.inflight === request) this.inflight = null;
        if (this.state.userId === userId) this.set({ loading: false });
      });
    this.inflight = request;
    return request;
  }

  /**
   * After paying: asks the backend (which asks Stripe) until the plan is
   * Pro. Stripe's webhook can take a few seconds, or not be set up locally.
   */
  async waitForPro(userId: string, { attempts = 8, delayMs = 1500 } = {}) {
    for (let i = 0; i < attempts; i++) {
      const status = await this.load(userId, { refresh: true });
      if (status?.plan === 'pro') return true;
      if (i < attempts - 1) await sleep(delayMs);
    }
    return false;
  }

  /** The chat reports how many free messages are left after each one. */
  setRemaining(remaining: number) {
    const limit = this.state.status?.ai_messages_limit;
    if (limit !== undefined) {
      this.patchStatus({ ai_messages_used: Math.max(0, limit - remaining) });
    }
  }

  /** The backend refused a message: the free ones are used up. */
  markLimitReached(limit?: number) {
    const total = limit ?? this.state.status?.ai_messages_limit;
    if (total !== undefined) {
      this.patchStatus({ ai_messages_used: total, ai_messages_limit: total });
    }
  }

  /** checkout: skip the plans and go straight to the payment form. */
  openUpgrade(reason: UpgradeReason = 'manual', { checkout = false } = {}) {
    this.set({ upgrade: { open: true, reason, checkout } });
  }

  closeUpgrade() {
    this.set({ upgrade: { ...this.state.upgrade, open: false } });
  }

  reset() {
    this.inflight = null;
    this.set(INITIAL);
  }
}

export const billingService = new BillingService();
