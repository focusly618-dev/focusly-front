import axiosInstance from '../axiosInstance';

export interface SubscriptionResponse {
  subscription_id: string;
  client_secret: string;
  customer_id: string;
  status: string;
}

export interface PortalResponse {
  url: string;
}

export interface CancelSubscriptionResponse {
  subscription_id: string;
  status: string;
  cancel_at_period_end: boolean;
}

export const billingApi = {
  createSubscription: async (
    priceId: string,
    planName = 'pro_monthly',
  ): Promise<SubscriptionResponse> => {
    const response = await axiosInstance.post<SubscriptionResponse>(
      '/api/billing/subscribe',
      {
        price_id: priceId,
        plan_name: planName,
      },
    );
    return response.data;
  },

  getPortalUrl: async (): Promise<PortalResponse> => {
    const response = await axiosInstance.post<PortalResponse>(
      '/api/billing/portal',
    );
    return response.data;
  },

  cancelSubscription: async (
    cancelAtPeriodEnd = true,
  ): Promise<CancelSubscriptionResponse> => {
    const response = await axiosInstance.post<CancelSubscriptionResponse>(
      '/api/billing/cancel',
      {
        cancel_at_period_end: cancelAtPeriodEnd,
      },
    );
    return response.data;
  },
};
