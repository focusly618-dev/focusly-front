import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ProjectGroupTypes } from '@/pages/Workspace/workspace.types';

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && typeof opts === 'object' && 'count' in opts
        ? `${key}:${opts.count}`
        : key,
    i18n: { language: 'es' },
  }),
}));
vi.mock('@/utils', () => ({
  UNTITLED_WORKSPACE_TITLE: 'Sin título',
  colorPalette: [],
  isColorDark: () => false,
}));

const { ListRowSkeleton, ChatSkeleton, LoadingRegion } =
  await import('@/components/ui/Skeletons');
const { ProjectFoldersGrid } =
  await import('@/pages/Projects/components/ProjectFolders/ProjectFoldersGrid');
const { ProjectTasksSkeleton } =
  await import('@/pages/Projects/components/ProjectTasks/ProjectTasksSkeleton');
const { WorkspaceLibrarySkeleton } =
  await import('@/pages/Workspace/components/Library/WorkspaceLibrarySkeleton');
const { initialScrollHour } =
  await import('@/pages/Home/components/CalendarView/hooks/useCalendarView.hook');

const selection = {
  state: { isSelecting: false, selectedCount: 0, selectedItems: [] },
  actions: {
    startSelecting: vi.fn(),
    stopSelecting: vi.fn(),
    toggle: vi.fn(),
    toggleAll: vi.fn(),
    isSelected: () => false,
    areAllSelected: () => false,
  },
} as never;

const group = (id: string): ProjectGroupTypes => ({
  id,
  name: `Proyecto ${id}`,
  userId: 'u1',
  color: '#10b981',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  workspaceCount: 0,
  workspaces: [],
});

const grid = (props: { groups: ProjectGroupTypes[]; loading?: boolean }) =>
  render(
    <ProjectFoldersGrid
      {...props}
      onSelectFolder={vi.fn()}
      onCreateFolder={vi.fn()}
      onUpdateFolder={vi.fn()}
      onDeleteFolders={vi.fn()}
      selection={selection}
    />,
  );

describe('loading placeholders', () => {
  it('announce the loading once and hide the placeholders from screen readers', () => {
    render(
      <LoadingRegion label="Cargando proyectos…">
        <div>placeholder</div>
      </LoadingRegion>,
    );
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(region).toHaveTextContent('Cargando proyectos…');
    expect(screen.getByText('placeholder').parentElement).toHaveAttribute(
      'aria-hidden',
    );
  });

  it('list rows: as many as asked, with a default label', () => {
    const { container } = render(<ListRowSkeleton rows={5} lines={1} />);
    expect(screen.getByRole('status')).toHaveTextContent('common.loading');
    expect(container.querySelectorAll('.MuiSkeleton-wave').length).toBe(10);
  });

  it('a conversation opening shows question and answer bubbles', () => {
    const { container } = render(<ChatSkeleton label="Abriendo…" />);
    expect(screen.getByRole('status')).toHaveTextContent('Abriendo…');
    expect(container.querySelectorAll('.MuiSkeleton-circular')).toHaveLength(3);
  });
});

describe('projects grid', () => {
  it('while the projects load: card placeholders, not "0 of 0"', () => {
    const { container } = grid({ groups: [], loading: true });
    expect(screen.getByRole('status')).toHaveTextContent('projects.loading');
    expect(
      container.querySelectorAll('.MuiSkeleton-wave').length,
    ).toBeGreaterThan(20);
    // No pagination nor project count until there's something to count.
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByText(/projects\.showing/)).not.toBeInTheDocument();
    // Creating a project stays possible meanwhile.
    expect(screen.getByText('projects.newProject')).toBeInTheDocument();
  });

  it('a refetch keeps the projects on screen, without placeholders', () => {
    grid({ groups: [group('a'), group('b')], loading: true });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Proyecto a')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('loaded and empty: the real (empty) grid', () => {
    grid({ groups: [], loading: false });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('page placeholders', () => {
  it('the Projects page while it first loads (it used to be blank)', () => {
    const { container } = render(<WorkspaceLibrarySkeleton />);
    expect(screen.getByRole('status')).toHaveTextContent('projects.loading');
    expect(
      container.querySelectorAll('.MuiSkeleton-wave').length,
    ).toBeGreaterThan(30);
  });

  it('project tasks: status groups with rows, not a lone spinner', () => {
    const { container } = render(<ProjectTasksSkeleton />);
    expect(screen.getByRole('status')).toHaveTextContent(
      'projectTasks.loading',
    );
    expect(container.querySelector('.MuiCircularProgress-root')).toBeNull();
  });
});

describe('the calendar opens where the day is', () => {
  const at = (h: number) => new Date(2026, 9, 12, h, 30);

  it('before the work day: just before it starts', () => {
    expect(initialScrollHour(at(6), '09:00')).toBe(8);
  });

  it('during or after it: the hour before now', () => {
    expect(initialScrollHour(at(15), '09:00')).toBe(14);
    expect(initialScrollHour(at(23), '09:00')).toBe(22);
  });

  it('without work hours, a 9:00 day; never out of range', () => {
    expect(initialScrollHour(at(7))).toBe(8);
    expect(initialScrollHour(at(0), '00:00')).toBe(0);
    expect(initialScrollHour(at(3), 'garbage')).toBe(8);
  });
});
