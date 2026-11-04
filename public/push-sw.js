/*
 * Web push for Focusly: shows what the server pushes (task reminders, the
 * morning summary) while Focusly is closed, and opens Focusly when the
 * notification is clicked. Loaded into the Workbox service worker through
 * importScripts (vite.config.ts); the server side is focusly-workflows'
 * push_service.py.
 *
 * Payload: { title, body, url, tag?, renotify?, inApp? }
 */

const PUSH_ICON = '/pwa-192x192.png';
const PUSH_BADGE = '/pwa-64x64.png';
const DEFAULT_URL = '/dashboard';

const readPayload = (event) => {
  if (!event.data) return {};
  try {
    return event.data.json();
  } catch {
    return { body: event.data.text() };
  }
};

const focuslyWindows = () =>
  self.clients.matchAll({ type: 'window', includeUncontrolled: true });

self.addEventListener('push', (event) => {
  const data = readPayload(event);
  const options = {
    body: data.body || '',
    icon: PUSH_ICON,
    badge: PUSH_BADGE,
    data: { url: data.url || DEFAULT_URL },
  };
  if (data.tag) {
    options.tag = data.tag;
    options.renotify = Boolean(data.renotify);
  }

  event.waitUntil(
    (async () => {
      // A reminder Focusly shows itself (inApp) is skipped while Focusly is
      // on screen: the app already showed it, with the same tag.
      if (data.inApp) {
        const windows = await focuslyWindows();
        if (windows.some((client) => client.visibilityState === 'visible')) {
          return;
        }
      }
      await self.registration.showNotification(
        data.title || 'Focusly',
        options,
      );
    })(),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const path =
    (event.notification.data && event.notification.data.url) || DEFAULT_URL;
  const url = new URL(path, self.location.origin);
  // Only ever open Focusly itself
  if (url.origin !== self.location.origin) return;

  event.waitUntil(
    (async () => {
      const windows = await focuslyWindows();
      const open = windows.find(
        (client) => new URL(client.url).origin === self.location.origin,
      );
      if (open) {
        await open.focus();
        if ('navigate' in open) await open.navigate(url.href).catch(() => {});
        return;
      }
      await self.clients.openWindow(url.href);
    })(),
  );
});
