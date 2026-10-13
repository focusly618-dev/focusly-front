import { describe, expect, it } from 'vitest';
import {
  actionDate,
  planDestinations,
} from '@/components/chat/actionPlan/planDestinations';
import type { ParsedLuminaAction } from '@/utils';

const a = (
  type: ParsedLuminaAction['type'],
  payload: Record<string, unknown> = {},
) => ({ type, payload }) as ParsedLuminaAction;

describe('planDestinations: where to go once the plan ran', () => {
  const plan = [
    a('CREATE_PROJECT_GROUP', { name: 'Nutrición' }),
    a('CREATE_WORKSPACE', { title: 'Menú' }),
    a('CREATE_TASK', { title: 'Compras', deadline: '2026-10-07T10:00:00' }),
    a('CREATE_TASK', { title: 'Cocinar', deadline: '2026-10-05T18:00:00' }),
  ];

  it('the project, its tasks and the first day on the calendar', () => {
    const where = planDestinations(
      plan,
      ['done', 'done', 'done', 'done'],
      ['p-1', 'w-1', 't-1', 't-2'],
    );
    expect(where.projectId).toBe('p-1');
    // With a project, the project shows its document.
    expect(where.documentId).toBeNull();
    expect(where.tasks).toEqual({ count: 2, singleId: null });
    expect(where.calendar).toEqual({
      date: new Date(2026, 9, 5, 18),
      view: 'week',
    });
  });

  it('only what was really done (with the id it got) counts', () => {
    const where = planDestinations(
      plan,
      ['error', 'done', 'skipped', 'done'],
      [null, 'w-1', null, 't-2'],
    );
    expect(where.projectId).toBeNull();
    expect(where.documentId).toBe('w-1');
    expect(where.tasks).toEqual({ count: 1, singleId: 't-2' });
    expect(where.calendar).toEqual({
      date: new Date(2026, 9, 5, 18),
      view: 'day',
    });
  });

  it('nothing done: nowhere to go', () => {
    expect(
      planDestinations(plan, ['pending', 'pending', 'error', 'skipped'], []),
    ).toEqual({
      projectId: null,
      documentId: null,
      tasks: { count: 0, singleId: null },
      calendar: null,
    });
  });

  it('several documents and no project: no single document to open', () => {
    const docs = [a('CREATE_WORKSPACE'), a('CREATE_WORKSPACE')];
    expect(
      planDestinations(docs, ['done', 'done'], ['w-1', 'w-2']).documentId,
    ).toBeNull();
  });

  it('updates and checklist edits count as tasks; deletions do not', () => {
    const where = planDestinations(
      [
        a('UPDATE_TASK', { id: 't-9' }),
        a('UPDATE_SUBTASKS', { id: 't-8' }),
        a('DELETE_TASK', { id: 't-7' }),
      ],
      ['done', 'done', 'done'],
      ['t-9', 't-8', null],
    );
    expect(where.tasks.count).toBe(2);
  });
});

describe('actionDate', () => {
  it("an event's start, a task's scheduled start before its deadline", () => {
    expect(
      actionDate(a('CREATE_EVENT', { start: '2026-10-05T10:00:00' })),
    ).toEqual(new Date(2026, 9, 5, 10));
    expect(
      actionDate(
        a('CREATE_TASK', {
          estimated_start_date: '2026-10-04T09:00:00',
          deadline: '2026-10-06T09:00:00',
        }),
      ),
    ).toEqual(new Date(2026, 9, 4, 9));
  });

  it('no date, or garbage: none', () => {
    expect(actionDate(a('CREATE_TASK'))).toBeNull();
    expect(actionDate(a('UPDATE_EVENT', { start: 'mañana' }))).toBeNull();
    expect(actionDate(a('CREATE_PROJECT_GROUP'))).toBeNull();
  });
});
