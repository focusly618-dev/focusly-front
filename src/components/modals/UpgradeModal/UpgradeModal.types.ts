import type { BillingInterval } from '@/api/Billing/billingApi';
import type { UpgradeReason } from '@/services/billingService';

export interface UpgradeModalProps {
  open: boolean;
  /** What brought the user here; sets the headline. */
  reason?: UpgradeReason;
  /** Open straight on the payment form (the plans were already seen). */
  startCheckout?: boolean;
  /** The plan picked before opening (monthly by default). */
  interval?: BillingInterval;
  onClose: () => void;
}
