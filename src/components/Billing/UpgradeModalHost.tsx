import { UpgradeModal } from '@/components/modals/UpgradeModal/UpgradeModal';
import { useBilling } from '@/hooks/useBilling';

/** The app's one Pro dialog; anything opens it with billingService.openUpgrade. */
export const UpgradeModalHost = () => {
  const { upgrade, closeUpgrade } = useBilling();
  return (
    <UpgradeModal
      open={upgrade.open}
      reason={upgrade.reason}
      startCheckout={upgrade.checkout}
      onClose={closeUpgrade}
    />
  );
};
