import { useState, useRef, useEffect } from 'react';
import { sileo } from '@/utils/sileo';
import type {
  EditorHeaderProps,
  ISpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionWindow,
} from './EditorHeader.types';

export const useEditorHeader = (props: EditorHeaderProps) => {
  const {
    editor,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
  } = props;

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

  return {
    isListening,
    sourceAnchor,
    setSourceAnchor,
    targetAnchor,
    setTargetAnchor,
    toggleListening,
    handleSourceSelect,
    handleTargetSelect,
    handleSwapLanguages,
    getLanguageLabel,
  };
};
