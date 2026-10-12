// What Focusly keeps in this browser for itself, and its upkeep.
//
// Lumina's plans remember which items were created (so reopening a chat
// doesn't create them twice). That record used to be keyed by the actions
// themselves: task titles and notes readable in localStorage, kept forever,
// even after logging out. Now the key is a hash, per user, and it expires.

/** A plan's record: `focusly_plan_run_<userId>_<hash>`. */
export const PLAN_RUN_PREFIX = 'focusly_plan_run_';
/** After this, a plan's record is dropped. */
export const PLAN_RUN_TTL_MS = 10 * 24 * 60 * 60 * 1000;
/** Kept at most (the oldest go first). */
export const MAX_PLAN_RUNS = 50;

/** Earlier records, with the task's content in the key. */
const LEGACY_ACTION_PREFIX = 'focusly_action_created_id_';
const LEGACY_PLAN_PREFIX = 'focusly_plan_completed_';

interface StoredRun<T> {
  savedAt: number;
  run: T;
}

/** setItem that never throws (storage full, blocked, private mode). */
export const safeSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const keys = (): string[] => {
  try {
    return Array.from({ length: localStorage.length }, (_, i) =>
      localStorage.key(i),
    ).filter((key): key is string => key !== null);
  } catch {
    return [];
  }
};

const remove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Blocked storage: nothing to clean.
  }
};

/** A short, stable hash (cyrb53): the key says nothing about the plan. */
export const hashText = (text: string): string => {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
};

export const planRunKey = (userId: string, fingerprint: string) =>
  `${PLAN_RUN_PREFIX}${userId}_${hashText(fingerprint)}`;

const readStored = <T>(key: string): StoredRun<T> | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredRun<T>;
    return typeof stored?.savedAt === 'number' ? stored : null;
  } catch {
    return null;
  }
};

/** A plan's record, or null when there's none or it expired. */
export const readPlanRun = <T>(key: string, now = Date.now()): T | null => {
  const stored = readStored<T>(key);
  if (!stored) return null;
  if (now - stored.savedAt > PLAN_RUN_TTL_MS) {
    remove(key);
    return null;
  }
  return stored.run;
};

/** Drops expired records, then the oldest beyond MAX_PLAN_RUNS. */
export const prunePlanRuns = (now = Date.now()) => {
  const runs = keys()
    .filter((key) => key.startsWith(PLAN_RUN_PREFIX))
    .map((key) => ({ key, savedAt: readStored(key)?.savedAt ?? 0 }));
  const alive = runs.filter((r) => {
    const expired = now - r.savedAt > PLAN_RUN_TTL_MS;
    if (expired) remove(r.key);
    return !expired;
  });
  alive
    .sort((a, b) => b.savedAt - a.savedAt)
    .slice(MAX_PLAN_RUNS)
    .forEach((r) => remove(r.key));
};

export const writePlanRun = <T>(key: string, run: T, now = Date.now()) => {
  const stored = JSON.stringify({ savedAt: now, run });
  if (!safeSetItem(key, stored)) {
    // Full: make room and try once more.
    prunePlanRuns(now);
    safeSetItem(key, stored);
  }
  prunePlanRuns(now);
};

const storedUserId = (): string | null => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? ((JSON.parse(raw) as { id?: string }).id ?? null) : null;
  } catch {
    return null;
  }
};

/**
 * On app start: removes the old records with readable content, moving the
 * ones of the current plan format to hashed keys (so a plan already run
 * doesn't look new and get created twice), and drops expired records.
 */
export const tidyLocalStorage = (now = Date.now()) => {
  const userId = storedUserId();
  for (const key of keys()) {
    if (key.startsWith(LEGACY_ACTION_PREFIX)) {
      remove(key);
    } else if (key.startsWith(LEGACY_PLAN_PREFIX)) {
      if (userId) {
        let run: unknown = null;
        try {
          const raw = localStorage.getItem(key);
          run = raw === 'true' ? { allDone: true } : JSON.parse(raw ?? 'null');
        } catch {
          run = null;
        }
        const newKey = planRunKey(userId, key.slice(LEGACY_PLAN_PREFIX.length));
        if (run && !localStorage.getItem(newKey)) {
          safeSetItem(newKey, JSON.stringify({ savedAt: now, run }));
        }
      }
      remove(key);
    }
  }
  prunePlanRuns(now);
};
