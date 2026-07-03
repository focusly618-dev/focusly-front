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

export type SoundType =
  | 'taskUpcoming'
  | 'sessionStart'
  | 'breakReminder'
  | 'sessionEnd';

export interface SoundOptions {
  volume?: number;
  duration?: number;
}
