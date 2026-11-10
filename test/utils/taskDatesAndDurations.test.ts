import { describe, expect, it } from 'vitest';
import {
  mapResponseToTask,
  parseServerDate,
  withoutPlaceholderDeadline,
} from '@/api/Tasks/taskMapper';
import type { TaskResponse } from '@/api/Tasks/apiTaskTypes';
import { parseDuration } from '@/pages/Tasks/components/TaskDetailModal/TaskDetailModal.utils';
import { parseLuminaActions } from '@/utils';

describe('parseDuration', () => {
  it.each([
    ['1h', 60],
    ['1 h', 60],
    ['2 h 30 m', 150],
    ['2h 30m', 150],
    ['2h30', 150],
    ['45 m', 45],
    ['30', 30],
  ])('%s is %i minutes', (text, minutes) => {
    expect(parseDuration(text)).toBe(minutes);
  });

  it('leaves what it cannot read at 0', () => {
    expect(parseDuration('mucho')).toBe(0);
    expect(parseDuration('')).toBe(0);
  });
});

describe('parseServerDate', () => {
  const instant = '2026-11-10T04:40:00.000Z';

  it.each([
    ['naive', '2026-11-10T04:40:00'],
    ['with microseconds', '2026-11-10T04:40:00.000000'],
    ['with Z', '2026-11-10T04:40:00Z'],
    ['with an offset', '2026-11-09T22:40:00-06:00'],
  ])('%s is read as the right instant', (_, value) => {
    expect(parseServerDate(value).toISOString()).toBe(instant);
  });
});

describe('the placeholder deadline', () => {
  const stored = '2026-12-31T23:59:59';

  it('is not a date', () => {
    expect(
      withoutPlaceholderDeadline({ deadline: stored }).deadline,
    ).toBeNull();
    expect(
      mapResponseToTask({
        id: 't',
        title: 'x',
        deadline: stored,
      } as unknown as TaskResponse).deadline,
    ).toBeNull();
  });

  it('a scheduled task on that day keeps its deadline', () => {
    const task = {
      deadline: stored,
      estimated_start_date: '2026-12-31T20:00:00',
    };
    expect(withoutPlaceholderDeadline(task).deadline).toBe(stored);
  });

  it('a real deadline stays', () => {
    const task = { deadline: '2026-12-31T18:00:00' };
    expect(withoutPlaceholderDeadline(task).deadline).toBe(task.deadline);
  });
});

describe('ids in what Lumina writes', () => {
  const id = 'bd98fea3-2b2a-41c9-8a97-43653ee9160d';

  it.each([
    [`Reunión de equipo (${id}). Es corta.`, 'Reunión de equipo. Es corta.'],
    [`Tarea (ID: ${id}) lista`, 'Tarea lista'],
  ])('are removed: %s', (text, clean) => {
    expect(parseLuminaActions(text).cleanText).toBe(clean);
  });

  it('stay available to the action', () => {
    const { actions } = parseLuminaActions(
      `Te propongo moverla.\n[ACTION: DELETE_TASK {"id": "${id}"}]`,
    );
    expect(actions[0].payload.id).toBe(id);
  });
});
