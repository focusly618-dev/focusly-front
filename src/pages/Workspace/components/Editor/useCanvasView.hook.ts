import { useCallback, useState, type RefObject } from 'react';
import type { MarkdownEditorRef } from './codemirror/MarkdownEditor.types';
import {
  canvasLink,
  findCanvasLinks,
} from './components/EditorContent/canvasLinks.utils';

/** The canvas open in place of the document, shared by the header (which
 * shows, renames and re-icons it) and the content area (which draws it). */
export interface CanvasView {
  isActive: boolean;
  id: string | null;
  title: string;
  /** Its emoji; null means the default one. */
  icon: string | null;
  open: (id: string | null, title: string, icon: string | null) => void;
  close: () => void;
  /** Each of these also rewrites the document's links to the canvas. */
  setTitle: (name: string) => void;
  setIcon: (icon: string) => void;
  /** Takes the saved name and icon once the canvas has loaded. */
  applySaved: (name: string, icon: string | null) => void;
}

export const useCanvasView = (
  markdownEditorRef: RefObject<MarkdownEditorRef | null>,
): CanvasView => {
  const [isActive, setIsActive] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [title, setTitleState] = useState('');
  const [icon, setIconState] = useState<string | null>(null);

  const open = useCallback(
    (
      canvasId: string | null,
      canvasTitle: string,
      canvasIcon: string | null,
    ) => {
      setId(canvasId);
      setTitleState(canvasTitle);
      setIconState(canvasIcon);
      setIsActive(true);
    },
    [],
  );

  const close = useCallback(() => setIsActive(false), []);

  // Keeps the open canvas's links in the document showing its icon and name,
  // both while they're changed and when it opens (an older link may lag).
  const relink = useCallback(
    (name: string, linkIcon: string | null) => {
      const editor = markdownEditorRef.current;
      if (!id || !editor || !name.trim()) return;
      const link = canvasLink(id, name, linkIcon);
      editor.applyChanges(
        findCanvasLinks(editor.getValue(), id)
          .filter((match) => match.text !== link)
          .map(({ from, to }) => ({ from, to, insert: link })),
      );
    },
    [id, markdownEditorRef],
  );

  const setTitle = useCallback(
    (name: string) => {
      setTitleState(name);
      relink(name, icon);
    },
    [icon, relink],
  );

  const setIcon = useCallback(
    (newIcon: string) => {
      setIconState(newIcon);
      relink(title, newIcon);
    },
    [title, relink],
  );

  const applySaved = useCallback(
    (name: string, savedIcon: string | null) => {
      setTitleState(name);
      setIconState(savedIcon);
      relink(name, savedIcon);
    },
    [relink],
  );

  return {
    isActive,
    id,
    title,
    icon,
    open,
    close,
    setTitle,
    setIcon,
    applySaved,
  };
};
