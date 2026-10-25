import { useEffect, useState } from 'react';
import { savePendingPlan } from '@/utils/storage/pendingPlan';

// The public site links here with ?mode=signup (and the beta form adds
// &email=…) to open the sign-up tab directly. The pricing page adds
// &plan=pro (and &interval=year) when the visitor picked Pro.
const getInitialParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    email: params.get('email') ?? '',
    signup: params.get('mode') === 'signup',
    plan: params.get('plan'),
    interval: params.get('interval') === 'year' ? 'year' : 'month',
  } as const;
};

export const useLoginForm = () => {
  const [email, setEmail] = useState(() => getInitialParams().email);
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(
    () => getInitialParams().signup,
  );

  // Kept until the first logged-in screen opens the Pro checkout
  useEffect(() => {
    const { plan, interval } = getInitialParams();
    if (plan === 'pro') savePendingPlan(interval);
  }, []);

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
