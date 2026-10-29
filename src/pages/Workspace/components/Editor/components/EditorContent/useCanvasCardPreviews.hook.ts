import { useEffect, useMemo, type RefObject } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CANVASES_BY_WORKSPACE } from '@/pages/Workspace/Canvas.graphql';
import type { Canvas } from '@/pages/Workspace/canvas.types';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';

// The links to the pictures expire after an hour; they're asked for again
// before that, so a card scrolled into view later still loads its picture.
const REFRESH_LINKS_MS = 30 * 60 * 1000;

/** Hands the document's canvas cards the pictures of their drawings. The
 * list is the header's own query, so both share one request and cache. */
export const useCanvasCardPreviews = (
  workspaceId: string | null,
  markdownEditorRef: RefObject<MarkdownEditorRef | null>,
) => {
  const { data } = useQuery<{ canvasesByWorkspace: Canvas[] }>(
    GET_CANVASES_BY_WORKSPACE,
    {
      variables: { workspaceId },
      skip: !workspaceId,
      pollInterval: REFRESH_LINKS_MS,
    },
  );

  const previews = useMemo(
    () =>
      new Map(
        (data?.canvasesByWorkspace ?? []).flatMap((canvas) =>
          canvas.previewUrl && canvas.previewAt
            ? [
                [
                  canvas.id,
                  { url: canvas.previewUrl, version: canvas.previewAt },
                ],
              ]
            : [],
        ),
      ),
    [data?.canvasesByWorkspace],
  );

  // Again for each document: the editor starts over when the note changes
  useEffect(() => {
    markdownEditorRef.current?.setCanvasPreviews(previews);
  }, [previews, markdownEditorRef, workspaceId]);
};
