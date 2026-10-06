import { describe, it, expect, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';

const auth = vi.hoisted(() => ({ sessionExpiredNotice: false }));
vi.mock('@/redux/hooks', () => ({
  useAppSelector: (selector: (state: unknown) => unknown) => selector({ auth }),
}));
vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({ t: (key: string) => key }),
}));

const { FocuslyToaster } =
  await import('@/components/Notification/FocuslyToaster');
const { notify } = await import('@/utils/notifications/notify');

describe('FocuslyToaster', () => {
  it('shows notify() toasts at the top center, in Focusly style', async () => {
    const { container } = render(<FocuslyToaster />);
    await act(async () => {
      notify.success({ title: 'Proyecto creado', description: 'Nutrición' });
    });

    expect(await screen.findByText('Proyecto creado')).toBeInTheDocument();
    expect(screen.getByText('Nutrición')).toBeInTheDocument();
    const toaster = container.ownerDocument.querySelector(
      '[data-sonner-toaster]',
    );
    expect(toaster?.getAttribute('data-y-position')).toBe('top');
    expect(toaster?.getAttribute('data-x-position')).toBe('center');
    const toast = screen
      .getByText('Proyecto creado')
      .closest('[data-sonner-toast]');
    expect(toast?.className).toContain('focusly-toast');
    expect(toast?.getAttribute('data-type')).toBe('success');
  });
});
