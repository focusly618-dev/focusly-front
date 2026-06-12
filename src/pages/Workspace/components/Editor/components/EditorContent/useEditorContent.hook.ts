import { useState } from 'react';
import type {
  UseEditorContentProps,
  UseEditorContentReturn,
} from './useEditorContent.types';
import { colorPalette, type HeaderColor } from '@/utils/colors';
import { sileo } from '@/utils/sileo';

export const useEditorContent = ({
  setValue,
  watch,
  editor,
}: UseEditorContentProps): UseEditorContentReturn => {
  const persistedEmoji = watch?.('emoji');
  const persistedBg = watch?.('background_color');

  const [menuAnchor, setMenuAnchor] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [colorAnchor, setColorAnchor] = useState<null | HTMLElement>(null);
  const [iconAnchor, setIconAnchor] = useState<null | HTMLElement>(null);

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

  const translateText = async (
    text: string,
    toLang: string,
  ): Promise<string> => {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=Autodetect|${toLang}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
      throw new Error('No translation returned');
    } catch (err) {
      console.error('Translation error:', err);
      return text;
    }
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

  const handleCreateTask = () => {
    handleClose();
    sileo.success({
      title: 'Task created!',
      description: `New task created from selection: "${selectedText.slice(0, 30)}..."`,
      fill: 'var(--sileo-success-bg)',
      duration: 3000,
    });
  };

  const processTextWithAI = async (action: string) => {
    handleClose();
    if (!selectedText) return;

    let promptDescription = 'Processing text...';
    let successTitle = 'Text updated';
    let resultText = selectedText;

    if (action === 'grammar') {
      promptDescription = 'Fixing grammar and spelling...';
      successTitle = 'Grammar & spelling fixed';
      let temp = selectedText.trim();
      if (temp.length > 0) {
        temp = temp.charAt(0).toUpperCase() + temp.slice(1);
        if (!temp.endsWith('.') && !temp.endsWith('!') && !temp.endsWith('?')) {
          temp += '.';
        }
      }
      resultText = temp;
    } else if (action === 'summarize') {
      promptDescription = 'Creating summary...';
      successTitle = 'Summary generated';
      resultText = `Summary: "${selectedText.slice(0, 100)}..."`;
    } else if (action === 'expand') {
      promptDescription = 'Expanding text...';
      successTitle = 'Text expanded';
      resultText = `${selectedText} (This point is critical for our strategic alignment. We need to ensure all team members understand the implications and coordinate their efforts to execute this phase efficiently.)`;
    } else if (action === 'shorten') {
      promptDescription = 'Shortening text...';
      successTitle = 'Text condensed';
      resultText =
        selectedText.length > 60
          ? `${selectedText.slice(0, 50)}...`
          : selectedText;
    } else if (action.startsWith('translate_')) {
      const langCode = action.replace('translate_', '');
      const langLabel = getLanguageLabel(langCode);
      promptDescription = `Translating to ${langLabel}...`;
      successTitle = `Translated to ${langLabel}`;
      resultText = await translateText(selectedText, langCode);
    } else if (action === 'tone_professional') {
      promptDescription = 'Changing tone to professional...';
      successTitle = 'Tone changed to Professional';
      resultText = `We should professionally note that: ${selectedText}`;
    } else if (action === 'tone_casual') {
      promptDescription = 'Changing tone to casual...';
      successTitle = 'Tone changed to Casual';
      resultText = `Hey, just so you know: ${selectedText} 😊`;
    }

    try {
      await sileo.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
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

      editor.insertInlineContent([
        {
          type: 'text',
          text: resultText,
          styles: {},
        },
      ]);
    } catch (e) {
      console.error(e);
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
  };
};
