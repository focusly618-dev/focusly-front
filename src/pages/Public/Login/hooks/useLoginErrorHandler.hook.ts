import { notify } from '@/utils/notifications/notify';
import { getFriendlyErrorMessage } from '@/utils/errors/interpretError';

export const useLoginErrorHandler = () => {
  const handleError = (error: unknown, context: string) => {
    console.error(context, error);
    notify.error({
      title: getFriendlyErrorMessage(error),
    });
  };

  return { handleError };
};
