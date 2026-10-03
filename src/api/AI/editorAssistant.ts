import axios from 'axios';
import { API_BASE_URL } from '@/config/env.config';
import type { AIMessage } from './apiAI.types';
import type { ConversationMessage } from './apiAI';

// Markers the editor assistant wraps document text in. The backend strips the
// same blocks before saving a reply to the history
// (focusly-workflows app/modules/ai/services/editor_blocks.py).
export const EDIT_PROPOSAL_START = '<<<FOCUSLY_PROPOSED_EDIT>>>';
export const EDIT_PROPOSAL_END = '<<<END_PROPOSED_EDIT>>>';
export const REPLACEMENT_START = '<<<FOCUSLY_REPLACEMENT>>>';
export const REPLACEMENT_END = '<<<END_REPLACEMENT>>>';

// Fence labels a user message quotes part of the document with.
export const SELECTION_FENCE = 'selection';
export const CURSOR_FENCE = 'before-cursor';

const baseUrl = () => (import.meta.env.DEV ? '' : API_BASE_URL);

export const buildEditorSystemContext = (
  documentText: string,
): string => `You are Lumina, the AI assistant embedded directly in a Focusly workspace note editor. The user is currently looking at this exact document — never ask them to paste or describe it, you already have it below, and it takes priority over any other document/workspace mentioned above with the same or a different title.

=== CURRENT DOCUMENT CONTENT ===
${documentText || '(empty document)'}
=== END DOCUMENT CONTENT ===

Answer conversationally, in the language the user writes in, using the document above as context (e.g. "the idea in point 1" refers to a heading/point in that document). Keep answers focused; use Markdown when it helps.

FRAGMENT REQUESTS. A user message may quote part of the document in a fenced block labeled \`${SELECTION_FENCE}\` (text the user selected) or \`${CURSOR_FENCE}\` (the text right before their cursor). When they ask you to rewrite, fix, shorten, lengthen, translate or restyle a \`${SELECTION_FENCE}\` block, or to continue writing from a \`${CURSOR_FENCE}\` block: write one short sentence describing what you did, then ONLY the new text — not the whole document — wrapped exactly like this, with nothing after it:
${REPLACEMENT_START}
(the rewritten selection, or only the new text to insert at the cursor)
${REPLACEMENT_END}
Keep the fragment's Markdown formatting and language unless asked to translate. When they only ask a question about the quoted text (e.g. to explain it), just answer, without that block.

WHOLE-DOCUMENT EDITS. If — and only if — the user asks you to change, rewrite, clarify, expand, shorten, proofread or otherwise edit the document itself (not a quoted fragment), write one short sentence describing what you changed, then on new lines include the COMPLETE revised document (the whole thing, in the same Markdown formatting) wrapped exactly like this, with no other text after it:
${EDIT_PROPOSAL_START}
(full revised document markdown here)
${EDIT_PROPOSAL_END}

This explicitly includes any request to save, insert, write, add, or keep something directly in this document/note/editor (e.g. "agrégalo a la nota", "escríbelo en el documento", "guárdalo aquí", "ponlo en el editor", "add this to my note") — treat that exactly like an edit request and use the block above right away, merging the new content into the existing document. Do not just ask for permission first when the user has already asked for this explicitly.

If the user has NOT asked for an edit — they're just asking a question, or you are the one offering to save something for them — include neither block. The user has buttons in the UI to insert your reply into the document themselves, so you don't need to chase confirmation across turns.

TASKS. When the user asks you to extract or create tasks from the document, propose each one with your CREATE_TASK action format, one action per task, and keep the surrounding text to a short summary.`;

const refreshSession = async () => {
  const { store } = await import('@/redux/store');
  const user = store.getState().auth.user;
  if (!user) return false;
  await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    { userId: user.id },
    { withCredentials: true },
  );
  return true;
};

export interface EditorAssistantRequest {
  messages: AIMessage[];
  documentText: string;
  /** The open document. With it the reply is saved to the document's thread. */
  workspaceId?: string | null;
  /** Continues an existing thread. */
  conversationId?: string | null;
  /** Title for a new thread in the Lumina history. */
  conversationTitle?: string;
  signal?: AbortSignal;
  /** Called with the reply received so far, as it streams in. */
  onText?: (text: string) => void;
}

export interface EditorAssistantResult {
  text: string;
  conversationId: string | null;
}

export const streamEditorAssistant = async ({
  messages,
  documentText,
  workspaceId,
  conversationId,
  conversationTitle,
  signal,
  onText,
}: EditorAssistantRequest): Promise<EditorAssistantResult> => {
  const persist = Boolean(conversationId || workspaceId);
  const body = JSON.stringify({
    messages,
    document_context: buildEditorSystemContext(documentText),
    conversationId: conversationId || undefined,
    workspaceId: conversationId ? undefined : workspaceId || undefined,
    conversationTitle,
    persist,
    clientTime: new Date().toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const makeRequest = () =>
    fetch(`${baseUrl()}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body,
      signal,
    });

  let response = await makeRequest();
  if (response.status === 401) {
    try {
      if (await refreshSession()) response = await makeRequest();
    } catch (refreshErr) {
      console.error(
        'Failed to refresh token for the editor assistant:',
        refreshErr,
      );
    }
  }
  if (!response.ok) {
    throw new Error(await response.text());
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body reader');

  const decoder = new TextDecoder();
  let text = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    onText?.(text);
  }
  text += decoder.decode();

  return {
    text: text.trim(),
    conversationId:
      response.headers.get('X-Conversation-Id') ?? conversationId ?? null,
  };
};

export interface EditorConversation {
  conversationId: string | null;
  messages: ConversationMessage[];
}

/** The document's latest assistant thread (empty when there is none). */
export const fetchEditorConversation = async (
  workspaceId: string,
): Promise<EditorConversation> => {
  const response = await fetch(
    `${baseUrl()}/ai/workspaces/${encodeURIComponent(workspaceId)}/conversation`,
    { credentials: 'include' },
  );
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export interface EditorConversationSummary {
  id: string;
  title: string | null;
  /** The thread's first question, without its quoted fragment. */
  preview: string;
  createdAt: string;
  updatedAt: string;
}

/** The document's assistant threads, most recently used first. */
export const fetchEditorConversations = async (
  workspaceId: string,
): Promise<EditorConversationSummary[]> => {
  const response = await fetch(
    `${baseUrl()}/ai/workspaces/${encodeURIComponent(workspaceId)}/conversations`,
    { credentials: 'include' },
  );
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};
