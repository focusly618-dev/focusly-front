import type { Compartment, Extension } from '@codemirror/state';
import {
  EditorView,
  keymap,
  placeholder as placeholderExt,
} from '@codemirror/view';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import { syntaxHighlighting, type HighlightStyle } from '@codemirror/language';
import { markdownExtension } from './markdownLanguage';
import { livePreviewExtensions, imageKeymap } from './livePreview';
import { imagePasteExtension } from './imagePaste';
import { diffReviewExtensions } from './diffReview';
import { targetHighlightExtension } from './targetHighlight';
import { canvasDropExtension } from './canvasDrop';
import { formattingKeymap } from './formatting';
import { slashMenuExtension } from './slashMenu';
import { htmlPasteExtension } from './htmlPaste';

export interface BuildMarkdownExtensionsOptions {
  editorThemeCompartment: Compartment;
  highlightCompartment: Compartment;
  initialEditorTheme: Extension;
  initialHighlightStyle: HighlightStyle;
  placeholder?: string;
}

export const buildMarkdownExtensions = ({
  editorThemeCompartment,
  highlightCompartment,
  initialEditorTheme,
  initialHighlightStyle,
  placeholder,
}: BuildMarkdownExtensionsOptions): Extension[] => [
  history(),
  // Before the defaults: Cmd/Ctrl+B, I... format instead of their defaults
  formattingKeymap,
  keymap.of([
    ...imageKeymap,
    ...defaultKeymap,
    ...historyKeymap,
    indentWithTab,
  ]),
  EditorView.lineWrapping,
  markdownExtension,
  editorThemeCompartment.of(initialEditorTheme),
  highlightCompartment.of(syntaxHighlighting(initialHighlightStyle)),
  ...livePreviewExtensions,
  imagePasteExtension,
  // After images: a paste with image files is theirs
  htmlPasteExtension,
  slashMenuExtension,
  ...canvasDropExtension,
  ...diffReviewExtensions,
  ...targetHighlightExtension,
  ...(placeholder ? [placeholderExt(placeholder)] : []),
];
