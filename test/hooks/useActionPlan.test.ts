import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ParsedLuminaAction } from '@/utils';

const mocks = vi.hoisted(() => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
  createWorkspace: vi.fn(),
  createProjectGroup: vi.fn(),
  deleteTask: vi.fn(),
  dispatch: vi.fn(),
  query: vi.fn(),
  taskDetail: null as unknown,
  projectGroups: [] as { id: string; name: string }[],
  createGoogleEvent: vi.fn(),
  updateGoogleEvent: vi.fn(),
  deleteGoogleEvent: vi.fn(),
  fetchGoogleEvent: vi.fn(),
  calendarConnected: true,
}));

// Mutations are told apart by operation name: importing the .graphql modules
// here would import @apollo/client from inside its own mock.
vi.mock('@apollo/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@apollo/client')>();
  const MUTATIONS: Record<string, keyof typeof mocks> = {
    CreateTask: 'createTask',
    UpdateTask: 'updateTask',
    CreateWorkspace: 'createWorkspace',
    CreateProjectGroup: 'createProjectGroup',
    DeleteTask: 'deleteTask',
  };
  return {
    ...actual,
    useMutation: (document: {
      definitions: { name?: { value: string } }[];
    }) => [mocks[MUTATIONS[document.definitions[0]?.name?.value ?? '']], {}],
    useQuery: () => ({ data: { projectGroups: mocks.projectGroups } }),
    useApolloClient: () => ({ query: mocks.query }),
  };
});

vi.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: {
        user: {
          id: 'u-1',
          settings: { calendarConnected: mocks.calendarConnected },
        },
        authProvider: 'google',
      },
      task: { tasks: [] },
      calendar: { reduxEvents: [] },
    }),
}));

vi.mock('@/api/GoogleCalendar/googleCalendarApi', () => ({
  createGoogleEvent: mocks.createGoogleEvent,
  updateGoogleEvent: mocks.updateGoogleEvent,
  deleteGoogleEvent: mocks.deleteGoogleEvent,
  fetchGoogleEvent: mocks.fetchGoogleEvent,
}));

const { useActionPlan } =
  await import('@/components/chat/actionPlan/useActionPlan.hook');

const workspaceInput = (call: number) =>
  mocks.createWorkspace.mock.calls[call][0].variables.createWorkspaceInput;
const taskInput = (call: number) =>
  mocks.createTask.mock.calls[call][0].variables.createTaskInput;

const render = (actions: ParsedLuminaAction[]) =>
  renderHook(() => useActionPlan(actions));

const nutrition: ParsedLuminaAction[] = [
  {
    type: 'CREATE_TASK',
    payload: {
      title: 'Lista de compras',
      project_ref: 'p1',
      workspace_ref: 'w1',
    },
  },
  {
    type: 'CREATE_WORKSPACE',
    payload: { ref: 'w1', title: 'Menu', project_ref: 'p1' },
  },
  {
    type: 'CREATE_WORKSPACE',
    payload: { ref: 'w2', title: 'Recetas', project_ref: 'p1' },
  },
  { type: 'CREATE_PROJECT_GROUP', payload: { ref: 'p1', name: 'Nutrición' } },
];

describe('useActionPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mocks.projectGroups = [];
    mocks.query.mockImplementation(
      async ({
        query,
      }: {
        query: { definitions: { name?: { value: string } }[] };
      }) =>
        query.definitions[0]?.name?.value === 'GetTaskDetail'
          ? { data: { task: mocks.taskDetail } }
          : { data: { projectGroups: mocks.projectGroups } },
    );
    mocks.updateTask.mockResolvedValue({ data: { updateTask: { id: 't-1' } } });
    mocks.deleteTask.mockResolvedValue({ data: { deleteTask: true } });
    let n = 0;
    mocks.createProjectGroup.mockImplementation(async () => ({
      data: { createProjectGroup: { id: `proj-${++n}` } },
    }));
    mocks.createWorkspace.mockImplementation(
      async ({
        variables,
      }: {
        variables: { createWorkspaceInput: { title: string } };
      }) => ({
        data: {
          createWorkspace: { id: `ws-${variables.createWorkspaceInput.title}` },
        },
      }),
    );
    mocks.createTask.mockResolvedValue({
      data: { createTask: { id: 'task-1' } },
    });
  });

  it('creates the project once and links everything, whatever order Lumina used', async () => {
    const { result } = render(nutrition);
    await act(async () => result.current.run());

    expect(mocks.createProjectGroup).toHaveBeenCalledTimes(1);
    expect(workspaceInput(0)).toMatchObject({
      title: 'Menu',
      groupId: 'proj-1',
    });
    expect(workspaceInput(1)).toMatchObject({
      title: 'Recetas',
      groupId: 'proj-1',
    });
    expect(taskInput(0)).toMatchObject({
      project_id: 'proj-1',
      workspace_id: 'ws-Menu',
    });
    expect(result.current.statuses).toEqual(['done', 'done', 'done', 'done']);
    expect(result.current.createdIds).toEqual([
      'task-1',
      'ws-Menu',
      'ws-Recetas',
      'proj-1',
    ]);
    expect(result.current.isCompleted).toBe(true);
  });

  it('documents that only name their project share one project', async () => {
    const { result } = render([
      {
        type: 'CREATE_WORKSPACE',
        payload: { title: 'Menu', project_name: 'Nutrición' },
      },
      {
        type: 'CREATE_WORKSPACE',
        payload: { title: 'Recetas', project_name: 'Nutrición' },
      },
    ]);
    await act(async () => result.current.run());

    expect(mocks.createProjectGroup).toHaveBeenCalledTimes(1);
    expect(workspaceInput(1).groupId).toBe('proj-1');
  });

  it('reuses an existing project with the same name', async () => {
    mocks.projectGroups = [{ id: 'mine', name: 'Nutrición' }];
    const { result } = render(nutrition.slice(1, 2).concat(nutrition[3]));
    await act(async () => result.current.run());

    expect(mocks.createProjectGroup).not.toHaveBeenCalled();
    expect(workspaceInput(0).groupId).toBe('mine');
  });

  it('only creates what stays checked; the rest is marked skipped', async () => {
    const { result } = render(nutrition);
    act(() => result.current.toggle(2)); // uncheck "Recetas"
    await act(async () => result.current.run());

    expect(mocks.createWorkspace).toHaveBeenCalledTimes(1);
    expect(result.current.statuses[2]).toBe('skipped');
    expect(result.current.isCompleted).toBe(true);
  });

  it('runs with the title and date the user edited', async () => {
    const { result } = render([
      {
        type: 'CREATE_TASK',
        payload: { title: 'Original', deadline: '2026-10-05T10:00:00' },
      },
    ]);
    act(() =>
      result.current.editItem(0, {
        title: 'Editada',
        deadline: '2026-10-06T16:30',
      }),
    );
    await act(async () => result.current.run());

    expect(taskInput(0).title).toBe('Editada');
    expect(new Date(taskInput(0).deadline).getDate()).toBe(6);
  });

  it('when the project fails its documents fail too, and a retry recovers', async () => {
    mocks.createProjectGroup.mockRejectedValueOnce(new Error('boom'));
    const actions = nutrition.slice(1, 2).concat(nutrition[3]);
    const { result } = render(actions);

    await act(async () => result.current.run());
    expect(mocks.createWorkspace).not.toHaveBeenCalled();
    expect(result.current.statuses).toEqual(['error', 'error']);
    expect(result.current.hasErrors).toBe(true);

    await act(async () => result.current.run());
    expect(result.current.statuses).toEqual(['done', 'done']);
    expect(workspaceInput(0).groupId).toBe('proj-1');
  });

  it('remembers what was created after a reload', async () => {
    const first = render(nutrition);
    await act(async () => first.result.current.run());
    first.unmount();

    const second = render(nutrition);
    expect(second.result.current.statuses).toEqual([
      'done',
      'done',
      'done',
      'done',
    ]);
    expect(second.result.current.createdIds[1]).toBe('ws-Menu');
    expect(second.result.current.isCompleted).toBe(true);
  });
});

describe('useActionPlan — existing tasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mocks.query.mockImplementation(
      async ({
        query,
      }: {
        query: { definitions: { name?: { value: string } }[] };
      }) =>
        query.definitions[0]?.name?.value === 'GetTaskDetail'
          ? { data: { task: mocks.taskDetail } }
          : { data: { projectGroups: [] } },
    );
    mocks.createWorkspace.mockResolvedValue({
      data: { createWorkspace: { id: 'ws-new' } },
    });
    mocks.createProjectGroup.mockResolvedValue({
      data: { createProjectGroup: { id: 'proj-1' } },
    });
    mocks.updateTask.mockResolvedValue({ data: { updateTask: { id: 't-1' } } });
    mocks.deleteTask.mockResolvedValue({ data: { deleteTask: true } });
  });

  const updateInput = (call = 0) =>
    mocks.updateTask.mock.calls[call][0].variables.updateTaskInput;

  it('changes status and links the task to a document created in the same plan', async () => {
    const { result } = render([
      {
        type: 'CREATE_PROJECT_GROUP',
        payload: { ref: 'p1', name: 'Nutrición' },
      },
      {
        type: 'CREATE_WORKSPACE',
        payload: { ref: 'w1', title: 'Menú', project_ref: 'p1' },
      },
      {
        type: 'UPDATE_TASK',
        payload: {
          id: 't-1',
          status: 'Done',
          workspace_ref: 'w1',
          project_ref: 'p1',
        },
      },
    ]);
    await act(async () => result.current.run());

    expect(updateInput()).toEqual({
      id: 't-1',
      status: 'Done',
      workspace_id: 'ws-new',
      project_id: 'proj-1',
    });
  });

  it('edits the checklist on top of the subtasks the task has now', async () => {
    mocks.taskDetail = {
      id: 't-1',
      subtasks: [
        {
          __typename: 'Subtask',
          id: 's1',
          title: 'Leer',
          completed: false,
          completed_at: null,
          estimate_timer: 10,
        },
      ],
    };
    const { result } = render([
      {
        type: 'UPDATE_SUBTASKS',
        payload: {
          id: 't-1',
          complete: ['leer'],
          add: [{ title: 'Resumir', estimate_timer: 15 }],
        },
      },
    ]);
    await act(async () => result.current.run());

    const subtasks = updateInput().subtasks;
    expect(subtasks).toHaveLength(2);
    expect(subtasks[0]).toMatchObject({
      id: 's1',
      title: 'Leer',
      completed: true,
    });
    expect(subtasks[1]).toMatchObject({
      title: 'Resumir',
      completed: false,
      estimate_timer: 15,
    });
    expect(subtasks[0]).not.toHaveProperty('__typename');
  });

  it('does not delete anything until the user confirms', async () => {
    const { result } = render([
      { type: 'DELETE_TASK', payload: { id: 't-9' } },
    ]);

    expect(result.current.needsConfirmation).toBe(true);
    await act(async () => result.current.run());
    expect(mocks.deleteTask).not.toHaveBeenCalled();

    act(() => result.current.setDestructiveConfirmed(true));
    await act(async () => result.current.run());

    expect(mocks.deleteTask).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { id: 't-9' } }),
    );
    expect(mocks.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: { id: 't-9' } }),
    );
    expect(result.current.statuses).toEqual(['done']);
  });

  it('runs deletions after everything else in the plan', async () => {
    const order: string[] = [];
    mocks.deleteTask.mockImplementation(async () => {
      order.push('delete');
      return { data: { deleteTask: true } };
    });
    mocks.updateTask.mockImplementation(async () => {
      order.push('update');
      return { data: { updateTask: { id: 't-1' } } };
    });
    const { result } = render([
      { type: 'DELETE_TASK', payload: { id: 't-9' } },
      { type: 'UPDATE_TASK', payload: { id: 't-1', status: 'Done' } },
    ]);
    act(() => result.current.setDestructiveConfirmed(true));
    await act(async () => result.current.run());

    expect(order).toEqual(['update', 'delete']);
  });
});

describe('useActionPlan — calendar events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mocks.calendarConnected = true;
    mocks.query.mockResolvedValue({ data: { projectGroups: [] } });
    mocks.createGoogleEvent.mockResolvedValue({
      id: 'ev-new',
      htmlLink: 'https://calendar.google.com/event?eid=1',
      hangoutLink: 'https://meet.google.com/abc-defg-hij',
    });
    mocks.updateGoogleEvent.mockResolvedValue({
      id: 'ev1',
      htmlLink: 'https://calendar.google.com/event?eid=2',
    });
    mocks.deleteGoogleEvent.mockResolvedValue(undefined);
    mocks.fetchGoogleEvent.mockResolvedValue({
      id: 'ev1',
      start: { dateTime: '2026-10-05T16:00:00Z' },
      end: { dateTime: '2026-10-05T16:30:00Z' },
      attendees: [{ email: 'ana@example.com', responseStatus: 'accepted' }],
    });
  });

  it('creates the event with guests and Meet, and keeps its links', async () => {
    const { result } = render([
      {
        type: 'CREATE_EVENT',
        payload: {
          title: 'Kickoff',
          start: '2026-10-05T10:00:00',
          attendees: ['ana@example.com'],
          meet: true,
        },
      },
    ]);
    await act(async () => result.current.run());

    const body = mocks.createGoogleEvent.mock.calls[0][0];
    expect(body).toMatchObject({
      summary: 'Kickoff',
      attendees: [{ email: 'ana@example.com' }],
    });
    expect(body.conferenceData.createRequest).toBeDefined();
    expect(result.current.statuses).toEqual(['done']);
    expect(result.current.links[0]).toEqual({
      url: 'https://calendar.google.com/event?eid=1',
      meetUrl: 'https://meet.google.com/abc-defg-hij',
    });
    // The calendar view refetches.
    expect(mocks.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'calendar/incrementSyncVersion' }),
    );
    const saved = JSON.parse(
      localStorage.getItem(localStorage.key(0) as string) as string,
    );
    expect(saved.links[0].meetUrl).toBe('https://meet.google.com/abc-defg-hij');
  });

  it('adds a guest on top of the guests the event has right now', async () => {
    const { result } = render([
      {
        type: 'UPDATE_EVENT',
        payload: { id: 'ev1', add_attendees: ['luis@example.com'] },
      },
    ]);
    await act(async () => result.current.run());

    expect(mocks.fetchGoogleEvent).toHaveBeenCalledWith('ev1');
    expect(mocks.updateGoogleEvent).toHaveBeenCalledWith('ev1', {
      attendees: [
        { email: 'ana@example.com', responseStatus: 'accepted' },
        { email: 'luis@example.com' },
      ],
    });
  });

  it('renaming does not need to read the event first', async () => {
    const { result } = render([
      { type: 'UPDATE_EVENT', payload: { id: 'ev1', title: 'Nuevo nombre' } },
    ]);
    await act(async () => result.current.run());
    expect(mocks.fetchGoogleEvent).not.toHaveBeenCalled();
    expect(mocks.updateGoogleEvent).toHaveBeenCalledWith('ev1', {
      summary: 'Nuevo nombre',
    });
  });

  it('cancels an event only after confirming, and drops it from the calendar', async () => {
    const { result } = render([
      { type: 'DELETE_EVENT', payload: { id: 'ev2' } },
    ]);
    expect(result.current.needsConfirmation).toBe(true);
    await act(async () => result.current.run());
    expect(mocks.deleteGoogleEvent).not.toHaveBeenCalled();

    act(() => result.current.setDestructiveConfirmed(true));
    await act(async () => result.current.run());
    expect(mocks.deleteGoogleEvent).toHaveBeenCalledWith('ev2');
    expect(mocks.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'calendar/removeEvent',
        payload: { id: 'ev2' },
      }),
    );
  });

  it('without Google Calendar, events are left out and never sent', async () => {
    mocks.calendarConnected = false;
    const { result } = render([
      {
        type: 'CREATE_EVENT',
        payload: { title: 'Kickoff', start: '2026-10-05T10:00:00' },
      },
      { type: 'CREATE_TASK', payload: { title: 'Preparar' } },
    ]);
    expect(result.current.isBlocked(0)).toBe(true);
    expect(result.current.selected.has(0)).toBe(false);

    act(() => result.current.toggle(0));
    act(() => result.current.selectAll());
    expect(result.current.selected.has(0)).toBe(false);

    mocks.createTask.mockResolvedValue({
      data: { createTask: { id: 'task-1' } },
    });
    await act(async () => result.current.run());
    expect(mocks.createGoogleEvent).not.toHaveBeenCalled();
    expect(result.current.statuses).toEqual(['skipped', 'done']);
  });
});
