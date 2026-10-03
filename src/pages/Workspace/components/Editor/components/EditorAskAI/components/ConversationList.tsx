import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AddCommentOutlined as NewChatIcon,
  DeleteOutline as DeleteIcon,
  ChatBubbleOutline as ChatIcon,
} from '@mui/icons-material';
import type { EditorConversationSummary } from '@/api/AI/editorAssistant';
import { ConversationRow } from '../EditorAskAI.styles';

interface ConversationListProps {
  conversations: EditorConversationSummary[];
  status: 'idle' | 'loading' | 'loaded' | 'error';
  activeId: string | null;
  /** Switching is blocked while a reply streams or a change awaits review. */
  disabled: boolean;
  onOpen: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onNew: () => void;
  onReload: () => void;
}

// The server stores naive UTC timestamps (no offset in the ISO string).
const parseServerDate = (value: string) =>
  new Date(/[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`);

export const ConversationList = ({
  conversations,
  status,
  activeId,
  disabled,
  onOpen,
  onDelete,
  onNew,
  onReload,
}: ConversationListProps) => {
  const { t, i18n } = useTranslation();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parseServerDate(value));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', flex: 1 }}>
          {t('editorAI.history.title')}
        </Typography>
        <Button
          size="small"
          startIcon={<NewChatIcon sx={{ fontSize: 16 }} />}
          onClick={onNew}
          disabled={disabled}
          sx={{ px: 1.25, py: 0.5 }}
        >
          {t('editorAI.header.newChat')}
        </Button>
      </Box>

      {status === 'loading' && conversations.length === 0 && (
        <Box>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" height={52} sx={{ mb: 1 }} />
          ))}
        </Box>
      )}

      {status === 'error' && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('editorAI.history.loadError')}
          </Typography>
          <Button size="small" onClick={onReload}>
            {t('editorAI.message.retry')}
          </Button>
        </Box>
      )}

      {status === 'loaded' && conversations.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 3 }}
        >
          {t('editorAI.history.empty')}
        </Typography>
      )}

      {conversations.map((conversation) => {
        const isActive = conversation.id === activeId;
        const confirming = confirmingId === conversation.id;
        return (
          <ConversationRow
            key={conversation.id}
            active={isActive}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-current={isActive ? 'true' : undefined}
            aria-disabled={disabled || undefined}
            onClick={() => !disabled && !confirming && onOpen(conversation.id)}
            onKeyDown={(e) => {
              if (
                (e.key === 'Enter' || e.key === ' ') &&
                !disabled &&
                !confirming
              ) {
                e.preventDefault();
                onOpen(conversation.id);
              }
            }}
          >
            <ChatIcon
              sx={{
                fontSize: 16,
                color: isActive ? 'primary.main' : 'text.secondary',
                mt: 0.25,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                noWrap
                sx={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 600 }}
              >
                {conversation.preview ||
                  conversation.title ||
                  t('editorAI.history.untitled')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isActive
                  ? `${t('editorAI.history.active')} · ${formatDate(conversation.updatedAt)}`
                  : formatDate(conversation.updatedAt)}
              </Typography>
            </Box>
            {confirming ? (
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {t('editorAI.history.confirmDelete')}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    setConfirmingId(null);
                    onDelete(conversation.id);
                  }}
                  sx={{ minWidth: 0, px: 1, py: 0.25 }}
                >
                  {t('editorAI.history.yes')}
                </Button>
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => setConfirmingId(null)}
                  sx={{ minWidth: 0, px: 1, py: 0.25 }}
                >
                  {t('editorAI.history.no')}
                </Button>
              </Box>
            ) : (
              <Tooltip title={t('editorAI.history.delete')}>
                <span>
                  <IconButton
                    size="small"
                    className="conversation-delete"
                    disabled={disabled}
                    aria-label={t('editorAI.history.delete')}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmingId(conversation.id);
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </ConversationRow>
        );
      })}
    </Box>
  );
};
