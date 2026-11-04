import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/** Runs public/push-sw.js against a fake service worker global. */
const source = readFileSync(
  path.resolve(__dirname, '../../public/push-sw.js'),
  'utf8',
);

type Listener = (event: unknown) => void;

const ORIGIN = 'https://app.focusly.test';

const setup = (windows: { url: string; visibilityState: string }[] = []) => {
  const listeners: Record<string, Listener> = {};
  const clients = windows.map((w) => ({
    ...w,
    focus: vi.fn().mockResolvedValue(undefined),
    navigate: vi.fn().mockResolvedValue(undefined),
  }));
  const self = {
    location: new URL(ORIGIN),
    addEventListener: (type: string, fn: Listener) => {
      listeners[type] = fn;
    },
    registration: { showNotification: vi.fn().mockResolvedValue(undefined) },
    clients: {
      matchAll: vi.fn().mockResolvedValue(clients),
      openWindow: vi.fn().mockResolvedValue(undefined),
    },
  };
  new Function('self', source)(self);

  const dispatch = async (type: string, event: object) => {
    let work: Promise<unknown> = Promise.resolve();
    listeners[type]({
      ...event,
      waitUntil: (p: Promise<unknown>) => {
        work = p;
      },
    });
    await work;
  };
  return { self, clients, dispatch };
};

const pushEvent = (payload: object) => ({
  data: { json: () => payload, text: () => JSON.stringify(payload) },
});

describe('push-sw.js: push', () => {
  let env: ReturnType<typeof setup>;

  beforeEach(() => {
    env = setup();
  });

  it('shows the notification with its tag, icon and link', async () => {
    await env.dispatch(
      'push',
      pushEvent({
        title: 'Bocetos',
        body: 'Empieza en 5 minutos',
        url: '/dashboard',
        tag: 't1',
        renotify: true,
      }),
    );
    expect(env.self.registration.showNotification).toHaveBeenCalledWith(
      'Bocetos',
      expect.objectContaining({
        body: 'Empieza en 5 minutos',
        tag: 't1',
        renotify: true,
        icon: '/pwa-192x192.png',
        data: { url: '/dashboard' },
      }),
    );
  });

  it('skips a reminder Focusly already shows while it is on screen', async () => {
    env = setup([{ url: `${ORIGIN}/dashboard`, visibilityState: 'visible' }]);
    await env.dispatch('push', pushEvent({ title: 'X', inApp: true }));
    expect(env.self.registration.showNotification).not.toHaveBeenCalled();
  });

  it('shows an in-app reminder when Focusly is only in the background', async () => {
    env = setup([{ url: `${ORIGIN}/dashboard`, visibilityState: 'hidden' }]);
    await env.dispatch('push', pushEvent({ title: 'X', inApp: true }));
    expect(env.self.registration.showNotification).toHaveBeenCalled();
  });

  it('always shows a push with no in-app version (morning summary)', async () => {
    env = setup([{ url: `${ORIGIN}/dashboard`, visibilityState: 'visible' }]);
    await env.dispatch('push', pushEvent({ title: '☀️ Buenos días' }));
    expect(env.self.registration.showNotification).toHaveBeenCalledWith(
      '☀️ Buenos días',
      expect.anything(),
    );
  });

  it('falls back to a plain-text body and the app name', async () => {
    await env.dispatch('push', {
      data: {
        json: () => {
          throw new Error('not json');
        },
        text: () => 'Hola',
      },
    });
    expect(env.self.registration.showNotification).toHaveBeenCalledWith(
      'Focusly',
      expect.objectContaining({ body: 'Hola' }),
    );
  });
});

describe('push-sw.js: notificationclick', () => {
  const click = (url?: string) => ({
    notification: { close: vi.fn(), data: url ? { url } : undefined },
  });

  it('focuses an open Focusly window and takes it to the link', async () => {
    const env = setup([{ url: `${ORIGIN}/tasks`, visibilityState: 'hidden' }]);
    await env.dispatch('notificationclick', click('/dashboard'));
    expect(env.clients[0].focus).toHaveBeenCalled();
    expect(env.clients[0].navigate).toHaveBeenCalledWith(`${ORIGIN}/dashboard`);
    expect(env.self.clients.openWindow).not.toHaveBeenCalled();
  });

  it('opens Focusly when no window is open', async () => {
    const env = setup();
    await env.dispatch('notificationclick', click());
    expect(env.self.clients.openWindow).toHaveBeenCalledWith(
      `${ORIGIN}/dashboard`,
    );
  });

  it('never opens another site', async () => {
    const env = setup();
    await env.dispatch('notificationclick', click('https://evil.example/x'));
    expect(env.self.clients.openWindow).not.toHaveBeenCalled();
  });
});
