import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAppSelector } from '@/redux/hooks';
import type {
  UseEditorContentProps,
  UseEditorContentReturn,
} from './useEditorContent.types';
import { colorPalette, type HeaderColor, sileo } from '@/utils';
import { fetchEditResult } from '@/api/AI/apiAI';
import {
  CREATE_TASK,
  GET_TASKS,
  GET_TASKS_TITLES,
} from '@/pages/Tasks/Tasks.graphql';
import { parseDuration } from '@/pages/Home/components/CreateTaskModal/CreateTaskModal.utils';
import type { AITaskPreviewData } from '../AITaskPreviewModal/AITaskPreviewModal';

export const useEditorContent = ({
  setValue,
  watch,
  markdownEditorRef,
}: UseEditorContentProps): UseEditorContentReturn => {
  const [createTaskMutation] = useMutation(CREATE_TASK);
  const { user } = useAppSelector((state) => state.auth);

  const persistedEmoji = watch?.('emoji');
  const persistedBg = watch?.('background_color');

  const [menuAnchor, setMenuAnchor] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [selectedRange, setSelectedRange] = useState<{
    from: number;
    to: number;
  } | null>(null);
  const [colorAnchor, setColorAnchor] = useState<null | HTMLElement>(null);
  const [iconAnchor, setIconAnchor] = useState<null | HTMLElement>(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  const [aiTaskPreviewData, setAiTaskPreviewData] =
    useState<AITaskPreviewData | null>(null);
  const [isAITaskPreviewOpen, setIsAITaskPreviewOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const headerColor: HeaderColor =
    (persistedBg as HeaderColor | undefined) ?? 'none';
  const headerIcon: string = persistedEmoji ?? '';

  const currentBgGradient =
    colorPalette.find((c) => c.color === headerColor)?.gradient || 'none';
  const hasCover = headerColor !== 'none';

  const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchor(event.currentTarget);
  };

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setIconAnchor(event.currentTarget);
  };

  const handleColorSelect = (color: HeaderColor) => {
    setValue?.('background_color', color === 'none' ? undefined : color);
    setColorAnchor(null);
  };

  const handleIconSelect = (iconName: string) => {
    setValue?.('emoji', iconName || undefined);
    setIconAnchor(null);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    const selection = markdownEditorRef.current?.getSelection();
    if (selection && selection.text.trim().length > 0) {
      event.preventDefault();
      setSelectedText(selection.text);
      setSelectedRange({ from: selection.from, to: selection.to });
      setMenuAnchor({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    }
  };

  const handleClose = () => {
    setMenuAnchor(null);
  };

  const getLanguageLabel = (code: string) => {
    if (code === 'auto') return 'Detect Language';
    if (code === 'es') return 'Spanish';
    if (code === 'en') return 'English';
    if (code === 'fr') return 'French';
    if (code === 'de') return 'German';
    if (code === 'it') return 'Italian';
    if (code === 'pt') return 'Portuguese';
    return '';
  };

  const handleCreateTask = async () => {
    handleClose();
    if (!selectedText) {
      sileo.error({
        title: 'Error',
        description: 'Please select some text in the editor to create a task.',
        fill: 'var(--sileo-error-bg)',
        duration: 3000,
      });
      return;
    }

    setIsAIProcessing(true);

    const aiPrompt = `You are a helpful productivity assistant. Analyze the selected text and turn it into a clear, actionable task.
Respond with a single raw JSON object and no extra commentary, matching this schema exactly:
{
  "title": "Short, action-oriented task title (max 60 chars)",
  "description": "A well-structured task description in rich Markdown. Use ## for sections, **bold** for key terms, - for bullet points, and \`code\` or \`\`\`lang\\n...\`\`\` for code snippets. Make it informative and scannable.",
  "priority": "High" | "Medium" | "Low",
  "duration": "15m" | "30m" | "1h" | "2h"
}

Text: "${selectedText}"`;

    const analyzeProcess = async () => {
      if (!user) throw new Error('User not logged in');

      const rawResult = await fetchEditResult(aiPrompt);
      let parsed: {
        title: string;
        description: string;
        priority?: 'High' | 'Medium' | 'Low';
        duration?: string;
      };

      try {
        let cleanText = rawResult.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.substring(7);
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.substring(3);
        }
        if (cleanText.endsWith('```')) {
          cleanText = cleanText.substring(0, cleanText.length - 3);
        }
        parsed = JSON.parse(cleanText.trim());
      } catch (e) {
        console.warn(
          'AI returned non-JSON task formatting, falling back to manual mapping',
          e,
        );
        parsed = {
          title:
            selectedText.length > 50
              ? selectedText.slice(0, 50) + '...'
              : selectedText,
          description: selectedText,
          priority: 'Medium',
          duration: '30m',
        };
      }

      const estimateTimer = parseDuration(parsed.duration || '30m');
      const priorityLevel =
        parsed.priority === 'High' ? 4 : parsed.priority === 'Low' ? 1 : 2;

      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + (estimateTimer || 1800) * 1000,
      );

      const previewData: AITaskPreviewData = {
        title: parsed.title || 'AI Task',
        description: parsed.description || selectedText,
        priority: parsed.priority || 'Medium',
        duration: parsed.duration || '30m',
        startDate,
        endDate,
        priorityLevel,
        estimateTimer,
        category: 'General',
        user_id: user.id || '',
      };

      return previewData;
    };

    try {
      const previewData = await sileo.promise(analyzeProcess(), {
        loading: {
          title: 'AI Task Creator',
          description: 'Creating summary & analyzing task...',
          fill: 'var(--sileo-info-bg)',
        },
        success: {
          title: 'Task summary ready!',
          description: 'Review task details before scheduling.',
          fill: 'var(--sileo-success-bg)',
          duration: 3000,
        },
        error: {
          title: 'Error creating task summary',
          description: 'Could not generate task with AI.',
          fill: 'var(--sileo-error-bg)',
        },
      });

      if (previewData) {
        setAiTaskPreviewData(previewData);
        setIsAITaskPreviewOpen(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleConfirmAITask = async (finalData: AITaskPreviewData) => {
    if (!user) return;
    setIsCreatingTask(true);
    try {
      const createTaskInput = {
        title: finalData.title || 'AI Task',
        notes_encrypted: finalData.description || '',
        estimate_timer: finalData.estimateTimer,
        real_timer: 0,
        tags: [],
        deadline: finalData.endDate
          ? finalData.endDate.toISOString()
          : new Date().toISOString(),
        priority_level: finalData.priorityLevel,
        category: finalData.category || 'General',
        color:
          finalData.priority === 'High'
            ? '#ef4444'
            : finalData.priority === 'Low'
              ? '#10b981'
              : '#3b82f6',
        links: [],
        user_id: user.id || '',
        status: 'Backlog',
        use_ai: true,
      };

      const { data } = await createTaskMutation({
        variables: { createTaskInput },
        refetchQueries: [
          { query: GET_TASKS, variables: { userId: user.id || '' } },
          {
            query: GET_TASKS_TITLES,
            variables: { userId: user.id || '', limit: 24, offset: 0 },
          },
        ],
      });

      if (data?.createTask) {
        sileo.success({
          title: 'Task created!',
          description: 'New task has been added to your schedule.',
          fill: 'var(--sileo-success-bg)',
          duration: 3000,
        });
        setIsAITaskPreviewOpen(false);
        setAiTaskPreviewData(null);
      }
    } catch (e) {
      console.error('Error creating task:', e);
      sileo.error({
        title: 'Error creating task',
        description: 'Could not save task.',
        fill: 'var(--sileo-error-bg)',
      });
    } finally {
      setIsCreatingTask(false);
    }
  };

  const processTextWithAI = async (action: string) => {
    handleClose();
    if (!selectedText || !markdownEditorRef.current) return;

    setIsAIProcessing(true);

    let promptDescription = 'Processing text...';
    let successTitle = 'Text updated';
    let aiPrompt = '';

    if (action === 'grammar') {
      promptDescription = 'Fixing grammar and spelling...';
      successTitle = 'Grammar & spelling fixed';
      aiPrompt = `Fix spelling and grammar in this text. Correct any typos and punctuation errors. Return ONLY the corrected text, with no conversational preamble, quotes, explanations, or introductory text:\n\n${selectedText}`;
    } else if (action === 'summarize') {
      promptDescription = 'Creating summary...';
      successTitle = 'Summary generated';
      aiPrompt = `Summarize the following text concisely using rich Markdown formatting. Use ## headers, ### subheaders, **bold** for key terms, bullet points (-), and \`\`\`code\`\`\` blocks where appropriate to produce a clear and well-structured summary. Return ONLY the formatted Markdown summary, with no conversational preamble, quotes, explanations, or introductory text:\n\n${selectedText}`;
    } else if (action === 'expand') {
      promptDescription = 'Expanding text...';
      successTitle = 'Text expanded';
      aiPrompt = `Expand this text by adding relevant detail and context while preserving the style. Return ONLY the expanded text, with no conversational preamble, quotes, explanations, or introductory text:\n\n${selectedText}`;
    } else if (action === 'shorten') {
      promptDescription = 'Shortening text...';
      successTitle = 'Text condensed';
      aiPrompt = `Condense this text, making it short and punchy. Return ONLY the shortened text, with no conversational preamble, quotes, explanations, or introductory text:\n\n${selectedText}`;
    } else if (action.startsWith('translate_')) {
      const langCode = action.replace('translate_', '');
      const langLabel = getLanguageLabel(langCode);
      promptDescription = `Translating to ${langLabel}...`;
      successTitle = `Translated to ${langLabel}`;
      aiPrompt = `Translate this text to ${langLabel}. Return ONLY the translated text, with no conversational preamble, quotes, explanations, or introductory text:\n\n${selectedText}`;
    } else if (action === 'tone_professional') {
      promptDescription = 'Changing tone to professional...';
      successTitle = 'Tone changed to Professional';
      aiPrompt = `Rewrite this text in a professional, clear, and business-appropriate tone. Return ONLY the rewritten text, with no conversational preamble, quotes, explanations, or introductory text:\n\n${selectedText}`;
    } else if (action === 'tone_casual') {
      promptDescription = 'Changing tone to casual...';
      successTitle = 'Tone changed to Casual';
      aiPrompt = `Rewrite this text in a friendly, casual, and conversational tone. Return ONLY the rewritten text, with no conversational preamble, quotes, explanations, or introductory text:\n\n${selectedText}`;
    }

    try {
      const fetchPromise = fetchEditResult(aiPrompt);

      await sileo.promise(fetchPromise, {
        loading: {
          title: 'AI Assistant',
          description: promptDescription,
          fill: 'var(--sileo-info-bg)',
        },
        success: {
          title: successTitle,
          description: 'The selected text has been updated.',
          fill: 'var(--sileo-success-bg)',
          duration: 3000,
        },
        error: {
          title: 'AI Processing Error',
          description: 'Could not refine the selected text.',
          fill: 'var(--sileo-error-bg)',
        },
      });

      const refinedText = await fetchPromise;

      if (action === 'summarize') {
        markdownEditorRef.current.insertAtCursor(refinedText);
      } else if (selectedRange) {
        markdownEditorRef.current.replaceRange(
          selectedRange.from,
          selectedRange.to,
          refinedText,
        );
      } else {
        markdownEditorRef.current.insertAtCursor(refinedText);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAIProcessing(false);
    }
  };

  return {
    menuAnchor,
    setMenuAnchor,
    selectedText,
    setSelectedText,
    colorAnchor,
    setColorAnchor,
    iconAnchor,
    setIconAnchor,
    headerColor,
    headerIcon,
    currentBgGradient,
    hasCover,
    handleColorClick,
    handleIconClick,
    handleColorSelect,
    handleIconSelect,
    handleContextMenu,
    handleClose,
    getLanguageLabel,
    handleCreateTask,
    processTextWithAI,
    isAIProcessing,
    aiTaskPreviewData,
    isAITaskPreviewOpen,
    setIsAITaskPreviewOpen,
    handleConfirmAITask,
    isCreatingTask,
  };
};
