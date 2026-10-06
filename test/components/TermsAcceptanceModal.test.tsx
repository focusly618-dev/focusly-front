import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// The modal blocks the whole app until the current Terms/Privacy version is
// accepted, so the cases that matter are: it appears only when the backend
// says acceptance is pending, never on top of the legal pages themselves
// (the user must be able to read them), and accepting records it and closes.
vi.mock('react-i18next', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-i18next')>()),
  useTranslation: () => ({ t: (key: string) => key }),
  Trans: ({ i18nKey }: { i18nKey: string }) => <span>{i18nKey}</span>,
}));

const userGetMock = vi.fn();
const acceptTermsMock = vi.fn();
vi.mock('@/api/User/apiUser', () => ({
  UserGet: (id: string) => userGetMock(id),
  UserAcceptTerms: (id: string) => acceptTermsMock(id),
}));

const dispatchMock = vi.fn();
vi.mock('@/redux/hooks', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({ auth: { isLogged: true, user: { id: 'user-1' } } }),
}));

vi.mock('@/utils', () => ({ notify: { error: vi.fn() } }));

const { TermsAcceptanceModal } =
  await import('@/components/TermsAcceptanceModal/TermsAcceptanceModal');

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TermsAcceptanceModal />
    </MemoryRouter>,
  );
}

describe('TermsAcceptanceModal', () => {
  beforeEach(() => {
    userGetMock.mockReset();
    acceptTermsMock.mockReset();
    dispatchMock.mockReset();
  });

  it('asks a new user to accept when the backend reports it pending', async () => {
    userGetMock.mockResolvedValue({
      termsVersion: null,
      needsTermsAcceptance: true,
    });
    renderAt('/dashboard');

    expect(
      await screen.findByText('legal.acceptModal.newBody'),
    ).toBeInTheDocument();
    expect(userGetMock).toHaveBeenCalledWith('user-1');
  });

  it('tells existing users the documents were updated', async () => {
    userGetMock.mockResolvedValue({
      termsVersion: '2025-01-01',
      needsTermsAcceptance: true,
    });
    renderAt('/dashboard');

    expect(
      await screen.findByText('legal.acceptModal.updatedBody'),
    ).toBeInTheDocument();
  });

  it('stays hidden once the current version is accepted', async () => {
    userGetMock.mockResolvedValue({
      termsVersion: '2026-10-01',
      needsTermsAcceptance: false,
    });
    renderAt('/dashboard');

    await waitFor(() => expect(userGetMock).toHaveBeenCalled());
    expect(
      screen.queryByText('legal.acceptModal.title'),
    ).not.toBeInTheDocument();
  });

  it('never covers the legal pages it links to', async () => {
    userGetMock.mockResolvedValue({
      termsVersion: null,
      needsTermsAcceptance: true,
    });
    renderAt('/terms');

    await waitFor(() => expect(userGetMock).toHaveBeenCalled());
    expect(
      screen.queryByText('legal.acceptModal.title'),
    ).not.toBeInTheDocument();
  });

  it('records acceptance and closes', async () => {
    userGetMock.mockResolvedValue({
      termsVersion: null,
      needsTermsAcceptance: true,
    });
    acceptTermsMock.mockResolvedValue({
      termsVersion: '2026-10-01',
      needsTermsAcceptance: false,
    });
    renderAt('/dashboard');

    fireEvent.click(await screen.findByText('legal.acceptModal.accept'));

    await waitFor(() =>
      expect(
        screen.queryByText('legal.acceptModal.title'),
      ).not.toBeInTheDocument(),
    );
    expect(acceptTermsMock).toHaveBeenCalledWith('user-1');
  });
});
