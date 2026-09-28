import React, { type ComponentProps, type HTMLAttributes, memo } from 'react';
import { cn } from '@/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  from: MessageRole;
}

export const Message: React.FC<MessageProps> = ({
  className,
  from,
  children,
  ...props
}) => (
  <div
    className={cn(
      'group flex w-full flex-col gap-2 my-1.5 transition-all',
      from === 'user'
        ? 'is-user items-end ml-auto'
        : 'is-assistant items-start mr-auto',
      className,
    )}
    data-slot="message"
    data-role={from}
    {...props}
  >
    {children}
  </div>
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent: React.FC<MessageContentProps> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex w-fit min-w-0 max-w-[90%] md:max-w-[85%] flex-col gap-2 overflow-hidden text-sm leading-relaxed transition-all',
      'group-[.is-user]:rounded-2xl group-[.is-user]:rounded-tr-sm group-[.is-user]:bg-gradient-to-r group-[.is-user]:from-[#008767] group-[.is-user]:to-[#059669] group-[.is-user]:px-4 group-[.is-user]:py-2.5 group-[.is-user]:text-white group-[.is-user]:shadow-md',
      'group-[.is-assistant]:rounded-2xl group-[.is-assistant]:rounded-tl-sm group-[.is-assistant]:bg-black/[0.03] dark:group-[.is-assistant]:bg-white/[0.04] group-[.is-assistant]:border group-[.is-assistant]:border-black/5 dark:group-[.is-assistant]:border-white/5 group-[.is-assistant]:px-4.5 group-[.is-assistant]:py-3.5 group-[.is-assistant]:text-zinc-900 dark:group-[.is-assistant]:text-zinc-100',
      className,
    )}
    data-slot="message-content"
    {...props}
  >
    {children}
  </div>
);

export interface MessageResponseProps extends HTMLAttributes<HTMLDivElement> {
  children?: string;
  dangerouslySetInnerHTML?: { __html: string };
}

export const MessageResponse: React.FC<MessageResponseProps> = memo(
  ({ children, dangerouslySetInnerHTML, className, ...props }) => {
    if (dangerouslySetInnerHTML) {
      return (
        <div
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          className={cn(
            'prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed [&>p]:mb-2.5 [&>p:last-child]:mb-0',
            className,
          )}
          data-slot="message-response"
          {...props}
        />
      );
    }

    if (!children) return null;

    return (
      <div
        className={cn(
          'prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed [&>p]:mb-2.5 [&>p:last-child]:mb-0',
          className,
        )}
        data-slot="message-response"
        {...props}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
      </div>
    );
  },
);

export type MessageActionsProps = HTMLAttributes<HTMLDivElement>;

export const MessageActions: React.FC<MessageActionsProps> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity mt-1',
      className,
    )}
    data-slot="message-actions"
    {...props}
  >
    {children}
  </div>
);

export interface MessageActionProps extends ComponentProps<'button'> {
  icon?: React.ReactNode;
}

export const MessageAction: React.FC<MessageActionProps> = ({
  className,
  children,
  icon,
  ...props
}) => (
  <button
    type="button"
    className={cn(
      'inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer',
      className,
    )}
    data-slot="message-action"
    {...props}
  >
    {icon}
    {children}
  </button>
);
