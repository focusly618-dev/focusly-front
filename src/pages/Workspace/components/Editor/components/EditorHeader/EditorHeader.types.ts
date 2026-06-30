import type { TaskSearchItems } from '@/pages/Workspace/types/workspace.types';
import type { BlockNoteEditor } from '@blocknote/core';

export interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

export interface ISpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export interface SpeechRecognitionWindow {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

export interface EditorHeaderProps {
  onBack: () => void;
  showPalette: boolean;
  setShowPalette: (b: boolean) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  filteredTasks: TaskSearchItems[];
  selectTask: TaskSearchItems | null;
  handleSelectTask: (task: TaskSearchItems | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: (field: any, value: any) => void;
  saveState?: 'idle' | 'saving' | 'saved';
  editor?: BlockNoteEditor;
  sourceLanguage: string;
  setSourceLanguage: (lang: string) => void;
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  groupId?: string;
}
