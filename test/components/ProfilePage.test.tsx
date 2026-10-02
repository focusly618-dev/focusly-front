import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

// Section bodies have their own data needs (Google OAuth, user API); stubbed
// so these tests cover the page shell: navigation, redirects and Back.
vi.mock('@/pages/Profile/sections/AccountSection', () => ({
  AccountSection: () => <div>ACCOUNT_SECTION</div>,
}));
vi.mock('@/pages/Profile/sections/WorkFocusSection', () => ({
  WorkFocusSection: () => <div>WORK_FOCUS_SECTION</div>,
}));
vi.mock('@/pages/Profile/sections/NotificationsSection', () => ({
  NotificationsSection: () => <div>NOTIFICATIONS_SECTION</div>,
}));
vi.mock('@/pages/Profile/sections/AppearanceSection', () => ({
  AppearanceSection: () => <div>APPEARANCE_SECTION</div>,
}));
vi.mock('@/pages/Profile/sections/IntegrationsSection', () => ({
  IntegrationsSection: () => <div>INTEGRATIONS_SECTION</div>,
}));
vi.mock('@/pages/Profile/sections/PrivacySection', () => ({
  PrivacySection: () => <div>PRIVACY_SECTION</div>,
}));

const dispatch = vi.fn();
vi.mock('@/redux/hooks', () => ({
  useAppDispatch: () => dispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: { user: { id: 'u-1', name: 'Ana', email: 'ana@example.com' } },
    }),
}));

const { default: Profile } = await import('@/pages/Profile/Profile');

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

type Entry = string | { pathname: string; state?: unknown };

const renderAt = (entries: Entry[], index = entries.length - 1) =>
  render(
    <MemoryRouter initialEntries={entries} initialIndex={index}>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:section" element={<Profile />} />
        <Route path="/dashboard" element={<div>DASHBOARD</div>} />
      </Routes>
      <LocationProbe />
    </MemoryRouter>,
  );

const pathname = () => screen.getByTestId('location').textContent;

describe('Profile page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens the account section by default', () => {
    renderAt(['/profile']);
    expect(pathname()).toBe('/profile/account');
    expect(screen.getByText('ACCOUNT_SECTION')).toBeInTheDocument();
  });

  it('redirects an unknown section to the account section', () => {
    renderAt(['/profile/nope']);
    expect(pathname()).toBe('/profile/account');
  });

  it('shows the selected section and marks it in the sidebar', () => {
    renderAt(['/profile/notifications']);
    expect(screen.getByText('NOTIFICATIONS_SECTION')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /profilePage.nav.notifications/ }),
    ).toHaveAttribute('aria-current', 'page');
  });

  it('switches sections from the sidebar', () => {
    renderAt(['/profile/account']);
    fireEvent.click(
      screen.getByRole('button', { name: /profilePage.nav.privacy/ }),
    );
    expect(pathname()).toBe('/profile/privacy');
    expect(screen.getByText('PRIVACY_SECTION')).toBeInTheDocument();
  });

  it('Back returns to the page it was opened from, even after switching sections', () => {
    renderAt([
      '/dashboard',
      { pathname: '/profile/account', state: { backTo: '/dashboard' } },
    ]);
    fireEvent.click(
      screen.getByRole('button', { name: /profilePage.nav.workFocus/ }),
    );
    fireEvent.click(screen.getByRole('button', { name: /profilePage.back/ }));

    expect(screen.getByText('DASHBOARD')).toBeInTheDocument();
  });

  it('Back goes to the dashboard when the page was opened directly', () => {
    renderAt(['/profile/appearance']);
    fireEvent.click(screen.getByRole('button', { name: /profilePage.back/ }));
    expect(pathname()).toBe('/dashboard');
  });
});
