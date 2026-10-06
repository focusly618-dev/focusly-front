import { useEffect, useRef, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowUpward as SendIcon,
  StopRounded as StopIcon,
  Close as CloseIcon,
  KeyboardArrowDown as MinimizeIcon,
  AddCommentOutlined as NewChatIcon,
  HistoryRounded as HistoryIcon,
  ArrowBackRounded as BackIcon,
  FormatQuote as QuoteIcon,
} from '@mui/icons-material';
import { LuminaAnimatedFace } from '@/components/ui';
import type { MarkdownEditorRef } from '../../codemirror/MarkdownEditor.types';
import { useEditorAskAI } from './useEditorAskAI.hook';
import { AssistantMessage } from './components/AssistantMessage';
import { UserMessage } from './components/UserMessage';
import { QuickActions } from './components/QuickActions';
import { ConversationList } from './components/ConversationList';
import { EditorProGate } from './components/EditorProGate';
import { useBilling } from '@/hooks/useBilling';
import {
  AvatarFrame,
  ContextChip,
  Dock,
  Footer,
  InputShell,
  Kbd,
  Launcher,
  Panel,
  PanelHeader,
  ReadyDot,
  ReviewBar,
  SendButton,
  ThinkingDots,
  Thread,
} from './EditorAskAI.styles';

interface EditorAskAIProps {
  markdownEditorRef: RefObject<MarkdownEditorRef | null>;
  // Live-tracked selection from the editor (see MarkdownEditor's
  // onSelectionChange) — only ever changes from a real selection change
  // inside the editor, never from focusing this panel's own input.
  selectedText: string;
  /** The open document: its id keys the saved threads. */
  workspaceId?: string | null;
  documentTitle?: string;
}

const isMac =
  typeof navigator !== 'undefined' &&
  /mac|iphone|ipad/i.test(navigator.userAgent);
const SHORTCUT = isMac ? '⌘J' : 'Ctrl J';

export const EditorAskAI = ({
  markdownEditorRef,
  selectedText,
  workspaceId,
  documentTitle,
}: EditorAskAIProps) => {
  const { t } = useTranslation();
  const { isPro } = useBilling();
  const ai = useEditorAskAI({
    markdownEditorRef,
    workspaceId,
    documentTitle,
    selectedText,
  });

  const threadRef = useRef<HTMLDivElement>(null);
  // Follow new text only while the user is reading at the bottom.
  const stickToBottom = useRef(true);
  useEffect(() => {
    const thread = threadRef.current;
    if (thread && stickToBottom.current) thread.scrollTop = thread.scrollHeight;
  }, [ai.messages, ai.view]);

  const canEdit = !ai.isBusy;
  const lastAssistantId = [...ai.messages]
    .reverse()
    .find((m) => m.role === 'assistant')?.id;
  const selectionPreview = selectedText.trim().replace(/\s+/g, ' ');

  if (!ai.isOpen) {
    return (
      <Dock>
        <Launcher
          onClick={ai.open}
          aria-keyshortcuts={isMac ? 'Meta+J' : 'Control+J'}
        >
          <LuminaAnimatedFace size={22} />
          <Typography variant="body2" fontWeight={700} color="text.primary">
            {ai.isStreaming
              ? t('editorAI.launcherWriting')
              : ai.unseen
                ? t('editorAI.launcherReady')
                : t('editorAI.launcher')}
          </Typography>
          {ai.isStreaming ? (
            <ThinkingDots aria-hidden>
              <span />
              <span />
              <span />
            </ThinkingDots>
          ) : ai.unseen ? (
            <ReadyDot aria-hidden />
          ) : (
            <Kbd>{SHORTCUT}</Kbd>
          )}
        </Launcher>
      </Dock>
    );
  }

  return (
    <Dock>
      <Panel role="dialog" aria-label={t('editorAI.header.title')}>
        <PanelHeader>
          {ai.view === 'history' ? (
            <Tooltip title={t('editorAI.history.back')}>
              <IconButton
                size="small"
                onClick={ai.showChat}
                aria-label={t('editorAI.history.back')}
              >
                <BackIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <AvatarFrame>
              <LuminaAnimatedFace size={20} />
            </AvatarFrame>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.2 }}
            >
              {t('editorAI.header.title')}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: 'block' }}
            >
              {t('editorAI.header.subtitle', {
                title: documentTitle?.trim() || t('editorAI.untitled'),
              })}
            </Typography>
          </Box>
          {ai.canPersist && ai.view === 'chat' && (
            <Tooltip title={t('editorAI.history.open')}>
              <IconButton
                size="small"
                onClick={ai.showHistory}
                aria-label={t('editorAI.history.open')}
              >
                <HistoryIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t('editorAI.header.newChat')}>
            <span>
              <IconButton
                size="small"
                onClick={ai.newConversation}
                disabled={ai.messages.length === 0 || ai.hasPendingDiff}
                aria-label={t('editorAI.header.newChat')}
              >
                <NewChatIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={`${t('editorAI.header.minimize')} (${SHORTCUT})`}>
            <span>
              <IconButton
                size="small"
                onClick={ai.close}
                disabled={ai.hasPendingDiff}
                aria-label={t('editorAI.header.minimize')}
              >
                <MinimizeIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </span>
          </Tooltip>
        </PanelHeader>

        <Thread
          ref={threadRef}
          aria-live="polite"
          onScroll={(e) => {
            const el = e.currentTarget;
            stickToBottom.current =
              el.scrollHeight - el.scrollTop - el.clientHeight < 48;
          }}
        >
          {ai.view === 'history' ? (
            <ConversationList
              conversations={ai.session.conversations}
              status={ai.session.conversationsStatus}
              activeId={ai.session.conversationId}
              disabled={ai.isBusy}
              onOpen={ai.openConversation}
              onDelete={ai.deleteConversation}
              onNew={ai.newConversation}
              onReload={ai.reloadConversations}
            />
          ) : ai.isLoadingHistory && ai.messages.length === 0 ? (
            <Box>
              <Skeleton width="55%" sx={{ ml: 'auto' }} height={36} />
              <Skeleton width="80%" height={64} />
            </Box>
          ) : ai.messages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 2, px: 1 }}>
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                {t('editorAI.empty.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ai.hasSelection
                  ? t('editorAI.empty.withSelection')
                  : t('editorAI.empty.description')}
              </Typography>
            </Box>
          ) : (
            ai.messages.map((message) =>
              message.role === 'user' ? (
                <UserMessage key={message.id} content={message.content} />
              ) : (
                <AssistantMessage
                  key={message.id}
                  message={message}
                  isLast={message.id === lastAssistantId}
                  workspaceId={workspaceId}
                  canEdit={canEdit}
                  hasSelection={ai.hasSelection}
                  onCopy={ai.copy}
                  onInsert={ai.insertText}
                  onRetry={ai.retry}
                  onReviewEdit={ai.reviewEdit}
                />
              ),
            )
          )}
        </Thread>

        {ai.view === 'chat' && !isPro && (
          <Footer>
            <EditorProGate />
          </Footer>
        )}

        {ai.view === 'chat' && isPro && (
          <Footer>
            {ai.hasPendingDiff ? (
              <ReviewBar>
                <Typography variant="body2" sx={{ flex: 1, minWidth: 180 }}>
                  {t('editorAI.diff.review')}
                </Typography>
                <Button
                  size="small"
                  color="inherit"
                  variant="outlined"
                  onClick={() => ai.resolveDiff('reject')}
                  sx={{ px: 1.5, py: 0.5 }}
                >
                  {t('editorAI.diff.discard')}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => ai.resolveDiff('accept')}
                  sx={{ px: 1.5, py: 0.5 }}
                >
                  {t('editorAI.diff.accept')}
                </Button>
              </ReviewBar>
            ) : (
              <QuickActions
                hasSelection={ai.hasSelection}
                disabled={ai.isBusy}
                onRun={ai.runAction}
              />
            )}

            {ai.hasSelection && !ai.hasPendingDiff && (
              <ContextChip>
                <QuoteIcon />
                <Box
                  component="span"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ai.selectionAttached
                    ? t('editorAI.selection.attached', {
                        text: selectionPreview,
                      })
                    : t('editorAI.selection.detached')}
                </Box>
                {ai.selectionAttached ? (
                  <IconButton
                    size="small"
                    onClick={ai.detachSelection}
                    aria-label={t('editorAI.selection.detach')}
                    sx={{ p: 0.25 }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                ) : (
                  <Button
                    size="small"
                    onClick={ai.attachSelection}
                    sx={{ minWidth: 0, px: 0.75, py: 0, fontSize: '0.75rem' }}
                  >
                    {t('editorAI.selection.attach')}
                  </Button>
                )}
              </ContextChip>
            )}

            <InputShell>
              <InputBase
                autoFocus
                fullWidth
                multiline
                maxRows={6}
                value={ai.inputValue}
                disabled={ai.hasPendingDiff}
                placeholder={
                  ai.selectionAttached
                    ? t('editorAI.input.placeholderSelection')
                    : t('editorAI.input.placeholder')
                }
                onChange={(e) => ai.setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    ai.submit();
                  }
                  if (e.key === 'Escape') ai.close();
                }}
                inputProps={{ 'aria-label': t('editorAI.input.placeholder') }}
                sx={{ fontSize: '0.875rem', py: 0.6, color: 'text.primary' }}
              />
              {ai.isStreaming ? (
                <Tooltip title={t('editorAI.message.stop')}>
                  <SendButton
                    active
                    onClick={ai.stop}
                    aria-label={t('editorAI.message.stop')}
                  >
                    <StopIcon sx={{ fontSize: 18 }} />
                  </SendButton>
                </Tooltip>
              ) : (
                <SendButton
                  active={Boolean(ai.inputValue.trim()) && !ai.isBusy}
                  disabled={!ai.inputValue.trim() || ai.isBusy}
                  onClick={ai.submit}
                  aria-label={t('editorAI.input.send')}
                >
                  <SendIcon sx={{ fontSize: 18 }} />
                </SendButton>
              )}
            </InputShell>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: 'center', fontSize: '0.7rem' }}
            >
              {ai.isStreaming
                ? t('editorAI.backgroundHint')
                : t('editorAI.disclaimer')}
            </Typography>
          </Footer>
        )}
      </Panel>
    </Dock>
  );
};
