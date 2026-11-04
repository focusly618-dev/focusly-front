import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { get, post, del } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  del: vi.fn(),
}));

vi.mock('@/api/axiosInstance', () => ({
  default: { get, post, delete: del },
}));

import {
  disablePush,
  enablePush,
  isPushSupported,
  urlBase64ToUint8Array,
} from '@/services/pushNotifications';

// A real P-256 public key, base64url (65 bytes, uncompressed)
const SERVER_KEY =
  'BKfHrQmPCttI3FH4T6VWYiHt41MMqbZa8pj3KXtaVb3K-ADlmklosXK78dSBWfxPikqXtzeMFmLlJPvi4Nk9YFo';
const OTHER_KEY =
  'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM';

const makeSubscription = (
  key: string,
  endpoint = 'https://push.example/1',
) => ({
  endpoint,
  options: { applicationServerKey: urlBase64ToUint8Array(key).buffer },
  toJSON: () => ({ endpoint, keys: { p256dh: 'p', auth: 'a' } }),
  unsubscribe: vi.fn().mockResolvedValue(true),
});

type FakeSubscription = ReturnType<typeof makeSubscription>;

let current: FakeSubscription | null;
const pushManager = {
  getSubscription: vi.fn(async () => current),
  subscribe: vi.fn(async () => {
    current = makeSubscription(SERVER_KEY, 'https://push.example/new');
    return current;
  }),
};
const registration = { pushManager };

const setPermission = (value: NotificationPermission) => {
  vi.stubGlobal(
    'Notification',
    Object.assign(function Notification() {}, { permission: value }),
  );
};

beforeEach(() => {
  current = null;
  vi.clearAllMocks();
  setPermission('granted');
  vi.stubGlobal('PushManager', function PushManager() {});
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: {
      ready: Promise.resolve(registration),
      getRegistration: vi.fn(async () => registration),
    },
  });
  get.mockResolvedValue({ data: { enabled: true, publicKey: SERVER_KEY } });
  post.mockResolvedValue({ data: { success: true } });
  del.mockResolvedValue({ data: { success: true } });
});

afterEach(() => {
  vi.unstubAllGlobals();
  // @ts-expect-error: test-only cleanup of the stubbed property
  delete navigator.serviceWorker;
});

describe('urlBase64ToUint8Array', () => {
  it('decodes an unpadded base64url VAPID key to its 65 bytes', () => {
    const bytes = urlBase64ToUint8Array(SERVER_KEY);
    expect(bytes).toHaveLength(65);
    expect(bytes[0]).toBe(0x04);
  });
});

describe('isPushSupported', () => {
  it('needs a service worker, PushManager and notifications', () => {
    expect(isPushSupported()).toBe(true);
    vi.stubGlobal('PushManager', undefined);
    // `in` sees the stubbed key; removing it is what a browser without push looks like
    // @ts-expect-error: test-only removal
    delete window.PushManager;
    expect(isPushSupported()).toBe(false);
  });
});

describe('enablePush', () => {
  it('subscribes with the server key and registers the device with its time zone', async () => {
    expect(await enablePush()).toBe(true);

    const options = pushManager.subscribe.mock.calls[0][0];
    expect(options.userVisibleOnly).toBe(true);
    expect(options.applicationServerKey).toEqual(
      urlBase64ToUint8Array(SERVER_KEY),
    );
    expect(post).toHaveBeenCalledWith('/push/subscriptions', {
      endpoint: 'https://push.example/new',
      keys: { p256dh: 'p', auth: 'a' },
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  });

  it('reuses an existing subscription made with the same key', async () => {
    current = makeSubscription(SERVER_KEY, 'https://push.example/kept');
    expect(await enablePush()).toBe(true);
    expect(pushManager.subscribe).not.toHaveBeenCalled();
    expect(post.mock.calls[0][1].endpoint).toBe('https://push.example/kept');
  });

  it('replaces a subscription made with an old server key', async () => {
    const old = makeSubscription(OTHER_KEY, 'https://push.example/old');
    current = old;
    expect(await enablePush()).toBe(true);
    expect(old.unsubscribe).toHaveBeenCalled();
    expect(post.mock.calls[0][1].endpoint).toBe('https://push.example/new');
  });

  it('never asks for permission: without it, does nothing', async () => {
    setPermission('default');
    expect(await enablePush()).toBe(false);
    expect(get).not.toHaveBeenCalled();
    expect(pushManager.subscribe).not.toHaveBeenCalled();
  });

  it('does nothing when the server has push turned off', async () => {
    get.mockResolvedValue({ data: { enabled: false, publicKey: null } });
    expect(await enablePush()).toBe(false);
    expect(pushManager.subscribe).not.toHaveBeenCalled();
    expect(post).not.toHaveBeenCalled();
  });

  it('never throws: a failure only turns push off', async () => {
    pushManager.subscribe.mockRejectedValueOnce(new Error('denied'));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await enablePush()).toBe(false);
    expect(post).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('disablePush', () => {
  it('tells the server and drops the browser subscription', async () => {
    const sub = makeSubscription(SERVER_KEY, 'https://push.example/mine');
    current = sub;
    await disablePush();
    expect(del).toHaveBeenCalledWith('/push/subscriptions', {
      data: { endpoint: 'https://push.example/mine' },
    });
    expect(sub.unsubscribe).toHaveBeenCalled();
  });

  it('still unsubscribes the browser when the server call fails', async () => {
    const sub = makeSubscription(SERVER_KEY);
    current = sub;
    del.mockRejectedValueOnce(new Error('offline'));
    await disablePush();
    expect(sub.unsubscribe).toHaveBeenCalled();
  });

  it('does nothing without a subscription', async () => {
    await disablePush();
    expect(del).not.toHaveBeenCalled();
  });
});
