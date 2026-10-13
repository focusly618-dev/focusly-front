import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const query = vi.hoisted(() => ({
  result: { data: undefined, loading: true, error: undefined } as {
    data: unknown;
    loading: boolean;
    error: unknown;
  },
}));

vi.mock('@apollo/client', async (original) => ({
  ...(await original<typeof import('@apollo/client')>()),
  useQuery: () => query.result,
  useMutation: () => [vi.fn()],
}));
vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'es' },
  }),
}));

const { Notifications } = await import('@/pages/Notifications/Notifications');

describe('Notifications loading', () => {
  it('first load: the page shape, not a lone spinner', () => {
    query.result = { data: undefined, loading: true, error: undefined };
    const { container } = render(<Notifications />);
    expect(screen.getByRole('status')).toHaveTextContent(
      'notificationsPage.loading',
    );
    expect(container.querySelector('.MuiCircularProgress-root')).toBeNull();
  });

  it('a poll while the list is on screen keeps the list', () => {
    query.result = {
      data: {
        getNotifications: [
          {
            id: 'n1',
            title: 'Tarea próxima',
            body: 'Empieza en 5 minutos',
            createdAt: new Date().toISOString(),
            status: 'unread',
            type: 'info',
          },
        ],
      },
      loading: true,
      error: undefined,
    };
    render(<Notifications />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Tarea próxima')).toBeInTheDocument();
  });
});
