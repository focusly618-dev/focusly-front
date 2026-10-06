import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

const api = vi.hoisted(() => ({ streamEditorAssistant: vi.fn() }));
vi.mock('@/api/AI/editorAssistant', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/AI/editorAssistant')>()),
  streamEditorAssistant: api.streamEditorAssistant,
  fetchEditorConversation: vi
    .fn()
    .mockResolvedValue({ conversationId: null, messages: [] }),
}));
vi.mock('@/api/AI/apiAI', () => ({
  getAIConversationMessages: vi.fn(),
  deleteAIConversation: vi.fn(),
}));
vi.mock('@/utils', () => ({
  notify: { success: vi.fn(), error: vi.fn() },
  getFriendlyErrorMessage: (_e: unknown, fallback: string) => fallback,
}));
vi.mock('@/components/ui', () => ({
  LuminaAnimatedFace: () => <span data-testid="lumina-face" />,
}));
vi.mock('@/i18n', () => ({ default: { t: (key: string) => key } }));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'es' } }),
}));

const { editorAssistantService: service } =
  await import('@/services/editorAssistantService');
const { EditorAIBackgroundIndicator } =
  await import('@/components/AI/EditorAIBackgroundIndicator');

const LocationProbe = () => {
  const location = useLocation();
  return (
    <div data-testid="location">{`${location.pathname}${location.search}`}</div>
  );
};

const renderIndicator = () =>
  render(
    <MemoryRouter initialEntries={['/profile/account']}>
      <Routes>
        <Route path="*" element={<LocationProbe />} />
      </Routes>
      <EditorAIBackgroundIndicator />
    </MemoryRouter>,
  );

describe('EditorAIBackgroundIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service.reset();
  });

  it('shows nothing when no editor reply is running elsewhere', () => {
    renderIndicator();
    expect(
      screen.queryByText('editorAI.background.writing'),
    ).not.toBeInTheDocument();
  });

  it('shows a reply still writing, then done, and takes you back to the document', async () => {
    let finish: (text: string) => void = () => {};
    api.streamEditorAssistant.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = (text) => resolve({ text, conversationId: 'c' });
        }),
    );
    service.setDocumentTitle('ws-1', 'Plan');
    renderIndicator();

    let pending: Promise<void> = Promise.resolve();
    act(() => {
      pending = service.send('ws-1', {
        content: 'Resume',
        documentText: 'Doc',
      });
    });
    expect(screen.getByText('editorAI.background.writing')).toBeInTheDocument();

    await act(async () => {
      finish('Listo');
      await pending;
    });
    expect(screen.getByText('editorAI.background.done')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: 'editorAI.background.open' }),
    );

    expect(screen.getByTestId('location').textContent).toBe(
      '/dashboard?tab=Projects&workspaceId=ws-1',
    );
    expect(service.getSession('ws-1').isOpen).toBe(true);
  });

  it('a finished notice can be dismissed', async () => {
    api.streamEditorAssistant.mockResolvedValue({
      text: 'Ok',
      conversationId: 'c',
    });
    renderIndicator();
    await act(async () => {
      await service.send('ws-1', { content: 'Hola', documentText: 'Doc' });
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'editorAI.background.dismiss' }),
    );

    expect(
      screen.queryByText('editorAI.background.done'),
    ).not.toBeInTheDocument();
  });
});
