import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import {
  ContentCopy as CopyIcon,
  KeyboardReturn as InsertIcon,
  FindReplace as ReplaceIcon,
  Replay as RetryIcon,
  EditNoteOutlined as EditIcon,
} from '@mui/icons-material';
import { ActionPlan } from '@/components/chat/actionPlan/ActionPlan';
import {
  linkActionsToWorkspace,
  parseAssistantReply,
} from '../editorAssistant.utils';
import type { EditorChatMessage } from '../useEditorAskAI.hook';
import {
  AssistantBlock,
  AssistantBubble,
  FragmentBox,
  MessageActionButton,
  MessageActions,
  StatusLine,
  ThinkingDots,
} from '../EditorAskAI.styles';
import { ReplyMarkdown } from '@/components/chat/ReplyMarkdown';

interface AssistantMessageProps {
  message: EditorChatMessage;
  isLast: boolean;
  workspaceId?: string | null;
  /** Inserting is blocked while a reply streams or a diff awaits review. */
  canEdit: boolean;
  hasSelection: boolean;
  onCopy: (text: string) => void;
  onInsert: (text: string, mode: 'cursor' | 'replaceSelection') => void;
  onRetry: () => void;
  onReviewEdit: (messageId: string) => void;
}

export const AssistantMessage = ({
  message,
  isLast,
  workspaceId,
  canEdit,
  hasSelection,
  onCopy,
  onInsert,
  onRetry,
  onReviewEdit,
}: AssistantMessageProps) => {
  const { t } = useTranslation();
  const isStreaming = message.status === 'streaming';
  const reply = parseAssistantReply(message.content, {
    complete: !isStreaming,
  });
  const actions = reply.actions.length
    ? reply.actions
    : (message.actions ?? []);
  const proposedEdit = Boolean(reply.edit || reply.replacement);
  const showBubble = Boolean(reply.note) || isStreaming;

  return (
    <AssistantBlock>
      {showBubble && (
        <AssistantBubble>
          {reply.note ? (
            <ReplyMarkdown>{reply.note}</ReplyMarkdown>
          ) : (
            <StatusLine sx={{ mt: 0 }}>
              <ThinkingDots aria-hidden>
                <span />
                <span />
                <span />
              </ThinkingDots>
              {t('editorAI.status.thinking')}
            </StatusLine>
          )}
          {isStreaming && reply.isPreparingEdit && (
            <StatusLine>
              <ThinkingDots aria-hidden>
                <span />
                <span />
                <span />
              </ThinkingDots>
              {t('editorAI.status.preparingEdit')}
            </StatusLine>
          )}
          {isStreaming && reply.isPreparingActions && (
            <StatusLine>
              <ThinkingDots aria-hidden>
                <span />
                <span />
                <span />
              </ThinkingDots>
              {t('editorAI.status.preparingTasks')}
            </StatusLine>
          )}
          {!isStreaming &&
            proposedEdit &&
            !message.unappliedFragment &&
            !message.unappliedEdit && (
              <StatusLine>
                <EditIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                {t('editorAI.status.editProposed')}
              </StatusLine>
            )}
        </AssistantBubble>
      )}

      {message.unappliedEdit && (
        <FragmentBox>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 0.75 }}
          >
            {t('editorAI.fragment.editChanged')}
          </Typography>
          <MessageActionButton
            disabled={!canEdit}
            onClick={() => onReviewEdit(message.id)}
          >
            <EditIcon />
            {t('editorAI.message.reviewEdit')}
          </MessageActionButton>
        </FragmentBox>
      )}

      {message.unappliedFragment && (
        <FragmentBox>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 0.75 }}
          >
            {t('editorAI.fragment.docChanged')}
          </Typography>
          <ReplyMarkdown>{message.unappliedFragment}</ReplyMarkdown>
          <MessageActions>
            <MessageActionButton
              disabled={!canEdit}
              onClick={() =>
                onInsert(message.unappliedFragment ?? '', 'cursor')
              }
            >
              <InsertIcon />
              {t('editorAI.message.insertAtCursor')}
            </MessageActionButton>
            {hasSelection && (
              <MessageActionButton
                disabled={!canEdit}
                onClick={() =>
                  onInsert(message.unappliedFragment ?? '', 'replaceSelection')
                }
              >
                <ReplaceIcon />
                {t('editorAI.message.replaceSelection')}
              </MessageActionButton>
            )}
            <MessageActionButton
              onClick={() => onCopy(message.unappliedFragment ?? '')}
            >
              <CopyIcon />
              {t('editorAI.message.copy')}
            </MessageActionButton>
          </MessageActions>
        </FragmentBox>
      )}

      {!isStreaming && actions.length > 0 && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <ActionPlan actions={linkActionsToWorkspace(actions, workspaceId)} />
        </Box>
      )}

      {message.status === 'stopped' && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          {t('editorAI.status.stopped')}
        </Typography>
      )}
      {message.status === 'error' && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {t('editorAI.status.error')}
        </Typography>
      )}

      {!isStreaming && (
        <MessageActions>
          {reply.note && (
            <>
              <MessageActionButton onClick={() => onCopy(reply.note)}>
                <CopyIcon />
                {t('editorAI.message.copy')}
              </MessageActionButton>
              <MessageActionButton
                disabled={!canEdit}
                onClick={() => onInsert(reply.note, 'cursor')}
              >
                <InsertIcon />
                {t('editorAI.message.insertAtCursor')}
              </MessageActionButton>
              {hasSelection && (
                <MessageActionButton
                  disabled={!canEdit}
                  onClick={() => onInsert(reply.note, 'replaceSelection')}
                >
                  <ReplaceIcon />
                  {t('editorAI.message.replaceSelection')}
                </MessageActionButton>
              )}
            </>
          )}
          {isLast && (
            <MessageActionButton disabled={!canEdit} onClick={onRetry}>
              <RetryIcon />
              {t('editorAI.message.retry')}
            </MessageActionButton>
          )}
        </MessageActions>
      )}
    </AssistantBlock>
  );
};
