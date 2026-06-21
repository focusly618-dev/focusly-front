import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/auth/auth.slice';
import { AuthProviders } from '../types/Login.types';
import {
  requestMagicLink,
  verifyMagicLink,
  loginWithGoogle,
} from '@/api/Auth/authApi';

interface UseLoginAuthProps {
  onAuthSuccess?: () => void;
  onAuthError?: (error: unknown, context: string) => void;
}

export const useLoginAuth = ({
  onAuthSuccess,
  onAuthError,
}: UseLoginAuthProps = {}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const sendMagicLink = async (email: string, fullName?: string) => {
    setIsLoading(true);
    try {
      console.log('Sending custom magic link to:', email);
      await requestMagicLink(email, fullName);

      // Guardamos el email localmente para completar el sign-in al volver
      window.localStorage.setItem('emailForSignIn', email);
      if (fullName) {
        window.localStorage.setItem('fullNameForSignIn', fullName);
      }

      onAuthSuccess?.();
      return true;
    } catch (error) {
      onAuthError?.(error, 'Error sending magic link');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const completeMagicLinkSignIn = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setIsLoading(true);
      try {
        console.log('Verifying custom magic link token...');
        const responseData = await verifyMagicLink(token);

        dispatch(
          login({
            isLogged: true,
            user: responseData.user,
            provider: AuthProviders.email,
          }),
        );

        // Limpiar storage
        window.localStorage.removeItem('emailForSignIn');
        window.localStorage.removeItem('fullNameForSignIn');

        // Navegar a dashboard y remover token de la URL
        navigate('/dashboard', { replace: true });
      } catch (error) {
        onAuthError?.(error, 'Magic Link sign-in failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const loginGoogle = useGoogleLogin({
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/calendar',
    redirect_uri: window.location.origin,
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      try {
        const responseData = await loginWithGoogle(
          codeResponse.code,
          window.location.origin,
        );
        dispatch(
          login({
            isLogged: true,
            user: responseData.user,
            provider: AuthProviders.google,
          }),
        );
        navigate('/dashboard');
      } catch (error) {
        onAuthError?.(error, 'Google Login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => onAuthError?.(error, 'Google Login popup failed'),
  });

  return {
    isLoading,
    sendMagicLink,
    completeMagicLinkSignIn,
    loginGoogle,
  };
};
