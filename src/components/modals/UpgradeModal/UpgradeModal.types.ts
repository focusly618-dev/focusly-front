export interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onUpgradeSuccess?: (planName: string) => void;
}
