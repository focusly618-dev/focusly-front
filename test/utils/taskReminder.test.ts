import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const { notify, soundPlayer } = vi.hoisted(() => ({
  notify: { info: vi.fn(), warning: vi.fn() },
  soundPlayer: { playTaskUpcoming: vi.fn() },
}));
vi.mock('@/utils', () => ({ notify, soundPlayer }));
vi.mock('@/i18n', () => ({
  default: {
    language: 'es',
    t: (key: string, opts: Record<string, unknown> = {}) =>
      `${key}|${Object.entries(opts)
        .map(([k, v]) => `${k}=${v}`)
        .join(',')}`,
  },
}));

import {
  showTaskReminder,
  type TaskUpcomingEvent,
} from '@/context/realtime/taskReminder';

const event = (over: Partial<TaskUpcomingEvent> = {}): TaskUpcomingEvent => ({
  taskId: 't1',
  title: 'Escribir informe',
  deadline: '2026-10-13T15:00:00Z',
  minutesLeft: 5,
  type: '5min',
  ...over,
});

// A Notification whose permission each test sets.
const fakeNotification = (permission: NotificationPermission) => {
  const created: { title: string; options?: NotificationOptions }[] = [];
  const Fake = vi.fn(function (title: string, options?: NotificationOptions) {
    created.push({ title, options });
  }) as unknown as typeof Notification & { requestPermission: () => void };
  Object.assign(Fake, { permission, requestPermission: vi.fn() });
  vi.stubGlobal('Notification', Fake);
  return { created, Fake };
};

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.unstubAllGlobals());

describe('showTaskReminder', () => {
  it('5 minutes before: the sound and an info toast with the start time', () => {
    fakeNotification('default');
    showTaskReminder(event());

    expect(soundPlayer.playTaskUpcoming).toHaveBeenCalledOnce();
    expect(notify.warning).not.toHaveBeenCalled();
    const toast = notify.info.mock.calls[0][0];
    expect(toast.title).toBe(
      'taskReminder.upcomingTitle|title=Escribir informe',
    );
    expect(toast.description).toMatch(/^taskReminder\.startsIn\|count=5,time=/);
    expect(toast.id).toBe('task-reminder:t1:5min');
  });

  it('1 minute before: an urgent toast, always "1 minute"', () => {
    fakeNotification('default');
    showTaskReminder(event({ type: '1min', minutesLeft: 0 }));

    expect(notify.info).not.toHaveBeenCalled();
    const toast = notify.warning.mock.calls[0][0];
    expect(toast.title).toContain('taskReminder.urgentTitle');
    expect(toast.description).toContain('count=1,');
    expect(toast.id).toBe('task-reminder:t1:1min');
  });

  it('never says "0 minutes" on the 5-minute warning', () => {
    fakeNotification('default');
    showTaskReminder(event({ minutesLeft: 0 }));
    expect(notify.info.mock.calls[0][0].description).toContain('count=1,');
  });

  it('with permission, also a system notification, one per task', () => {
    const { created } = fakeNotification('granted');
    showTaskReminder(event());

    expect(created).toHaveLength(1);
    expect(created[0].title).toBe('Escribir informe');
    expect(created[0].options).toMatchObject({ tag: 't1' });
    expect(created[0].options?.body).toContain('taskReminder.startsIn');
  });

  it('does not ask for permission itself (browsers block it without a click)', () => {
    const { created, Fake } = fakeNotification('default');
    showTaskReminder(event());

    expect(Fake.requestPermission).not.toHaveBeenCalled();
    expect(created).toHaveLength(0);
    // The toast still shows.
    expect(notify.info).toHaveBeenCalledOnce();
  });

  it('permission denied or no Notification API: only the toast', () => {
    const { created } = fakeNotification('denied');
    showTaskReminder(event());
    expect(created).toHaveLength(0);

    vi.stubGlobal('Notification', undefined);
    expect(() => showTaskReminder(event())).not.toThrow();
    expect(notify.info).toHaveBeenCalledTimes(2);
  });

  it('falls back to the service worker when Notification throws', async () => {
    const Throwing = vi.fn(function () {
      throw new TypeError('Illegal constructor');
    });
    Object.assign(Throwing, { permission: 'granted' });
    vi.stubGlobal('Notification', Throwing);
    const showNotification = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      serviceWorker: { ready: Promise.resolve({ showNotification }) },
    });

    showTaskReminder(event());
    await vi.waitFor(() => expect(showNotification).toHaveBeenCalled());
    expect(showNotification.mock.calls[0][0]).toBe('Escribir informe');
    expect(showNotification.mock.calls[0][1]).toMatchObject({
      tag: 't1',
      renotify: true,
    });
  });
});
