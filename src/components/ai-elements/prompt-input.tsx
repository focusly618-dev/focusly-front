import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  type ComponentProps,
  type HTMLAttributes,
  type TextareaHTMLAttributes,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { cn } from '@/utils';
import { ArrowUpIcon, SquareIcon, Loader2Icon } from 'lucide-react';

export type ChatStatus = 'ready' | 'submitted' | 'streaming' | 'error';

interface PromptInputContextValue {
  status?: ChatStatus;
  onStop?: () => void;
  onSubmit?: () => void;
}

const PromptInputContext = createContext<PromptInputContextValue>({});

export interface PromptInputProps extends HTMLAttributes<HTMLFormElement> {
  status?: ChatStatus;
  onStop?: () => void;
  onSubmit?: (e?: FormEvent) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  className,
  status = 'ready',
  onStop,
  onSubmit,
  children,
  ...props
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
      <form
        onSubmit={handleSubmit}
        className={cn(
          'relative flex flex-col w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg transition-all focus-within:border-indigo-500/50 dark:focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 p-2.5',
          className,
        )}
        data-slot="prompt-input"
        {...props}
      >
        {children}
      </form>
    </PromptInputContext.Provider>
  );
};

export type PromptInputHeaderProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputHeader: React.FC<PromptInputHeaderProps> = ({
  className,
  children,
  ...props
}) => {
  if (!children) return null;
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 px-1 pb-2 border-b border-black/5 dark:border-white/5',
        className,
      )}
      data-slot="prompt-input-header"
      {...props}
    >
      {children}
    </div>
  );
};

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputBody: React.FC<PromptInputBodyProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn('relative flex-1 min-w-0 py-1', className)}
    data-slot="prompt-input-body"
    {...props}
  >
    {children}
  </div>
);

export interface PromptInputTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

export const PromptInputTextarea: React.FC<PromptInputTextareaProps> = ({
  className,
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
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
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
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        adjustHeight();
      }}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      rows={rows}
      className={cn(
        'w-full resize-none border-none bg-transparent px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-0 leading-relaxed max-h-[180px]',
        className,
      )}
      data-slot="prompt-input-textarea"
      {...props}
    />
  );
};

export type PromptInputFooterProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputFooter: React.FC<PromptInputFooterProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center justify-between gap-2 pt-1 px-1',
      className,
    )}
    data-slot="prompt-input-footer"
    {...props}
  >
    {children}
  </div>
);

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;

export const PromptInputTools: React.FC<PromptInputToolsProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn('flex items-center gap-1.5 min-w-0 flex-wrap', className)}
    data-slot="prompt-input-tools"
    {...props}
  >
    {children}
  </div>
);

export interface PromptInputButtonProps extends ComponentProps<'button'> {
  icon?: React.ReactNode;
}

export const PromptInputButton: React.FC<PromptInputButtonProps> = ({
  className,
  children,
  icon,
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0',
      className,
    )}
    data-slot="prompt-input-button"
    {...props}
  >
    {icon}
    {children}
  </button>
);

export interface PromptInputSubmitProps extends ComponentProps<'button'> {
  status?: ChatStatus;
  onStop?: () => void;
}

export const PromptInputSubmit: React.FC<PromptInputSubmitProps> = ({
  className,
  status: statusProp,
  onStop: onStopProp,
  disabled,
  children,
  ...props
}) => {
  const context = useContext(PromptInputContext);
  const status = statusProp || context.status || 'ready';
  const onStop = onStopProp || context.onStop;

  const isStreaming = status === 'streaming';
  const isSubmitted = status === 'submitted';

  if (isStreaming) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onStop?.();
        }}
        className={cn(
          'inline-flex items-center justify-center size-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-all cursor-pointer shadow-sm shrink-0',
          className,
        )}
        title="Detener respuesta"
        data-slot="prompt-input-submit-stop"
      >
        <SquareIcon className="size-3.5 fill-current" />
      </button>
    );
  }

  if (isSubmitted) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          'inline-flex items-center justify-center size-8 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0 cursor-wait',
          className,
        )}
        title="Generando..."
        data-slot="prompt-input-submit-loading"
      >
        <Loader2Icon className="size-4 animate-spin" />
      </button>
    );
  }

  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center size-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-sm shrink-0',
        className,
      )}
      title="Enviar mensaje"
      data-slot="prompt-input-submit"
      {...props}
    >
      {children ?? <ArrowUpIcon className="size-4 stroke-[2.5]" />}
    </button>
  );
};
