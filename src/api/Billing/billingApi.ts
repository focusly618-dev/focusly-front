import axiosInstance from '../axiosInstance';

export type PlanId = 'free' | 'pro';
export type BillingInterval = 'month' | 'year';

/** What a plan lets canvases hold (the server enforces it). */
export interface CanvasLimits {
  /** Null: as many as wanted. */
  max_canvases: number | null;
  max_scene_bytes: number;
  max_image_bytes: number;
  max_images_per_canvas: number;
}

export interface BillingStatus {
  plan: PlanId;
  /** Stripe's subscription status, when it was read (refresh=true). */
  subscription_status: string | null;
  cancel_at_period_end: boolean;
  /** Unix seconds. */
  current_period_end: number | null;
  ai_messages_used: number;
  ai_messages_limit: number;
  billing_enabled: boolean;
  /** The monthly Pro price as Stripe has it (null when unknown). */
  pro_price: ProPrice | null;
  /** Every Pro price on sale: monthly, and yearly when offered. */
  pro_prices?: ProPrice[];
  /** The current subscription's billing interval (when read from Stripe). */
  interval?: string | null;
  /** Unix seconds: when the free trial ends, while in one. */
  trial_end?: number | null;
  /** The promotion code applied to the subscription, if any. */
  discount?: Discount | null;
  /** Days of free trial this user would get (0: none). */
  trial_days?: number;
  /** What the user's canvases may hold on their plan. */
  canvas_limits?: CanvasLimits;
}

export interface Discount {
  code: string | null;
  percent_off: number | null;
  /** In the smallest currency unit. */
  amount_off: number | null;
  currency: string | null;
  duration: 'once' | 'repeating' | 'forever' | null;
  duration_in_months: number | null;
  /** Unix seconds, when it stops applying (null: never / unknown). */
  end?: number | null;
}

export interface ProPrice {
  /** In the smallest currency unit (cents). */
  amount: number | null;
  currency: string | null;
  interval: string | null;
}

export interface SubscriptionResponse {
  subscription_id: string;
  client_secret: string;
  /** A PaymentIntent ("payment") or, e.g. for a trial, a SetupIntent. */
  intent_type: 'payment' | 'setup';
  /** Shows the customer's saved cards in the form (null if unavailable). */
  customer_session_client_secret: string | null;
  status: string;
  /** In the smallest currency unit (cents). */
  amount: number | null;
  currency: string | null;
  interval: string | null;
  /** Charged today: the first payment less the discount, 0 in a trial. */
  amount_due?: number | null;
  /** Unix seconds: when the free trial ends (null: no trial). */
  trial_end?: number | null;
  discount?: Discount | null;
}

export type InvoiceStatus =
  | 'paid'
  | 'open'
  | 'uncollectible'
  | 'refunded'
  | 'partially_refunded';

export interface Invoice {
  id: string;
  number: string | null;
  /** Unix seconds. */
  created: number;
  paid_at: number | null;
  status: InvoiceStatus;
  /** The first invoice of a free trial (nothing charged). */
  trial: boolean;
  subtotal: number | null;
  /** Taken off by a promotion code. */
  discount: number;
  total: number | null;
  amount_paid: number;
  amount_refunded: number;
  currency: string;
  period_start: number | null;
  period_end: number | null;
  interval: BillingInterval;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
}

export interface CheckoutOptions {
  interval?: BillingInterval;
  promotionCode?: string;
}

export interface PortalResponse {
  url: string;
}

// A slow backend shows an error instead of a button that loads forever.
const STATUS_TIMEOUT_MS = 20_000;
const STRIPE_TIMEOUT_MS = 30_000;

export const billingApi = {
  /** refresh=true reads the subscription from Stripe first. */
  getStatus: async (refresh = false): Promise<BillingStatus> => {
    const response = await axiosInstance.get<BillingStatus>(
      '/api/billing/status',
      {
        params: refresh ? { refresh: true } : undefined,
        timeout: STATUS_TIMEOUT_MS,
      },
    );
    return response.data;
  },

  /** Only the plan (monthly or yearly) and a promotion code go from here:
   * the prices are the server's. */
  createSubscription: async ({
    interval = 'month',
    promotionCode,
  }: CheckoutOptions = {}): Promise<SubscriptionResponse> => {
    const response = await axiosInstance.post<SubscriptionResponse>(
      '/api/billing/subscribe',
      {
        interval,
        ...(promotionCode ? { promotion_code: promotionCode } : {}),
      },
      { timeout: STRIPE_TIMEOUT_MS },
    );
    return response.data;
  },

  /** The user's payment history, newest first. */
  getInvoices: async (): Promise<Invoice[]> => {
    const response = await axiosInstance.get<Invoice[]>(
      '/api/billing/invoices',
      { timeout: STRIPE_TIMEOUT_MS },
    );
    return response.data;
  },

  getPortalUrl: async (): Promise<PortalResponse> => {
    const response = await axiosInstance.post<PortalResponse>(
      '/api/billing/portal',
      undefined,
      { timeout: STRIPE_TIMEOUT_MS },
    );
    return response.data;
  },
};
