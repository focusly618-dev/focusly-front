import { describe, it, expect, vi } from 'vitest';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}));

const { FontStylePicker } =
  await import('@/pages/Workspace/components/Editor/components/EditorHeader/components/FontStylePicker/FontStylePicker');
const { editorFontVars, toEditorFontStyle, useEditorFontStyle } =
  await import('@/pages/Workspace/components/Editor/editorFonts');

describe('FontStylePicker', () => {
  it('marks the note style and picks another', () => {
    const onChange = vi.fn();
    render(<FontStylePicker value="default" onChange={onChange} />);

    expect(screen.getByRole('radio', { name: /Default/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    fireEvent.click(screen.getByRole('radio', { name: /Serif/ }));

    expect(onChange).toHaveBeenCalledWith('serif');
  });
});

describe('editor fonts', () => {
  it('reads unknown or unset styles as the default', () => {
    expect(toEditorFontStyle(undefined)).toBe('default');
    expect(toEditorFontStyle('comic')).toBe('default');
    expect(toEditorFontStyle('mono')).toBe('mono');
  });

  it('leaves the default on the app font and sets a face otherwise', () => {
    expect(editorFontVars('default')).not.toHaveProperty(
      '--editor-font-family',
    );
    expect(editorFontVars('serif')['--editor-font-family']).toMatch(
      /Source Serif 4/,
    );
    expect(editorFontVars('mono')['--editor-font-family']).toMatch(
      /JetBrains Mono/,
    );
  });
});

describe('useEditorFontStyle', () => {
  it('remembers the picked style in this browser', () => {
    localStorage.removeItem('editor_font_style');
    const first = renderHook(() => useEditorFontStyle());
    expect(first.result.current.fontStyle).toBe('default');

    act(() => first.result.current.setFontStyle('mono'));
    expect(first.result.current.fontStyle).toBe('mono');

    const reopened = renderHook(() => useEditorFontStyle());
    expect(reopened.result.current.fontStyle).toBe('mono');
    localStorage.removeItem('editor_font_style');
  });
});
