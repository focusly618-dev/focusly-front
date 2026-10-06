import { notify } from '../notifications/notify';
import { getFriendlyErrorMessage } from './interpretError';

export const handleMutationError = (
  error: unknown,
  fallbackMessage: string,
) => {
  console.error(fallbackMessage, error);
  notify.error({
    title: getFriendlyErrorMessage(error, fallbackMessage),
  });
};
