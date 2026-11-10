import { beforeAll, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import i18n from '@/i18n';
import { WorkspaceCardItem } from '@/pages/Workspace/components/Library/components/WorkspaceCardItem';
import type { WorkspaceTypes } from '@/pages/Workspace/workspace.types';
import { flatBackgroundColor } from '@/pages/Workspace/components/Library/constants/library.constants';

const base = {
  id: 'w1',
  title: 'Notas de reunión',
  content: 'Puntos de la reunión',
  background_color: 'aurora',
  createdAt: '2026-11-01T10:00:00Z',
} as unknown as WorkspaceTypes;

const tasks = [
  { id: 't1', title: 'Preparar la agenda', status: 'Done', estimate_timer: 90 },
  { id: 't2', title: 'Enviar acta', status: 'Todo', estimate_timer: 30 },
];

const show = (over: Partial<WorkspaceTypes> = {}, compact = false) => {
  const handlers = {
    onSelect: vi.fn(),
    onMenuOpen: vi.fn(),
    onUnlinkTask: vi.fn(),
  };
  render(
    <WorkspaceCardItem
      workspace={{ ...base, ...over }}
      groupName="Marketing"
      groupColor="#3b82f6"
      compact={compact}
      {...handlers}
    />,
  );
  return handlers;
};

beforeAll(async () => {
  await i18n.changeLanguage('es');
});

describe('WorkspaceCardItem', () => {
  it('shows the project, name, snippet and footer', () => {
    show();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Notas de reunión')).toBeInTheDocument();
    expect(screen.getByText('Puntos de la reunión')).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('workspaceLibrary.card.noTask')),
    ).toBeInTheDocument();
  });

  it('with linked tasks: progress, time, and unlink stays available', () => {
    const { onUnlinkTask, onSelect } = show({
      tasks: tasks as unknown as WorkspaceTypes['tasks'],
    });
    expect(
      screen.getByText(
        i18n.t('workspaceLibrary.card.doneCount', { done: 1, total: 2 }),
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/2h/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Preparar la agenda'));
    expect(onUnlinkTask).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('lists the other linked tasks', async () => {
    show({ tasks: tasks as unknown as WorkspaceTypes['tasks'] });
    fireEvent.click(
      screen.getByText(i18n.t('workspaceLibrary.card.more', { count: 1 })),
    );
    expect(await screen.findByText('Enviar acta')).toBeInTheDocument();
  });

  it('opens the document, and the menu without opening it', () => {
    const { onSelect, onMenuOpen } = show();
    fireEvent.click(
      screen.getByRole('button', {
        name: i18n.t('workspaceLibrary.card.options'),
      }),
    );
    expect(onMenuOpen).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Notas de reunión'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('compact keeps only the header', () => {
    show({}, true);
    expect(screen.queryByText(/2026/)).toBeNull();
  });
});

describe('flatBackgroundColor', () => {
  it.each([
    ['linear-gradient(135deg, #a5b4fc 0%, #c084fc 100%)', '#a5b4fc'],
    ['linear-gradient(90deg, rgb(1, 2, 3), #fff)', 'rgb(1, 2, 3)'],
    ['#FED7AA', '#FED7AA'],
    ['rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.5)'],
  ])('%s becomes %s', (background, flat) => {
    expect(flatBackgroundColor(background)).toBe(flat);
  });
});
