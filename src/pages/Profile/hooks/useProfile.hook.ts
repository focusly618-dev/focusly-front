import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/auth/auth.slice';
import {
  findProfileSection,
  profilePath,
  type ProfileLocationState,
  type ProfileSectionSlug,
} from '../profileSections';

export const useProfile = () => {
  const { section: slug } = useParams<{ section?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const state = (location.state ?? null) as ProfileLocationState | null;
  const section = findProfileSection(slug);

  // Sections replace each other in history, so the entry right before the
  // profile page is the one the user came from.
  const openSection = (next: ProfileSectionSlug) => {
    if (next === section?.slug) return;
    navigate(profilePath(next), { replace: true, state });
  };

  const goBack = () => {
    if (state?.backTo) {
      navigate(-1);
    } else {
      // Opened directly (new tab, shared link): nothing in-app to return to.
      navigate('/dashboard', { replace: true });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return { user, section, state, openSection, goBack, handleLogout };
};
