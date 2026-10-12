import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  calendarPlanService,
  type PlanResult,
} from '@/services/calendarPlanService';
import type { ICalendarEvent } from '@/pages/Home/components/CalendarEvent';

const draft = (id: string): ICalendarEvent => ({
  id,
  title: id,
  start: new Date(2026, 9, 7, 10),
  end: new Date(2026, 9, 7, 11),
  type: 'task',
  isDraft: true,
});

describe('calendarPlanService', () => {
  beforeEach(() => calendarPlanService.reset());

  it('one run at a time', async () => {
    let finish!: (result: PlanResult) => void;
    const job = vi.fn(
      () => new Promise<PlanResult>((resolve) => (finish = resolve)),
    );
    const first = calendarPlanService.run('u1', job);
    await calendarPlanService.run('u1', job);
    expect(job).toHaveBeenCalledTimes(1);
    finish({ drafts: [draft('a')], unplaced: [] });
    await first;
    expect(calendarPlanService.getSnapshot().drafts).toHaveLength(1);
  });

  it('a cancelled run leaves no proposal', async () => {
    const run = calendarPlanService.run('u1', async (signal) => {
      await new Promise((resolve) => signal.addEventListener('abort', resolve));
      return { drafts: [draft('a')], unplaced: [] };
    });
    calendarPlanService.cancel();
    await run;
    expect(calendarPlanService.getSnapshot()).toMatchObject({
      isPlanning: false,
      drafts: [],
    });
  });

  it('a run that fails still frees the button', async () => {
    await expect(
      calendarPlanService.run('u1', async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
    expect(calendarPlanService.getSnapshot().isPlanning).toBe(false);
  });

  it("a run that finishes after a logout doesn't bring the proposal back", async () => {
    let finish!: (result: PlanResult) => void;
    const run = calendarPlanService.run(
      'u1',
      () => new Promise((resolve) => (finish = resolve)),
    );
    calendarPlanService.reset();
    finish({ drafts: [draft('a')], unplaced: [] });
    await run;
    expect(calendarPlanService.getSnapshot().drafts).toEqual([]);
  });

  it('knows whether the calendar is on screen', () => {
    expect(calendarPlanService.isCalendarOpen()).toBe(false);
    const detachA = calendarPlanService.attachCalendar();
    const detachB = calendarPlanService.attachCalendar(); // the mobile drawer too
    detachA();
    expect(calendarPlanService.isCalendarOpen()).toBe(true);
    detachB();
    expect(calendarPlanService.isCalendarOpen()).toBe(false);
  });

  it('edits and clears the proposal, telling every screen', () => {
    const listener = vi.fn();
    calendarPlanService.subscribe(listener);
    calendarPlanService.setDrafts(() => [draft('a'), draft('b')]);
    calendarPlanService.setDrafts((d) => d.filter((x) => x.id !== 'a'));
    expect(calendarPlanService.getSnapshot().drafts.map((d) => d.id)).toEqual([
      'b',
    ]);
    calendarPlanService.clearDrafts();
    expect(calendarPlanService.getSnapshot().drafts).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('reports its steps, and the time it started', async () => {
    const phases: (string | null)[] = [];
    const unsubscribe = calendarPlanService.subscribe(() =>
      phases.push(calendarPlanService.getSnapshot().phase),
    );
    await calendarPlanService.run('u1', async (_signal, setPhase) => {
      expect(calendarPlanService.getSnapshot().startedAt).toEqual(
        expect.any(Number),
      );
      setPhase('slots');
      setPhase('thinking');
      setPhase('checking');
      return { drafts: [draft('a')], unplaced: [{ id: 'b', title: 'B' }] };
    });
    unsubscribe();
    expect(phases).toEqual([
      'tasks',
      'slots',
      'thinking',
      'checking',
      'checking',
      null,
    ]);
    expect(calendarPlanService.getSnapshot()).toMatchObject({
      phase: null,
      startedAt: null,
      unplaced: [{ id: 'b', title: 'B' }],
    });
  });

  it('unchecked blocks are remembered, and forgotten when they go', () => {
    calendarPlanService.setDrafts(() => [draft('a'), draft('b')]);
    calendarPlanService.toggleExcluded('a');
    expect(calendarPlanService.getSnapshot().excluded).toEqual(['a']);
    calendarPlanService.toggleExcluded('a');
    expect(calendarPlanService.getSnapshot().excluded).toEqual([]);
    calendarPlanService.toggleExcluded('b');
    calendarPlanService.setDrafts((d) => d.filter((x) => x.id !== 'b'));
    expect(calendarPlanService.getSnapshot().excluded).toEqual([]);
  });

  it('discarding clears the blocks, the unchecked ones and what did not fit', async () => {
    await calendarPlanService.run('u1', async () => ({
      drafts: [draft('a')],
      unplaced: [{ id: 'b', title: 'B' }],
    }));
    calendarPlanService.toggleExcluded('a');
    calendarPlanService.clearDrafts();
    expect(calendarPlanService.getSnapshot()).toMatchObject({
      drafts: [],
      excluded: [],
      unplaced: [],
    });
  });
});
