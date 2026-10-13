import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-color-scheme: dark)';

// Without matchMedia (tests, very old browsers) the system counts as dark,
// Focusly's own default.
const media = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(QUERY)
    : null;

export const systemPrefersDark = () => media()?.matches ?? true;

const subscribe = (onChange: () => void) => {
  const mq = media();
  if (!mq) return () => {};
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};

/** Whether the OS is in dark mode, kept live while the app is open. */
export const useSystemDark = () =>
  useSyncExternalStore(subscribe, systemPrefersDark, () => true);
