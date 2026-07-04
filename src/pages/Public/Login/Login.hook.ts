import { useState } from 'react';
import { useLoginForm } from './hooks/useLoginForm.hook';
import { useLoginAuth } from './hooks/useLoginAuth.hook';
import { useLoginErrorHandler } from './hooks/useLoginErrorHandler.hook';

export const useLogin = () => {
  const { handleError } = useLoginErrorHandler();
  const [linkSent, setLinkSent] = useState(false);
  const form = useLoginForm();
  const auth = useLoginAuth({
    onAuthSuccess: () => {
      setLinkSent(true);
      form.clearCredentials();
    },
    onAuthError: handleError,
  });

  const onSignIn = async () => {
    if (!form.email) {
      alert('Please enter your email');
      return;
    }

    let resolvedName = form.fullName;
    if (form.isRegistering && !resolvedName) {
      resolvedName = form.email.split('@')[0];
    }

    const success = await auth.sendMagicLink(
      form.email,
      form.isRegistering ? resolvedName : undefined,
    );

    if (success) {
      setLinkSent(true);
    }
  };

  return {
    // Auth
    loginGoogle: auth.loginGoogle,
    isLoading: auth.isLoading,
    completeMagicLinkSignIn: auth.completeMagicLinkSignIn,
    onSignIn,
    linkSent,
    setLinkSent,
    isRegistering: form.isRegistering,
    toggleRegister: form.toggleRegister,
    email: form.email,
    fullName: form.fullName,
    handleEmailChange: form.handleEmailChange,
    handleFullNameChange: form.handleFullNameChange,
  };
};
