import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}));
// The real picker is a large lazy grid; one emoji is enough to pick.
vi.mock('emoji-picker-react', () => ({
  default: ({
    onEmojiClick,
  }: {
    onEmojiClick: (data: { emoji: string }) => void;
  }) => (
    <button type="button" onClick={() => onEmojiClick({ emoji: '🧠' })}>
      pick brain
    </button>
  ),
  Theme: { DARK: 'dark', LIGHT: 'light' },
}));

const { CreateCanvasPopover } =
  await import('@/pages/Workspace/components/Editor/components/CanvasIdentity/CreateCanvasPopover');

const renderModal = (initialName: string | null = 'Ideas') => {
  const onCreate = vi.fn();
  const onCancel = vi.fn();
  render(
    <CreateCanvasPopover
      draft={
        initialName === null
          ? null
          : { name: initialName, anchor: { top: 120, left: 80 } }
      }
      creating={false}
      onCancel={onCancel}
      onCreate={onCreate}
    />,
  );
  return { onCreate, onCancel };
};

const nameInput = () =>
  screen.getByRole('textbox', { name: 'Nombre del canvas' });

describe('CreateCanvasPopover', () => {
  it('starts from the selection name and creates with the default icon', () => {
    const { onCreate } = renderModal('Ideas');

    expect(nameInput()).toHaveValue('Ideas');
    fireEvent.click(screen.getByRole('button', { name: 'Crear' }));

    expect(onCreate).toHaveBeenCalledWith('Ideas', '🎨');
  });

  it('creates with the name and icon chosen, on Enter too', () => {
    const { onCreate } = renderModal('Ideas');

    fireEvent.change(nameInput(), { target: { value: '  Roadmap  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar icono' }));
    fireEvent.click(screen.getByRole('button', { name: 'pick brain' }));
    fireEvent.keyDown(nameInput(), { key: 'Enter' });

    expect(onCreate).toHaveBeenCalledWith('Roadmap', '🧠');
  });

  it("won't create without a name", () => {
    const { onCreate } = renderModal('Ideas');

    fireEvent.change(nameInput(), { target: { value: '   ' } });
    fireEvent.keyDown(nameInput(), { key: 'Enter' });

    expect(screen.getByRole('button', { name: 'Crear' })).toBeDisabled();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('cancels', () => {
    const { onCancel } = renderModal('Ideas');
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('stays closed until there is a draft', () => {
    renderModal(null);
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('opens at the point under the selected text', () => {
    renderModal('Ideas');
    const paper = nameInput().closest('.MuiPopover-paper') as HTMLElement;
    expect(paper.style.top).toBe('120px');
    expect(paper.style.left).toBe('80px');
  });
});
