import type { UpgradeReason } from '@/services/billingService';

export interface UpgradeModalProps {
  open: boolean;
  /** What brought the user here; sets the headline. */
  reason?: UpgradeReason;
  /** Open straight on the payment form (the plans were already seen). */
  startCheckout?: boolean;
  onClose: () => void;
}
