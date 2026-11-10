// An old version kept every action Lumina ran as a localStorage key, with the
// action's whole content in the key's name. Nothing reads them any more.
const LEGACY_PREFIX = 'focusly_action_completed_';

export const removeLegacyStorage = () => {
  try {
    Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
      .filter((key): key is string => Boolean(key?.startsWith(LEGACY_PREFIX)))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage can be blocked; there's nothing to clean then.
  }
};
