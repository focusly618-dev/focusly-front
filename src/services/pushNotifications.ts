import axiosInstance from '@/api/axiosInstance';

/**
 * Web push: lets this device receive reminders while Focusly is closed.
 *
 * The browser subscribes with the server's VAPID public key and the server
 * stores the subscription (focusly-workflows /push). The service worker
 * (public/push-sw.js) shows what arrives. One subscription per browser; it
 * belongs to whoever is signed in, and is dropped on sign-out or when the
 * reminders are switched off, so a shared computer never shows someone
 * else's reminders.
 */

const READY_TIMEOUT_MS = 10_000;

interface PublicKeyResponse {
  enabled: boolean;
  publicKey: string | null;
}

export const isPushSupported = (): boolean =>
  typeof window !== 'undefined' &&
  typeof navigator !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  typeof Notification !== 'undefined';

/** A base64url VAPID key as the bytes PushManager.subscribe() takes. */
export const urlBase64ToUint8Array = (
  value: string,
): Uint8Array<ArrayBuffer> => {
  const base64 = (value + '='.repeat((4 - (value.length % 4)) % 4))
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const raw = atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
  return bytes;
};

const sameKey = (subscription: PushSubscription, key: Uint8Array): boolean => {
  const current = subscription.options?.applicationServerKey;
  if (!current) return false;
  const bytes = new Uint8Array(current);
  return bytes.length === key.length && bytes.every((b, i) => b === key[i]);
};

/** The active service worker, or null when there is none (yet): in local
 * dev, or a browser that hasn't installed it. */
const readyRegistration = (): Promise<ServiceWorkerRegistration | null> =>
  Promise.race([
    navigator.serviceWorker.ready,
    new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), READY_TIMEOUT_MS),
    ),
  ]);

const deviceTimeZone = (): string | undefined => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
};

/**
 * Subscribes this device for the signed-in user (or refreshes its
 * subscription). Needs notification permission already granted; never
 * asks for it. Safe to call on every app start. Returns whether push is on.
 */
export const enablePush = async (): Promise<boolean> => {
  if (!isPushSupported() || Notification.permission !== 'granted') return false;
  try {
    const { data } =
      await axiosInstance.get<PublicKeyResponse>('/push/public-key');
    if (!data?.enabled || !data.publicKey) return false;

    const registration = await readyRegistration();
    if (!registration) return false;

    const key = urlBase64ToUint8Array(data.publicKey);
    let subscription = await registration.pushManager.getSubscription();
    // Subscribed with another server key (keys rotated): start over
    if (subscription && !sameKey(subscription, key)) {
      await subscription.unsubscribe();
      subscription = null;
    }
    subscription ??= await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: key,
    });

    const { endpoint, keys } = subscription.toJSON();
    await axiosInstance.post('/push/subscriptions', {
      endpoint,
      keys,
      timeZone: deviceTimeZone(),
    });
    return true;
  } catch (error) {
    console.warn('[PUSH] Could not enable push notifications:', error);
    return false;
  }
};

/**
 * Stops push on this device: tells the server (while still signed in) and
 * drops the browser's subscription. Never throws.
 */
export const disablePush = async (): Promise<void> => {
  if (!isPushSupported()) return;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    if (!subscription) return;
    await axiosInstance
      .delete('/push/subscriptions', {
        data: { endpoint: subscription.endpoint },
      })
      // Unsubscribing below is what matters: a subscription the server
      // still holds is reported gone on its next push and deleted then.
      .catch(() => {});
    await subscription.unsubscribe();
  } catch (error) {
    console.warn('[PUSH] Could not disable push notifications:', error);
  }
};
