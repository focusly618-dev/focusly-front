import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/Public/LandingPage/LandingPage';
import HowItWorksPage from '@/pages/Public/HowItWorks/HowItWorksPage';
import FeaturesPage from '@/pages/Public/Features/FeaturesPage';
import PricingPage from '@/pages/Public/Pricing/PricingPage';
import { Login } from '@/pages/Public/Login/Login';
import Profile from '@/pages/Profile/Profile';
import NotFoundPage from '@/pages/NotFound/page_not_found';
import Dashboard from '@/pages/Dashboard/Dashboard';
import { useSession } from '@/hooks/useSession';
import { useAppSelector } from '@/redux/hooks';
import { SessionExpiredBanner } from '@/components/ui/SessionExpiredBanner';
import { ReleaseModal } from '@/components/ReleaseModal/ReleaseModal';

function App() {
  const { isLogged } = useSession();
  const sessionExpiredNotice = useAppSelector(
    (state) => state.auth.sessionExpiredNotice,
  );

  return (
    <>
      <SessionExpiredBanner />
      <ReleaseModal />
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
            element={isLogged ? <Navigate to="/dashboard" /> : <LandingPage />}
          />
          <Route
            path="/tasks"
            element={
              isLogged ? (
                <>
                  <Navigate to={'/dashboard'} />
                </>
              ) : (
                <LandingPage />
              )
            }
          />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route
            path="/login"
            element={isLogged ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/profile"
            element={isLogged ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;
