import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { REPLACEMENT_END, REPLACEMENT_START } from '@/api/AI/editorAssistant';
import type { MarkdownEditorRef } from '@/pages/Workspace/components/Editor/codemirror/MarkdownEditor.types';

const api = vi.hoisted(() => ({
  streamEditorAssistant: vi.fn(),
  fetchEditorConversation: vi.fn(),
}));
vi.mock('@/api/AI/editorAssistant', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/AI/editorAssistant')>()),
  streamEditorAssistant: api.streamEditorAssistant,
  fetchEditorConversation: api.fetchEditorConversation,
  fetchEditorConversations: vi.fn().mockResolvedValue([]),
}));
vi.mock('@/api/AI/apiAI', () => ({
  getAIConversationMessages: vi.fn(),
  deleteAIConversation: vi.fn(),
}));
vi.mock('@/utils', () => ({
  sileo: { success: vi.fn(), error: vi.fn() },
  getFriendlyErrorMessage: (_e: unknown, fallback: string) => fallback,
}));
vi.mock('@/i18n', () => ({ default: { t: (key: string) => key } }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'es' } }),
}));

const { editorAssistantService: service } =
  await import('@/services/editorAssistantService');
const { useEditorAskAI } =
  await import('@/pages/Workspace/components/Editor/components/EditorAskAI/useEditorAskAI.hook');

type Sessions = { sessions: Map<string, object> };

/** Puts a session in a given state, as if a reply had finished earlier. */
const seedSession = (patch: object) => {
  const internals = service as unknown as Sessions;
  internals.sessions.set('ws-1', { ...service.getSession('ws-1'), ...patch });
};

/** A stand-in editor whose document and selection tests can change. */
const makeEditor = (
  doc = 'Hola mundo cruel.',
  selection = { from: 5, to: 10 },
) => {
  const state = { doc, selection };
  const editor = {
    getValue: vi.fn(() => state.doc),
    getSelection: vi.fn(() => ({
      text: state.doc.slice(state.selection.from, state.selection.to),
      ...state.selection,
    })),
    showDiff: vi.fn(),
    resolveDiff: vi.fn(),
    insertAtCursor: vi.fn(),
    replaceRange: vi.fn(),
  };
  return {
    state,
    editor,
    ref: { current: editor as unknown as MarkdownEditorRef },
  };
};

const render = (ref: { current: MarkdownEditorRef }, selectedText = '') =>
  renderHook(() =>
    useEditorAskAI({
      markdownEditorRef: ref,
      workspaceId: 'ws-1',
      documentTitle: 'Plan',
      selectedText,
    }),
  );

describe('useEditorAskAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service.reset();
    api.fetchEditorConversation.mockResolvedValue({
      conversationId: null,
      messages: [],
    });
  });

  it('a selection action sends the fragment and reviews only that fragment', async () => {
    api.streamEditorAssistant.mockResolvedValue({
      text: `Más claro.\n${REPLACEMENT_START}\nplaneta\n${REPLACEMENT_END}`,
      conversationId: 'conv-1',
    });
    const { ref, editor } = makeEditor();
    const { result } = render(ref, 'mundo');

    await act(async () => result.current.runAction('improve'));
    await waitFor(() => expect(editor.showDiff).toHaveBeenCalled());

    const sent =
      api.streamEditorAssistant.mock.calls[0][0].messages.at(-1).content;
    expect(sent).toContain('editorAI.prompts.improve');
    expect(sent).toContain('```selection\nmundo\n```');
    expect(editor.showDiff).toHaveBeenCalledWith('Hola planeta cruel.');
    expect(result.current.hasPendingDiff).toBe(true);

    act(() => result.current.resolveDiff('accept'));
    expect(editor.resolveDiff).toHaveBeenCalledWith('accept');
    expect(result.current.hasPendingDiff).toBe(false);
  });

  it('a reply that finished away goes up for review when the document opens', () => {
    const { ref, editor } = makeEditor();
    seedSession({
      pendingReview: {
        messageId: 'm',
        proposedDoc: 'Hola planeta cruel.',
        baseDoc: 'Hola mundo cruel.',
        fragment: 'planeta',
      },
    });

    const { result } = render(ref);

    expect(editor.showDiff).toHaveBeenCalledWith('Hola planeta cruel.');
    expect(result.current.hasPendingDiff).toBe(true);
  });

  it('…unless the document changed meanwhile: then it is offered by hand', () => {
    const { ref, editor } = makeEditor('Otro texto');
    seedSession({
      messages: [
        { id: 'm', role: 'assistant', content: 'Hecho', status: 'done' },
      ],
      pendingReview: {
        messageId: 'm',
        proposedDoc: 'Hola planeta cruel.',
        baseDoc: 'Hola mundo cruel.',
        fragment: 'planeta',
      },
    });

    const { result } = render(ref);

    expect(editor.showDiff).not.toHaveBeenCalled();
    expect(result.current.messages[0].unappliedFragment).toBe('planeta');
  });

  it('a free-text question sends the attached selection along', async () => {
    api.streamEditorAssistant.mockResolvedValue({
      text: 'Claro',
      conversationId: 'c',
    });
    const { ref } = makeEditor();
    const { result } = render(ref, 'mundo');

    expect(result.current.selectionAttached).toBe(true);
    act(() => result.current.setInputValue('¿Qué significa?'));
    await act(async () => result.current.submit());
    await waitFor(() => expect(result.current.isStreaming).toBe(false));
    expect(
      api.streamEditorAssistant.mock.calls[0][0].messages.at(-1).content,
    ).toContain('```selection\nmundo\n```');

    act(() => result.current.detachSelection());
    act(() => result.current.setInputValue('¿Y en general?'));
    await act(async () => result.current.submit());
    await waitFor(() =>
      expect(api.streamEditorAssistant).toHaveBeenCalledTimes(2),
    );
    expect(
      api.streamEditorAssistant.mock.calls[1][0].messages.at(-1).content,
    ).toBe('¿Y en general?');
  });

  it('Cmd/Ctrl+J toggles the panel', () => {
    const { ref } = makeEditor();
    const { result } = render(ref);

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'j', metaKey: true }),
      );
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'j', ctrlKey: true }),
      );
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('the conversation survives leaving the editor and is there on return', async () => {
    let finish: (text: string) => void = () => {};
    api.streamEditorAssistant.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = (text) => resolve({ text, conversationId: 'c' });
        }),
    );
    const { ref } = makeEditor();
    const first = render(ref);

    act(() => first.result.current.setInputValue('Resume'));
    await act(async () => first.result.current.submit());
    first.unmount();

    expect(service.getBackgroundActivity()[0]?.status).toBe('writing');
    await act(async () => finish('Es un plan.'));
    expect(service.getBackgroundActivity()[0]?.status).toBe('done');

    const second = render(ref);
    expect(second.result.current.messages.map((m) => m.content)).toEqual([
      'Resume',
      'Es un plan.',
    ]);
  });
});
