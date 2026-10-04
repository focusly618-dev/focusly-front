import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import type { ParsedLuminaAction } from '@/utils';

const mocks = vi.hoisted(() => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
  createWorkspace: vi.fn(),
  createProjectGroup: vi.fn(),
  deleteTask: vi.fn(),
  createGoogleEvent: vi.fn(),
  calendarConnected: true,
}));

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
    useQuery: () => ({ data: { projectGroups: [] } }),
    useApolloClient: () => ({
      query: async () => ({ data: { projectGroups: [] } }),
      cache: { extract: () => ({}) },
    }),
  };
});

vi.mock('@/redux/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: {
        user: {
          id: 'u-1',
          settings: { calendarConnected: mocks.calendarConnected },
        },
        authProvider: 'google',
      },
      calendar: {
        reduxEvents: [
          {
            id: 'ev1',
            google_event_id: 'ev1',
            title: 'Revisión con cliente',
            estimated_start_date: '2026-10-05T16:00:00',
            deadline: '2026-10-05T16:30:00',
            is_all_day: false,
            is_owner: false,
            organizer_email: 'jefa@example.com',
            links: [{ title: 'Google Meet', url: 'https://meet.google.com/x' }],
            attendees: [
              { email: 'yo@example.com', self: true },
              { email: 'cliente@example.com', responseStatus: 'accepted' },
              { email: 'jefa@example.com', responseStatus: 'needsAction' },
            ],
          },
        ],
      },
      task: {
        tasks: [
          {
            id: 't-9',
            title: 'Preparar presentación',
            status: 'Todo',
            priority_level: 1,
            subtasks: [{ id: 's1', title: 'Diapositivas', completed: false }],
            deadline: '2026-10-03T10:00:00',
          },
        ],
      },
    }),
}));

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string, opts?: { count?: number }) =>
      opts?.count !== undefined ? `${key}:${opts.count}` : key,
    i18n: { language: 'es' },
  }),
}));

vi.mock('@/api/GoogleCalendar/googleCalendarApi', () => ({
  createGoogleEvent: mocks.createGoogleEvent,
  updateGoogleEvent: vi.fn(),
  deleteGoogleEvent: vi.fn(),
  fetchGoogleEvent: vi.fn(),
}));

const { ActionPlan } = await import('@/components/chat/actionPlan/ActionPlan');

const LocationProbe = () => {
  const location = useLocation();
  return (
    <div data-testid="location" data-path={location.pathname}>
      {location.search}
    </div>
  );
};

const renderPlan = (actions: ParsedLuminaAction[]) =>
  render(
    <MemoryRouter initialEntries={['/dashboard?tab=AskAI']}>
      <Routes>
        <Route path="*" element={<LocationProbe />} />
      </Routes>
      <ActionPlan actions={actions} />
    </MemoryRouter>,
  );

const nutrition: ParsedLuminaAction[] = [
  {
    type: 'CREATE_PROJECT_GROUP',
    payload: { ref: 'p1', name: 'Nutrición', emoji: '🥗' },
  },
  {
    type: 'CREATE_WORKSPACE',
    payload: {
      ref: 'w1',
      title: 'Menú semanal',
      project_ref: 'p1',
      content: '# Menú\n## Lunes\nAvena\n## Martes\nArroz',
    },
  },
  {
    type: 'CREATE_TASK',
    payload: {
      title: 'Lista de compras',
      project_ref: 'p1',
      workspace_ref: 'w1',
      priority_level: 3,
      estimate_timer: 45,
      deadline: '2026-10-05T10:00:00',
      subtasks: [{ title: 'Frutas', estimate_timer: 15 }],
      notes: 'Revisa la despensa primero.',
    },
  },
];

describe('ActionPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mocks.createProjectGroup.mockResolvedValue({
      data: { createProjectGroup: { id: 'proj-1' } },
    });
    mocks.createWorkspace.mockResolvedValue({
      data: { createWorkspace: { id: 'ws-1' } },
    });
    mocks.createTask.mockResolvedValue({
      data: { createTask: { id: 'task-1' } },
    });
    mocks.updateTask.mockResolvedValue({ data: { updateTask: { id: 't-9' } } });
  });

  it('shows the plan as a project holding its document and tasks, with a summary', () => {
    renderPlan(nutrition);

    expect(screen.getByText('Nutrición')).toBeInTheDocument();
    expect(screen.getByText('actionPlan.project.new')).toBeInTheDocument();
    expect(screen.getByText('Menú semanal')).toBeInTheDocument();
    expect(screen.getByText('Lista de compras')).toBeInTheDocument();
    expect(screen.getByText('actionPlan.priority.3')).toBeInTheDocument();
    expect(
      screen.getByText('actionPlan.document.sections:2'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('actionPlan.summary.projects:1'),
    ).toBeInTheDocument();
    expect(screen.getByText('actionPlan.footer.create:3')).toBeInTheDocument();
  });

  it('expands a document to its sections and full content', () => {
    renderPlan(nutrition);
    const docRow = screen.getByText('Menú semanal').closest('div[class]')!
      .parentElement!.parentElement!;
    fireEvent.click(
      within(docRow).getByRole('button', { name: 'actionPlan.details.show' }),
    );

    expect(screen.getByText('Lunes')).toBeInTheDocument();
    fireEvent.click(screen.getByText('actionPlan.document.showContent'));
    expect(screen.getByText('Avena')).toBeInTheDocument();
  });

  it('expands a task to its subtasks and notes', () => {
    renderPlan(nutrition);
    const buttons = screen.getAllByRole('button', {
      name: 'actionPlan.details.show',
    });
    fireEvent.click(buttons[buttons.length - 1]);

    expect(screen.getByText('Frutas')).toBeInTheDocument();
    expect(screen.getByText('Revisa la despensa primero.')).toBeInTheDocument();
  });

  it('a change to an existing task shows its real name and before → after', () => {
    renderPlan([
      { type: 'UPDATE_TASK', payload: { id: 't-9', priority_level: 4 } },
    ]);

    expect(screen.getByText('Preparar presentación')).toBeInTheDocument();
    // Changes are shown expanded from the start.
    expect(screen.getByText('actionPlan.priority.1')).toBeInTheDocument();
    expect(screen.getByText('actionPlan.priority.4')).toBeInTheDocument();
    expect(screen.getByText('actionPlan.footer.apply:1')).toBeInTheDocument();
  });

  it('creates only what stays checked, then links to what was created', async () => {
    renderPlan(nutrition);
    // Unchecking the task leaves the project and the document.
    fireEvent.click(screen.getByRole('checkbox', { name: 'Lista de compras' }));
    expect(screen.getByText('actionPlan.footer.create:2')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('actionPlan.footer.create:2'));
    });

    expect(mocks.createProjectGroup).toHaveBeenCalledTimes(1);
    expect(mocks.createWorkspace).toHaveBeenCalledTimes(1);
    expect(mocks.createTask).not.toHaveBeenCalled();
    expect(screen.getByText('actionPlan.status.skipped')).toBeInTheDocument();

    fireEvent.click(screen.getByText('actionPlan.open.document'));
    expect(screen.getByTestId('location').textContent).toBe(
      '?tab=Projects&workspaceId=ws-1',
    );
  });

  it("a status change shows the task's current and new status", () => {
    renderPlan([
      { type: 'UPDATE_TASK', payload: { id: 't-9', status: 'Done' } },
    ]);

    // Changes are expanded from the start.
    expect(screen.getByText('actionPlan.taskStatus.todo')).toBeInTheDocument();
    expect(
      screen.getAllByText(/actionPlan.taskStatus.done/).length,
    ).toBeGreaterThan(0);
  });

  it('a checklist edit lists what is added, completed and missing', () => {
    renderPlan([
      {
        type: 'UPDATE_SUBTASKS',
        payload: {
          id: 't-9',
          add: [{ title: 'Ensayar' }],
          complete: ['Diapositivas', 'Inventada'],
        },
      },
    ]);

    expect(screen.getByText('Preparar presentación')).toBeInTheDocument();
    expect(screen.getByText('Ensayar')).toBeInTheDocument();
    expect(screen.getByText('Diapositivas')).toBeInTheDocument();
    expect(screen.getByText('actionPlan.subtasks.missing')).toBeInTheDocument();
  });

  it('deleting is blocked until the user ticks the confirmation', async () => {
    mocks.deleteTask.mockResolvedValue({ data: { deleteTask: true } });
    renderPlan([{ type: 'DELETE_TASK', payload: { id: 't-9' } }]);

    expect(screen.getByText('Preparar presentación')).toBeInTheDocument();
    expect(screen.getByText('actionPlan.delete.permanent')).toBeInTheDocument();
    const button = screen.getByRole('button', {
      name: 'actionPlan.footer.delete:1',
    });
    expect(button).toBeDisabled();

    fireEvent.click(
      screen.getByRole('checkbox', { name: 'actionPlan.delete.confirm:1' }),
    );
    expect(button).toBeEnabled();
    await act(async () => {
      fireEvent.click(button);
    });
    expect(mocks.deleteTask).toHaveBeenCalledTimes(1);
  });
});

describe('ActionPlan — calendar events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mocks.calendarConnected = true;
  });

  const kickoff: ParsedLuminaAction = {
    type: 'CREATE_EVENT',
    payload: {
      title: 'Kickoff',
      start: '2026-10-05T10:00:00',
      duration_minutes: 45,
      attendees: ['ana@example.com', 'luis@example.com'],
      meet: true,
      location: 'Sala 2',
    },
  };

  it('a new event shows its time, Meet, guests and the invitation warning', () => {
    renderPlan([kickoff]);

    expect(screen.getByText('Kickoff')).toBeInTheDocument();
    expect(screen.getByText('45m')).toBeInTheDocument();
    expect(screen.getAllByText('actionPlan.event.meet').length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText('Sala 2')).toBeInTheDocument();
    expect(
      screen.getByText(
        'actionPlan.summary.events:1 · actionPlan.summary.guests:2',
      ),
    ).toBeInTheDocument();
    // Guests are listed up front: Google emails them.
    expect(screen.getByText('ana@example.com')).toBeInTheDocument();
    expect(screen.getByText('luis@example.com')).toBeInTheDocument();
    expect(
      screen.getByText('actionPlan.event.guestsNotice'),
    ).toBeInTheDocument();
  });

  it('after creating it, links to Google Calendar and Meet', async () => {
    mocks.createGoogleEvent.mockResolvedValue({
      id: 'ev-new',
      htmlLink: 'https://calendar.google.com/e',
      hangoutLink: 'https://meet.google.com/abc',
    });
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    renderPlan([kickoff]);

    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: 'actionPlan.footer.create:1' }),
      );
    });
    fireEvent.click(screen.getByText('actionPlan.open.meet'));
    expect(open).toHaveBeenCalledWith(
      'https://meet.google.com/abc',
      '_blank',
      'noopener',
    );
    expect(screen.getByText('actionPlan.open.calendar')).toBeInTheDocument();
    open.mockRestore();
  });

  it("an edit shows the event's real name, before → after and guest changes", () => {
    renderPlan([
      {
        type: 'UPDATE_EVENT',
        payload: {
          id: 'ev1',
          start: '2026-10-06T09:00:00',
          add_attendees: ['nuevo@example.com'],
          remove_attendees: ['jefa@example.com'],
        },
      },
    ]);

    expect(screen.getByText('Revisión con cliente')).toBeInTheDocument();
    expect(screen.getByText('actionPlan.fields.when')).toBeInTheDocument();
    expect(screen.getByText('nuevo@example.com')).toBeInTheDocument();
    expect(
      screen.getByText('actionPlan.event.addGuests:1'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('actionPlan.event.removeGuests:1'),
    ).toBeInTheDocument();
    // Someone else organizes it: say so before changing it.
    expect(
      screen.getByText('actionPlan.event.organizedBy'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('actionPlan.event.notOrganizerHint'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('actionPlan.event.updateNotice'),
    ).toBeInTheDocument();
  });

  it('canceling warns that guests get the cancellation and needs confirming', () => {
    renderPlan([{ type: 'DELETE_EVENT', payload: { id: 'ev1' } }]);

    expect(screen.getByText('Revisión con cliente')).toBeInTheDocument();
    expect(
      screen.getByText('actionPlan.event.cancelNotice:2'),
    ).toBeInTheDocument();
    const button = screen.getByRole('button', {
      name: 'actionPlan.footer.delete:1',
    });
    expect(button).toBeDisabled();
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'actionPlan.delete.confirmEvents:1',
      }),
    );
    expect(button).toBeEnabled();
  });

  it('without Google Calendar the event is left out and points to Integrations', () => {
    mocks.calendarConnected = false;
    renderPlan([kickoff]);

    expect(
      screen.getByText('actionPlan.event.needsCalendar'),
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Kickoff' })).not.toBeChecked();
    expect(
      screen.getByRole('button', { name: 'actionPlan.footer.create:0' }),
    ).toBeDisabled();

    fireEvent.click(screen.getByText('actionPlan.event.connect'));
    expect(screen.getByTestId('location').getAttribute('data-path')).toBe(
      '/profile/integrations',
    );
  });
});
