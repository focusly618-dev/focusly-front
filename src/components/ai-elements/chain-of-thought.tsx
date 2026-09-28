/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
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
import {
  BrainIcon,
  ChevronDownIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  CircleIcon,
} from 'lucide-react';

interface ChainOfThoughtContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isStreaming: boolean;
}

const ChainOfThoughtContext = createContext<ChainOfThoughtContextValue | null>(
  null,
);

export const useChainOfThought = () => {
  const context = useContext(ChainOfThoughtContext);
  if (!context) {
    throw new Error(
      'ChainOfThought components must be used within ChainOfThought',
    );
  }
  return context;
};

export type ChainOfThoughtProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const ChainOfThought: React.FC<ChainOfThoughtProps> = ({
  className,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  isStreaming = false,
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

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, isStreaming }),
    [isOpen, setIsOpen, isStreaming],
  );

  return (
    <ChainOfThoughtContext.Provider value={contextValue}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn(
          'not-prose w-full rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-zinc-900/60 p-2.5 backdrop-blur-sm transition-all',
          className,
        )}
        {...props}
      >
        {children}
      </Collapsible>
    </ChainOfThoughtContext.Provider>
  );
};

export type ChainOfThoughtHeaderProps = ComponentProps<
  typeof CollapsibleTrigger
> & {
  icon?: ReactNode;
};

export const ChainOfThoughtHeader: React.FC<ChainOfThoughtHeaderProps> = ({
  className,
  icon,
  children,
  ...props
}) => {
  const { isOpen, isStreaming } = useChainOfThought();

  return (
    <CollapsibleTrigger
      className={cn(
        'flex w-full items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-[#008767] dark:hover:text-[#10B981] transition-colors cursor-pointer select-none text-left',
        className,
      )}
      {...props}
    >
      {icon ??
        (isStreaming ? (
          <CircleDashedIcon className="size-3.5 text-[#008767] animate-spin shrink-0" />
        ) : (
          <BrainIcon className="size-3.5 text-[#008767] shrink-0" />
        ))}
      <span className="flex-1 truncate">
        {children ?? 'Proceso de análisis'}
      </span>
      <ChevronDownIcon
        className={cn(
          'size-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ml-auto',
          isOpen ? 'rotate-180' : 'rotate-0',
        )}
      />
    </CollapsibleTrigger>
  );
};

export type ChainOfThoughtStepStatus = 'complete' | 'active' | 'pending';

export type ChainOfThoughtStepProps = ComponentProps<'div'> & {
  icon?: React.ComponentType<{ className?: string }>;
  label: ReactNode;
  description?: ReactNode;
  status?: ChainOfThoughtStepStatus;
};

const stepStatusStyles: Record<ChainOfThoughtStepStatus, string> = {
  active: 'text-[#008767] dark:text-[#10B981] font-medium',
  complete: 'text-zinc-500 dark:text-zinc-400',
  pending: 'text-zinc-400/60 dark:text-zinc-600',
};

export const ChainOfThoughtStep: React.FC<ChainOfThoughtStepProps> = ({
  className,
  icon: Icon,
  label,
  description,
  status = 'complete',
  children,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center gap-2 text-xs py-1 transition-all',
      stepStatusStyles[status],
      className,
    )}
    {...props}
  >
    <div className="relative flex items-center justify-center shrink-0 size-4">
      {status === 'complete' && (
        <CheckCircle2Icon className="size-3.5 text-emerald-500" />
      )}
      {status === 'active' && (
        <CircleDashedIcon className="size-3.5 text-[#008767] animate-spin" />
      )}
      {status === 'pending' && (
        <CircleIcon className="size-2 text-zinc-300 dark:text-zinc-700" />
      )}
    </div>

    {Icon && <Icon className="size-3.5 shrink-0 opacity-75" />}

    <div className="flex-1 min-w-0 truncate">
      <div className="truncate">{label}</div>
      {description && (
        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">
          {description}
        </div>
      )}
      {children}
    </div>
  </div>
);

export type ChainOfThoughtContentProps = ComponentProps<
  typeof CollapsibleContent
>;

export const ChainOfThoughtContent: React.FC<ChainOfThoughtContentProps> = ({
  className,
  children,
  ...props
}) => (
  <CollapsibleContent
    className={cn(
      'mt-2.5 pt-2 border-t border-emerald-500/10 space-y-1.5',
      'data-[state=closed]:animate-out data-[state=open]:animate-in',
      className,
    )}
    {...props}
  >
    {children}
  </CollapsibleContent>
);

export const ChainOfThoughtSearchResults: React.FC<ComponentProps<'div'>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('flex flex-wrap gap-1.5 pt-1', className)} {...props}>
    {children}
  </div>
);

export const ChainOfThoughtSearchResult: React.FC<ComponentProps<'span'>> = ({
  className,
  children,
  ...props
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/15',
      className,
    )}
    {...props}
  >
    {children}
  </span>
);
