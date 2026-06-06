export type NotificationType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'loading';

export interface NotificationButton {
  title: string;
  onClick: () => void;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  fill?: string;
  duration?: number;
  dismissing?: boolean;
  button?: NotificationButton;
}

export type Listener = (notifications: Notification[]) => void;

let notifications: Notification[] = [];
const listeners: Set<Listener> = new Set();

const notify = () => {
  listeners.forEach((listener) => listener([...notifications]));
};

export const sileo = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener([...notifications]);
    return () => {
      listeners.delete(listener);
    };
  },

  getNotifications() {
    return notifications;
  },

  add(
    type: NotificationType,
    options: {
      title: string;
      description?: string;
      fill?: string;
      duration?: number;
      button?: NotificationButton;
    },
    existingId?: string,
  ) {
    const id = existingId || Math.random().toString(36).substring(2, 11);
    // If it has a button, it's a dialog toast and shouldn't auto-dismiss, unless duration is explicitly passed
    const defaultDuration =
      type === 'loading' || options.button
        ? undefined
        : options.duration || 4000;

    const existingIndex = notifications.findIndex((n) => n.id === id);
    if (existingIndex > -1) {
      notifications[existingIndex] = {
        id,
        type,
        title: options.title,
        description: options.description,
        fill: options.fill,
        duration: defaultDuration,
        dismissing: false,
        button: options.button,
      };
    } else {
      notifications.push({
        id,
        type,
        title: options.title,
        description: options.description,
        fill: options.fill,
        duration: defaultDuration,
        button: options.button,
      });
    }
    notify();

    if (defaultDuration) {
      setTimeout(() => {
        this.dismiss(id);
      }, defaultDuration);
    }
    return id;
  },

  dismiss(id: string) {
    const existing = notifications.find((n) => n.id === id);
    if (existing && !existing.dismissing) {
      existing.dismissing = true;
      notify();
      // Wait for exit animation (match duration in CSS: 300ms)
      setTimeout(() => {
        notifications = notifications.filter((n) => n.id !== id);
        notify();
      }, 300);
    }
  },

  success(options: {
    title: string;
    description?: string;
    fill?: string;
    duration?: number;
    button?: NotificationButton;
  }) {
    return this.add('success', options);
  },

  error(options: {
    title: string;
    description?: string;
    fill?: string;
    duration?: number;
    button?: NotificationButton;
  }) {
    return this.add('error', options);
  },

  warning(options: {
    title: string;
    description?: string;
    fill?: string;
    duration?: number;
    button?: NotificationButton;
  }) {
    return this.add('warning', options);
  },

  info(options: {
    title: string;
    description?: string;
    fill?: string;
    duration?: number;
    button?: NotificationButton;
  }) {
    return this.add('info', options);
  },

  async promise<T>(
    prom: Promise<T> | (() => Promise<T>),
    options: {
      loading: { title: string; description?: string; fill?: string };
      success: {
        title: string;
        description?: string;
        fill?: string;
        duration?: number;
        button?: NotificationButton;
      };
      error: {
        title: string;
        description?: string;
        fill?: string;
        duration?: number;
        button?: NotificationButton;
      };
    },
  ): Promise<T> {
    const id = this.add('loading', options.loading);
    try {
      const actualPromise = typeof prom === 'function' ? prom() : prom;
      const result = await actualPromise;
      this.add('success', options.success, id);
      return result;
    } catch (err) {
      this.add('error', options.error, id);
      throw err;
    }
  },
};
