import { useRef, type RefObject } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
  CircularProgress,
  Grow,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  AutoFixHigh as StyleIcon,
  Summarize as SummarizeIcon,
} from '@mui/icons-material';
import { LuminaAnimatedFace } from '@/components/ui';
import { useEditorAskAI } from './useEditorAskAI.hook';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';

interface EditorAskAIProps {
  markdownEditorRef: RefObject<MarkdownEditorRef | null>;
  // Live-tracked selection from the editor (see MarkdownEditor's
  // onSelectionChange) — only ever changes from a real selection change
  // inside the editor, never from focusing this panel's own input.
  selectedText: string;
}

const SUMMARIZE_ACTION = {
  id: 'summarize',
  label: 'Resumir con IA',
  icon: SummarizeIcon,
  mode: 'send' as const,
  text: 'Resume este documento de forma clara y concisa.',
};

const buildStyleAction = (selectedText: string) => ({
  id: 'style',
  label: 'Adaptar estilo de escritura',
  icon: StyleIcon,
  mode: 'send' as const,
  text: `Adapta el estilo de redacción de esta parte seleccionada para que coincida con el estilo de escritura del resto del documento (mismo tono, vocabulario y forma de construir las frases), sin cambiar su significado: "${selectedText}"`,
});

// Renders Lumina's reply with real Markdown (bold, lists, etc.) instead of
// showing the literal "**...**" syntax — mapped onto MUI primitives so it
// matches the bubble's own typography instead of raw browser default styles.
const noteMarkdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <Typography variant="body2" sx={{ mb: 0.75, '&:last-child': { mb: 0 } }}>
      {children}
    </Typography>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <Box component="strong" sx={{ fontWeight: 700 }}>
      {children}
    </Box>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <Box component="em" sx={{ fontStyle: 'italic' }}>
      {children}
    </Box>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <Box component="ul" sx={{ pl: 2.5, m: 0, mb: 0.75 }}>
      {children}
    </Box>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <Box component="ol" sx={{ pl: 2.5, m: 0, mb: 0.75 }}>
      {children}
    </Box>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <Typography component="li" variant="body2" sx={{ mb: 0.25 }}>
      {children}
    </Typography>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <Box
      component="code"
      sx={{
        fontFamily: 'ui-monospace, monospace',
        bgcolor: 'action.hover',
        px: 0.5,
        py: 0.1,
        borderRadius: '4px',
        fontSize: '0.85em',
      }}
    >
      {children}
    </Box>
  ),
};

export const EditorAskAI: React.FC<EditorAskAIProps> = ({
  markdownEditorRef,
  selectedText,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen,
    open,
    close,
    inputValue,
    setInputValue,
    isLoading,
    note,
    hasPendingDiff,
    handleSubmit,
    handleQuickAction,
    handleResolveDiff,
  } = useEditorAskAI({ markdownEditorRef });

  const glowBg = isDark ? '#1e1b4b' : '#e0f2fe';
  const glowBorder = `${theme.palette.primary.main}30`;
  const glowShadow = `0 8px 32px rgba(15, 23, 76, 0.25), 0 0 16px ${theme.palette.primary.main}15`;

  const showQuickActions =
    isOpen && !note && !hasPendingDiff && !inputValue.trim() && !isLoading;

  const trimmedSelection = selectedText.trim();
  const hasSelection = Boolean(trimmedSelection);

  const quickActions = hasSelection
    ? [buildStyleAction(trimmedSelection), SUMMARIZE_ACTION]
    : [SUMMARIZE_ACTION];

  return (
    <Box
      sx={{
        // Fixed to the viewport (not the scrolling note surface) so it stays
        // put like Google Docs' Gemini button, instead of scrolling away
        // with a long document.
        position: 'fixed',
        left: '50%',
        bottom: 32,
        transform: 'translateX(-50%)',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        // Same width collapsed or open, so the button never has to jump
        // size — only its inner shape morphs (icon+label vs icon+input).
        width: 'min(90%, 560px)',
      }}
    >
      {(note || hasPendingDiff) && (
        <Box
          sx={{
            width: '100%',
            px: 2,
            py: 1.25,
            borderRadius: '14px',
            bgcolor: theme.palette.background.paper,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            animation: 'askAiFadeIn 0.2s ease-out',
            '@keyframes askAiFadeIn': {
              from: { opacity: 0, transform: 'translateY(6px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {note && (
            <Box sx={{ mb: hasPendingDiff ? 1 : 0 }}>
              <ReactMarkdown components={noteMarkdownComponents}>
                {note}
              </ReactMarkdown>
            </Box>
          )}
          {hasPendingDiff && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ flex: 1 }}
              >
                Lo tachado se eliminaría, lo subrayado se agregaría.
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleResolveDiff('reject')}
                sx={{
                  color: 'error.main',
                  border: '1px solid',
                  borderColor: 'error.main',
                  borderRadius: '8px',
                  px: 1,
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ ml: 0.5 }}
                >
                  Descartar
                </Typography>
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleResolveDiff('accept')}
                sx={{
                  color: '#fff',
                  bgcolor: 'success.main',
                  borderRadius: '8px',
                  px: 1,
                  '&:hover': { bgcolor: 'success.dark' },
                }}
              >
                <CheckIcon sx={{ fontSize: 16 }} />
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ ml: 0.5 }}
                >
                  Aceptar
                </Typography>
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      {showQuickActions && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.75,
            justifyContent: 'center',
            animation: 'askAiFadeIn 0.2s ease-out',
          }}
        >
          {quickActions.map((action) => {
            const ActionIcon = action.icon;
            return (
              <Box
                key={action.id}
                onClick={() => {
                  if (action.mode === 'send') {
                    handleQuickAction(action.text);
                  } else {
                    setInputValue(action.text);
                    inputRef.current?.focus();
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.6,
                  px: 1.25,
                  py: 0.6,
                  borderRadius: '999px',
                  bgcolor: theme.palette.background.paper,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <ActionIcon
                  sx={{ fontSize: 15, color: theme.palette.primary.main }}
                />
                <Typography variant="caption" fontWeight={600}>
                  {action.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      <Box sx={{ position: 'relative', width: '100%', minHeight: 48 }}>
        <Grow in={isOpen} unmountOnExit style={{ transformOrigin: 'bottom' }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: '999px',
              bgcolor: glowBg,
              border: `1px solid ${glowBorder}`,
              boxShadow: glowShadow,
            }}
          >
            <LuminaAnimatedFace size={24} />
            <InputBase
              inputRef={inputRef}
              autoFocus
              fullWidth
              placeholder="Pregúntale a Lumina sobre este documento…"
              value={inputValue}
              disabled={isLoading || hasPendingDiff}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
                if (e.key === 'Escape') close();
              }}
              sx={{
                fontSize: '14px',
                color: 'text.primary',
                '& input::placeholder': { opacity: 0.7 },
              }}
            />
            {isLoading ? (
              <CircularProgress size={18} sx={{ mr: 0.5 }} />
            ) : (
              <IconButton
                size="small"
                onClick={handleSubmit}
                disabled={!inputValue.trim() || hasPendingDiff}
                sx={{ color: theme.palette.primary.main }}
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={close}
              disabled={hasPendingDiff}
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Grow>

        <Grow
          in={!isOpen}
          unmountOnExit
          style={{ transformOrigin: 'bottom center' }}
        >
          <Box
            onClick={open}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') open();
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: '999px',
              bgcolor: glowBg,
              border: `1px solid ${glowBorder}`,
              boxShadow: glowShadow,
              cursor: 'pointer',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              animation: 'askAiPulseGlow 2.4s infinite ease-in-out',
              '@keyframes askAiPulseGlow': {
                '0%, 100%': { boxShadow: glowShadow },
                '50%': {
                  boxShadow: `0 8px 32px rgba(15, 23, 76, 0.3), 0 0 22px ${theme.palette.primary.main}30`,
                },
              },
              '&:hover': {
                transform: 'translateY(-1px)',
              },
              transition: 'transform 0.15s ease',
            }}
          >
            <LuminaAnimatedFace size={22} />
            <Typography
              variant="body2"
              fontWeight={700}
              color="text.primary"
              sx={{ letterSpacing: '0.2px' }}
            >
              Pregúntale a Lumina
            </Typography>
          </Box>
        </Grow>
      </Box>
    </Box>
  );
};
