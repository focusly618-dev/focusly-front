import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/Public/Site/HomePage';
import SitePage from '@/pages/Public/Site/SitePage';
import { PAGES, PAGE_SLUGS } from '@/pages/Public/Site/routes';
import LegalPage from '@/pages/Public/Legal/LegalPage';
import { Login } from '@/pages/Public/Login/Login';
import Profile from '@/pages/Profile/Profile';
import NotFoundPage from '@/pages/NotFound/page_not_found';
import Dashboard from '@/pages/Dashboard/Dashboard';
import { useSession } from '@/hooks/useSession';
import { useAppSelector } from '@/redux/hooks';
import { SessionExpiredBanner } from '@/components/ui/SessionExpiredBanner';
import { ReleaseModal } from '@/components/ReleaseModal/ReleaseModal';
import { TermsAcceptanceModal } from '@/components/TermsAcceptanceModal/TermsAcceptanceModal';
import { EditorAIBackgroundIndicator } from '@/components/AI/EditorAIBackgroundIndicator';

function App() {
  const { isLogged } = useSession();
  const sessionExpiredNotice = useAppSelector(
    (state) => state.auth.sessionExpiredNotice,
  );

  return (
    <>
      <SessionExpiredBanner />
      <ReleaseModal />
      {/* After ReleaseModal so it stacks on top: terms come first */}
      <TermsAcceptanceModal />
      {/* Editor assistant replies keep running when the user leaves the note */}
      {isLogged && <EditorAIBackgroundIndicator />}
      <Box
        sx={{
          pt: sessionExpiredNotice ? { xs: '92px', sm: '102px' } : 0,
          transition: 'padding-top 0.25s ease',
        }}
      >
        <Routes>
          <Route
            path="/dashboard"
            element={isLogged ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={isLogged ? <Navigate to="/dashboard" /> : <HomePage />}
          />
          <Route
            path="/tasks"
            element={
              isLogged ? (
                <>
                  <Navigate to={'/dashboard'} />
                </>
              ) : (
                <HomePage />
              )
            }
          />
          {/* Former standalone pages, now sections of the home page */}
          <Route
            path="/features"
            element={<Navigate to="/#producto" replace />}
          />
          <Route
            path="/how-it-works"
            element={<Navigate to="/#como-funciona" replace />}
          />
          {/* Product, use-case and resource pages of the public site */}
          {PAGE_SLUGS.map((slug) => (
            <Route
              key={slug}
              path={PAGES[slug].path}
              element={<SitePage key={slug} slug={slug} />}
            />
          ))}
          {/* Public for everyone, logged in or not (Google's OAuth review needs them too) */}
          <Route path="/terms" element={<LegalPage document="terms" />} />
          <Route path="/privacy" element={<LegalPage document="privacy" />} />
          <Route
            path="/login"
            element={isLogged ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/profile"
            element={isLogged ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:section"
            element={isLogged ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
