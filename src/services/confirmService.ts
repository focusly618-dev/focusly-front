// One confirmation dialog for destructive actions, opened from anywhere
// (hooks included) and shown by ConfirmDialogHost. Confirmations used to be
// toasts with a "Confirm" button: easy to miss, and they covered the page.

export interface ConfirmRequest {
  title: string;
  description: string;
  confirmText?: string;
  warning?: string;
  /** Runs when confirmed; the dialog waits for it and stays open if it throws. */
  onConfirm: () => Promise<unknown> | unknown;
}

type Listener = () => void;

let current: ConfirmRequest | null = null;
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

export const confirmService = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => current,
  close() {
    current = null;
    emit();
  },
};

/** Asks before a destructive action. */
export const confirmAction = (request: ConfirmRequest) => {
  current = request;
  emit();
};
