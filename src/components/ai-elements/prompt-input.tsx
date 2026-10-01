import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { Box, ButtonBase, type SxProps, type Theme } from '@mui/material';
import { ArrowUpIcon, SquareIcon, Loader2Icon } from 'lucide-react';
import { brand, byMode, mergeSx, spin, zinc } from '@/styles/mui';

export type ChatStatus = 'ready' | 'submitted' | 'streaming' | 'error';

interface PromptInputContextValue {
  status?: ChatStatus;
  onStop?: () => void;
  onSubmit?: () => void;
}

const PromptInputContext = createContext<PromptInputContextValue>({});

interface SxChildrenProps {
  sx?: SxProps<Theme>;
  children?: ReactNode;
}

export interface PromptInputProps extends SxChildrenProps {
  status?: ChatStatus;
  onStop?: () => void;
  onSubmit?: (e?: FormEvent) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  sx,
  status = 'ready',
  onStop,
  onSubmit,
  children,
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (status === 'streaming' && onStop) {
      onStop();
      return;
    }
    onSubmit?.(e);
  };

  return (
    <PromptInputContext.Provider
      value={{ status, onStop, onSubmit: () => onSubmit?.() }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        data-slot="prompt-input"
        sx={mergeSx(
          {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: byMode(
              'rgba(0, 0, 0, 0.1)',
              'rgba(255, 255, 255, 0.1)',
            ),
            bgcolor: byMode('rgba(255, 255, 255, 0.8)', `${zinc[900]}e6`),
            backdropFilter: 'blur(12px)',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            p: 1.25,
            '&:focus-within': {
              borderColor: `${brand.main}80`,
              boxShadow: `0 0 0 2px ${brand.main}26, 0 10px 15px -3px rgba(0, 0, 0, 0.1)`,
            },
          },
          sx,
        )}
      >
        {children}
      </Box>
    </PromptInputContext.Provider>
  );
};

export const PromptInputHeader: React.FC<SxChildrenProps> = ({
  sx,
  children,
}) => {
  if (!children) return null;
  return (
    <Box
      data-slot="prompt-input-header"
      sx={mergeSx(
        {
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 0.75,
          px: 0.5,
          pb: 1,
          borderBottom: '1px solid',
          borderColor: byMode(
            'rgba(0, 0, 0, 0.05)',
            'rgba(255, 255, 255, 0.05)',
          ),
        },
        sx,
      )}
    >
      {children}
    </Box>
  );
};

export const PromptInputBody: React.FC<SxChildrenProps> = ({
  sx,
  children,
}) => (
  <Box
    data-slot="prompt-input-body"
    sx={mergeSx({ position: 'relative', flex: 1, minWidth: 0, py: 0.5 }, sx)}
  >
    {children}
  </Box>
);

export interface PromptInputTextareaProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste?: React.ClipboardEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  sx?: SxProps<Theme>;
}

const MAX_TEXTAREA_HEIGHT = 180;

export const PromptInputTextarea: React.FC<PromptInputTextareaProps> = ({
  sx,
  value,
  onChange,
  onKeyDown,
  placeholder = 'Pregunta lo que quieras...',
  rows = 1,
  ...props
}) => {
  const { status, onStop, onSubmit } = useContext(PromptInputContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (status === 'streaming') {
        onStop?.();
      } else {
        onSubmit?.();
      }
    }
  };

  return (
    <Box
      component="textarea"
      ref={textareaRef}
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e);
        adjustHeight();
      }}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      rows={rows}
      data-slot="prompt-input-textarea"
      sx={mergeSx(
        {
          width: '100%',
          resize: 'none',
          border: 'none',
          outline: 'none',
          bgcolor: 'transparent',
          px: 1,
          py: 0.75,
          fontFamily: 'inherit',
          fontSize: '14px',
          lineHeight: 1.625,
          color: byMode(zinc[900], zinc[100]),
          maxHeight: MAX_TEXTAREA_HEIGHT,
          '&::placeholder': { color: zinc[400], opacity: 1 },
        },
        sx,
      )}
      {...props}
    />
  );
};

export const PromptInputFooter: React.FC<SxChildrenProps> = ({
  sx,
  children,
}) => (
  <Box
    data-slot="prompt-input-footer"
    sx={mergeSx(
      {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        pt: 0.5,
        px: 0.5,
      },
      sx,
    )}
  >
    {children}
  </Box>
);

export const PromptInputTools: React.FC<SxChildrenProps> = ({
  sx,
  children,
}) => (
  <Box
    data-slot="prompt-input-tools"
    sx={mergeSx(
      {
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        minWidth: 0,
        flexWrap: 'wrap',
      },
      sx,
    )}
  >
    {children}
  </Box>
);

export interface PromptInputButtonProps extends SxChildrenProps {
  icon?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  title?: string;
}

export const PromptInputButton: React.FC<PromptInputButtonProps> = ({
  sx,
  children,
  icon,
  ...props
}) => (
  <ButtonBase
    type="button"
    data-slot="prompt-input-button"
    sx={mergeSx(
      {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.75,
        borderRadius: '12px',
        fontFamily: 'inherit',
        fontSize: '12px',
        fontWeight: 500,
        flexShrink: 0,
        color: byMode(zinc[600], zinc[300]),
        bgcolor: byMode('rgba(0, 0, 0, 0.03)', 'rgba(255, 255, 255, 0.04)'),
        transition: 'color 0.15s ease, background-color 0.15s ease',
        '&:hover': {
          color: byMode(zinc[900], zinc[100]),
          bgcolor: byMode('rgba(0, 0, 0, 0.06)', 'rgba(255, 255, 255, 0.08)'),
        },
      },
      sx,
    )}
    {...props}
  >
    {icon}
    {children}
  </ButtonBase>
);

export interface PromptInputSubmitProps extends SxChildrenProps {
  status?: ChatStatus;
  onStop?: () => void;
  disabled?: boolean;
}

const roundButtonSx = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '50%',
  flexShrink: 0,
  transition: 'all 0.15s ease',
} as const;

export const PromptInputSubmit: React.FC<PromptInputSubmitProps> = ({
  sx,
  status: statusProp,
  onStop: onStopProp,
  disabled,
  children,
}) => {
  const context = useContext(PromptInputContext);
  const status = statusProp || context.status || 'ready';
  const onStop = onStopProp || context.onStop;

  if (status === 'streaming') {
    return (
      <ButtonBase
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onStop?.();
        }}
        title="Detener respuesta"
        data-slot="prompt-input-submit-stop"
        sx={mergeSx(
          {
            ...roundButtonSx,
            bgcolor: byMode(zinc[900], '#ffffff'),
            color: byMode('#ffffff', zinc[900]),
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            '&:hover': { opacity: 0.9 },
          },
          sx,
        )}
      >
        <Box
          component={SquareIcon}
          sx={{ width: 14, height: 14, fill: 'currentColor' }}
        />
      </ButtonBase>
    );
  }

  if (status === 'submitted') {
    return (
      <ButtonBase
        type="button"
        disabled
        title="Generando..."
        data-slot="prompt-input-submit-loading"
        sx={mergeSx(
          {
            ...roundButtonSx,
            bgcolor: `${brand.main}33`,
            color: byMode(brand.main, brand.dark),
            cursor: 'wait',
          },
          sx,
        )}
      >
        <Box
          component={Loader2Icon}
          sx={{
            width: 16,
            height: 16,
            animation: `${spin} 1s linear infinite`,
          }}
        />
      </ButtonBase>
    );
  }

  return (
    <ButtonBase
      type="submit"
      disabled={disabled}
      title="Enviar mensaje"
      data-slot="prompt-input-submit"
      sx={mergeSx(
        {
          ...roundButtonSx,
          bgcolor: brand.main,
          color: '#ffffff',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          '&:hover': { bgcolor: brand.hover },
          '&.Mui-disabled': { opacity: 0.3 },
        },
        sx,
      )}
    >
      {children ?? (
        <Box
          component={ArrowUpIcon}
          sx={{ width: 16, height: 16, strokeWidth: 2.5 }}
        />
      )}
    </ButtonBase>
  );
};
