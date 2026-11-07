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
import {
  buildSlashMenuExtension,
  type CreateCanvasFromSlash,
} from './slashMenu';
import { htmlPasteExtension } from './htmlPaste';
import { markupEditingExtensions } from './markupEditing';

export interface BuildMarkdownExtensionsOptions {
  editorThemeCompartment: Compartment;
  highlightCompartment: Compartment;
  initialEditorTheme: Extension;
  initialHighlightStyle: HighlightStyle;
  placeholder?: string;
  onCreateCanvas?: CreateCanvasFromSlash;
}

export const buildMarkdownExtensions = ({
  editorThemeCompartment,
  highlightCompartment,
  initialEditorTheme,
  initialHighlightStyle,
  placeholder,
  onCreateCanvas,
}: BuildMarkdownExtensionsOptions): Extension[] => [
  history(),
  // Before the defaults: Cmd/Ctrl+B, I... format instead of their defaults
  formattingKeymap,
  ...markupEditingExtensions,
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
  buildSlashMenuExtension(onCreateCanvas),
  ...canvasDropExtension,
  ...diffReviewExtensions,
  ...targetHighlightExtension,
  ...(placeholder ? [placeholderExt(placeholder)] : []),
];
