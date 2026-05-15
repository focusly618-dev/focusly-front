import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout as logoutThunk, clearAuth, setSessionExpiredNotice } from '@/redux/auth/auth.slice';
import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast/useToast';
import { auth as firebaseAuth } from '@/context/firebase';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';

/**
 * useSession Hook
 * 
 * Provides session management, authentication status, and cross-tab synchronization.
 * Listens to Firebase auth state changes in real-time to detect session expiration
 * without waiting for an API call to fail.
 */
export const useSession = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const auth = useAppSelector((state) => state.auth);
  const wasLoggedIn = useRef(false);

  const logout = useCallback(async (isExternal = false) => {
    try {
      if (isExternal) {
        dispatch(clearAuth());
        toast.info(
          'Sesión Finalizada',
          'Tu sesión se ha cerrado en otra pestaña. Inicia Sesión de nuevo para continuar.'
        );
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
  }, [dispatch, navigate, toast]);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        wasLoggedIn.current = true;
      } else if (wasLoggedIn.current && auth.user) {
        // Firebase session ended, but we still think we are logged in
        dispatch(setSessionExpiredNotice(true));
        logout(false);
      }
    });

    const unsubscribeToken = onIdTokenChanged(firebaseAuth, async (user) => {
      if (user) {
        await user.getIdToken();
        // Update local storage or state if needed, but Firebase handles refreshing
      }
    });

    return () => {
      unsubscribe();
      unsubscribeToken();
    };
  }, [auth.user, dispatch, logout]);

  return {
    isLogged: !!auth.user,
    user: auth.user,
    logout: () => logout(false),
  };
};
