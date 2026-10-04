import { describe, it, expect } from 'vitest';
import {
  NO_TASK_FILTERS,
  filterProjectTasks,
  sortProjectTasks,
  summarizeProjectTasks,
  visibleStatuses,
} from '@/pages/Projects/components/ProjectTasks/projectTaskFilters';
import type { ProjectTaskItemData } from '@/pages/Projects/components/ProjectTasks/projectTasks.types';

const task = (over: Partial<ProjectTaskItemData>): ProjectTaskItemData => ({
  id: over.title ?? 'x',
  title: 'x',
  status: 'todo',
  priority: 'Medium',
  ...over,
});

const tasks = [
  task({
    title: 'Vencida',
    rawDeadline: '2026-09-01T09:00:00',
    dueDateHighlight: 'overdue',
    priority: 'Low',
    estimateMinutes: 30,
    createdAt: '2026-09-01T00:00:00Z',
  }),
  task({
    title: 'Sin fecha',
    priority: 'Critical',
    estimateMinutes: 60,
    createdAt: '2026-10-02T00:00:00Z',
  }),
  task({
    title: 'Próxima',
    rawDeadline: '2026-10-10T09:00:00',
    priority: 'High',
    status: 'in_progress',
    estimateMinutes: 45,
    createdAt: '2026-09-15T00:00:00Z',
  }),
  task({
    title: 'Hecha',
    rawDeadline: '2026-09-20T09:00:00',
    status: 'completed',
    completed: true,
    estimateMinutes: 90,
  }),
];

const titles = (list: ProjectTaskItemData[]) => list.map((t) => t.title);

describe('project task filters', () => {
  it('quick filters combine', () => {
    expect(
      titles(filterProjectTasks(tasks, { ...NO_TASK_FILTERS, overdue: true })),
    ).toEqual(['Vencida']);
    expect(
      titles(filterProjectTasks(tasks, { ...NO_TASK_FILTERS, noDate: true })),
    ).toEqual(['Sin fecha']);
    expect(
      titles(
        filterProjectTasks(tasks, { ...NO_TASK_FILTERS, highPriority: true }),
      ),
    ).toEqual(['Sin fecha', 'Próxima']);
    expect(filterProjectTasks(tasks, NO_TASK_FILTERS)).toHaveLength(4);
  });

  it('orders by date (undated last), priority, name or newest', () => {
    expect(titles(sortProjectTasks(tasks, 'dueDate'))).toEqual([
      'Vencida',
      'Hecha',
      'Próxima',
      'Sin fecha',
    ]);
    expect(titles(sortProjectTasks(tasks, 'priority'))[0]).toBe('Sin fecha');
    expect(titles(sortProjectTasks(tasks, 'title', 'es'))).toEqual([
      'Hecha',
      'Próxima',
      'Sin fecha',
      'Vencida',
    ]);
    expect(titles(sortProjectTasks(tasks, 'recent'))[0]).toBe('Sin fecha');
  });

  it('sums progress, overdue tasks and the time left', () => {
    expect(summarizeProjectTasks(tasks)).toEqual({
      total: 4,
      completed: 1,
      overdue: 1,
      remainingMinutes: 135,
    });
  });

  it('shows the main statuses always and the rest when used', () => {
    const ids = (list: { id: string }[]) => list.map((s) => s.id);
    expect(ids(visibleStatuses(tasks, false))).toEqual([
      'in_progress',
      'todo',
      'completed',
    ]);
    expect(
      ids(visibleStatuses([task({ status: 'on_hold' })], false)),
    ).toContain('on_hold');
    expect(visibleStatuses([], true)).toHaveLength(8);
  });
});
