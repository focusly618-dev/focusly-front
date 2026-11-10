import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import i18n from '@/i18n';
import { CreateProjectTaskModal } from '@/pages/Projects/components/CreateProjectTaskModal';
import type { ProjectTaskItemData } from '@/pages/Projects/components/ProjectTasks/projectTasks.types';

const task = {
  id: 't1',
  title: 'Revisar brief',
  status: 'in_progress',
  priority: 'Medium',
  description: 'Notas importantes [COLOR:#BAE6FD]',
  color: '#BAE6FD',
} as unknown as ProjectTaskItemData;

const open = (over: Partial<ProjectTaskItemData> = {}) => {
  const onUpdate = vi.fn().mockResolvedValue(undefined);
  const onDelete = vi.fn().mockResolvedValue(undefined);
  render(
    <MockedProvider mocks={[]}>
      <MemoryRouter>
        <CreateProjectTaskModal
          open
          onClose={() => {}}
          task={{ ...task, ...over }}
          projects={[{ id: 'p1', name: 'Marketing' }]}
          selectedProjectId="p1"
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </MemoryRouter>
    </MockedProvider>,
  );
  return { onUpdate };
};

const save = async () => {
  fireEvent.keyDown(screen.getByRole('dialog'), {
    key: 'Enter',
    metaKey: true,
  });
};

beforeAll(async () => {
  await i18n.changeLanguage('es');
});

describe('project task modal header', () => {
  it('has the background and delete controls in the header', () => {
    open();
    const close = screen.getByRole('button', { name: 'Cerrar' });
    const controls = within(close.parentElement!);
    expect(
      controls.getByRole('button', { name: /fondo/i }),
    ).toBeInTheDocument();
    expect(
      controls.getByRole('button', { name: 'Eliminar tarea' }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'Eliminar tarea' }),
    ).toHaveLength(1);
  });

  it("doesn't show the color tag in the description", () => {
    open();
    expect(screen.getByRole('dialog').textContent).not.toContain('[COLOR:');
  });

  it('a new color alone keeps the description', async () => {
    const { onUpdate } = open();
    fireEvent.click(screen.getByRole('button', { name: /fondo/i }));
    const swatch = await screen.findByLabelText('Lavanda');
    fireEvent.click(swatch);
    await save();
    await waitFor(() => expect(onUpdate).toHaveBeenCalled());
    expect(onUpdate.mock.calls[0][1]).toMatchObject({
      color: '#DDD6FE',
      description: 'Notas importantes',
    });
  });
});
