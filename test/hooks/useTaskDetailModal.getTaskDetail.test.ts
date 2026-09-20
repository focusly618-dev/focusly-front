import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  GET_TASKS_PAGINATED,
  GET_TASK_DETAIL,
} from '@/pages/Tasks/Tasks.graphql';

vi.mock('@/redux/hooks', () => ({
  useAppSelector: () => ({ user: { id: 'u-1', email: 'me@example.com' } }),
  useAppDispatch: () => vi.fn(),
}));

const mockTaskDetailResponse = {
  id: 'task-full-1',
  user_id: 'u-1',
  title: 'Full Task with Resources',
  notes_encrypted: 'Notes from server [COLOR:#ff0000]',
  status: 'Planning',
  estimate_timer: 60,
  real_timer: 15,
  priority_level: 3,
  deadline: '2026-10-01T12:00:00.000Z',
  category: 'Engineering',
  color: '#ff0000',
  created_at: '2026-09-01T10:00:00.000Z',
  updated_at: '2026-09-02T10:00:00.000Z',
  use_ai: false,
  is_owner: true,
  tags: [{ name: 'frontend' }],
  links: [{ title: 'Docs', url: 'https://docs.example.com' }],
  collaborators: [
    {
      name: 'Alice',
      email: 'alice@example.com',
      avatar: 'https://avatar.example.com/alice',
      responseStatus: 'accepted',
    },
  ],
  time_logs: [{ date: '2026-09-02', minutes: 15 }],
  subtasks: [
    {
      id: 'sub-1',
      title: 'Subtask with full title',
      completed: false,
      completed_at: null,
      estimate_timer: 30,
    },
  ],
  workspace_id: 'ws-1',
  project_id: 'proj-1',
  workspace: { id: 'ws-1', title: 'Q3 Launch Workspace' },
  project: {
    id: 'proj-1',
    name: 'Product Revamp',
    color: '#6366f1',
    emoji: '🚀',
  },
};

let capturedQueryDoc: unknown = null;
let capturedQueryVariables: unknown = null;

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client')>();
  return {
    ...actual,
    useQuery: (
      doc: { loc?: { source?: { body?: string } } },
      options?: { variables?: unknown; skip?: boolean },
    ) => {
      capturedQueryDoc = doc;
      capturedQueryVariables = options?.variables;
      if (options?.skip) {
        return { data: undefined, loading: false };
      }
      return {
        data: { task: mockTaskDetailResponse },
        loading: false,
      };
    },
    useMutation: () => [vi.fn().mockResolvedValue({}), {}],
  };
});

const { useTaskDetailModal } =
  await import('@/pages/Tasks/components/TaskDetailModal/hooks/useTaskDetailModal.hooks');

describe('GET_TASKS_PAGINATED field pruning contract', () => {
  it('no longer requests color, created_at, source, or estimated_end_date', () => {
    const queryBody = GET_TASKS_PAGINATED.loc?.source.body || '';
    // Pruned fields
    expect(queryBody).not.toMatch(/\bcolor\b/);
    expect(queryBody).not.toMatch(/\bcreated_at\b/);
    expect(queryBody).not.toMatch(/\bsource\b/);
    expect(queryBody).not.toMatch(/\bestimated_end_date\b/);

    // Kept fields as required
    expect(queryBody).toMatch(/\bworkspace_id\b/);
    expect(queryBody).toMatch(/\bproject_id\b/);
    expect(queryBody).toMatch(/\bsubtasks\b/);

    // Subtasks pruned to only id and completed in list view
    const subtasksMatch = queryBody.match(/subtasks\s*\{([^}]+)\}/);
    expect(subtasksMatch).not.toBeNull();
    const subtaskFields = subtasksMatch![1];
    expect(subtaskFields).toMatch(/\bid\b/);
    expect(subtaskFields).toMatch(/\bcompleted\b/);
    expect(subtaskFields).not.toMatch(/\btitle\b/);
    expect(subtaskFields).not.toMatch(/\bcompleted_at\b/);
    expect(subtaskFields).not.toMatch(/\bestimate_timer\b/);

    // Verify GET_TASK_DETAIL retains full subtasks fields for the modal
    const detailBody = GET_TASK_DETAIL.loc?.source.body || '';
    const detailSubtasksMatch = detailBody.match(/subtasks\s*\{([^}]+)\}/);
    expect(detailSubtasksMatch).not.toBeNull();
    const detailSubtaskFields = detailSubtasksMatch![1];
    expect(detailSubtaskFields).toMatch(/\bid\b/);
    expect(detailSubtaskFields).toMatch(/\btitle\b/);
    expect(detailSubtaskFields).toMatch(/\bcompleted\b/);
    expect(detailSubtaskFields).toMatch(/\bcompleted_at\b/);
    expect(detailSubtaskFields).toMatch(/\bestimate_timer\b/);
  });
});

describe('TaskDetailModal connected to GET_TASK_DETAIL', () => {
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(MemoryRouter, null, children);

  it('queries GET_TASK_DETAIL and populates collaborators, links, and workspaces', () => {
    const initialTaskFromRedux = {
      id: 'task-full-1',
      user_id: 'u-1',
      title: 'Task from list (lacks collaborators and links)',
      notes_encrypted: '',
      status: 'Planning' as const,
      estimate_timer: 60,
      real_timer: 0,
      priority_level: 2,
      deadline: '2026-10-01T12:00:00.000Z',
      category: 'General',
      created_at: '2026-09-17T00:00:00.000Z',
      updated_at: '2026-09-17T00:00:00.000Z',
      links: [],
      collaborators: [],
      time_logs: [],
      subtasks: [{ id: 'sub-1', completed: false }],
    };

    const { result } = renderHook(
      () =>
        useTaskDetailModal({
          initialStart: null,
          initialEnd: null,
          initialTask: initialTaskFromRedux,
          onSave: vi.fn(),
          onClose: vi.fn(),
        }),
      { wrapper },
    );

    // Verified that GET_TASK_DETAIL was invoked with the task ID
    expect(capturedQueryDoc).toBe(GET_TASK_DETAIL);
    expect(capturedQueryVariables).toEqual({ id: 'task-full-1' });

    // Collections populated from GET_TASK_DETAIL
    expect(result.current.collaborators).toHaveLength(1);
    expect(result.current.collaborators[0].email).toBe('alice@example.com');

    expect(result.current.links).toHaveLength(1);
    expect(result.current.links[0].url).toBe('https://docs.example.com');

    expect(result.current.timeLogs).toHaveLength(1);
    expect(result.current.timeLogs[0].minutes).toBe(15);

    expect(result.current.subtasks).toHaveLength(1);
    expect(result.current.subtasks[0].title).toBe('Subtask with full title');

    // Workspaces mapped from workspace field
    expect(result.current.effectiveTask?.workspaces).toHaveLength(1);
    expect(result.current.effectiveTask?.workspaces?.[0].title).toBe(
      'Q3 Launch Workspace',
    );
  });
});
