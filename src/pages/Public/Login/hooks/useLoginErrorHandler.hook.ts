import { sileo } from '@/utils/notifications/sileo';
import { getFriendlyErrorMessage } from '@/utils/errors/interpretError';

export const useLoginErrorHandler = () => {
  const handleError = (error: unknown, context: string) => {
    console.error(context, error);
    sileo.error({
      title: getFriendlyErrorMessage(error),
      fill: 'var(--sileo-error-bg)',
    });
  };

  return { handleError };
};
