import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type {
  ProjectGroupTypes,
  WorkspaceTypes,
} from '@/pages/Workspace/workspace.types';

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && typeof opts === 'object' && 'count' in opts
        ? `${key}:${opts.count}`
        : opts && typeof opts === 'object' && 'date' in opts
          ? `${key}:${opts.date}`
          : key,
    i18n: { language: 'es' },
  }),
}));

// The real barrel pulls in the sound player (AudioContext isn't in jsdom).
vi.mock('@/utils', () => ({
  UNTITLED_WORKSPACE_TITLE: 'Sin título',
  colorPalette: [],
  isColorDark: () => false,
}));

const { ProjectFolderCard } =
  await import('@/pages/Projects/components/ProjectFolders/ProjectFolderCard');
const { WorkspaceCardItem } =
  await import('@/pages/Workspace/components/Library/components/WorkspaceCardItem');

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString();

const group = (over: Partial<ProjectGroupTypes> = {}): ProjectGroupTypes => ({
  id: 'g1',
  name: 'Nutrición',
  userId: 'u1',
  color: '#10b981',
  createdAt: daysAgo(30),
  updatedAt: daysAgo(20),
  workspaceCount: 2,
  workspaces: [
    { id: 'w1', title: 'Menú semanal', updatedAt: daysAgo(10) },
    { id: 'w2', title: 'Recetas', updatedAt: daysAgo(2) },
  ],
  ...over,
});

describe('ProjectFolderCard', () => {
  it('shows the document edited last, with real dates', () => {
    render(<ProjectFolderCard group={group()} onSelect={vi.fn()} />);

    expect(screen.getByText('Nutrición')).toBeInTheDocument();
    expect(screen.getByText('Recetas')).toBeInTheDocument();
    expect(screen.queryByText('Menú semanal')).not.toBeInTheDocument();
    expect(
      screen.getByText(/^workspaceLibrary\.editedOn:/),
    ).toBeInTheDocument();
    expect(
      screen.getByText('workspaceLibrary.status.recent'),
    ).toBeInTheDocument();
  });

  it('an empty project says so instead of inventing content', () => {
    render(
      <ProjectFolderCard
        group={group({ workspaceCount: 0, workspaces: [] })}
        onSelect={vi.fn()}
      />,
    );
    expect(
      screen.getByText('workspaceLibrary.emptyFolderSnippet'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('workspaceLibrary.status.empty'),
    ).toBeInTheDocument();
  });

  it('an old project gets no "recent" badge', () => {
    render(
      <ProjectFolderCard
        group={group({
          workspaces: [{ id: 'w1', title: 'Viejo', updatedAt: daysAgo(40) }],
          updatedAt: daysAgo(40),
        })}
        onSelect={vi.fn()}
      />,
    );
    expect(
      screen.queryByText('workspaceLibrary.status.recent'),
    ).not.toBeInTheDocument();
  });
});

const workspace = (over: Partial<WorkspaceTypes> = {}): WorkspaceTypes => ({
  id: 'w1',
  userId: 'u1',
  title: 'Plan de comidas',
  saveStatus: true,
  content: '',
  createdAt: '2026-10-01T10:00:00Z',
  updatedAt: '2026-10-02T10:00:00Z',
  ...over,
});

describe('WorkspaceCardItem', () => {
  const props = {
    onSelect: vi.fn(),
    onMenuOpen: vi.fn(),
    onUnlinkTask: vi.fn(),
  };

  it('uses translated labels, also when the document is empty', () => {
    render(<WorkspaceCardItem workspace={workspace()} {...props} />);
    expect(
      screen.getByText('workspaceLibrary.card.noContent'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('workspaceLibrary.card.created'),
    ).toBeInTheDocument();
    expect(screen.getByText('workspaceLibrary.card.none')).toBeInTheDocument();
    expect(
      screen.getByText('workspaceLibrary.card.noTask'),
    ).toBeInTheDocument();
    expect(screen.queryByText('No task linked')).not.toBeInTheDocument();
  });

  it("shows the linked task's status in the board's words", () => {
    render(
      <WorkspaceCardItem
        workspace={workspace({
          content: '# Plan\nDesayuno y comida',
          tasks: [
            {
              id: 't1',
              title: 'Comprar',
              status: 'Pending',
            } as unknown as NonNullable<WorkspaceTypes['tasks']>[number],
          ],
        })}
        {...props}
      />,
    );
    expect(screen.getByText('Plan Desayuno y comida')).toBeInTheDocument();
    expect(screen.getByText('tasks.status.pending')).toBeInTheDocument();
    expect(screen.getByText('Comprar')).toBeInTheDocument();
  });
});
