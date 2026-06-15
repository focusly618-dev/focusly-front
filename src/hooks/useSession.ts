import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout as logoutThunk, clearAuth } from '@/redux/auth/auth.slice';
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { sileo } from '@/utils/sileo';

/**
 * useSession Hook
 *
 * Provides session management, authentication status, and cross-tab synchronization.
 */
export const useSession = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);

  const logout = useCallback(
    async (isExternal = false) => {
      try {
        if (isExternal) {
          dispatch(clearAuth());
          sileo.info({
            title: 'Sesión Finalizada',
            description:
              'Tu sesión se ha cerrado en otra pestaña. Inicia Sesión de nuevo para continuar.',
            fill: 'var(--sileo-update-bg)',
            duration: 5000,
          });
        } else {
          // Call logout thunk (handles API + state clearing)
          await dispatch(logoutThunk());
        }

        navigate('/login');
      } catch (error) {
        console.error('Error during logout:', error);
        dispatch(clearAuth());
        navigate('/login');
      }
    },
    [dispatch, navigate],
  );

  // Cross-tab logout detection via localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // detect if 'user' or 'authProvider' was removed (logout in another tab)
      if (
        (event.key === 'user' || event.key === 'authProvider') &&
        event.oldValue &&
        !event.newValue
      ) {
        logout(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [logout]);

  return {
    isLogged: auth.isLogged,
    user: auth.user,
    authProvider: auth.authProvider,
    status: auth.isLogged ? 'authenticated' : 'unauthenticated',
    logout: () => logout(false),
  };
};
