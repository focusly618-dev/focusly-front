import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from 'react';
import { useTranslation } from 'react-i18next';
import { sileo } from '@/utils';
import {
  editorAssistantService as service,
  sessionKey,
} from '@/services/editorAssistantService';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';
import {
  CURSOR_CONTEXT_CHARS,
  actionScope,
  buildScopedMessage,
  type FragmentTarget,
  type QuickActionId,
} from './editorAssistant.utils';

export type {
  EditorChatMessage,
  MessageStatus,
} from '@/services/editorAssistantService';

interface UseEditorAskAIProps {
  markdownEditorRef: RefObject<MarkdownEditorRef | null>;
  /** The open document; without one, nothing is saved to the history. */
  workspaceId?: string | null;
  documentTitle?: string;
  /** Live editor selection (empty when the selection is a cursor). */
  selectedText: string;
}

// The panel's state lives in editorAssistantService, per document, so a reply
// keeps going (and its change waits for review) while the user is elsewhere.
// This hook binds that session to the editor on screen.
export const useEditorAskAI = ({
  markdownEditorRef,
  workspaceId,
  documentTitle = '',
  selectedText,
}: UseEditorAskAIProps) => {
  const { t, i18n } = useTranslation();
  const key = sessionKey(workspaceId);
  const session = useSyncExternalStore(service.subscribe, () =>
    service.getSession(key),
  );
  const [view, setView] = useState<'chat' | 'history'>('chat');
  // The selection the user chose not to send along; a new selection
  // attaches again.
  const [detachedSelection, setDetachedSelection] = useState<string | null>(
    null,
  );

  useEffect(() => service.mount(key), [key]);

  useEffect(() => {
    service.setDocumentTitle(key, documentTitle);
  }, [key, documentTitle]);

  // A finished reply's change goes up for review once this editor shows the
  // document it was written for; otherwise it's offered by hand.
  useEffect(() => {
    const review = session.pendingReview;
    const editor = markdownEditorRef.current;
    if (!review || !editor) return;
    if (editor.getValue() === review.baseDoc) {
      editor.showDiff(review.proposedDoc);
      service.beginReview(key);
    } else {
      service.deferReview(key);
    }
  }, [session.pendingReview, key, markdownEditorRef]);

  // ⌘J / Ctrl+J toggles the panel from anywhere in the editor.
  const isOpenRef = useRef(session.isOpen);
  useEffect(() => {
    isOpenRef.current = session.isOpen;
  });
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        !e.shiftKey &&
        !e.altKey &&
        e.key.toLowerCase() === 'j'
      ) {
        e.preventDefault();
        service.setOpen(key, !isOpenRef.current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key]);

  const hasSelection = Boolean(selectedText.trim());
  const selectionAttached = hasSelection && detachedSelection !== selectedText;
  const hasPendingDiff = Boolean(session.activeReview);
  const isBusy =
    session.isStreaming || hasPendingDiff || Boolean(session.pendingReview);

  const send = (content: string, target: FragmentTarget | null = null) => {
    const editor = markdownEditorRef.current;
    if (!editor) return;
    void service.send(key, {
      content,
      target,
      documentText: editor.getValue(),
    });
  };

  const languageName = (code: string) => {
    try {
      return (
        new Intl.DisplayNames([i18n.language], { type: 'language' }).of(code) ??
        code
      );
    } catch {
      return code;
    }
  };

  const runAction = (
    id: QuickActionId,
    options: { language?: string } = {},
  ) => {
    const editor = markdownEditorRef.current;
    if (!editor || isBusy) return;
    const instruction = t(`editorAI.prompts.${id}`, {
      language: options.language ? languageName(options.language) : '',
    });
    const scope = actionScope(id);
    setView('chat');

    if (scope === 'selection') {
      const selection = editor.getSelection();
      if (!selection.text.trim()) return;
      const target =
        id === 'explain'
          ? null
          : { doc: editor.getValue(), from: selection.from, to: selection.to };
      send(
        buildScopedMessage(instruction, 'selection', selection.text),
        target,
      );
      return;
    }

    if (scope === 'cursor') {
      const doc = editor.getValue();
      const cursor = editor.getSelection().to;
      const before = doc.slice(
        Math.max(0, cursor - CURSOR_CONTEXT_CHARS),
        cursor,
      );
      send(buildScopedMessage(instruction, 'cursor', before), {
        doc,
        from: cursor,
        to: cursor,
      });
      return;
    }

    send(instruction);
  };

  const submit = () => {
    const text = session.draft.trim();
    const editor = markdownEditorRef.current;
    if (!text || !editor || isBusy) return;
    service.setDraft(key, '');
    setView('chat');
    if (selectionAttached) {
      const selection = editor.getSelection();
      if (selection.text.trim()) {
        send(buildScopedMessage(text, 'selection', selection.text), {
          doc: editor.getValue(),
          from: selection.from,
          to: selection.to,
        });
        return;
      }
    }
    send(text);
  };

  const retry = () => {
    const editor = markdownEditorRef.current;
    if (editor) service.retry(key, editor.getValue());
  };

  const resolveDiff = (resolution: 'accept' | 'reject') => {
    markdownEditorRef.current?.resolveDiff(resolution);
    service.finishReview(key);
    sileo.success({
      title:
        resolution === 'accept'
          ? t('editorAI.diff.applied')
          : t('editorAI.diff.discarded'),
      fill: 'var(--sileo-success-bg)',
      duration: 2200,
    });
  };

  /** Shows an edit that couldn't open automatically, against today's text. */
  const reviewEdit = (messageId: string) => {
    const editor = markdownEditorRef.current;
    const message = session.messages.find((m) => m.id === messageId);
    if (!editor || !message?.unappliedEdit || isBusy) return;
    editor.showDiff(message.unappliedEdit);
    service.startManualReview(key, messageId, editor.getValue());
  };

  /** Puts text into the document at the cursor or over the selection. */
  const insertText = (text: string, mode: 'cursor' | 'replaceSelection') => {
    const editor = markdownEditorRef.current;
    if (!editor || hasPendingDiff || !text.trim()) return;
    const selection = editor.getSelection();
    if (mode === 'replaceSelection' && selection.from !== selection.to) {
      editor.replaceRange(selection.from, selection.to, text);
    } else {
      editor.insertAtCursor(text);
    }
    sileo.success({
      title: t('editorAI.toasts.inserted'),
      fill: 'var(--sileo-success-bg)',
      duration: 2000,
    });
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      sileo.success({
        title: t('editorAI.toasts.copied'),
        fill: 'var(--sileo-success-bg)',
        duration: 1600,
      });
    } catch {
      sileo.error({
        title: t('editorAI.errors.copy'),
        fill: 'var(--sileo-error-bg)',
      });
    }
  };

  const showHistory = () => {
    setView('history');
    if (session.conversationsStatus === 'idle')
      void service.loadConversations(key);
  };

  return {
    session,
    canPersist: Boolean(session.workspaceId),
    isOpen: session.isOpen,
    open: () => service.setOpen(key, true),
    close: () => service.setOpen(key, false),
    view,
    showHistory,
    showChat: () => setView('chat'),
    messages: session.messages,
    isLoadingHistory: session.historyStatus === 'loading',
    isStreaming: session.isStreaming,
    hasPendingDiff,
    isBusy,
    unseen: session.unseen,
    inputValue: session.draft,
    setInputValue: (value: string) => service.setDraft(key, value),
    hasSelection,
    selectionAttached,
    detachSelection: () => setDetachedSelection(selectedText),
    attachSelection: () => setDetachedSelection(null),
    submit,
    runAction,
    stop: () => service.stop(key),
    retry,
    newConversation: () => {
      service.newConversation(key);
      setView('chat');
    },
    openConversation: (conversationId: string) => {
      setView('chat');
      void service.openConversation(key, conversationId);
    },
    deleteConversation: (conversationId: string) =>
      service.deleteConversation(key, conversationId),
    reloadConversations: () => service.loadConversations(key),
    resolveDiff,
    reviewEdit,
    insertText,
    copy,
  };
};
