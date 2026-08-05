import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Route guards in App.tsx are hand-rolled per-route ternaries
// (isLogged ? <Page/> : <Navigate/>), not a single reusable <ProtectedRoute/>
// wrapper. That means each route's guard is a separate place a typo or a
// copy-paste mistake can silently leave a page reachable while logged out
// (or vice versa) — exactly the class of bug that slips past manual QA
// because the developer only clicks through as their own, already-logged-in
// account. Page components are stubbed so these tests only exercise the
// guard logic, not each page's own data-fetching.
vi.mock('@/pages/Public/LandingPage/LandingPage', () => ({
  default: () => <div>LANDING_PAGE</div>,
}));
vi.mock('@/pages/Public/HowItWorks/HowItWorksPage', () => ({
  default: () => <div>HOW_IT_WORKS_PAGE</div>,
}));
vi.mock('@/pages/Public/Features/FeaturesPage', () => ({
  default: () => <div>FEATURES_PAGE</div>,
}));
vi.mock('@/pages/Public/Pricing/PricingPage', () => ({
  default: () => <div>PRICING_PAGE</div>,
}));
vi.mock('@/pages/Public/Login/Login', () => ({
  Login: () => <div>LOGIN_PAGE</div>,
}));
vi.mock('@/pages/Profile/Profile', () => ({
  default: () => <div>PROFILE_PAGE</div>,
}));
vi.mock('@/pages/NotFound/page_not_found', () => ({
  default: () => <div>NOT_FOUND_PAGE</div>,
}));
vi.mock('@/pages/Dashboard/Dashboard', () => ({
  default: () => <div>DASHBOARD_PAGE</div>,
}));
vi.mock('@/components/ui/SessionExpiredBanner', () => ({
  SessionExpiredBanner: () => null,
}));
vi.mock('@/components/ReleaseModal/ReleaseModal', () => ({
  ReleaseModal: () => null,
}));

const useSessionMock = vi.fn();
vi.mock('@/hooks/useSession', () => ({
  useSession: () => useSessionMock(),
}));

const useAppSelectorMock = vi.fn();
vi.mock('@/redux/hooks', () => ({
  useAppSelector: (selector: (state: unknown) => unknown) =>
    useAppSelectorMock(selector),
}));

const { default: App } = await import('@/App');

function renderAppAt(path: string, isLogged: boolean) {
  useSessionMock.mockReturnValue({ isLogged });
  useAppSelectorMock.mockReturnValue(false);
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App route guards', () => {
  beforeEach(() => {
    useSessionMock.mockReset();
    useAppSelectorMock.mockReset();
  });

  it('redirects an anonymous visitor away from /dashboard to /login', () => {
    renderAppAt('/dashboard', false);
    expect(screen.getByText('LOGIN_PAGE')).toBeInTheDocument();
    expect(screen.queryByText('DASHBOARD_PAGE')).not.toBeInTheDocument();
  });

  it('lets an authenticated user reach /dashboard', () => {
    renderAppAt('/dashboard', true);
    expect(screen.getByText('DASHBOARD_PAGE')).toBeInTheDocument();
  });

  it('redirects an already-authenticated user away from /login (no re-login screen)', () => {
    renderAppAt('/login', true);
    expect(screen.getByText('DASHBOARD_PAGE')).toBeInTheDocument();
    expect(screen.queryByText('LOGIN_PAGE')).not.toBeInTheDocument();
  });

  it('redirects an anonymous visitor away from /profile to /login', () => {
    renderAppAt('/profile', false);
    expect(screen.getByText('LOGIN_PAGE')).toBeInTheDocument();
  });

  it('lets an authenticated user reach /profile', () => {
    renderAppAt('/profile', true);
    expect(screen.getByText('PROFILE_PAGE')).toBeInTheDocument();
  });

  it('sends an authenticated user hitting "/" straight to the dashboard instead of the marketing page', () => {
    renderAppAt('/', true);
    expect(screen.getByText('DASHBOARD_PAGE')).toBeInTheDocument();
    expect(screen.queryByText('LANDING_PAGE')).not.toBeInTheDocument();
  });

  it('shows the landing page at "/" for an anonymous visitor', () => {
    renderAppAt('/', false);
    expect(screen.getByText('LANDING_PAGE')).toBeInTheDocument();
  });

  it('falls back to the 404 page for an unknown route', () => {
    renderAppAt('/this-route-does-not-exist', false);
    expect(screen.getByText('NOT_FOUND_PAGE')).toBeInTheDocument();
  });

  // This one documents a real inconsistency rather than a "happy path": every
  // other private route (/dashboard, /profile) sends a logged-out visitor to
  // /login, but /tasks sends them to the marketing landing page instead. If
  // that's not deliberate, it's the kind of thing a user bookmarking a task
  // link and logging out would notice immediately.
  it('sends a logged-out visitor hitting /tasks to the landing page, NOT to /login (inconsistent with /dashboard and /profile)', () => {
    renderAppAt('/tasks', false);
    expect(screen.getByText('LANDING_PAGE')).toBeInTheDocument();
    expect(screen.queryByText('LOGIN_PAGE')).not.toBeInTheDocument();
  });
});
