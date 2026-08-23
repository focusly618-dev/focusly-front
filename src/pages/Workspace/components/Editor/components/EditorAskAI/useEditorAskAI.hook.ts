import { useState, type RefObject } from 'react';
import {
  fetchAssistantResult,
  EDIT_PROPOSAL_START,
  EDIT_PROPOSAL_END,
} from '@/api/AI/apiAI';
import type { AIMessage } from '@/api/AI/apiAI.types';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';
import { sileo, getFriendlyErrorMessage } from '@/utils';

interface UseEditorAskAIProps {
  markdownEditorRef: RefObject<MarkdownEditorRef | null>;
}

const parseAssistantResponse = (
  raw: string,
): { note: string; proposedEdit: string | null } => {
  const startIdx = raw.indexOf(EDIT_PROPOSAL_START);
  if (startIdx === -1) return { note: raw.trim(), proposedEdit: null };

  const endIdx = raw.indexOf(EDIT_PROPOSAL_END, startIdx);
  const note = raw.slice(0, startIdx).trim();
  const proposedEdit = raw
    .slice(startIdx + EDIT_PROPOSAL_START.length, endIdx === -1 ? undefined : endIdx)
    .trim();

  return {
    note: note || 'Aquí tienes los cambios propuestos.',
    proposedEdit: proposedEdit || null,
  };
};

export const useEditorAskAI = ({ markdownEditorRef }: UseEditorAskAIProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [hasPendingDiff, setHasPendingDiff] = useState(false);
  const [history, setHistory] = useState<AIMessage[]>([]);

  const open = () => setIsOpen(true);

  const close = () => {
    if (hasPendingDiff) return;
    setIsOpen(false);
    setNote(null);
  };

  const sendMessage = async (message: string) => {
    if (!message || !markdownEditorRef.current || isLoading) return;

    setInputValue('');
    setIsLoading(true);
    setNote(null);

    const documentText = markdownEditorRef.current.getValue();
    const nextHistory: AIMessage[] = [
      ...history,
      { role: 'user', content: message },
    ];

    try {
      const raw = await fetchAssistantResult(nextHistory, documentText);
      const { note: replyNote, proposedEdit } = parseAssistantResponse(raw);

      // Store only the short note in history, never the full echoed-back
      // document from an edit proposal — keeping that in every future
      // request would balloon payload size/cost with each turn for no
      // benefit, since fresh document_context is already resent every time.
      setHistory([...nextHistory, { role: 'assistant', content: replyNote }]);
      setNote(replyNote);

      if (proposedEdit) {
        markdownEditorRef.current.showDiff(proposedEdit);
        setHasPendingDiff(true);
      }
    } catch (e) {
      console.error('Ask AI failed:', e);
      sileo.error({
        title: 'Lumina no pudo responder',
        description: getFriendlyErrorMessage(
          e,
          'Intenta de nuevo en un momento.',
        ),
        fill: 'var(--sileo-error-bg)',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const message = inputValue.trim();
    if (!message) return;
    setInputValue('');
    sendMessage(message);
  };

  const handleQuickAction = (message: string) => {
    sendMessage(message);
  };

  const handleResolveDiff = (resolution: 'accept' | 'reject') => {
    markdownEditorRef.current?.resolveDiff(resolution);
    setHasPendingDiff(false);
    setNote(null);
    sileo.success({
      title:
        resolution === 'accept'
          ? 'Cambios aplicados a tu documento'
          : 'Cambios descartados',
      fill: 'var(--sileo-success-bg)',
      duration: 2200,
    });
  };

  return {
    isOpen,
    open,
    close,
    inputValue,
    setInputValue,
    isLoading,
    note,
    hasPendingDiff,
    handleSubmit,
    handleQuickAction,
    handleResolveDiff,
  };
};
