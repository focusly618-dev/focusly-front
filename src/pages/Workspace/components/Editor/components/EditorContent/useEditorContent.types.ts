import type { RefObject } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { WorkspaceFormData } from '@/pages/Workspace/types/workspace.types';
import type { HeaderColor } from '@/utils';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';

export interface UseEditorContentProps {
  setValue?: UseFormSetValue<WorkspaceFormData>;
  watch?: UseFormWatch<WorkspaceFormData>;
  markdownEditorRef: RefObject<MarkdownEditorRef | null>;
}

export interface UseEditorContentReturn {
  menuAnchor: { mouseX: number; mouseY: number } | null;
  setMenuAnchor: (anchor: { mouseX: number; mouseY: number } | null) => void;
  selectedText: string;
  setSelectedText: (text: string) => void;
  colorAnchor: HTMLElement | null;
  setColorAnchor: (anchor: HTMLElement | null) => void;
  iconAnchor: HTMLElement | null;
  setIconAnchor: (anchor: HTMLElement | null) => void;
  headerColor: HeaderColor;
  headerIcon: string;
  currentBgGradient: string;
  hasCover: boolean;
  handleColorClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleIconClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleColorSelect: (color: HeaderColor) => void;
  handleIconSelect: (iconName: string) => void;
  handleContextMenu: (event: React.MouseEvent) => void;
  handleClose: () => void;
  getLanguageLabel: (code: string) => string;
  handleCreateTask: () => void;
  processTextWithAI: (action: string) => Promise<void>;
  isAIProcessing: boolean;
}
