import type { LuminaActionPayload } from '@/utils';
import { normalizeEstimateTimer } from './planFormat';

// UPDATE_SUBTASKS edits a task's checklist by subtask title (what Lumina sees
// in its context). The list is written whole, so the edit is applied on top
// of the task's current subtasks instead of replacing them.

export interface SubtaskRecord {
  id: string;
  title: string;
  completed: boolean;
  completed_at: string | null;
  estimate_timer: number | null;
}

const sameTitle = (a: string, b: string) =>
  a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase();

const newSubtaskId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Normalizes subtasks as the API returns them (dropping __typename). */
export const toSubtaskRecords = (raw: unknown): SubtaskRecord[] =>
  Array.isArray(raw)
    ? raw.map((s) => ({
        id: String(s?.id ?? newSubtaskId()),
        title: String(s?.title ?? ''),
        completed: Boolean(s?.completed),
        completed_at: s?.completed_at ?? null,
        estimate_timer: s?.estimate_timer ?? null,
      }))
    : [];

export const applySubtaskOps = (
  current: SubtaskRecord[],
  ops: Pick<LuminaActionPayload, 'add' | 'complete' | 'reopen' | 'remove'>,
  now = new Date(),
): SubtaskRecord[] => {
  const matches = (list: string[] | undefined, title: string) =>
    (list ?? []).some((t) => sameTitle(t, title));

  const kept = current
    .filter((s) => !matches(ops.remove, s.title))
    .map((s) => {
      if (matches(ops.complete, s.title) && !s.completed) {
        return { ...s, completed: true, completed_at: now.toISOString() };
      }
      if (matches(ops.reopen, s.title) && s.completed) {
        return { ...s, completed: false, completed_at: null };
      }
      return s;
    });

  const added = (ops.add ?? [])
    .filter(
      (s) => s?.title?.trim() && !kept.some((k) => sameTitle(k.title, s.title)),
    )
    .map((s) => ({
      id: newSubtaskId(),
      title: s.title.trim(),
      completed: false,
      completed_at: null,
      estimate_timer: s.estimate_timer
        ? normalizeEstimateTimer(Number(s.estimate_timer))
        : null,
    }));

  return [...kept, ...added];
};

/** Titles an edit refers to that the task doesn't have (for the preview). */
export const missingSubtaskTitles = (
  current: { title?: string }[],
  ops: Pick<LuminaActionPayload, 'complete' | 'reopen' | 'remove'>,
): string[] =>
  [
    ...(ops.complete ?? []),
    ...(ops.reopen ?? []),
    ...(ops.remove ?? []),
  ].filter(
    (title) => !current.some((s) => s.title && sameTitle(s.title, title)),
  );
