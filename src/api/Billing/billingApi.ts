import axiosInstance from '../axiosInstance';

export type PlanId = 'free' | 'pro';

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
  /** The Pro price as Stripe has it (null when unknown). */
  pro_price: ProPrice | null;
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

  /** The price is the server's; nothing about it is sent from here. */
  createSubscription: async (): Promise<SubscriptionResponse> => {
    const response = await axiosInstance.post<SubscriptionResponse>(
      '/api/billing/subscribe',
      undefined,
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
