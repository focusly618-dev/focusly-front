import { toast } from 'sonner';
export { toast };

// Focusly's toasts (rendered by components/Notification/FocuslyToaster).
// Short and quiet: successes go away fast, errors stay a little longer, and
// the same message shown twice replaces itself instead of piling up.

export type NotifyType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface NotifyButton {
  title: string;
  onClick: () => void;
}

export interface NotifyOptions {
  title: string;
  description?: string;
  /** Milliseconds; Infinity keeps it until dismissed. */
  duration?: number;
  /** One action, e.g. "Undo". */
  button?: NotifyButton;
  /** Reuse an id to update a toast in place. */
  id?: string | number;
}

export const NOTIFY_DURATIONS: Record<
  Exclude<NotifyType, 'loading'>,
  number
> = {
  success: 3000,
  info: 4000,
  warning: 5000,
  error: 6000,
};

/** Long enough to reach the button (e.g. "Undo"). */
export const NOTIFY_ACTION_DURATION = 6000;

const show = (type: NotifyType, options: NotifyOptions): string | number => {
  const { title, description, duration, button } = options;
  // Same message twice (e.g. saving again) updates the one on screen.
  const id = options.id ?? `${type}:${title}:${description ?? ''}`;
  const common = {
    id,
    description,
    action: button
      ? { label: button.title, onClick: () => button.onClick() }
      : undefined,
  };
  if (type === 'loading') {
    return toast.loading(title, { ...common, duration: duration ?? Infinity });
  }
  return toast[type](title, {
    ...common,
    duration:
      duration ??
      Math.max(NOTIFY_DURATIONS[type], button ? NOTIFY_ACTION_DURATION : 0),
  });
};

export const notify = {
  success: (options: NotifyOptions) => show('success', options),
  error: (options: NotifyOptions) => show('error', options),
  warning: (options: NotifyOptions) => show('warning', options),
  info: (options: NotifyOptions) => show('info', options),
  loading: (options: NotifyOptions) => show('loading', options),

  dismiss: (id?: string | number) => {
    toast.dismiss(id);
  },

  /** A loading toast that turns into the success or the error one. */
  async promise<T>(
    work: Promise<T> | (() => Promise<T>),
    messages: {
      loading: Omit<NotifyOptions, 'id'>;
      success: Omit<NotifyOptions, 'id'>;
      error: Omit<NotifyOptions, 'id'>;
    },
  ): Promise<T> {
    const id = show('loading', {
      ...messages.loading,
      id: `promise:${Date.now()}:${Math.random()}`,
    });
    try {
      const result = await (typeof work === 'function' ? work() : work);
      show('success', { ...messages.success, id });
      return result;
    } catch (err) {
      show('error', { ...messages.error, id });
      throw err;
    }
  },
};
