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
import { livePreviewExtensions } from './livePreview';
import { imagePasteExtension } from './imagePaste';
import { diffReviewExtensions } from './diffReview';

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
  keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
  EditorView.lineWrapping,
  markdownExtension,
  editorThemeCompartment.of(initialEditorTheme),
  highlightCompartment.of(syntaxHighlighting(initialHighlightStyle)),
  ...livePreviewExtensions,
  imagePasteExtension,
  ...diffReviewExtensions,
  ...(placeholder ? [placeholderExt(placeholder)] : []),
];
