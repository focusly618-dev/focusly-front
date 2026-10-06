import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { MarkdownEditorRef } from '@/pages/Workspace/components/Editor/codemirror/MarkdownEditor.types';

const api = vi.hoisted(() => ({
  fetchEditorConversation: vi.fn(),
  fetchEditorConversations: vi.fn(),
}));
vi.mock('@/api/AI/editorAssistant', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/AI/editorAssistant')>()),
  fetchEditorConversation: api.fetchEditorConversation,
  fetchEditorConversations: api.fetchEditorConversations,
  streamEditorAssistant: vi.fn(),
}));
vi.mock('@/api/AI/apiAI', () => ({
  getAIConversationMessages: vi.fn(),
  deleteAIConversation: vi.fn(),
}));
vi.mock('@/utils', () => ({
  sileo: { success: vi.fn(), error: vi.fn() },
  getFriendlyErrorMessage: (_e: unknown, fallback: string) => fallback,
}));
vi.mock('@/components/ui', () => ({
  LuminaAnimatedFace: () => <span data-testid="lumina-face" />,
}));
vi.mock('@/i18n', () => ({ default: { t: (key: string) => key } }));
const billing = vi.hoisted(() => ({ isPro: true, openUpgrade: vi.fn() }));
vi.mock('@/hooks/useBilling', () => ({ useBilling: () => billing }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'es' } }),
}));

const { editorAssistantService } =
  await import('@/services/editorAssistantService');
const { EditorAskAI } =
  await import('@/pages/Workspace/components/Editor/components/EditorAskAI/EditorAskAI');

const editorRef = {
  current: {
    getValue: () => 'Hola mundo',
    getSelection: () => ({ text: '', from: 0, to: 0 }),
  } as unknown as MarkdownEditorRef,
};

const renderAssistant = (selectedText = '') =>
  render(
    <EditorAskAI
      markdownEditorRef={editorRef}
      selectedText={selectedText}
      workspaceId="ws-1"
      documentTitle="Plan"
    />,
  );

const openPanel = async () => {
  fireEvent.click(screen.getByRole('button', { name: /editorAI.launcher/ }));
  return screen.findByRole('dialog');
};

describe('EditorAskAI', () => {
  beforeEach(() => {
    billing.isPro = true;
    billing.openUpgrade.mockClear();
    editorAssistantService.reset();
    api.fetchEditorConversation.mockResolvedValue({
      conversationId: null,
      messages: [],
    });
    api.fetchEditorConversations.mockResolvedValue([]);
  });

  it('starts as a launcher and opens the panel', async () => {
    renderAssistant();
    await openPanel();

    expect(screen.getByText('editorAI.empty.title')).toBeInTheDocument();
    expect(api.fetchEditorConversation).toHaveBeenCalledWith('ws-1');
  });

  it('offers document actions without a selection', async () => {
    renderAssistant();
    await openPanel();

    expect(
      screen.getByText('editorAI.actions.extractTasks.label'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('editorAI.actions.improve.label'),
    ).not.toBeInTheDocument();
  });

  it('offers selection actions and shows the attached selection', async () => {
    renderAssistant('mundo');
    await openPanel();

    expect(
      screen.getByText('editorAI.actions.improve.label'),
    ).toBeInTheDocument();
    expect(screen.getByText('editorAI.selection.attached')).toBeInTheDocument();
  });

  it('lists the document chats and goes back to the chat', async () => {
    api.fetchEditorConversations.mockResolvedValue([
      {
        id: 'c1',
        title: '📝 Plan',
        preview: 'Resume el plan',
        createdAt: '2026-10-02T12:00:00',
        updatedAt: '2026-10-02T12:00:00',
      },
    ]);
    renderAssistant();
    await openPanel();

    fireEvent.click(
      screen.getByRole('button', { name: 'editorAI.history.open' }),
    );

    expect(await screen.findByText('Resume el plan')).toBeInTheDocument();
    expect(api.fetchEditorConversations).toHaveBeenCalledWith('ws-1');

    fireEvent.click(
      screen.getByRole('button', { name: 'editorAI.history.back' }),
    );
    expect(screen.getByText('editorAI.empty.title')).toBeInTheDocument();
  });

  it('minimizes back to the launcher', async () => {
    renderAssistant();
    await openPanel();
    fireEvent.click(
      screen.getByRole('button', { name: 'editorAI.header.minimize' }),
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('on the free plan, offers Pro instead of the input', async () => {
    billing.isPro = false;
    renderAssistant();
    await openPanel();

    expect(screen.getByText('billing.editorGate.title')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(
      screen.queryByText('editorAI.actions.extractTasks.label'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('billing.editorGate.cta'));
    expect(billing.openUpgrade).toHaveBeenCalledWith('editor');
  });
});
