import { useEffect, useSyncExternalStore } from 'react';
import i18next from 'i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateUser } from '@/redux/auth/auth.slice';
import { billingService } from '@/services/billingService';
import {
  dailyUseRenewal,
  freeMessagesRenewal,
} from '@/utils/billing/aiRenewal';

/** Shown until the backend answers (it sends the real limit). */
const DEFAULT_FREE_LIMIT = 10;

/** The user's plan, free AI usage and the Pro dialog. */
export const useBilling = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const state = useSyncExternalStore(
    billingService.subscribe,
    billingService.getSnapshot,
  );
  const userId = user?.id ?? null;

  useEffect(() => {
    if (userId) void billingService.load(userId);
    else billingService.reset();
  }, [userId]);

  // Keep the stored user's plan in step with the backend's.
  const plan = state.userId === userId ? state.status?.plan : undefined;
  useEffect(() => {
    if (plan && user && user.subscriptionStatus !== plan) {
      dispatch(updateUser({ subscriptionStatus: plan }));
    }
  }, [plan, user, dispatch]);

  const status = state.userId === userId ? state.status : null;
  const isPro = status
    ? status.plan === 'pro'
    : user?.subscriptionStatus === 'pro';
  const limit = status?.ai_messages_limit ?? DEFAULT_FREE_LIMIT;
  const used = status?.ai_messages_used ?? 0;

  return {
    status,
    /** True once the backend has answered. */
    known: Boolean(status),
    loading: state.loading,
    isPro,
    limit,
    used,
    remaining: isPro ? Infinity : Math.max(0, limit - used),
    billingEnabled: status?.billing_enabled ?? true,
    /** When the free messages come back, and Pro's fair use for today starts
     * over, in the user's own time zone and language. */
    freeRenewal: freeMessagesRenewal(
      status?.ai_messages_resets_at,
      i18next.language || 'es',
    ),
    dailyRenewal: dailyUseRenewal(
      status?.ai_daily_resets_at,
      i18next.language || 'es',
    ),
    /** Null until the backend answers; it checks them either way. */
    canvasLimits: status?.canvas_limits ?? null,
    upgrade: state.upgrade,
    openUpgrade: billingService.openUpgrade.bind(billingService),
    closeUpgrade: billingService.closeUpgrade.bind(billingService),
    refresh: () =>
      userId
        ? billingService.load(userId, { refresh: true })
        : Promise.resolve(null),
    waitForPro: () =>
      userId ? billingService.waitForPro(userId) : Promise.resolve(false),
  };
};
