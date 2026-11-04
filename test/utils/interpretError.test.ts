import { describe, expect, it } from 'vitest';
import i18n from '@/i18n';
import { getFriendlyErrorMessage } from '@/utils/errors/interpretError';

const axiosError = (status: number, detail: string) => ({
  isAxiosError: true,
  request: {},
  response: { status, data: { detail } },
});

describe('getFriendlyErrorMessage: the hardened backend messages', () => {
  it('too many sign-in attempts', () => {
    expect(
      getFriendlyErrorMessage(
        axiosError(
          429,
          'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.',
        ),
      ),
    ).toBe(i18n.t('errors.tooManyAttempts'));
  });

  it('a magic link email that could not be sent', () => {
    expect(
      getFriendlyErrorMessage(
        axiosError(
          503,
          'No pudimos enviar el correo. Inténtalo de nuevo o entra con Google.',
        ),
      ),
    ).toBe(i18n.t('errors.emailNotSent'));
  });

  it.each([
    'No pudimos iniciar sesión con Google.',
    'Vuelve a conectar Google Calendar.',
    'Invalid Google OAuth Token: invalid_grant',
  ])('Google sign-in: %s', (detail) => {
    expect(getFriendlyErrorMessage(axiosError(401, detail))).toBe(
      i18n.t('errors.googleAuthFailed'),
    );
  });

  it.each([
    'Lumina no está disponible en este momento. Inténtalo de nuevo.',
    'Failed to delegate planning to focusly-ai: boom',
  ])('AI unavailable: %s', (detail) => {
    expect(getFriendlyErrorMessage(axiosError(500, detail))).toBe(
      i18n.t('errors.aiUnavailable'),
    );
  });

  it('every new message exists in every language with its own errors', () => {
    for (const lng of [
      'es',
      'en',
      'de',
      'fr',
      'it',
      'ja',
      'ko',
      'pt-BR',
      'zh-CN',
      'en-GB',
    ]) {
      for (const key of ['errors.tooManyAttempts', 'errors.emailNotSent']) {
        expect(i18n.exists(key, { lng })).toBe(true);
      }
    }
  });
});
