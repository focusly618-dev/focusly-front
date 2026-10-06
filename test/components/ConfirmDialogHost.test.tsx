import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({ t: (key: string) => key }),
}));

const { ConfirmDialogHost } =
  await import('@/components/ConfirmDialog/ConfirmDialogHost');
const { confirmAction, confirmService } =
  await import('@/services/confirmService');

describe('confirmAction', () => {
  beforeEach(() => confirmService.close());

  it('asks in a dialog and runs the action only when confirmed', async () => {
    const onConfirm = vi.fn(async () => {});
    render(<ConfirmDialogHost />);
    act(() =>
      confirmAction({
        title: '¿Eliminar esta tarea?',
        description: 'Se eliminará de forma permanente.',
        confirmText: 'Eliminar tarea',
        onConfirm,
      }),
    );
    expect(screen.getByText('¿Eliminar esta tarea?')).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(screen.getByText('Eliminar tarea'));
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(confirmService.getSnapshot()).toBeNull();
  });

  it('cancel closes without deleting', () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialogHost />);
    act(() =>
      confirmAction({
        title: 'T',
        description: 'D',
        confirmText: 'OK',
        onConfirm,
      }),
    );
    fireEvent.click(screen.getByText('common.cancel'));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(confirmService.getSnapshot()).toBeNull();
  });

  it('stays open when the action fails, to try again', async () => {
    render(<ConfirmDialogHost />);
    act(() =>
      confirmAction({
        title: 'T',
        description: 'D',
        confirmText: 'OK',
        onConfirm: async () => {
          throw new Error('no');
        },
      }),
    );
    await act(async () => {
      fireEvent.click(screen.getByText('OK'));
    });
    expect(confirmService.getSnapshot()).not.toBeNull();
  });
});
