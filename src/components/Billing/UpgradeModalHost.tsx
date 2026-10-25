import { useEffect } from 'react';
import { UpgradeModal } from '@/components/modals/UpgradeModal/UpgradeModal';
import { useBilling } from '@/hooks/useBilling';
import { billingService } from '@/services/billingService';
import { takePendingPlan } from '@/utils/storage/pendingPlan';

/** The app's one Pro dialog; anything opens it with billingService.openUpgrade. */
export const UpgradeModalHost = () => {
  const { upgrade, closeUpgrade, known, isPro, billingEnabled } = useBilling();

  // Picked Pro on the pricing page before signing up: go straight to the
  // checkout once the plan is known, unless the account is already Pro.
  useEffect(() => {
    if (!known) return;
    const pending = takePendingPlan();
    if (pending && !isPro && billingEnabled) {
      billingService.openUpgrade('manual', {
        checkout: true,
        interval: pending.interval,
      });
    }
  }, [known, isPro, billingEnabled]);

  return (
    <UpgradeModal
      open={upgrade.open}
      reason={upgrade.reason}
      startCheckout={upgrade.checkout}
      interval={upgrade.interval}
      onClose={closeUpgrade}
    />
  );
};
