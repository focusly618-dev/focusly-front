import type { RefObject } from 'react';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { WorkspaceFormData } from '@/pages/Workspace/workspace.types';
import type { HeaderColor } from '@/utils';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';
import type { AITaskPreviewData } from '../AITaskPreviewModal/AITaskPreviewModal';
import type { CanvasView } from '../../useCanvasView.hook';

export interface UseEditorContentProps {
  setValue?: UseFormSetValue<WorkspaceFormData>;
  watch?: UseFormWatch<WorkspaceFormData>;
  markdownEditorRef: RefObject<MarkdownEditorRef | null>;
  canvasView: CanvasView;
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
  handleGenerateCanvasPage: () => void;
  /** The create-canvas popover's starting name and where it opens (under the
   * selected text); null while it's closed. */
  canvasDraft: { name: string; anchor: { top: number; left: number } } | null;
  isCreatingCanvas: boolean;
  handleCancelCanvasDraft: () => void;
  handleCreateCanvas: (name: string, icon: string) => Promise<void>;
  processTextWithAI: (action: string) => Promise<void>;
  isAIProcessing: boolean;
  aiTaskPreviewData: AITaskPreviewData | null;
  isAITaskPreviewOpen: boolean;
  setIsAITaskPreviewOpen: (open: boolean) => void;
  handleConfirmAITask: (finalData: AITaskPreviewData) => Promise<void>;
  isCreatingTask: boolean;
}
