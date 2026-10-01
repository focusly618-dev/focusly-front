export interface ModalItemsProps {
  title: string;
  description: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subtitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}
