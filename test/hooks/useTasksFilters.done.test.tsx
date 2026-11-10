import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useTasksFilters } from '@/pages/Tasks/hooks/useTasksFilters.hook';
import type { TaskResponse } from '@/redux/tasks/task.types';

const day = (offset: number) =>
  new Date(Date.now() + offset * 86400000).toISOString();

const task = (id: string, over: Partial<TaskResponse>) =>
  ({ id, title: id, status: 'Todo', tags: [], ...over }) as TaskResponse;

const filter = (list: string, tasks: TaskResponse[]) => {
  const { result } = renderHook(() => useTasksFilters('list'), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={[`/?filter=${list}`]}>
        {children}
      </MemoryRouter>
    ),
  });
  return result.current.applyLocalFilters(tasks).map((t) => t.id);
};

describe('finished tasks in the lists', () => {
  it('Upcoming keeps a finished task, so Done can count it', () => {
    expect(
      filter('upcoming', [
        task('done', { status: 'Done', estimated_start_date: day(2) }),
        task('open', { estimated_start_date: day(2) }),
      ]),
    ).toEqual(['done', 'open']);
  });

  it('Today keeps what is dated or was finished today, not old ones', () => {
    expect(
      filter('today', [
        task('dated', { status: 'Done', estimated_start_date: day(0) }),
        task('finished', {
          status: 'Done',
          estimated_start_date: day(-3),
          completed_at: day(0),
        }),
        task('old', {
          status: 'Done',
          estimated_start_date: day(-3),
          completed_at: day(-3),
        }),
        task('overdue', { estimated_start_date: day(-3) }),
      ]),
    ).toEqual(['dated', 'finished', 'overdue']);
  });
});
