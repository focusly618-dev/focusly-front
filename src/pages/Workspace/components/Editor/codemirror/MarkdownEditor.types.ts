export interface MarkdownSelection {
  text: string;
  from: number;
  to: number;
}

export interface MarkdownEditorRef {
  getSelection: () => MarkdownSelection;
  replaceRange: (from: number, to: number, text: string) => void;
  insertAtCursor: (text: string) => void;
  insertAtEnd: (text: string) => void;
  setCursor: (pos: number) => void;
  getValue: () => string;
  focus: () => void;
}

export interface MarkdownEditorProps {
  initialValue: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}
