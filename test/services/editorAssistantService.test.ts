import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  EDIT_PROPOSAL_END,
  EDIT_PROPOSAL_START,
  REPLACEMENT_END,
  REPLACEMENT_START,
} from '@/api/AI/editorAssistant';

const api = vi.hoisted(() => ({
  streamEditorAssistant: vi.fn(),
  fetchEditorConversation: vi.fn(),
  fetchEditorConversations: vi.fn(),
  getAIConversationMessages: vi.fn(),
  deleteAIConversation: vi.fn(),
}));
vi.mock('@/api/AI/editorAssistant', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/AI/editorAssistant')>()),
  streamEditorAssistant: api.streamEditorAssistant,
  fetchEditorConversation: api.fetchEditorConversation,
  fetchEditorConversations: api.fetchEditorConversations,
}));
vi.mock('@/api/AI/apiAI', () => ({
  getAIConversationMessages: api.getAIConversationMessages,
  deleteAIConversation: api.deleteAIConversation,
}));
// The real '@/utils' builds an AudioContext, which jsdom doesn't have.
vi.mock('@/utils', () => ({
  notify: { success: vi.fn(), error: vi.fn() },
  getFriendlyErrorMessage: (_e: unknown, fallback: string) => fallback,
}));
vi.mock('@/i18n', () => ({
  default: { t: (key: string) => key },
}));

const { editorAssistantService: service } =
  await import('@/services/editorAssistantService');

const KEY = 'ws-1';
const DOC = 'Hola mundo cruel.';

/** A stream the test finishes by hand. */
const controllableStream = () => {
  let finish: (text: string) => void = () => {};
  api.streamEditorAssistant.mockImplementation(
    ({ onText }: { onText: (t: string) => void }) =>
      new Promise((resolve) => {
        onText('Escribiendo');
        finish = (text) => resolve({ text, conversationId: 'conv-1' });
      }),
  );
  return (text: string) => finish(text);
};

describe('editorAssistantService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service.reset();
    api.fetchEditorConversation.mockResolvedValue({
      conversationId: null,
      messages: [],
    });
  });

  it('keeps streaming with no editor on screen and reports it as background work', async () => {
    const finish = controllableStream();
    service.setDocumentTitle(KEY, 'Plan');

    const pending = service.send(KEY, { content: 'Resume', documentText: DOC });

    expect(service.getSession(KEY).isStreaming).toBe(true);
    expect(service.getBackgroundActivity()).toEqual([
      { key: KEY, workspaceId: KEY, documentTitle: 'Plan', status: 'writing' },
    ]);

    finish('Es un plan.');
    await pending;

    const session = service.getSession(KEY);
    expect(session.isStreaming).toBe(false);
    expect(session.unseen).toBe(true);
    expect(session.conversationId).toBe('conv-1');
    expect(service.getBackgroundActivity()[0].status).toBe('done');
  });

  it('work on the open document is not background work', async () => {
    const finish = controllableStream();
    const unmount = service.mount(KEY);
    service.setOpen(KEY, true);

    const pending = service.send(KEY, { content: 'Resume', documentText: DOC });
    expect(service.getBackgroundActivity()).toEqual([]);
    finish('Listo.');
    await pending;

    expect(service.getSession(KEY).unseen).toBe(false);
    unmount();
  });

  it('coming back to the document clears the "done" notice', async () => {
    api.streamEditorAssistant.mockResolvedValue({
      text: 'Ok',
      conversationId: 'c',
    });
    service.setOpen(KEY, true);
    await service.send(KEY, { content: 'Hola', documentText: DOC });
    expect(service.getBackgroundActivity()).toHaveLength(1);

    const unmount = service.mount(KEY);
    expect(service.getBackgroundActivity()).toEqual([]);
    expect(service.getSession(KEY).unseen).toBe(false);
    unmount();
  });

  it('an edit that finishes away waits for review on its base document', async () => {
    api.streamEditorAssistant.mockResolvedValue({
      text: `Corregido.\n${EDIT_PROPOSAL_START}\nHola mundo.\n${EDIT_PROPOSAL_END}`,
      conversationId: 'c',
    });

    await service.send(KEY, { content: 'Corrige', documentText: DOC });

    expect(service.getSession(KEY).pendingReview).toMatchObject({
      proposedDoc: 'Hola mundo.',
      baseDoc: DOC,
      fragment: null,
    });
  });

  it('a fragment reply is reviewed as the whole document with the fragment swapped', async () => {
    api.streamEditorAssistant.mockResolvedValue({
      text: `Más claro.\n${REPLACEMENT_START}\nplaneta\n${REPLACEMENT_END}`,
      conversationId: 'c',
    });

    await service.send(KEY, {
      content: 'Mejora',
      target: { doc: DOC, from: 5, to: 10 },
      documentText: DOC,
    });

    expect(service.getSession(KEY).pendingReview).toMatchObject({
      proposedDoc: 'Hola planeta cruel.',
      baseDoc: DOC,
      fragment: 'planeta',
    });
  });

  it('leaving mid-review offers the change again on return', () => {
    service.getSession(KEY);
    const unmount = service.mount(KEY);
    // Simulate an active review.
    (service as unknown as { sessions: Map<string, object> }).sessions.set(
      KEY,
      {
        ...service.getSession(KEY),
        pendingReview: {
          messageId: 'm',
          proposedDoc: 'x',
          baseDoc: DOC,
          fragment: null,
        },
      },
    );
    service.beginReview(KEY);
    expect(service.getSession(KEY).activeReview).not.toBeNull();

    unmount();

    expect(service.getSession(KEY).activeReview).toBeNull();
    expect(service.getSession(KEY).pendingReview?.proposedDoc).toBe('x');
  });

  it('a change that no longer fits is offered by hand', async () => {
    api.streamEditorAssistant.mockResolvedValue({
      text: `Hecho.\n${REPLACEMENT_START}\nplaneta\n${REPLACEMENT_END}`,
      conversationId: 'c',
    });
    await service.send(KEY, {
      content: 'Mejora',
      target: { doc: DOC, from: 5, to: 10 },
      documentText: DOC,
    });

    service.deferReview(KEY);

    const session = service.getSession(KEY);
    expect(session.pendingReview).toBeNull();
    expect(session.messages.at(-1)?.unappliedFragment).toBe('planeta');
  });

  it('stop keeps what streamed so far', async () => {
    api.streamEditorAssistant.mockImplementation(
      ({
        onText,
        signal,
      }: {
        onText: (t: string) => void;
        signal: AbortSignal;
      }) =>
        new Promise((_resolve, reject) => {
          onText('Empiezo a');
          signal.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          );
        }),
    );

    const pending = service.send(KEY, { content: 'Resume', documentText: DOC });
    service.stop(KEY);
    await pending;

    expect(service.getSession(KEY).messages.at(-1)).toMatchObject({
      content: 'Empiezo a',
      status: 'stopped',
    });
  });

  it('retry replaces the last reply and keeps using the thread', async () => {
    api.streamEditorAssistant
      .mockResolvedValueOnce({ text: 'Primera', conversationId: 'conv-1' })
      .mockResolvedValueOnce({ text: 'Segunda', conversationId: 'conv-1' });
    await service.send(KEY, { content: 'Resume', documentText: DOC });

    service.retry(KEY, DOC);
    await vi.waitFor(() =>
      expect(service.getSession(KEY).isStreaming).toBe(false),
    );

    expect(service.getSession(KEY).messages.map((m) => m.content)).toEqual([
      'Resume',
      'Segunda',
    ]);
    expect(api.streamEditorAssistant.mock.calls[1][0].conversationId).toBe(
      'conv-1',
    );
  });

  it('opening the panel restores the latest thread only once', async () => {
    api.fetchEditorConversation.mockResolvedValue({
      conversationId: 'conv-7',
      messages: [{ id: 'm1', role: 'user', content: 'Hola', createdAt: '' }],
    });

    service.setOpen(KEY, true);
    await vi.waitFor(() =>
      expect(service.getSession(KEY).historyStatus).toBe('loaded'),
    );
    service.setOpen(KEY, false);
    service.setOpen(KEY, true);

    expect(api.fetchEditorConversation).toHaveBeenCalledTimes(1);
    expect(service.getSession(KEY).conversationId).toBe('conv-7');
  });

  it('lists, opens and deletes the document chats', async () => {
    api.fetchEditorConversations.mockResolvedValue([
      {
        id: 'c1',
        title: '📝 Plan',
        preview: 'Hola',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'c2',
        title: '📝 Plan',
        preview: 'Adiós',
        createdAt: '',
        updatedAt: '',
      },
    ]);
    api.getAIConversationMessages.mockResolvedValue([
      { id: 'm1', role: 'user', content: 'Adiós', createdAt: '' },
      { id: 'm2', role: 'assistant', content: 'Bye', createdAt: '' },
    ]);
    api.deleteAIConversation.mockResolvedValue({ status: 'ok' });

    await service.loadConversations(KEY);
    expect(service.getSession(KEY).conversations).toHaveLength(2);

    await service.openConversation(KEY, 'c2');
    expect(service.getSession(KEY).conversationId).toBe('c2');
    expect(service.getSession(KEY).messages.map((m) => m.content)).toEqual([
      'Adiós',
      'Bye',
    ]);

    await service.deleteConversation(KEY, 'c2');
    const session = service.getSession(KEY);
    expect(session.conversations.map((c) => c.id)).toEqual(['c1']);
    // The open thread was the deleted one: start fresh.
    expect(session.conversationId).toBeNull();
    expect(session.messages).toEqual([]);
  });

  it('an unsaved document never shows up as background work', async () => {
    api.streamEditorAssistant.mockResolvedValue({
      text: 'Ok',
      conversationId: null,
    });
    await service.send('unsaved', { content: 'Hola', documentText: DOC });

    expect(api.streamEditorAssistant.mock.calls[0][0].workspaceId).toBeNull();
    expect(service.getBackgroundActivity()).toEqual([]);
  });
});
