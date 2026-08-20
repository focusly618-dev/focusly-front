import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { TaskData as CreateTaskData } from '@/pages/Home/components/CreateTaskModal/types/CreateTaskModal.types';
import type { TaskData as DetailTaskData } from '@/pages/Tasks/components/TaskDetailModal/types/TaskDetailModal.types';

const executeCreateTask = vi.fn();
const executeUpdateTask = vi.fn();
const executeDeleteTask = vi.fn();
const generateMeetLinkNow = vi.fn();

vi.mock('@/hooks/useTaskOperations', () => ({
  useTaskOperations: () => ({
    user: { id: 'u-1' },
    generateMeetLinkNow,
    executeCreateTask,
    executeUpdateTask,
    executeDeleteTask,
  }),
}));

vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client')>();
  return { ...actual, useMutation: () => [vi.fn(), {}] };
});

const sileo = { success: vi.fn(), error: vi.fn(), warning: vi.fn() };
const handleMutationError = vi.fn();
vi.mock('@/utils', () => ({
  sileo,
  handleMutationError,
}));

const { useTaskMutations: useCreateTaskModalMutations } = await import(
  '@/pages/Home/components/CreateTaskModal/hooks/useTaskMutations'
);
const { useTaskMutations: useTaskDetailModalMutations } = await import(
  '@/pages/Tasks/components/TaskDetailModal/hooks/useTaskMutations'
);

const createState = (
  overrides: Partial<CreateTaskData & { shouldGenerateMeet?: boolean }> = {},
): CreateTaskData & { color: string; shouldGenerateMeet?: boolean } => ({
  title: 'A task',
  description: '',
  priority: 'Med',
  category: 'General',
  deadline: new Date('2026-01-01T10:00:00.000Z'),
  duration: '30m',
  tags: [],
  color: '#3b82f6',
  ...overrides,
});

const detailState = (
  overrides: Partial<DetailTaskData & { shouldGenerateMeet?: boolean }> = {},
): DetailTaskData & { color: string; shouldGenerateMeet?: boolean } => ({
  title: 'A task',
  description: '',
  priority: 'Med',
  category: 'General',
  deadline: new Date('2026-01-01T10:00:00.000Z'),
  duration: '30m',
  tags: [],
  color: '#3b82f6',
  ...overrides,
});

describe.each([
  {
    name: 'Home/CreateTaskModal',
    useTaskMutations: useCreateTaskModalMutations,
    buildState: createState,
  },
  {
    name: 'Tasks/TaskDetailModal',
    useTaskMutations: useTaskDetailModalMutations,
    buildState: detailState,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
])('useTaskMutations.handleSave ($name) — Meet link generation failure', (ctx: any) => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('warns the user (without blocking task creation) when generateMeetLinkNow fails and shouldGenerateMeet is set', async () => {
    generateMeetLinkNow.mockResolvedValue(null);
    executeCreateTask.mockResolvedValue({ createTask: { id: 'new-1' } });
    const onSave = vi.fn();
    const onClose = vi.fn();
    const resetForm = vi.fn();

    const { result } = renderHook(() =>
      ctx.useTaskMutations({
        onSave,
        onClose,
        resetForm,
        initialTask: undefined,
      }),
    );

    await result.current.handleSave(
      ctx.buildState({ shouldGenerateMeet: true }),
    );

    expect(generateMeetLinkNow).toHaveBeenCalledTimes(1);
    expect(sileo.warning).toHaveBeenCalledTimes(1);
    expect(sileo.warning).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Could not generate Meet link',
      }),
    );
    // The task must still be created successfully — Meet failure degrades
    // gracefully instead of blocking the save or reporting false success.
    expect(executeCreateTask).toHaveBeenCalledTimes(1);
    expect(sileo.success).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({ id: 'new-1' });
  });

  it('warns when collaborators are set (even without shouldGenerateMeet) and generateMeetLinkNow fails', async () => {
    generateMeetLinkNow.mockResolvedValue(null);
    executeCreateTask.mockResolvedValue({ createTask: { id: 'new-2' } });
    const onSave = vi.fn();
    const onClose = vi.fn();
    const resetForm = vi.fn();

    const { result } = renderHook(() =>
      ctx.useTaskMutations({
        onSave,
        onClose,
        resetForm,
        initialTask: undefined,
      }),
    );

    await result.current.handleSave(
      ctx.buildState({ collaborators: [{ name: 'A', email: 'a@b.com' }] }),
    );

    expect(sileo.warning).toHaveBeenCalledTimes(1);
    expect(executeCreateTask).toHaveBeenCalledTimes(1);
  });

  it('does not warn when generateMeetLinkNow succeeds', async () => {
    generateMeetLinkNow.mockResolvedValue({
      meetLink: 'https://meet.google.com/abc-defg-hij',
      googleEventId: 'g-1',
    });
    executeCreateTask.mockResolvedValue({ createTask: { id: 'new-3' } });
    const onSave = vi.fn();
    const onClose = vi.fn();
    const resetForm = vi.fn();

    const { result } = renderHook(() =>
      ctx.useTaskMutations({
        onSave,
        onClose,
        resetForm,
        initialTask: undefined,
      }),
    );

    await result.current.handleSave(
      ctx.buildState({ shouldGenerateMeet: true }),
    );

    expect(sileo.warning).not.toHaveBeenCalled();
    expect(executeCreateTask).toHaveBeenCalledTimes(1);
    const [createInput] = executeCreateTask.mock.calls[0];
    expect(createInput.links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Google Meet',
          url: 'https://meet.google.com/abc-defg-hij',
        }),
      ]),
    );
  });

  it('does not attempt Meet generation at all when neither shouldGenerateMeet nor collaborators are set', async () => {
    executeCreateTask.mockResolvedValue({ createTask: { id: 'new-4' } });
    const onSave = vi.fn();
    const onClose = vi.fn();
    const resetForm = vi.fn();

    const { result } = renderHook(() =>
      ctx.useTaskMutations({
        onSave,
        onClose,
        resetForm,
        initialTask: undefined,
      }),
    );

    await result.current.handleSave(ctx.buildState());

    expect(generateMeetLinkNow).not.toHaveBeenCalled();
    expect(sileo.warning).not.toHaveBeenCalled();
  });
});
