import { sileo } from '../notifications/sileo';
import { getFriendlyErrorMessage } from './interpretError';

export const handleMutationError = (
  error: unknown,
  fallbackMessage: string,
) => {
  console.error(fallbackMessage, error);
  sileo.error({
    title: getFriendlyErrorMessage(error, fallbackMessage),
    fill: 'var(--sileo-error-bg)',
  });
};
