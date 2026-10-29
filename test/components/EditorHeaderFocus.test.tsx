import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';

vi.mock('@/i18n', () => ({ default: { t: (key: string) => key } }));
vi.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: () => {} },
  useTranslation: () => ({
    t: (key: string, fallback?: string | { defaultValue?: string }) =>
      typeof fallback === 'string' ? fallback : (fallback?.defaultValue ?? key),
    i18n: { language: 'en' },
  }),
}));
vi.mock('@/utils', () => ({ notify: { error: vi.fn(), success: vi.fn() } }));

const { EditorHeader } =
  await import('@/pages/Workspace/components/Editor/components/EditorHeader/EditorHeader');

const task = { id: 't1', title: 'Write the report' };

const renderHeader = () => {
  const onStartFocus = vi.fn();
  render(
    <EditorHeader
      onBack={vi.fn()}
      sourceLanguage="auto"
      setSourceLanguage={vi.fn()}
      targetLanguage="en"
      setTargetLanguage={vi.fn()}
      currentTitle="Notes"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      selectTask={task as any}
      onStartFocus={onStartFocus}
      onToggleCentered={vi.fn()}
    />,
  );
  return { onStartFocus };
};

describe('EditorHeader focus', () => {
  it('starts a focus session on the linked task from a visible button', () => {
    const { onStartFocus } = renderHeader();

    const focus = screen.getByRole('button', { name: 'Focus' });
    fireEvent.click(focus);

    expect(onStartFocus).toHaveBeenCalledWith(task);
  });

  it('no longer hides Focus Mode in the "…" menu', () => {
    renderHeader();
    const buttons = screen.getAllByRole('button');
    const more = buttons.find((b) =>
      b.querySelector('[data-testid="MoreHorizIcon"]'),
    );
    fireEvent.click(more!);

    const menu = screen.getByRole('menu');
    expect(within(menu).queryByText(/Focus Mode/i)).toBeNull();
    expect(within(menu).getByText('Import Document')).toBeInTheDocument();
  });
});
