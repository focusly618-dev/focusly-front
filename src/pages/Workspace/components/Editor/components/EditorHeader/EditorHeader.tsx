import { useState, useRef, useEffect } from 'react';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircleOutline as CheckCircleIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Language as LanguageIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import {
  CircularProgress,
  Fade,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
} from '@mui/material';
import { SearchPalette } from '../SearchPalette/SearchPalette';
import type { TaskSearchItems } from '../../../../types/workspace.types';
import {
  HeaderCenter,
  HeaderLeft,
  HeaderRight,
} from '@/pages/Workspace/Workspace.styles';
import {
  BackButton,
  EditorHeader as StyledEditorHeader,
} from './EditorHeader.styles';
import { sileo } from '@/utils/sileo';
import type { BlockNoteEditor } from '@blocknote/core';

interface SpeechRecognitionEvent {
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

interface ISpeechRecognition {
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

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

interface EditorHeaderProps {
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
}

export const EditorHeader = ({
  onBack,
  showPalette,
  setShowPalette,
  searchTerm,
  setSearchTerm,
  filteredTasks,
  selectTask,
  handleSelectTask,
  setValue,
  saveState,
  editor,
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
}: EditorHeaderProps) => {
  const [isListening, setIsListening] = useState(false);
  const [sourceAnchor, setSourceAnchor] = useState<null | HTMLElement>(null);
  const [targetAnchor, setTargetAnchor] = useState<null | HTMLElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const interimLengthRef = useRef(0);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const translateText = async (
    text: string,
    fromLang: string,
    toLang: string,
  ): Promise<string> => {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
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

  const handleSpeechResult = async (
    event: SpeechRecognitionEvent,
    speechLangCode: string,
  ) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    if (interimTranscript) {
      if (editor) {
        editor.focus();
      }

      const selection = window.getSelection();
      if (selection) {
        const prevLength = interimLengthRef.current;
        if (prevLength > 0) {
          try {
            for (let i = 0; i < prevLength; i++) {
              selection.modify('extend', 'backward', 'character');
            }
          } catch (e) {
            console.error('Failed to adjust selection:', e);
          }
        }
        document.execCommand('insertText', false, interimTranscript);
        interimLengthRef.current = interimTranscript.length;
      }
    }

    if (finalTranscript && editor) {
      if (editor) {
        editor.focus();
      }

      const selection = window.getSelection();
      if (selection) {
        const prevLength = interimLengthRef.current;
        if (prevLength > 0) {
          try {
            for (let i = 0; i < prevLength; i++) {
              selection.modify('extend', 'backward', 'character');
            }
          } catch (e) {
            console.error('Failed to adjust selection:', e);
          }
        }

        let textToInsert = finalTranscript;
        const speechLang = speechLangCode.split('-')[0];
        if (speechLang !== targetLanguage) {
          textToInsert = await translateText(
            finalTranscript,
            speechLang,
            targetLanguage,
          );
        }

        document.execCommand('insertText', false, textToInsert + ' ');
        interimLengthRef.current = 0;
      }
    }
  };

  const getSpeechLanguageCode = () => {
    if (sourceLanguage === 'auto') return 'es-ES'; // Default to Spanish if auto
    if (sourceLanguage === 'es') return 'es-ES';
    if (sourceLanguage === 'en') return 'en-US';
    if (sourceLanguage === 'fr') return 'fr-FR';
    if (sourceLanguage === 'de') return 'de-DE';
    if (sourceLanguage === 'it') return 'it-IT';
    if (sourceLanguage === 'pt') return 'pt-PT';
    return 'es-ES';
  };

  const startSpeechToText = () => {
    const SpeechRecognitionAPI =
      (window as unknown as SpeechRecognitionWindow).SpeechRecognition ||
      (window as unknown as SpeechRecognitionWindow).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      sileo.error({
        title: 'Speech Recognition Not Supported',
        description: 'Your browser does not support speech recognition.',
        fill: 'var(--sileo-error-bg)',
      });
      return;
    }

    if (editor) {
      editor.focus();
    }

    const rec = new SpeechRecognitionAPI();
    rec.lang = getSpeechLanguageCode();
    rec.continuous = true;
    rec.interimResults = true;

    rec.onstart = () => {
      setIsListening(true);
      interimLengthRef.current = 0;
      sileo.info({
        title: 'Listening...',
        description: `Speak now in ${getSpeechLanguageCode().split('-')[0].toUpperCase()}. Press mic again to stop.`,
        fill: 'var(--sileo-info-bg)',
        duration: 4000,
      });
    };

    rec.onresult = (event) =>
      handleSpeechResult(event, getSpeechLanguageCode());

    rec.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      interimLengthRef.current = 0;
    };

    rec.onend = () => {
      setIsListening(false);
      interimLengthRef.current = 0;
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const stopSpeechToText = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    interimLengthRef.current = 0;
  };

  const toggleListening = () => {
    if (isListening) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const restartDictationIfListening = (lang: string) => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setTimeout(() => {
        const SpeechRecognitionAPI =
          (window as unknown as SpeechRecognitionWindow).SpeechRecognition ||
          (window as unknown as SpeechRecognitionWindow)
            .webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
          const rec = new SpeechRecognitionAPI();
          let speechLang = 'es-ES';
          if (lang === 'es') speechLang = 'es-ES';
          else if (lang === 'en') speechLang = 'en-US';
          else if (lang === 'fr') speechLang = 'fr-FR';
          else if (lang === 'de') speechLang = 'de-DE';
          else if (lang === 'it') speechLang = 'it-IT';
          else if (lang === 'pt') speechLang = 'pt-PT';

          if (editor) {
            editor.focus();
          }

          rec.lang = speechLang;
          rec.continuous = true;
          rec.interimResults = true;
          rec.onstart = () => {
            setIsListening(true);
            interimLengthRef.current = 0;
            sileo.info({
              title: 'Listening...',
              description: `Language changed. Speak now in ${lang.toUpperCase()}.`,
              fill: 'var(--sileo-info-bg)',
              duration: 3000,
            });
          };
          rec.onresult = (event) => handleSpeechResult(event, speechLang);
          rec.onerror = () => {
            setIsListening(false);
            interimLengthRef.current = 0;
          };
          rec.onend = () => {
            setIsListening(false);
            interimLengthRef.current = 0;
          };
          recognitionRef.current = rec;
          rec.start();
        }
      }, 300);
    }
  };

  const handleSourceSelect = (lang: string) => {
    setSourceLanguage(lang);
    setSourceAnchor(null);
    restartDictationIfListening(lang);
  };

  const handleTargetSelect = (lang: string) => {
    setTargetLanguage(lang);
    setTargetAnchor(null);
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage !== 'auto') {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
      restartDictationIfListening(targetLanguage);
    } else {
      if (targetLanguage === 'es') {
        setSourceLanguage('en');
        setTargetLanguage('es');
        restartDictationIfListening('en');
      } else {
        setSourceLanguage('es');
        setTargetLanguage('en');
        restartDictationIfListening('es');
      }
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
  return (
    <StyledEditorHeader>
      <HeaderCenter
        id="joyride-editor-search"
        sx={{ position: 'relative', zIndex: 50, mx: 2 }}
      >
        <SearchPalette
          showPalette={showPalette}
          setShowPalette={setShowPalette}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredTasks={filteredTasks}
          selectTask={selectTask}
          handleSelectTask={handleSelectTask}
          setValue={setValue}
        />
      </HeaderCenter>

      <HeaderRight>
        {/* Source Language Selector */}
        <IconButton
          onClick={(e) => setSourceAnchor(e.currentTarget)}
          size="small"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '20px',
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            height: '32px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'text.secondary',
            },
          }}
        >
          <LanguageIcon sx={{ fontSize: 14 }} />
          {getLanguageLabel(sourceLanguage)}
        </IconButton>

        {/* Swap Languages Button */}
        <IconButton
          onClick={handleSwapLanguages}
          size="small"
          sx={{
            width: '32px',
            height: '32px',
            border: '1px solid',
            borderColor: 'divider',
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'text.secondary',
            },
          }}
        >
          <SwapIcon sx={{ fontSize: 16 }} />
        </IconButton>

        {/* Target Language Selector */}
        <IconButton
          onClick={(e) => setTargetAnchor(e.currentTarget)}
          size="small"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '20px',
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            height: '32px',
            fontSize: '11px',
            fontWeight: 700,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'text.secondary',
            },
          }}
        >
          <LanguageIcon sx={{ fontSize: 14 }} />
          {getLanguageLabel(targetLanguage)}
        </IconButton>

        {/* Real-time speech preview overlay */}
        {isListening && (
          <Fade in={true}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(239, 68, 68, 0.08)'
                    : 'rgba(239, 68, 68, 0.04)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '6px 14px',
                height: '32px',
                borderRadius: '20px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                maxWidth: '280px',
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  animation: 'blink 1.2s infinite ease-in-out',
                  '@keyframes blink': {
                    '0%, 100%': { opacity: 0.2 },
                    '50%': { opacity: 1 },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: '11px',
                  whiteSpace: 'nowrap',
                }}
              >
                Listening...
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Dictation Microphone Button */}
        <IconButton
          onClick={toggleListening}
          size="small"
          sx={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            color: isListening ? 'error.main' : 'text.secondary',
            bgcolor: isListening ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
            border: '1px solid',
            borderColor: isListening ? 'error.main' : 'divider',
            animation: isListening ? 'pulse 1.5s infinite ease-in-out' : 'none',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.3)',
              },
              '70%': {
                transform: 'scale(1.08)',
                boxShadow: '0 0 0 6px rgba(239, 68, 68, 0)',
              },
              '100%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)',
              },
            },
            '&:hover': {
              bgcolor: isListening ? 'rgba(239, 68, 68, 0.15)' : 'action.hover',
            },
          }}
        >
          {isListening ? (
            <MicIcon sx={{ fontSize: 16 }} />
          ) : (
            <MicOffIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>

        {/* Save Status Indicator */}
        <Fade
          in={saveState === 'saving' || saveState === 'saved'}
          timeout={300}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.02)',
              border: '1px solid',
              borderColor: (theme) =>
                saveState === 'saved'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : theme.palette.divider,
              padding: '6px 12px',
              height: '32px',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              boxShadow:
                saveState === 'saved'
                  ? '0 0 10px rgba(16, 185, 129, 0.1)'
                  : 'none',
            }}
          >
            {saveState === 'saving' ? (
              <>
                <CircularProgress
                  size={14}
                  thickness={6}
                  sx={{
                    color: 'text.secondary',
                    animationDuration: '750ms',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    fontSize: '11px',
                  }}
                >
                  saving
                </Typography>
              </>
            ) : saveState === 'saved' ? (
              <>
                <CheckCircleIcon
                  sx={{
                    fontSize: 14,
                    color: '#10B981',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#10B981',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    fontSize: '11px',
                  }}
                >
                  saved
                </Typography>
              </>
            ) : null}
          </Box>
        </Fade>

        {/* Source Language selection Menu */}
        <Menu
          anchorEl={sourceAnchor}
          open={Boolean(sourceAnchor)}
          onClose={() => setSourceAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: '10px',
              mt: 0.5,
              minWidth: '130px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <MenuItem onClick={() => handleSourceSelect('auto')}>
            <ListItemText
              primary="Detect Language"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('es')}>
            <ListItemText
              primary="Spanish"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('en')}>
            <ListItemText
              primary="English"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('fr')}>
            <ListItemText
              primary="French"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('de')}>
            <ListItemText
              primary="German"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('it')}>
            <ListItemText
              primary="Italian"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleSourceSelect('pt')}>
            <ListItemText
              primary="Portuguese"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
        </Menu>

        {/* Target Language selection Menu */}
        <Menu
          anchorEl={targetAnchor}
          open={Boolean(targetAnchor)}
          onClose={() => setTargetAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: '10px',
              mt: 0.5,
              minWidth: '130px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <MenuItem onClick={() => handleTargetSelect('es')}>
            <ListItemText
              primary="Spanish"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleTargetSelect('en')}>
            <ListItemText
              primary="English"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleTargetSelect('fr')}>
            <ListItemText
              primary="French"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleTargetSelect('de')}>
            <ListItemText
              primary="German"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleTargetSelect('it')}>
            <ListItemText
              primary="Italian"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
          <MenuItem onClick={() => handleTargetSelect('pt')}>
            <ListItemText
              primary="Portuguese"
              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
            />
          </MenuItem>
        </Menu>
      </HeaderRight>
    </StyledEditorHeader>
  );
};
