import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@mui/material';
import { useBilling } from '@/hooks/useBilling';
import { notify } from '@/utils';

// What a plan lets canvases hold, and how the server says one went past it.
// Kept apart from the canvas itself so the editor can use it without
// loading the drawing tool.

export type CanvasLimitCode =
  | 'canvas_limit_reached'
  | 'canvas_too_large'
  | 'canvas_image_too_large'
  | 'canvas_image_limit';

const CODES: readonly string[] = [
  'canvas_limit_reached',
  'canvas_too_large',
  'canvas_image_too_large',
  'canvas_image_limit',
];

/** The plan limit a GraphQL request ran into, if that's why it failed: the
 * server puts { code, limit } in the error's extensions. */
export const canvasLimitError = (
  error: unknown,
): { code: CanvasLimitCode; limit?: number } | null => {
  const errors = (error as { graphQLErrors?: unknown })?.graphQLErrors;
  if (!Array.isArray(errors)) return null;
  for (const err of errors) {
    const extensions = (err as { extensions?: Record<string, unknown> })
      ?.extensions;
    const code = extensions?.code;
    if (typeof code === 'string' && CODES.includes(code)) {
      const limit = extensions?.limit;
      return {
        code: code as CanvasLimitCode,
        limit: typeof limit === 'number' ? limit : undefined,
      };
    }
  }
  return null;
};

/** "2 MB", for the messages about sizes. */
export const formatMegabytes = (bytes: number): string =>
  `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;

/**
 * Tells the user which of their plan's limits a canvas ran into, with Pro
 * one click away (or opened straight away, when they were creating one).
 */
export const useCanvasLimitNotice = () => {
  const { t } = useTranslation();
  const { isPro, openUpgrade } = useBilling();

  return useCallback(
    ({ code, limit }: { code: CanvasLimitCode; limit?: number }) => {
      const size = limit ? formatMegabytes(limit) : '';
      const k = 'workspaceEditor.canvases';
      const messages: Record<CanvasLimitCode, [string, string]> = {
        canvas_limit_reached: [
          t(`${k}.limitReached`, { count: limit ?? 0 }),
          t(`${k}.limitReachedDesc`),
        ],
        canvas_too_large: [
          t(`${k}.tooLarge`),
          t(`${k}.tooLargeDesc`, { size }),
        ],
        canvas_image_too_large: [
          t(`${k}.imageTooLarge`),
          t(`${k}.imageTooLargeDesc`, { size }),
        ],
        canvas_image_limit: [
          t(`${k}.imageLimit`),
          t(`${k}.imageLimitDesc`, { count: limit ?? 0 }),
        ],
      };
      const [title, description] = messages[code];
      // Creating one is something the user just asked for: Pro opens now.
      // The rest happen mid-drawing, so Pro waits behind the toast's button.
      if (code === 'canvas_limit_reached' && !isPro) openUpgrade('canvas');
      notify.warning({
        title,
        description,
        button:
          isPro || code === 'canvas_limit_reached'
            ? undefined
            : {
                title: t('billing.tryPro'),
                onClick: () => openUpgrade('canvas'),
              },
      });
    },
    [isPro, openUpgrade, t],
  );
};

// Phones (the app's mobile layout, on a touch screen): drawing there is
// awkward and slips easily, so canvases only open to be looked at. A narrow
// desktop window, or a tablet in landscape, still edits.
const READ_ONLY_QUERY = '(max-width: 899.95px) and (pointer: coarse)';

export const useCanvasReadOnly = (): boolean =>
  useMediaQuery(READ_ONLY_QUERY, { noSsr: true });
