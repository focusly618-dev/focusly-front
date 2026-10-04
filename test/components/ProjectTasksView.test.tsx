import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import type { ProjectTaskItemData } from '@/pages/Projects/components/ProjectTasks/projectTasks.types';

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && 'count' in opts ? `${key}:${opts.count}` : key,
    i18n: { language: 'es' },
  }),
}));

const { ProjectTasksView } =
  await import('@/pages/Projects/components/ProjectTasks/ProjectTasksView');
const { useProjectTaskViewState } =
  await import('@/pages/Projects/components/ProjectTasks/hooks/useProjectTaskViewState.hook');

const PROJECTS = [
  { id: 'p1', name: 'Nutrición', color: '#10b981' },
  { id: 'p2', name: 'Tesis', color: '#3b82f6' },
];

const TASKS: ProjectTaskItemData[] = [
  {
    id: 't1',
    title: 'Comprar verduras',
    status: 'in_progress',
    priority: 'High',
    projectId: 'p1',
    dueDate: '1 oct',
    dueDateHighlight: 'overdue',
    rawDeadline: '2026-10-01T09:00:00',
  },
  {
    id: 't2',
    title: 'Escribir capítulo',
    status: 'todo',
    priority: 'Medium',
    projectId: 'p2',
  },
  {
    id: 't3',
    title: 'Elegir tema',
    status: 'completed',
    completed: true,
    projectId: 'p2',
  },
];

const makeProjectTasks = (tasks = TASKS) => ({
  tasks,
  totalCount: tasks.length,
  loading: false,
  error: undefined,
  refetch: vi.fn(),
  hasMore: false,
  loadMore: vi.fn(),
  isLoadingMore: false,
  createProjectTask: vi.fn(),
  setProjectTaskStatus: vi.fn(),
  setProjectTasksStatus: vi.fn(async () => 0),
  toggleProjectTaskComplete: vi.fn(),
  toggleProjectSubtask: vi.fn(),
  addProjectSubtask: vi.fn(),
  deleteProjectTasks: vi.fn(),
});

let projectTasks = makeProjectTasks();
const onNewTask = vi.fn();

const Harness = ({ projectId = null }: { projectId?: string | null }) => {
  const view = useProjectTaskViewState();
  return (
    <ProjectTasksView
      projectTasks={projectTasks as never}
      view={view}
      projectId={projectId}
      projects={PROJECTS}
      onOpenTask={vi.fn()}
      onNewTask={onNewTask}
    />
  );
};

describe('ProjectTasksView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    projectTasks = makeProjectTasks();
  });

  it('groups tasks under the same status names as the rest of the app', () => {
    render(<Harness />);
    expect(screen.getByText('tasks.status.pending')).toBeInTheDocument();
    expect(screen.getByText('tasks.status.todo')).toBeInTheDocument();
    expect(screen.getByText('tasks.status.done')).toBeInTheDocument();
    expect(screen.queryByText('In Progress')).not.toBeInTheDocument();
    expect(screen.getByText('Comprar verduras')).toBeInTheDocument();
    // The project shows in the all-projects view, by name.
    expect(screen.getAllByText('Nutrición').length).toBeGreaterThan(0);
    expect(
      screen.getByText('projectTasks.summary.overdue:1'),
    ).toBeInTheDocument();
  });

  it('moves a task to another status without opening it', () => {
    render(<Harness />);
    const row = screen.getByRole('button', { name: 'Escribir capítulo' });
    fireEvent.click(
      within(row).getByRole('button', { name: 'projectTasks.changeStatus' }),
    );
    fireEvent.click(
      screen.getByRole('menuitem', { name: 'tasks.status.review' }),
    );
    expect(projectTasks.setProjectTaskStatus).toHaveBeenCalledWith(
      expect.objectContaining({ id: 't2' }),
      'in_review',
    );
  });

  it('the overdue chip filters the list', () => {
    render(<Harness />);
    fireEvent.click(screen.getByText('projectTasks.summary.overdue:1'));
    expect(screen.getByText('Comprar verduras')).toBeInTheDocument();
    expect(screen.queryByText('Escribir capítulo')).not.toBeInTheDocument();
  });

  it('quick add goes to the chosen project', () => {
    render(<Harness />);
    fireEvent.click(screen.getByText('projectTasks.allProjects'));
    fireEvent.click(screen.getByRole('menuitem', { name: /Tesis/ }));
    const todo = screen
      .getByText('tasks.status.todo')
      .closest('section') as HTMLElement;
    // The header "+" (the row at the bottom does the same).
    fireEvent.click(
      within(todo).getAllByRole('button', { name: 'projectTasks.addTo' })[0],
    );
    const input = within(todo).getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Leer papers' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(projectTasks.createProjectTask).toHaveBeenCalledWith({
      title: 'Leer papers',
      status: 'todo',
      projectId: 'p2',
    });
  });

  it('completes several tasks at once', async () => {
    render(<Harness />);
    fireEvent.click(screen.getByText('selection.select'));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Comprar verduras' }));
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Escribir capítulo' }),
    );
    await act(async () => {
      fireEvent.click(screen.getByText('projectTasks.bulk.complete'));
    });
    expect(projectTasks.setProjectTasksStatus).toHaveBeenCalledWith(
      [
        expect.objectContaining({ id: 't1' }),
        expect.objectContaining({ id: 't2' }),
      ],
      'completed',
    );
  });

  it("inside a project there's no project column or picker", () => {
    render(<Harness projectId="p1" />);
    expect(
      screen.queryByText('projectTasks.allProjects'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('projectTasks.columns.project'),
    ).not.toBeInTheDocument();
  });

  it('an empty project offers to create the first task', () => {
    projectTasks = makeProjectTasks([]);
    render(<Harness projectId="p1" />);
    expect(
      screen.getByText('projectTasks.emptyProject.title'),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('projectTasks.empty.action'));
    expect(onNewTask).toHaveBeenCalled();
  });
});
