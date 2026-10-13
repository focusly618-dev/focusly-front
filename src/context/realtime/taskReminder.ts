import i18n from '@/i18n';
import { notify, soundPlayer } from '@/utils';

/** The worker's "task_upcoming" socket event (focusly-workflows). */
export interface TaskUpcomingEvent {
  taskId: string;
  title: string;
  /** When the task starts (its scheduled start, or else its deadline). */
  deadline: string;
  minutesLeft: number;
  type: '5min' | '1min';
}

const ICON = '/Focusly.png';

/**
 * A task is about to start: the sound, a toast in Focusly and, when the
 * browser allows it, a system notification (seen with the tab in the
 * background). Permission is asked from Settings → Notifications, on a click:
 * asking from here, with no click, browsers ignore or block it.
 */
export const showTaskReminder = (event: TaskUpcomingEvent) => {
  const t = i18n.t.bind(i18n);
  const urgent = event.type === '1min';
  const time = new Date(event.deadline).toLocaleTimeString(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const description = t('taskReminder.startsIn', {
    count: urgent ? 1 : Math.max(1, event.minutesLeft),
    time,
  });

  soundPlayer.playTaskUpcoming();

  const toast = {
    title: t(
      urgent ? 'taskReminder.urgentTitle' : 'taskReminder.upcomingTitle',
      {
        title: event.title,
      },
    ),
    description,
    // One toast per task and warning, even if the event arrives twice.
    id: `task-reminder:${event.taskId}:${event.type}`,
  };
  if (urgent) notify.warning({ ...toast, duration: 6000 });
  else notify.info({ ...toast, duration: 5000 });

  showSystemNotification(event, description);
};

const showSystemNotification = (event: TaskUpcomingEvent, body: string) => {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission !== 'granted') return;

  const options: NotificationOptions = { body, icon: ICON, tag: event.taskId };
  try {
    new Notification(event.title, options);
  } catch {
    // Some mobile browsers only allow it through the service worker.
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.ready
      .then((registration) =>
        registration.showNotification(event.title, {
          ...options,
          renotify: true,
        } as NotificationOptions),
      )
      .catch((err) => {
        console.error('[REALTIME] Service Worker notification error:', err);
      });
  }
};
