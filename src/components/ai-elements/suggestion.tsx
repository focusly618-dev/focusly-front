import React, { type ComponentProps, type HTMLAttributes } from 'react';
import { cn } from '@/utils';

export type SuggestionsProps = HTMLAttributes<HTMLDivElement>;

export const Suggestions: React.FC<SuggestionsProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto w-full px-4 py-2',
      className,
    )}
    data-slot="suggestions"
    {...props}
  >
    {children}
  </div>
);

export interface SuggestionProps extends ComponentProps<'button'> {
  icon?: React.ReactNode;
  label?: string;
  description?: string;
}

export const Suggestion: React.FC<SuggestionProps> = ({
  className,
  icon,
  label,
  description,
  children,
  ...props
}) => (
  <button
    type="button"
    className={cn(
      'flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 hover:bg-white dark:hover:bg-zinc-800 shadow-sm transition-all cursor-pointer text-left',
      className,
    )}
    data-slot="suggestion"
    {...props}
  >
    {icon && <div className="text-indigo-500 shrink-0">{icon}</div>}
    <div className="flex flex-col min-w-0">
      {label && (
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
          {label}
        </span>
      )}
      {description && (
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
          {description}
        </span>
      )}
      {children}
    </div>
  </button>
);
