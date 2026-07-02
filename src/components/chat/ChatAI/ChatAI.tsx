import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  Box,
  Typography,
  Slide,
  Grow,
  Zoom,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  AutoAwesome as AutoAwesomeIcon,
  KeyboardArrowDown as ArrowDownIcon,
  RadioButtonChecked as TokenIcon,
} from '@mui/icons-material';
import { CuteRobotIcon, ClaudeIcon, GeminiIcon } from '@/components/ui';
import {
  useLocalRuntime,
  AssistantRuntimeProvider,
  useAuiState,
  useThreadRuntime,
} from '@assistant-ui/react';
import type { ChatModelAdapter } from '@assistant-ui/react';
import { fetchChatStreamResponse } from '@/api/AI/apiAI';
import { SuggestedActionCard } from '@/components/chat/suggestedActionCard/SuggestedActionCard';
import { parseLuminaAction } from '@/utils/lumina';
import {
  ChatContainer,
  FloatingButton,
  NotificationCard,
  ChatWindow,
  Header,
  ModelBadgeButton,
  TokenCounterBadge,
  MessageList,
  MessageRow,
  MessageBubble,
  AIAvatar,
  RobotIconWrapper,
  TypingIndicator,
  SuggestionGrid,
  SuggestionChip,
  InputArea,
  ChatInputWrapper,
  ChatTextArea,
  SendButton,
} from './ChatAI.styles';

const renderMarkdown = (text: string, isDark: boolean) => {
  if (!text) return '';

  // 1. Escape HTML
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 3. Inline code: `code` -> <code>code</code>
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // 4. Links: [text](url) -> <a href="$2" target="_blank" rel="noopener noreferrer">$1</a>
  html = html.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline; font-weight: 600;">$1</a>',
  );

  // 5. Lists: lines starting with "- " or "* " -> <li>...</li>
  const lines = html.split('\n');
  let inList = false;
  let inTable = false;
  let tableLines: string[] = [];
  const processedLines: string[] = [];

  const flushTable = () => {
    if (tableLines.length === 0) return;

    // Parse tableLines into rows and columns
    const rows = tableLines.map((line) => {
      const parts = line.replace(/^\|/, '').replace(/\|$/, '').split('|');
      return parts.map((p) => p.trim());
    });

    if (rows.length > 0) {
      const borderColor = isDark
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(0,0,0,0.08)';
      const headerBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
      const rowBg = isDark ? 'rgba(15,23,42,0.15)' : 'rgba(255,255,255,0.95)';
      const thColor = isDark ? '#f8fafc' : '#0f172a';
      const tdColor = isDark ? '#e2e8f0' : '#334155';
      const rowBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

      let tableHtml = `<div style="overflow-x: auto; margin: 12px 0; border-radius: 8px; border: 1px solid ${borderColor}; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); alignment-adjust: central;">`;
      tableHtml += `<table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; background: ${rowBg}; backdrop-filter: blur(4px); table-layout: auto;">`;

      // Determine if second line is a Markdown table separator line
      const hasHeader =
        tableLines.length > 1 &&
        (tableLines[1].includes('---') || tableLines[1].includes('-|-'));

      let startIdx = 0;
      if (hasHeader) {
        tableHtml += `<thead><tr style="background: ${headerBg}; border-bottom: 1.5px solid ${borderColor};">`;
        rows[0].forEach((cell) => {
          tableHtml += `<th style="padding: 10px 14px; font-weight: 600; color: ${thColor};">${cell}</th>`;
        });
        tableHtml += '</tr></thead>';
        startIdx = 2; // Skip header row and separator line
      }

      tableHtml += '<tbody>';
      for (let i = startIdx; i < rows.length; i++) {
        const row = rows[i];
        if (row.length === 1 && row[0] === '') continue;

        tableHtml += `<tr style="border-bottom: 1px solid ${rowBorder}; transition: background-color 0.15s;">`;
        row.forEach((cell) => {
          tableHtml += `<td style="padding: 10px 14px; color: ${tdColor}; vertical-align: middle;">${cell}</td>`;
        });
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody></table></div>';
      processedLines.push(tableHtml);
    }

    tableLines = [];
    inTable = false;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const isTableLine =
      trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 1;

    if (isTableLine) {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      inTable = true;
      tableLines.push(trimmed);
    } else {
      if (inTable) {
        flushTable();
      }

      if (trimmed.startsWith('### ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        const titleText = trimmed.substring(4);
        const color = isDark ? '#f8fafc' : '#0f172a';
        processedLines.push(
          `<h3 style="margin: 14px 0 6px 0; font-size: 14px; font-weight: 700; color: ${color};">${titleText}</h3>`,
        );
      } else if (trimmed.startsWith('## ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        const titleText = trimmed.substring(3);
        const color = isDark ? '#f8fafc' : '#0f172a';
        processedLines.push(
          `<h2 style="margin: 18px 0 8px 0; font-size: 16px; font-weight: 700; color: ${color}; border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}; padding-bottom: 4px;">${titleText}</h2>`,
        );
      } else if (trimmed.startsWith('# ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        const titleText = trimmed.substring(2);
        const color = isDark ? '#f8fafc' : '#0f172a';
        processedLines.push(
          `<h1 style="margin: 22px 0 10px 0; font-size: 18px; font-weight: 800; color: ${color};">${titleText}</h1>`,
        );
      } else if (trimmed.startsWith('> ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        const quoteText = trimmed.substring(2);
        const quoteBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
        const quoteColor = isDark ? '#cbd5e1' : '#475569';
        processedLines.push(
          `<blockquote style="margin: 10px 0; padding: 8px 14px; background: ${quoteBg}; border-left: 4px solid #3b82f6; border-radius: 0 6px 6px 0; color: ${quoteColor}; font-style: italic; font-size: 13.5px; line-height: 1.6;">${quoteText}</blockquote>`,
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          processedLines.push(
            '<ul style="margin: 6px 0; padding-left: 20px;">',
          );
          inList = true;
        }
        processedLines.push(
          `<li style="margin-bottom: 4px;">${trimmed.substring(2)}</li>`,
        );
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        if (trimmed === '') {
          processedLines.push('<p style="margin: 0; min-height: 8px;"></p>');
        } else {
          processedLines.push(
            `<p style="margin: 0; margin-bottom: 6px;">${line}</p>`,
          );
        }
      }
    }
  }

  if (inTable) {
    flushTable();
  }
  if (inList) {
    processedLines.push('</ul>');
  }

  return processedLines.join('\n');
};

const getModelLabel = (model: string) => {
  switch (model) {
    case 'claude-3-5-sonnet':
      return 'Claude 3.5 Sonnet';
    case 'claude-3-5-haiku':
      return 'Claude 3.5 Haiku';
    case 'claude-3-opus':
      return 'Claude 3 Opus';
    case 'gemini-2.5-flash-lite':
      return 'Gemini Flash Lite';
    case 'gemini-2.5-flash':
      return 'Gemini Flash 2.5';
    case 'gemini-1.5-flash':
      return 'Gemini Flash 1.5';
    default:
      return 'AI Model';
  }
};

const getModelIcon = (model: string, isMenu: boolean = false) => {
  const size = isMenu ? 16 : 14;
  const mr = isMenu ? 1.5 : 0.5;
  if (model.startsWith('claude')) {
    return <ClaudeIcon sx={{ fontSize: size, color: '#cc6543', mr }} />;
  }
  return <GeminiIcon sx={{ fontSize: size, color: '#137fec', mr }} />;
};

interface ChatAIInnerProps {
  setIsOpen: (open: boolean) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ChatAIInner = ({
  setIsOpen,
  selectedModel,
  setSelectedModel,
}: ChatAIInnerProps) => {
  const theme = useTheme();
  const messages = useAuiState((s) => s.thread.messages);
  const isRunning = useAuiState((s) => s.thread.isRunning);
  const thread = useThreadRuntime();
  const [chatInput, setChatInput] = useState('');
  const [modelAnchor, setModelAnchor] = useState<null | HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isRunning, scrollToBottom]);

  const handleSend = () => {
    if (!chatInput.trim() || isRunning) return;
    const content = chatInput;
    setChatInput('');
    thread.append({
      role: 'user',
      content: [{ type: 'text', text: content }],
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    thread.append({
      role: 'user',
      content: [{ type: 'text', text: prompt }],
    });
  };

  // Real-time token tracking based on message characters (1 token ≈ 4 characters) + 150 prompt base overhead
  const tokensSpent = useMemo(() => {
    let total = 0;
    messages.forEach((msg) => {
      const m = msg as unknown as {
        content: Array<{ type: string; text?: string }>;
      };
      const textContent = m.content
        .filter((p) => p.type === 'text')
        .map((p) => p.text || '')
        .join('\n');
      total += Math.ceil(textContent.length / 4);
    });
    if (messages.length > 0) {
      total += 150;
    }
    return total;
  }, [messages]);

  return (
    <ChatWindow elevation={0}>
      {/* Header */}
      <Header>
        <Box display="flex" alignItems="center" gap={1.5}>
          <RobotIconWrapper>
            <CuteRobotIcon
              size={20}
              variant="mini"
              primaryColor="#137fec"
              eyeColor="#22d3ee"
            />
          </RobotIconWrapper>
          <Box>
            <Typography
              variant="subtitle2"
              color="text.primary"
              fontWeight={800}
              lineHeight={1.2}
            >
              Lumina
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              AI Buddy
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {/* Model Selector Badge */}
          <ModelBadgeButton
            size="small"
            onClick={(e) => setModelAnchor(e.currentTarget)}
            startIcon={getModelIcon(selectedModel)}
            endIcon={<ArrowDownIcon sx={{ fontSize: 12 }} />}
          >
            {getModelLabel(selectedModel)}
          </ModelBadgeButton>
          <Menu
            anchorEl={modelAnchor}
            open={Boolean(modelAnchor)}
            onClose={() => setModelAnchor(null)}
            PaperProps={{
              sx: {
                borderRadius: '10px',
                minWidth: '150px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                border: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            {/* Claude models */}
            <MenuItem
              onClick={() => {
                setSelectedModel('claude-3-5-sonnet');
                setModelAnchor(null);
              }}
              selected={selectedModel === 'claude-3-5-sonnet'}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              <ClaudeIcon sx={{ fontSize: 16, color: '#cc6543', mr: 1.5 }} />
              Claude 3.5 Sonnet (Recommended)
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedModel('claude-3-5-haiku');
                setModelAnchor(null);
              }}
              selected={selectedModel === 'claude-3-5-haiku'}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              <ClaudeIcon sx={{ fontSize: 16, color: '#cc6543', mr: 1.5 }} />
              Claude 3.5 Haiku (Fast)
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedModel('claude-3-opus');
                setModelAnchor(null);
              }}
              selected={selectedModel === 'claude-3-opus'}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              <ClaudeIcon sx={{ fontSize: 16, color: '#cc6543', mr: 1.5 }} />
              Claude 3 Opus (Advanced)
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            {/* Gemini models */}
            <MenuItem
              onClick={() => {
                setSelectedModel('gemini-2.5-flash-lite');
                setModelAnchor(null);
              }}
              selected={selectedModel === 'gemini-2.5-flash-lite'}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              <GeminiIcon sx={{ fontSize: 16, color: '#137fec', mr: 1.5 }} />
              Gemini 2.5 Flash Lite
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedModel('gemini-2.5-flash');
                setModelAnchor(null);
              }}
              selected={selectedModel === 'gemini-2.5-flash'}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              <GeminiIcon sx={{ fontSize: 16, color: '#137fec', mr: 1.5 }} />
              Gemini 2.5 Flash
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedModel('gemini-1.5-flash');
                setModelAnchor(null);
              }}
              selected={selectedModel === 'gemini-1.5-flash'}
              sx={{ fontSize: '12px', fontWeight: 600 }}
            >
              <GeminiIcon sx={{ fontSize: 16, color: '#137fec', mr: 1.5 }} />
              Gemini 1.5 Flash
            </MenuItem>
          </Menu>

          {/* Token Counter */}
          {tokensSpent > 0 && (
            <TokenCounterBadge>
              <TokenIcon sx={{ fontSize: 10 }} />
              <span>{tokensSpent.toLocaleString()} tkn</span>
            </TokenCounterBadge>
          )}

          <IconButton
            onClick={() => setIsOpen(false)}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Header>

      {/* Messages */}
      <MessageList>
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
              py: 4,
              px: 2,
              textAlign: 'center',
              gap: 2,
            }}
          >
            <RobotIconWrapper
              sx={{ width: 44, height: 44, borderRadius: '12px' }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 22 }} />
            </RobotIconWrapper>
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={850}
                color="text.primary"
                sx={{ mb: 0.5 }}
              >
                Meet Lumina AI
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ maxWidth: '240px', display: 'block', mx: 'auto' }}
              >
                Ask me tips to boost focus, request summaries, or let me
                organize your task workloads!
              </Typography>
            </Box>
          </Box>
        ) : (
          messages.map((msg) => {
            const m = msg as unknown as {
              id: string;
              role: string;
              content: Array<{ type: string; text?: string }>;
            };
            const isUser = m.role === 'user';
            const textContent = m.content
              .filter((p) => p.type === 'text')
              .map((p) => p.text || '')
              .join('\n');

            const { cleanText, action } = parseLuminaAction(textContent);

            return (
              <MessageRow key={msg.id} isUser={isUser}>
                {!isUser && (
                  <AIAvatar>
                    <CuteRobotIcon
                      size={16}
                      variant="mini"
                      primaryColor="#137fec"
                      eyeColor="#22d3ee"
                    />
                  </AIAvatar>
                )}
                <Box
                  display="flex"
                  flexDirection="column"
                  sx={{
                    maxWidth: '75%',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <MessageBubble
                    isUser={isUser}
                    dangerouslySetInnerHTML={{
                      __html: isUser
                        ? cleanText
                        : renderMarkdown(
                            cleanText,
                            theme.palette.mode === 'dark',
                          ),
                    }}
                  />
                  {!isUser && action && <SuggestedActionCard action={action} />}
                </Box>
              </MessageRow>
            );
          })
        )}
        {/* Typing indicator */}
        {isRunning && (
          <MessageRow isUser={false}>
            <AIAvatar>
              <CuteRobotIcon
                size={16}
                variant="mini"
                primaryColor="#137fec"
                eyeColor="#22d3ee"
              />
            </AIAvatar>
            <Box
              display="flex"
              flexDirection="column"
              sx={{ maxWidth: '75%', alignItems: 'flex-start' }}
            >
              <TypingIndicator>
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </TypingIndicator>
            </Box>
          </MessageRow>
        )}
        <div ref={endRef} />
      </MessageList>

      {/* Suggestions */}
      {messages.length === 0 && (
        <SuggestionGrid>
          <SuggestionChip
            onClick={() =>
              handleSuggestionClick(
                'Suggest 3 ways to boost my productivity today',
              )
            }
          >
            ⚡ 3 tips to boost my focus
          </SuggestionChip>
          <SuggestionChip
            onClick={() =>
              handleSuggestionClick('Help me organize a deep work session')
            }
          >
            🧘 Schedule a deep work session
          </SuggestionChip>
          <SuggestionChip
            onClick={() =>
              handleSuggestionClick('Explain the Pomodoro technique benefits')
            }
          >
            🍅 Explain Pomodoro benefits
          </SuggestionChip>
        </SuggestionGrid>
      )}

      {/* Input */}
      <InputArea>
        <ChatInputWrapper>
          <ChatTextArea
            placeholder="Ask Lumina anything..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
        </ChatInputWrapper>
        <SendButton
          onClick={handleSend}
          disabled={!chatInput.trim() || isRunning}
        >
          <SendIcon sx={{ fontSize: 16 }} />
        </SendButton>
      </InputArea>
    </ChatWindow>
  );
};

interface ChatAIProps {
  rightOffset?: number;
}

export const ChatAI = ({ rightOffset = 100 }: ChatAIProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(
    () => localStorage.getItem('focusly_energy_notif_seen') !== 'true',
  );

  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash-lite');
  const modelRef = useRef(selectedModel);
  useEffect(() => {
    modelRef.current = selectedModel;
  }, [selectedModel]);

  const adapter = useMemo<ChatModelAdapter>(() => {
    return {
      async *run({ messages, abortSignal }) {
        const mappedMessages = messages.map((msg) => {
          const m = msg as unknown as {
            role: string;
            content: Array<{ type: string; text?: string }>;
          };
          const textContent = m.content
            .filter((part) => part.type === 'text')
            .map((part) => part.text || '')
            .join('\n');
          return {
            role: m.role as 'user' | 'assistant' | 'system',
            content: textContent,
          };
        });

        let stream: ReadableStream<Uint8Array>;
        try {
          stream = await fetchChatStreamResponse(
            mappedMessages,
            null, // no task context for global chat buddy
            abortSignal,
            modelRef.current, // Dynamic model selection!
          );
        } catch (e: unknown) {
          const errMsg = e instanceof Error ? e.message : String(e);
          yield {
            content: [{ type: 'text' as const, text: `Error: ${errMsg}` }],
          };
          return;
        }

        const reader = stream.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let text = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          yield {
            content: [{ type: 'text' as const, text }],
          };
        }
      },
    };
  }, []);

  const runtime = useLocalRuntime(adapter);

  return (
    <ChatContainer rightOffset={rightOffset}>
      {/* Notification Card (Only visible when chat is closed) */}
      <Slide
        direction="up"
        in={!isOpen && showNotification}
        mountOnEnter
        unmountOnExit
      >
        <NotificationCard elevation={0}>
          <Box display="flex" gap={2} alignItems="start">
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'info.main',
                mt: 1,
              }}
            />
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <CuteRobotIcon
                  size={16}
                  variant="mini"
                  primaryColor="#137fec"
                  eyeColor="#22d3ee"
                />
                <Typography
                  variant="subtitle2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  Energy Optimization
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize="13px"
                sx={{ mb: 1.5 }}
              >
                Energy dip predicted at 2 PM. Consider scheduling lighter admin
                tasks.
              </Typography>
              <Box display="flex" gap={1}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setIsOpen(true)}
                  sx={{
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    textTransform: 'none',
                    fontSize: '11px',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontWeight: 700,
                  }}
                >
                  Ask Lumina
                </Button>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => {
                    localStorage.setItem('focusly_energy_notif_seen', 'true');
                    setShowNotification(false);
                  }}
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontSize: '11px',
                    padding: '4px 12px',
                  }}
                >
                  Dismiss
                </Button>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => {
                localStorage.setItem('focusly_energy_notif_seen', 'true');
                setShowNotification(false);
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </NotificationCard>
      </Slide>

      {/* Main Chat Window */}
      <Grow in={isOpen} mountOnEnter unmountOnExit>
        <Box>
          <AssistantRuntimeProvider runtime={runtime}>
            <ChatAIInner
              setIsOpen={setIsOpen}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          </AssistantRuntimeProvider>
        </Box>
      </Grow>

      {/* Floating Toggle Button */}
      <Zoom in={!isOpen} unmountOnExit>
        <FloatingButton onClick={() => setIsOpen(true)}>
          <CuteRobotIcon
            size={38}
            variant="full"
            primaryColor="#137fec"
            eyeColor="#22d3ee"
          />
        </FloatingButton>
      </Zoom>
    </ChatContainer>
  );
};
