/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useMemo,
  type ComponentProps,
} from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { cn } from '@/utils';
import { ChevronsUpDownIcon } from 'lucide-react';
import { Shimmer } from './shimmer';

interface PlanContextValue {
  isStreaming: boolean;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('Plan components must be used within Plan');
  }
  return context;
};

export type PlanProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
};

export const Plan: React.FC<PlanProps> = ({
  className,
  isStreaming = false,
  children,
  defaultOpen = true,
  ...props
}) => {
  const contextValue = useMemo(() => ({ isStreaming }), [isStreaming]);

  return (
    <PlanContext.Provider value={contextValue}>
      <Collapsible
        defaultOpen={defaultOpen}
        className={cn(
          'w-full rounded-2xl border border-white/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm transition-all overflow-hidden',
          className,
        )}
        {...props}
      >
        {children}
      </Collapsible>
    </PlanContext.Provider>
  );
};

export type PlanHeaderProps = ComponentProps<'div'>;

export const PlanHeader: React.FC<PlanHeaderProps> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center justify-between gap-3 px-4 py-3 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]',
      className,
    )}
    data-slot="plan-header"
    {...props}
  />
);

export type PlanTitleProps = ComponentProps<'h4'>;

export const PlanTitle: React.FC<PlanTitleProps> = ({
  children,
  className,
  ...props
}) => {
  const { isStreaming } = usePlan();

  return (
    <h4
      className={cn(
        'text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2',
        className,
      )}
      data-slot="plan-title"
      {...props}
    >
      {isStreaming && typeof children === 'string' ? (
        <Shimmer>{children}</Shimmer>
      ) : (
        children
      )}
    </h4>
  );
};

export type PlanDescriptionProps = ComponentProps<'p'>;

export const PlanDescription: React.FC<PlanDescriptionProps> = ({
  className,
  children,
  ...props
}) => {
  const { isStreaming } = usePlan();

  return (
    <p
      className={cn('text-xs text-zinc-500 dark:text-zinc-400', className)}
      data-slot="plan-description"
      {...props}
    >
      {isStreaming && typeof children === 'string' ? (
        <Shimmer>{children}</Shimmer>
      ) : (
        children
      )}
    </p>
  );
};

export type PlanActionProps = ComponentProps<'div'>;

export const PlanAction: React.FC<PlanActionProps> = ({
  className,
  ...props
}) => (
  <div
    className={cn('flex items-center gap-2', className)}
    data-slot="plan-action"
    {...props}
  />
);

export type PlanContentProps = ComponentProps<typeof CollapsibleContent>;

export const PlanContent: React.FC<PlanContentProps> = ({
  className,
  children,
  ...props
}) => (
  <CollapsibleContent
    className={cn(
      'px-4 py-3 space-y-2.5 transition-all data-[state=closed]:animate-out data-[state=open]:animate-in',
      className,
    )}
    data-slot="plan-content"
    {...props}
  >
    {children}
  </CollapsibleContent>
);

export type PlanFooterProps = ComponentProps<'div'>;

export const PlanFooter: React.FC<PlanFooterProps> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center justify-between px-4 py-2.5 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]',
      className,
    )}
    data-slot="plan-footer"
    {...props}
  />
);

export type PlanTriggerProps = ComponentProps<typeof CollapsibleTrigger>;

export const PlanTrigger: React.FC<PlanTriggerProps> = ({
  className,
  ...props
}) => (
  <CollapsibleTrigger
    className={cn(
      'inline-flex items-center justify-center size-8 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer',
      className,
    )}
    data-slot="plan-trigger"
    {...props}
  >
    <ChevronsUpDownIcon className="size-4" />
    <span className="sr-only">Toggle plan</span>
  </CollapsibleTrigger>
);
