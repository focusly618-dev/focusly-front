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
  private inflightRefresh = false;
  /** A plain read waiting to be sent (see load). */
  private queuedRead: ((status: Promise<BillingStatus | null>) => void) | null =
    null;

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
      this.dropQueuedRead();
      this.set({ ...INITIAL, userId });
    }
    if (this.inflight && (!refresh || this.inflightRefresh))
      return this.inflight;
    if (this.state.status && !refresh)
      return Promise.resolve(this.state.status);

    if (!refresh) {
      // Sent a moment later: when a screen also asks for a refresh as it
      // opens (the profile's billing section), that one request answers
      // both instead of a plain read plus a refresh.
      const queued = new Promise<BillingStatus | null>((resolve) => {
        this.queuedRead = resolve;
      });
      this.inflight = queued;
      this.inflightRefresh = false;
      queueMicrotask(() => {
        const resolve = this.queuedRead;
        if (!resolve) return;
        this.queuedRead = null;
        resolve(this.request(userId, false));
      });
      return queued;
    }

    const request = this.request(userId, true);
    const queuedRead = this.queuedRead;
    this.queuedRead = null;
    queuedRead?.(request);
    return request;
  }

  /** Whoever awaits a read that won't be sent gets no status. */
  private dropQueuedRead() {
    const resolve = this.queuedRead;
    this.queuedRead = null;
    resolve?.(Promise.resolve(null));
  }

  private request(userId: string, refresh: boolean) {
    this.set({ loading: true });
    const request: Promise<BillingStatus | null> = billingApi
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
    this.inflightRefresh = refresh;
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
    this.dropQueuedRead();
    this.set(INITIAL);
  }
}

export const billingService = new BillingService();
