/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type ComponentProps,
  type ReactNode,
} from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { cn } from '@/utils';
import { BrainIcon, ChevronDownIcon } from 'lucide-react';
import { Shimmer } from './shimmer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReasoningContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number | undefined;
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

export const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error('Reasoning components must be used within Reasoning');
  }
  return context;
};

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
};

export const Reasoning: React.FC<ReasoningProps> = ({
  className,
  isStreaming = false,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  duration: controlledDuration,
  children,
  ...props
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setIsOpen = useCallback(
    (nextOpen: boolean) => {
      setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  const [duration, setDuration] = useState<number | undefined>(
    controlledDuration,
  );
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isStreaming) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }
    } else if (startTimeRef.current !== null) {
      setDuration(Math.ceil((Date.now() - startTimeRef.current) / 1000));
      startTimeRef.current = null;
    }
  }, [isStreaming]);

  const contextValue = useMemo(
    () => ({ isStreaming, isOpen, setIsOpen, duration }),
    [isStreaming, isOpen, setIsOpen, duration],
  );

  return (
    <ReasoningContext.Provider value={contextValue}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn(
          'w-full my-2.5 rounded-xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20 px-3.5 py-2 transition-all',
          className,
        )}
        {...props}
      >
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  );
};

export type ReasoningTriggerProps = ComponentProps<
  typeof CollapsibleTrigger
> & {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode;
};

const defaultGetThinkingMessage = (isStreaming: boolean, duration?: number) => {
  if (isStreaming) {
    return <Shimmer duration={1.5}>Razonando la respuesta...</Shimmer>;
  }
  if (!duration) {
    return <span>Pensó por unos segundos</span>;
  }
  return <span>Pensó por {duration}s</span>;
};

export const ReasoningTrigger: React.FC<ReasoningTriggerProps> = ({
  className,
  children,
  getThinkingMessage = defaultGetThinkingMessage,
  ...props
}) => {
  const { isStreaming, isOpen, duration } = useReasoning();

  return (
    <CollapsibleTrigger
      className={cn(
        'flex w-full items-center justify-between gap-2 text-xs font-medium text-[#008767] dark:text-[#10B981] hover:text-[#007357] dark:hover:text-[#34D399] transition-colors cursor-pointer select-none',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <BrainIcon className="size-3.5 animate-pulse text-[#008767] dark:text-[#10B981]" />
        {children ?? getThinkingMessage(isStreaming, duration)}
      </div>
      <ChevronDownIcon
        className={cn(
          'size-3.5 text-[#008767] dark:text-[#10B981] transition-transform duration-200',
          isOpen ? 'rotate-180' : 'rotate-0',
        )}
      />
    </CollapsibleTrigger>
  );
};

export type ReasoningContentProps = ComponentProps<
  typeof CollapsibleContent
> & {
  children: string;
};

export const ReasoningContent: React.FC<ReasoningContentProps> = ({
  className,
  children,
  ...props
}) => (
  <CollapsibleContent
    className={cn(
      'mt-2 pt-2 border-t border-emerald-500/10 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono',
      'data-[state=closed]:animate-out data-[state=open]:animate-in',
      className,
    )}
    {...props}
  >
    <div className="prose prose-xs dark:prose-invert max-w-none opacity-90">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  </CollapsibleContent>
);
