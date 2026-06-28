import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAppSelector } from '@/redux/hooks';
import type {
  UseEditorContentProps,
  UseEditorContentReturn,
} from './useEditorContent.types';
import { colorPalette, type HeaderColor } from '@/utils/colors';
import { sileo } from '@/utils/sileo';
import { fetchEditResult } from '@/api/AI/apiAI';
import {
  CREATE_TASK,
  GET_TASKS,
  GET_TASKS_TITLES,
} from '@/pages/Tasks/Task.graphql';
import { parseDuration } from '@/pages/Home/components/CreateTaskModal/CreateTaskModal.utils';

export const useEditorContent = ({
  setValue,
  watch,
  editor,
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
  const [colorAnchor, setColorAnchor] = useState<null | HTMLElement>(null);
  const [iconAnchor, setIconAnchor] = useState<null | HTMLElement>(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

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
    const selection = window.getSelection()?.toString();
    if (selection && selection.trim().length > 0) {
      event.preventDefault();
      setSelectedText(selection);
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

    const aiPrompt = `You are a task details generator. Analyze the text below and extract a task from it.
Response MUST be a single raw JSON object (with no conversational preamble, quotes, markdown formatting, or introductory text) matching this schema:
{
  "title": "Action-oriented task title",
  "description": "Short explanation or context extracted from the text",
  "priority": "High" | "Medium" | "Low",
  "duration": "15m" | "30m" | "1h" | "2h"
}

Text: "${selectedText}"`;

    const createProcess = async () => {
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

      const createTaskInput = {
        title: parsed.title || 'AI Task',
        notes_encrypted: `${parsed.description || ''} [COLOR:#3b82f6]`,
        estimate_timer: estimateTimer,
        real_timer: 0,
        tags: [],
        deadline: new Date().toISOString(),
        priority_level: priorityLevel,
        category: 'General',
        color: '#3b82f6',
        links: [],
        user_id: user.id || '',
        status: 'Backlog',
        use_ai: true,
      };

      const { data } = await createTaskMutation({
        variables: { createTaskInput },
        refetchQueries: [
          { query: GET_TASKS, variables: { userId: user.id || '' } },
          { query: GET_TASKS_TITLES, variables: { userId: user.id || '' } },
        ],
      });

      if (!data?.createTask) {
        throw new Error('Task creation returned empty data');
      }

      return data.createTask;
    };

    try {
      await sileo.promise(createProcess(), {
        loading: {
          title: 'AI Task Creator',
          description: 'Analyzing text and creating task...',
          fill: 'var(--sileo-info-bg)',
        },
        success: {
          title: 'Task created!',
          description: 'New task has been added to your task list.',
          fill: 'var(--sileo-success-bg)',
          duration: 3000,
        },
        error: {
          title: 'Error creating task',
          description: 'Could not create task with AI.',
          fill: 'var(--sileo-error-bg)',
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const processTextWithAI = async (action: string) => {
    handleClose();
    if (!selectedText || !editor) return;

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
      aiPrompt = `Summarize this text concisely. Return ONLY the summarized text, with no conversational preamble, quotes, explanations, or introductory text:\n\n${selectedText}`;
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

      editor.insertInlineContent([
        {
          type: 'text',
          text: refinedText,
          styles: {},
        },
      ]);
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
  };
};
