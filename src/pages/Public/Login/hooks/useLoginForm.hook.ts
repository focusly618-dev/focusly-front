import { useState } from 'react';

// The public site links here with ?mode=signup (and the beta form adds
// &email=…) to open the sign-up tab directly.
const getInitialParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    email: params.get('email') ?? '',
    signup: params.get('mode') === 'signup',
  };
};

export const useLoginForm = () => {
  const [email, setEmail] = useState(() => getInitialParams().email);
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(
    () => getInitialParams().signup,
  );

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);
  const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFullName(event.target.value);

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
  };

  const clearCredentials = () => {
    // Ya no hay contraseñas que limpiar
  };

  return {
    email,
    setEmail,
    fullName,
    setFullName,
    isRegistering,
    setIsRegistering,
    handleEmailChange,
    handleFullNameChange,
    toggleRegister,
    clearCredentials,
  };
};
