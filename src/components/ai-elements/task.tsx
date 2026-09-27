import React, { type ComponentProps, type ReactNode } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { cn } from '@/utils';
import {
  ChevronDownIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  AlertCircleIcon,
  ClockIcon,
} from 'lucide-react';

export type TaskStatusType = 'pending' | 'in_progress' | 'completed' | 'error';

export interface TaskStatusProps extends ComponentProps<'div'> {
  status: TaskStatusType;
}

export const TaskStatus: React.FC<TaskStatusProps> = ({
  status,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center size-5 shrink-0 rounded-full transition-colors',
        status === 'completed' && 'text-emerald-500 bg-emerald-500/10',
        status === 'in_progress' &&
          'text-indigo-500 bg-indigo-500/10 animate-spin',
        status === 'pending' && 'text-zinc-400 bg-zinc-500/10',
        status === 'error' && 'text-rose-500 bg-rose-500/10',
        className,
      )}
      data-slot="task-status"
      {...props}
    >
      {status === 'completed' && <CheckCircle2Icon className="size-3.5" />}
      {status === 'in_progress' && <CircleDashedIcon className="size-3.5" />}
      {status === 'pending' && <ClockIcon className="size-3.5" />}
      {status === 'error' && <AlertCircleIcon className="size-3.5" />}
    </div>
  );
};

export type TaskProps = ComponentProps<typeof Collapsible>;

export const Task: React.FC<TaskProps> = ({
  defaultOpen = false,
  className,
  ...props
}) => (
  <Collapsible
    className={cn(
      'rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.015] dark:bg-white/[0.02] p-2.5 transition-all hover:bg-black/[0.03] dark:hover:bg-white/[0.04]',
      className,
    )}
    defaultOpen={defaultOpen}
    {...props}
  />
);

export type TaskTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  title?: string;
  icon?: ReactNode;
};

export const TaskTrigger: React.FC<TaskTriggerProps> = ({
  children,
  className,
  title,
  icon,
  ...props
}) => (
  <CollapsibleTrigger
    asChild
    className={cn('group cursor-pointer w-full text-left', className)}
    {...props}
  >
    {children ?? (
      <div className="flex w-full items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          {icon}
          <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
            {title}
          </span>
        </div>
        <ChevronDownIcon className="size-4 shrink-0 text-zinc-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </div>
    )}
  </CollapsibleTrigger>
);

export type TaskContentProps = ComponentProps<typeof CollapsibleContent>;

export const TaskContent: React.FC<TaskContentProps> = ({
  children,
  className,
  ...props
}) => (
  <CollapsibleContent
    className={cn(
      'mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400',
      'data-[state=closed]:animate-out data-[state=open]:animate-in',
      className,
    )}
    {...props}
  >
    {children}
  </CollapsibleContent>
);

export type TaskItemProps = ComponentProps<'div'>;

export const TaskItem: React.FC<TaskItemProps> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
