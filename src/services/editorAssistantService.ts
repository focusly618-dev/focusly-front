import i18n from '@/i18n';
import { sileo, getFriendlyErrorMessage } from '@/utils';
import type { ParsedLuminaAction } from '@/utils/lumina';
import {
  deleteAIConversation,
  getAIConversationMessages,
  type ConversationMessage,
} from '@/api/AI/apiAI';
import {
  fetchEditorConversation,
  fetchEditorConversations,
  streamEditorAssistant,
  type EditorConversationSummary,
} from '@/api/AI/editorAssistant';
import {
  historyContent,
  replyOutcome,
  type FragmentTarget,
  type PendingReview,
} from '@/pages/Workspace/components/Editor/components/EditorAskAI/editorAssistant.utils';
import { isPlanLimitError } from '@/api/Billing/planLimit';
import { billingService } from '@/services/billingService';

// The workspace editor's assistant, one session per document, kept outside
// React like aiStreamService: a reply keeps streaming when the user leaves the
// editor, and its change waits for review until they come back.

export type MessageStatus = 'streaming' | 'done' | 'stopped' | 'error';

export interface EditorChatMessage {
  id: string;
  role: 'user' | 'assistant';
  /** User: the message as sent. Assistant: the raw reply, blocks included. */
  content: string;
  status: MessageStatus;
  /** Actions the server extracted from a reply restored from history. */
  actions?: ParsedLuminaAction[];
  /** User messages: where a fragment reply should land. */
  target?: FragmentTarget | null;
  /** A fragment that couldn't go to review: the document changed meanwhile. */
  unappliedFragment?: string | null;
  /** A whole-document edit that couldn't go to review automatically. */
  unappliedEdit?: string | null;
}

type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface EditorSession {
  key: string;
  workspaceId: string | null;
  documentTitle: string;
  conversationId: string | null;
  messages: EditorChatMessage[];
  historyStatus: LoadStatus;
  isOpen: boolean;
  draft: string;
  isStreaming: boolean;
  /** A finished reply's change, waiting for the editor to show it. */
  pendingReview: PendingReview | null;
  /** The change shown as a diff in the editor right now. */
  activeReview: PendingReview | null;
  /** A reply finished while the user wasn't looking. */
  unseen: boolean;
  conversations: EditorConversationSummary[];
  conversationsStatus: LoadStatus;
}

/** A session working, or done, while its document isn't open. */
export interface BackgroundActivity {
  key: string;
  workspaceId: string;
  documentTitle: string;
  status: 'writing' | 'done';
}

export const UNSAVED_SESSION = 'unsaved';
export const sessionKey = (workspaceId?: string | null) =>
  workspaceId || UNSAVED_SESSION;

const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createSession = (key: string): EditorSession => ({
  key,
  workspaceId: key === UNSAVED_SESSION ? null : key,
  documentTitle: '',
  conversationId: null,
  messages: [],
  historyStatus: 'idle',
  isOpen: false,
  draft: '',
  isStreaming: false,
  pendingReview: null,
  activeReview: null,
  unseen: false,
  conversations: [],
  conversationsStatus: 'idle',
});

const fromServer = (m: ConversationMessage): EditorChatMessage => ({
  id: m.id,
  role: m.role === 'user' ? 'user' : 'assistant',
  content: m.content,
  status: 'done',
  actions: m.actions,
});

const sameActivity = (a: BackgroundActivity[], b: BackgroundActivity[]) =>
  a.length === b.length &&
  a.every(
    (item, i) =>
      item.key === b[i].key &&
      item.status === b[i].status &&
      item.documentTitle === b[i].documentTitle,
  );

class EditorAssistantService {
  private sessions = new Map<string, EditorSession>();
  private controllers = new Map<string, AbortController>();
  private mounts = new Map<string, number>();
  private listeners = new Set<() => void>();
  private activity: BackgroundActivity[] = [];

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /** The session for a document (created empty on first use). */
  getSession = (key: string): EditorSession => {
    let session = this.sessions.get(key);
    if (!session) {
      session = createSession(key);
      this.sessions.set(key, session);
    }
    return session;
  };

  getBackgroundActivity = (): BackgroundActivity[] => this.activity;

  isMounted(key: string) {
    return (this.mounts.get(key) ?? 0) > 0;
  }

  private emit() {
    const next = [...this.sessions.values()]
      .filter(
        (s) =>
          s.workspaceId &&
          !this.isMounted(s.key) &&
          (s.isStreaming || s.unseen),
      )
      .map((s) => ({
        key: s.key,
        workspaceId: s.workspaceId as string,
        documentTitle: s.documentTitle,
        status: s.isStreaming ? ('writing' as const) : ('done' as const),
      }));
    if (!sameActivity(next, this.activity)) this.activity = next;
    this.listeners.forEach((listener) => listener());
  }

  private set(
    key: string,
    patch:
      | Partial<EditorSession>
      | ((s: EditorSession) => Partial<EditorSession>),
  ) {
    const current = this.getSession(key);
    const changes = typeof patch === 'function' ? patch(current) : patch;
    this.sessions.set(key, { ...current, ...changes });
    this.emit();
  }

  private patchMessage(
    key: string,
    id: string,
    patch: Partial<EditorChatMessage>,
  ) {
    this.set(key, (s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  }

  /* ── The editor showing this document ─────────────────────────────── */

  /** Registers an open editor for the document; returns its cleanup. */
  mount(key: string) {
    this.mounts.set(key, (this.mounts.get(key) ?? 0) + 1);
    const session = this.getSession(key);
    if (session.unseen && session.isOpen) this.set(key, { unseen: false });
    else this.emit();

    return () => {
      const count = (this.mounts.get(key) ?? 1) - 1;
      if (count > 0) this.mounts.set(key, count);
      else this.mounts.delete(key);
      const s = this.getSession(key);
      // The editor (and its diff) is gone: offer the change again on return.
      if (count <= 0 && s.activeReview) {
        this.set(key, { pendingReview: s.activeReview, activeReview: null });
      } else {
        this.emit();
      }
    };
  }

  setDocumentTitle(key: string, title: string) {
    if (this.getSession(key).documentTitle !== title) {
      this.set(key, { documentTitle: title });
    }
  }

  setOpen(key: string, isOpen: boolean) {
    const session = this.getSession(key);
    if (!isOpen && session.activeReview) return;
    this.set(key, isOpen ? { isOpen, unseen: false } : { isOpen });
    if (isOpen) void this.loadLatest(key);
  }

  setDraft(key: string, draft: string) {
    this.set(key, { draft });
  }

  dismissActivity(key: string) {
    this.set(key, { unseen: false });
  }

  /* ── History ──────────────────────────────────────────────────────── */

  /** The document's most recent thread, once per session. */
  async loadLatest(key: string) {
    const session = this.getSession(key);
    if (!session.workspaceId || session.historyStatus !== 'idle') return;
    this.set(key, { historyStatus: 'loading' });
    try {
      const { conversationId, messages } = await fetchEditorConversation(
        session.workspaceId,
      );
      // A message sent while loading stays after the restored ones.
      this.set(key, (s) => ({
        conversationId: s.conversationId ?? conversationId,
        messages: s.conversationId
          ? s.messages
          : [...messages.map(fromServer), ...s.messages],
        historyStatus: 'loaded',
      }));
    } catch (e) {
      console.warn('Could not load the editor conversation:', e);
      this.set(key, { historyStatus: 'loaded' });
    }
  }

  async loadConversations(key: string) {
    const session = this.getSession(key);
    if (!session.workspaceId) return;
    this.set(key, { conversationsStatus: 'loading' });
    try {
      const conversations = await fetchEditorConversations(session.workspaceId);
      this.set(key, { conversations, conversationsStatus: 'loaded' });
    } catch (e) {
      console.warn('Could not load the editor conversations:', e);
      this.set(key, { conversationsStatus: 'error' });
    }
  }

  async openConversation(key: string, conversationId: string) {
    const session = this.getSession(key);
    if (session.isStreaming || session.activeReview) return;
    if (session.conversationId === conversationId) return;
    this.set(key, {
      conversationId,
      messages: [],
      historyStatus: 'loading',
      pendingReview: null,
    });
    try {
      const messages = await getAIConversationMessages(conversationId);
      this.set(key, (s) =>
        s.conversationId === conversationId
          ? { messages: messages.map(fromServer), historyStatus: 'loaded' }
          : {},
      );
    } catch (e) {
      this.set(key, { historyStatus: 'loaded' });
      sileo.error({
        title: i18n.t('editorAI.history.loadError'),
        description: getFriendlyErrorMessage(
          e,
          i18n.t('editorAI.errors.retry'),
        ),
        fill: 'var(--sileo-error-bg)',
      });
    }
  }

  newConversation(key: string) {
    if (this.getSession(key).activeReview) return;
    this.controllers.get(key)?.abort();
    this.set(key, {
      conversationId: null,
      messages: [],
      historyStatus: 'loaded',
      pendingReview: null,
    });
  }

  async deleteConversation(key: string, conversationId: string) {
    try {
      await deleteAIConversation(conversationId);
    } catch (e) {
      sileo.error({
        title: i18n.t('editorAI.history.deleteError'),
        description: getFriendlyErrorMessage(
          e,
          i18n.t('editorAI.errors.retry'),
        ),
        fill: 'var(--sileo-error-bg)',
      });
      return;
    }
    this.set(key, (s) => ({
      conversations: s.conversations.filter((c) => c.id !== conversationId),
    }));
    if (this.getSession(key).conversationId === conversationId) {
      this.newConversation(key);
    }
  }

  /* ── Asking ───────────────────────────────────────────────────────── */

  async send(
    key: string,
    {
      content,
      target = null,
      documentText,
    }: {
      content: string;
      target?: FragmentTarget | null;
      documentText: string;
    },
  ) {
    const session = this.getSession(key);
    if (
      !content.trim() ||
      session.isStreaming ||
      session.activeReview ||
      session.pendingReview
    ) {
      return;
    }

    const question: EditorChatMessage = {
      id: newId(),
      role: 'user',
      content,
      status: 'done',
      target,
    };
    const reply: EditorChatMessage = {
      id: newId(),
      role: 'assistant',
      content: '',
      status: 'streaming',
    };
    const history = [...session.messages, question]
      .filter((m) => m.content && m.status !== 'error')
      .map((m) => ({
        role: m.role,
        content: historyContent(m.role, m.content),
      }));

    this.set(key, (s) => ({
      messages: [...s.messages, question, reply],
      isStreaming: true,
      unseen: false,
    }));
    const controller = new AbortController();
    this.controllers.set(key, controller);

    try {
      const result = await streamEditorAssistant({
        messages: history,
        documentText,
        workspaceId: session.workspaceId,
        conversationId: session.conversationId,
        conversationTitle: i18n.t('editorAI.conversationTitle', {
          title: session.documentTitle.trim() || i18n.t('editorAI.untitled'),
        }),
        signal: controller.signal,
        onText: (partial) =>
          this.patchMessage(key, reply.id, { content: partial }),
      });

      const outcome = replyOutcome(reply.id, result.text, target, documentText);
      this.set(key, (s) => ({
        conversationId: result.conversationId,
        isStreaming: false,
        // The list shows this thread first now; refetch it when next opened.
        conversationsStatus: 'idle',
        unseen: !this.isMounted(key) || !s.isOpen,
        pendingReview: outcome.kind === 'review' ? outcome.review : null,
        messages: s.messages.map((m) =>
          m.id === reply.id
            ? {
                ...m,
                content: result.text,
                status: 'done',
                unappliedFragment:
                  outcome.kind === 'fragment' ? outcome.fragment : null,
              }
            : m,
        ),
      }));
    } catch (e) {
      const stopped = controller.signal.aborted;
      if (isPlanLimitError(e)) {
        // Free plan: the editor assistant is Pro. Drop the unanswered turn.
        this.set(key, (s) => ({
          isStreaming: false,
          messages: s.messages.filter(
            (m) => m.id !== reply.id && m.id !== question.id,
          ),
        }));
        billingService.openUpgrade('editor');
        return;
      }
      if (!stopped) console.error('Editor assistant failed:', e);
      this.set(key, (s) => ({
        isStreaming: false,
        messages: s.messages.map((m) =>
          m.id === reply.id
            ? { ...m, status: stopped ? 'stopped' : 'error' }
            : m,
        ),
      }));
      if (!stopped) {
        sileo.error({
          title: i18n.t('editorAI.errors.title'),
          description: getFriendlyErrorMessage(
            e,
            i18n.t('editorAI.errors.retry'),
          ),
          fill: 'var(--sileo-error-bg)',
        });
      }
    } finally {
      if (this.controllers.get(key) === controller)
        this.controllers.delete(key);
    }
  }

  stop(key: string) {
    this.controllers.get(key)?.abort();
  }

  /** Sends the last question again in place of its reply. */
  retry(key: string, currentDoc: string) {
    const session = this.getSession(key);
    if (session.isStreaming || session.activeReview || session.pendingReview)
      return;
    const lastQuestion = session.messages
      .map((m) => m.role)
      .lastIndexOf('user');
    if (lastQuestion === -1) return;
    const question = session.messages[lastQuestion];
    // The fragment still lands only if the document hasn't changed since.
    const target =
      question.target && question.target.doc === currentDoc
        ? question.target
        : null;
    this.set(key, { messages: session.messages.slice(0, lastQuestion) });
    void this.send(key, {
      content: question.content,
      target,
      documentText: currentDoc,
    });
  }

  /* ── Reviewing a change in the editor ─────────────────────────────── */

  /** The pending change is now shown as a diff. */
  beginReview(key: string) {
    this.set(key, (s) => ({
      activeReview: s.pendingReview,
      pendingReview: null,
    }));
  }

  /** The pending change no longer fits the document: offer it by hand. */
  deferReview(key: string) {
    const review = this.getSession(key).pendingReview;
    if (!review) return;
    this.set(key, (s) => ({
      pendingReview: null,
      messages: s.messages.map((m) =>
        m.id === review.messageId
          ? review.fragment !== null
            ? { ...m, unappliedFragment: review.fragment }
            : { ...m, unappliedEdit: review.proposedDoc }
          : m,
      ),
    }));
  }

  /** The user asked to review an edit that didn't open automatically. */
  startManualReview(key: string, messageId: string, baseDoc: string) {
    const message = this.getSession(key).messages.find(
      (m) => m.id === messageId,
    );
    if (!message?.unappliedEdit) return;
    this.set(key, (s) => ({
      activeReview: {
        messageId,
        proposedDoc: message.unappliedEdit as string,
        baseDoc,
        fragment: null,
      },
      messages: s.messages.map((m) =>
        m.id === messageId ? { ...m, unappliedEdit: null } : m,
      ),
    }));
  }

  finishReview(key: string) {
    this.set(key, { activeReview: null });
  }

  /** Tests only: forget every session. */
  reset() {
    this.controllers.forEach((c) => c.abort());
    this.controllers.clear();
    this.sessions.clear();
    this.mounts.clear();
    this.activity = [];
    this.listeners.forEach((listener) => listener());
  }
}

export const editorAssistantService = new EditorAssistantService();
