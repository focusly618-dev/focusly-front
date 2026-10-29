import { useCallback, useMemo, type RefObject } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { notify } from '@/utils';
import {
  GET_CANVASES_BY_WORKSPACE,
  REMOVE_CANVAS,
} from '@/pages/Workspace/Canvas.graphql';
import type { Canvas } from '@/pages/Workspace/canvas.types';
import type { MarkdownEditorRef } from '../../../../codemirror/MarkdownEditor.types';
import type { CanvasView } from '../../../../useCanvasView.hook';
import {
  canvasLink,
  canvasLinkRemovals,
  linkedCanvasIds,
} from '../../../EditorContent/canvasLinks.utils';

/**
 * The document's canvases, for the header's list: whether the text still
 * links to each one (a card deleted by accident leaves its canvas here), and
 * opening, putting back and deleting them.
 */
export const useDocumentCanvases = ({
  workspaceId,
  documentText,
  markdownEditorRef,
  canvasView,
}: {
  workspaceId: string | null;
  documentText: string;
  markdownEditorRef?: RefObject<MarkdownEditorRef | null>;
  canvasView?: CanvasView;
}) => {
  const { t } = useTranslation();
  const { data, refetch } = useQuery<{ canvasesByWorkspace: Canvas[] }>(
    GET_CANVASES_BY_WORKSPACE,
    {
      variables: { workspaceId },
      skip: !workspaceId,
      fetchPolicy: 'cache-and-network',
    },
  );
  const [removeCanvas] = useMutation<{ removeCanvas: boolean }>(REMOVE_CANVAS);

  const canvases = useMemo(
    () => data?.canvasesByWorkspace ?? [],
    [data?.canvasesByWorkspace],
  );

  const linked = useMemo(
    () => (canvases.length ? linkedCanvasIds(documentText) : new Set<string>()),
    [canvases.length, documentText],
  );
  const isInDocument = useCallback((id: string) => linked.has(id), [linked]);
  const missingCount = canvases.filter((c) => !linked.has(c.id)).length;

  const open = useCallback(
    (canvas: Canvas) => canvasView?.open(canvas.id, canvas.name, canvas.icon),
    [canvasView],
  );

  /** Puts the canvas's card back where the cursor was in the document. */
  const insert = useCallback(
    (canvas: Canvas) => {
      const link = canvasLink(canvas.id, canvas.name, canvas.icon);
      if (canvasView?.isActive) {
        canvasView.close();
        // The document shows again first, so the card scrolls into view
        requestAnimationFrame(() =>
          markdownEditorRef?.current?.insertLine(link),
        );
        return;
      }
      markdownEditorRef?.current?.insertLine(link);
    },
    [canvasView, markdownEditorRef],
  );

  /** Deletes the canvas with its images, and its links from the document. */
  const remove = useCallback(
    async (canvas: Canvas): Promise<boolean> => {
      if (canvasView?.isActive && canvasView.id === canvas.id) {
        // Closing it sends its last unsaved change; that goes out first
        canvasView.close();
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      try {
        await removeCanvas({
          variables: { id: canvas.id },
          update: (cache) => {
            cache.evict({
              id: cache.identify({ __typename: 'Canvas', id: canvas.id }),
            });
            cache.gc();
          },
        });
      } catch (error) {
        console.error('Failed to delete canvas:', error);
        notify.error({
          title: t(
            'workspaceEditor.canvases.deleteFailed',
            'No se pudo eliminar el canvas',
          ),
          description: t(
            'workspaceEditor.canvases.deleteFailedDesc',
            'Inténtalo de nuevo en un momento.',
          ),
        });
        return false;
      }
      const editor = markdownEditorRef?.current;
      if (editor)
        editor.applyChanges(canvasLinkRemovals(editor.getValue(), canvas.id));
      return true;
    },
    [canvasView, markdownEditorRef, removeCanvas, t],
  );

  return {
    canvases,
    missingCount,
    isInDocument,
    refresh: refetch,
    open,
    insert,
    remove,
  };
};
