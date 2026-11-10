import { describe, expect, it, vi } from 'vitest';
import { executeSingleAction } from '@/components/chat/actionPlan/actionExecution';
import { taskStart } from '@/components/chat/actionPlan/planFormat';
import { parseLuminaActions, STREAM_INCOMPLETE_NOTICE } from '@/utils';
import type { ParsedLuminaAction } from '@/utils';

const local = (value: string) => new Date(value).toISOString();

const create = async (payload: Record<string, unknown>) => {
  const createTask = vi
    .fn()
    .mockResolvedValue({ data: { createTask: { id: 't1' } } });
  await executeSingleAction(
    { type: 'CREATE_TASK', payload } as ParsedLuminaAction,
    { createTask, userId: 'u1' } as unknown as Parameters<
      typeof executeSingleAction
    >[1],
  );
  return createTask.mock.calls[0][0].variables.createTaskInput;
};

describe('a task from a plan starts when Lumina said', () => {
  const payload = {
    title: 'Pagar la luz',
    estimate_timer: 30,
    estimated_start_date: '2026-11-13T10:00:00',
    estimated_end_date: '2026-11-13T10:30:00',
    deadline: '2026-11-13T17:00:00',
  };

  it('the start wins over the deadline', () => {
    expect(taskStart(payload)).toEqual(new Date('2026-11-13T10:00:00'));
  });

  it('saves start, end and deadline as they came', async () => {
    const input = await create(payload);
    expect(input.estimated_start_date).toBe(local('2026-11-13T10:00:00'));
    expect(input.estimated_end_date).toBe(local('2026-11-13T10:30:00'));
    expect(input.deadline).toBe(local('2026-11-13T17:00:00'));
  });

  it('with only a deadline it still starts there', async () => {
    const input = await create({
      title: 'Antigua',
      estimate_timer: 30,
      deadline: '2026-11-13T10:00:00',
    });
    expect(input.estimated_start_date).toBe(local('2026-11-13T10:00:00'));
    expect(input.estimated_end_date).toBe(local('2026-11-13T10:30:00'));
  });

  it('without an end it adds the estimate to the start', async () => {
    const input = await create({
      title: 'Sin fin',
      estimate_timer: 45,
      estimated_start_date: '2026-11-13T10:00:00',
    });
    expect(input.estimated_end_date).toBe(local('2026-11-13T10:45:00'));
  });
});

describe('a reply cut by the provider', () => {
  const notice = `\n\n${STREAM_INCOMPLETE_NOTICE}`;

  it('still shows the notice when cut inside an action tag', () => {
    const result = parseLuminaActions(
      `Te propongo esto.\n\n[ACTION: CREATE_TASK {"title": "A", "dead${notice}`,
    );
    expect(result.cleanText).toBe(
      `Te propongo esto.\n\n${STREAM_INCOMPLETE_NOTICE}`,
    );
    expect(result.actions).toEqual([]);
    expect(result.hasPendingAction).toBe(false);
  });

  it('keeps it as normal text when cut before any tag', () => {
    const result = parseLuminaActions(`Te propongo es${notice}`);
    expect(result.cleanText).toContain(STREAM_INCOMPLETE_NOTICE);
  });

  it('an action still being written stays pending', () => {
    const result = parseLuminaActions('Listo [ACTION: CREATE_TASK {"title"');
    expect(result.hasPendingAction).toBe(true);
    expect(result.cleanText).toBe('Listo');
  });
});
