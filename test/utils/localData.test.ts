import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MAX_PLAN_RUNS,
  PLAN_RUN_TTL_MS,
  hashText,
  planRunKey,
  prunePlanRuns,
  readPlanRun,
  safeSetItem,
  tidyLocalStorage,
  writePlanRun,
} from '@/utils/storage/localData';

const DAY = 24 * 60 * 60 * 1000;
const allKeys = () =>
  Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
const NOW = new Date(2026, 9, 7, 12).getTime();
const LEGACY_ACTION =
  'focusly_action_created_id_CREATE_TASK_{"title":"Investigación: Análisis y Diseño del SDLC","notes_encrypted":"Semana 2 - Levantamiento de requisitos","estimate_timer":600,"priority_level":2}';

describe('localData', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('plan records', () => {
    it('the key is per user and reveals nothing of the plan', () => {
      const key = planRunKey('u-1', 'CREATE_TASK:Informe secreto:');
      expect(key).toMatch(/^focusly_plan_run_u-1_[a-z0-9]+$/);
      expect(key).not.toContain('Informe');
      expect(planRunKey('u-2', 'CREATE_TASK:Informe secreto:')).not.toBe(key);
      expect(hashText('a')).toBe(hashText('a'));
      expect(hashText('a')).not.toBe(hashText('b'));
    });

    it('is kept for 10 days, then dropped', () => {
      const key = planRunKey('u-1', 'plan');
      writePlanRun(key, { statuses: ['done'] }, NOW);
      expect(PLAN_RUN_TTL_MS).toBe(10 * DAY);
      expect(readPlanRun(key, NOW + 10 * DAY - 1)).toEqual({
        statuses: ['done'],
      });
      expect(readPlanRun(key, NOW + 10 * DAY + 1)).toBeNull();
      expect(localStorage.getItem(key)).toBeNull();
    });

    it('keeps at most MAX_PLAN_RUNS, dropping the oldest', () => {
      for (let i = 0; i < MAX_PLAN_RUNS + 5; i++) {
        writePlanRun(planRunKey('u-1', `plan ${i}`), { i }, NOW + i);
      }
      const runs = allKeys().filter((k) => k?.startsWith('focusly_plan_run_'));
      expect(runs).toHaveLength(MAX_PLAN_RUNS);
      expect(readPlanRun(planRunKey('u-1', 'plan 0'), NOW + 100)).toBeNull();
      expect(
        readPlanRun(planRunKey('u-1', `plan ${MAX_PLAN_RUNS + 4}`), NOW + 100),
      ).toEqual({ i: MAX_PLAN_RUNS + 4 });
    });

    it('a corrupt record reads as none', () => {
      localStorage.setItem(planRunKey('u-1', 'x'), '{not json');
      expect(readPlanRun(planRunKey('u-1', 'x'), NOW)).toBeNull();
    });

    it('other data is never touched by the pruning', () => {
      localStorage.setItem('themeMode', 'dark');
      localStorage.setItem('user', '{"id":"u-1"}');
      prunePlanRuns(NOW + 100 * DAY);
      expect(localStorage.getItem('themeMode')).toBe('dark');
      expect(localStorage.getItem('user')).toBe('{"id":"u-1"}');
    });
  });

  describe('a full or blocked localStorage', () => {
    it('safeSetItem never throws', () => {
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new DOMException('full', 'QuotaExceededError');
      });
      expect(safeSetItem('user', '{}')).toBe(false);
      expect(() => writePlanRun('focusly_plan_run_u_x', {}, NOW)).not.toThrow();
    });

    it('makes room by dropping expired records, then saves', () => {
      const old = planRunKey('u-1', 'old');
      localStorage.setItem(
        old,
        JSON.stringify({ savedAt: NOW - 20 * DAY, run: {} }),
      );
      const real = localStorage.setItem.bind(localStorage);
      let full = true;
      vi.spyOn(localStorage, 'setItem').mockImplementation(function (
        this: Storage,
        key: string,
        value: string,
      ) {
        if (full) {
          full = false;
          throw new DOMException('full', 'QuotaExceededError');
        }
        real(key, value);
      });
      const key = planRunKey('u-1', 'new');
      writePlanRun(key, { ok: true }, NOW);
      expect(localStorage.getItem(old)).toBeNull();
      expect(readPlanRun(key, NOW)).toEqual({ ok: true });
    });
  });

  describe('tidying old records on start', () => {
    it('removes the old action records with task content', () => {
      localStorage.setItem(LEGACY_ACTION, 'task-123');
      localStorage.setItem('themeMode', 'light');
      tidyLocalStorage(NOW);
      expect(localStorage.getItem(LEGACY_ACTION)).toBeNull();
      expect(allKeys()).toEqual(['themeMode']);
    });

    it("moves the user's plan records to hashed keys, so nothing is created twice", () => {
      localStorage.setItem('user', JSON.stringify({ id: 'u-1' }));
      const fp = 'CREATE_TASK:Lista de compras:';
      localStorage.setItem(
        `focusly_plan_completed_${fp}`,
        JSON.stringify({ statuses: ['done'], createdIds: ['t-1'] }),
      );
      localStorage.setItem('focusly_plan_completed_CREATE_TASK:Viejo:', 'true');

      tidyLocalStorage(NOW);

      const keys = allKeys();
      expect(keys.some((k) => k?.includes('Lista de compras'))).toBe(false);
      expect(readPlanRun(planRunKey('u-1', fp), NOW)).toEqual({
        statuses: ['done'],
        createdIds: ['t-1'],
      });
      expect(readPlanRun(planRunKey('u-1', 'CREATE_TASK:Viejo:'), NOW)).toEqual(
        { allDone: true },
      );
      // And they expire like any other, 10 days from now.
      expect(readPlanRun(planRunKey('u-1', fp), NOW + 11 * DAY)).toBeNull();
    });

    it('with nobody logged in, old plan records are just removed', () => {
      localStorage.setItem('focusly_plan_completed_CREATE_TASK:X:', 'true');
      tidyLocalStorage(NOW);
      expect(localStorage.length).toBe(0);
    });

    it('drops expired records and survives a corrupt user', () => {
      localStorage.setItem('user', '{broken');
      localStorage.setItem(
        planRunKey('u-1', 'old'),
        JSON.stringify({ savedAt: NOW - 11 * DAY, run: {} }),
      );
      expect(() => tidyLocalStorage(NOW)).not.toThrow();
      expect(localStorage.getItem(planRunKey('u-1', 'old'))).toBeNull();
    });
  });
});

describe('logging in with a full localStorage', () => {
  it('still logs in (it just isn’t remembered on reload)', async () => {
    const { default: reducer, login } = await import('@/redux/auth/auth.slice');
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    const state = reducer(
      undefined,
      login({
        user: { id: 'u-1', email: 'ana@example.com' },
        provider: 'google' as never,
        isLogged: true,
      }),
    );
    expect(state.isLogged).toBe(true);
    expect(state.user?.id).toBe('u-1');
  });
});
