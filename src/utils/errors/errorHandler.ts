import { sileo } from '../notifications/sileo';

export const handleMutationError = (
  error: unknown,
  fallbackMessage: string,
) => {
  console.error(fallbackMessage, error);
  const message =
    (error as { graphQLErrors?: { message?: string }[] })?.graphQLErrors?.[0]
      ?.message ||
    (error as { message?: string })?.message ||
    fallbackMessage;
  sileo.error({
    title: message,
    fill: 'var(--sileo-error-bg)',
  });
};
