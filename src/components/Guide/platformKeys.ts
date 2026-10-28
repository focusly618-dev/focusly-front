// Modifier keys as this computer labels them: ⌘ ⇧ ⌥ on a Mac, words elsewhere.
const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export const KEYS = {
  mod: isMac ? '⌘' : 'Ctrl',
  shift: isMac ? '⇧' : 'Shift',
  alt: isMac ? '⌥' : 'Alt',
} as const;

/** A key combination written as this computer writes it: ⌘K, or Ctrl+K. */
export const combo = (...keys: string[]): string => keys.join(isMac ? '' : '+');
