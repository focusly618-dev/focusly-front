import { describe, it, expect } from 'vitest';
import {
  applySubtaskOps,
  missingSubtaskTitles,
  toSubtaskRecords,
} from '@/components/chat/actionPlan/subtaskOps';

const NOW = new Date('2026-10-03T12:00:00.000Z');

const current = toSubtaskRecords([
  {
    __typename: 'Subtask',
    id: 's1',
    title: 'Buscar fuentes',
    completed: false,
    completed_at: null,
    estimate_timer: 20,
  },
  {
    __typename: 'Subtask',
    id: 's2',
    title: 'Borrador',
    completed: true,
    completed_at: '2026-10-01T00:00:00Z',
    estimate_timer: null,
  },
  {
    __typename: 'Subtask',
    id: 's3',
    title: 'Revisión',
    completed: false,
    completed_at: null,
    estimate_timer: 15,
  },
]);

describe('applySubtaskOps', () => {
  it('drops __typename from the API shape', () => {
    expect(current[0]).toEqual({
      id: 's1',
      title: 'Buscar fuentes',
      completed: false,
      completed_at: null,
      estimate_timer: 20,
    });
  });

  it('completes, reopens and removes by title (case-insensitive), keeping the rest', () => {
    const next = applySubtaskOps(
      current,
      {
        complete: ['buscar FUENTES'],
        reopen: ['Borrador'],
        remove: ['Revisión'],
      },
      NOW,
    );
    expect(next).toEqual([
      {
        id: 's1',
        title: 'Buscar fuentes',
        completed: true,
        completed_at: NOW.toISOString(),
        estimate_timer: 20,
      },
      {
        id: 's2',
        title: 'Borrador',
        completed: false,
        completed_at: null,
        estimate_timer: null,
      },
    ]);
  });

  it('appends new subtasks without duplicating existing ones', () => {
    const next = applySubtaskOps(current, {
      add: [
        { title: 'Publicar', estimate_timer: 10 },
        { title: 'borrador' },
        { title: '  ' },
      ],
    });
    expect(next).toHaveLength(4);
    expect(next[3]).toMatchObject({
      title: 'Publicar',
      completed: false,
      estimate_timer: 10,
    });
    expect(next[3].id).toBeTruthy();
  });

  it('reports titles the task does not have', () => {
    expect(
      missingSubtaskTitles(current, {
        complete: ['Borrador', 'Inventada'],
        remove: ['Otra'],
      }),
    ).toEqual(['Inventada', 'Otra']);
  });
});
