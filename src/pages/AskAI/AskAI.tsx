import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  InfoOutlined as InfoIcon,
  ArrowDropDown as ArrowDownIcon,
} from '@mui/icons-material';
import { FEATURE_FLAGS } from '@/config/featureFlags.config';
import { useAppSelector } from '@/redux/hooks';
import { CuteRobotIcon, ClaudeIcon, GeminiIcon } from '@/components/ui';
import {
  fetchChatStreamResponse,
  getAIConversations,
  getAIConversationMessages,
  deleteAIConversation,
  type AIConversation,
} from '@/api/AI/apiAI';
import { SuggestedActionCard } from '@/components/chat/SuggestedActionCard';
import { parseLuminaAction } from '@/utils/lumina';
import { sileo } from '@/utils/sileo';
import {
  AskAIContainer,
  ChatScrollArea,
  CenteredColumn,
  WelcomeSection,
  MascotWrapper,
  SuggestionGrid,
  SuggestionCard,
  MessageRow,
  AvatarWrapper,
  UserAvatar,
  MessageBubble,
  TypingIndicator,
  InputWrapper,
  InputBox,
  StyledInput,
  SendButton,
  HistorySidebar,
  ChatAreaWrapper,
  ChatHeader,
  ModelBadgeButton,
} from './AskAI.styles';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  html?: string;
}

// ─── Suggestion cards data ────────────────────────────────────────────────────

const suggestions = [
  {
    emoji: '📅',
    title: 'Optimize my daily plan',
    subtitle: 'Reschedule tasks for peak energy',
    prompt: 'Optimize my daily plan',
  },
  {
    emoji: '🔨',
    title: 'Break down a big task',
    subtitle: 'Split your largest task into smaller tasks',
    prompt: 'Break down my biggest task into smaller tasks',
  },
  {
    emoji: '⚡',
    title: 'Suggest a focus strategy',
    subtitle: 'Get personalized deep-work techniques',
    prompt: 'Suggest a focus strategy for me',
  },
  {
    emoji: '📊',
    title: 'Analyze my productivity',
    subtitle: 'Identify patterns and bottlenecks',
    prompt: 'Analyze my productivity and suggest improvements',
  },
];

// ─── Markdown Rendering Helper ───────────────────────────────────────────────

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

  // 4. Links: [text](url) -> <a href="url" target="_blank">text</a>
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, (_, text, url) => {
    const isInternal = /^\/(?!\/)/.test(url);
    if (isInternal) {
      return `<a href="${url}" style="color: #60a5fa; text-decoration: underline; font-weight: 600;">${text}</a>`;
    }
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline; font-weight: 600;">${text}</a>`;
  });

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

// ─── Component ────────────────────────────────────────────────────────────────

export const AskAI: React.FC = () => {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.task);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet');
  const [modelAnchor, setModelAnchor] = useState<null | HTMLElement>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    let active = true;
    getAIConversations()
      .then((data) => {
        if (active) {
          setConversations(data);
        }
      })
      .catch((err) => {
        console.error('Error loading conversations:', err);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSelectConversation = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    try {
      const msgs = await getAIConversationMessages(conversationId);
      setMessages(
        msgs.map((m) => ({
          id: m.id,
          sender: m.role === 'user' ? 'user' : 'ai',
          text: m.content,
          html: renderMarkdown(m.content, theme.palette.mode === 'dark'),
        })),
      );
    } catch (err) {
      console.error('Error loading conversation messages:', err);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteAIConversation(id);
      if (activeConversationId === id) {
        handleNewChat();
      }
      getAIConversations().then(setConversations).catch(console.error);
      sileo.success({
        title: 'Chat deleted',
        description: 'The conversation has been removed.',
        fill: 'var(--sileo-delete-bg)',
        duration: 3000,
      });
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.name?.split(' ')[0] || 'there';
    if (hour < 12) return `Good morning, ${name} ☀️`;
    if (hour < 17) return `Good afternoon, ${name} 👋`;
    return `Good evening, ${name} 🌙`;
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

  const biggestTask = tasks.reduce(
    (prev, curr) =>
      (curr.estimated_end_date &&
        prev.estimated_end_date &&
        curr.estimated_end_date > prev.estimated_end_date) ||
      (!prev.title && curr.title)
        ? curr
        : prev,
    tasks[0],
  );

  const sendMessage = useCallback(
    async (text: string, customHistory?: Message[]) => {
      if (!text.trim()) return;

      if (FEATURE_FLAGS.LIMIT_AI_CONVERSATIONS && !activeConversationId) {
        if (conversations.length >= 4) {
          setIsUpgradeModalOpen(true);
          return;
        }
      }

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: text.trim(),
      };

      const baseHistory = customHistory || messages;
      const history = [
        ...baseHistory.map((m) => ({
          role:
            m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.text,
        })),
        { role: 'user' as const, content: text.trim() },
      ];

      if (!customHistory) {
        setMessages((prev) => [...prev, userMsg]);
      } else {
        setMessages([...customHistory, userMsg]);
      }
      setInputValue('');
      setIsTyping(true);

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        html: '',
      };

      setMessages((prev) => [...prev, aiMsg]);

      let accumulatedText = '';
      try {
        const stream = await fetchChatStreamResponse(
          history,
          biggestTask
            ? {
                title: biggestTask.title,
                description: biggestTask.notes_encrypted || '',
                status: biggestTask.status || 'Todo',
                priority_level: biggestTask.priority_level ?? 0,
                estimate_timer: biggestTask.estimate_timer ?? 0,
                real_timer: biggestTask.real_timer ?? undefined,
                deadline: biggestTask.deadline || '',
              }
            : null,
          undefined,
          selectedModel,
          activeConversationId || undefined,
        );

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        setIsTyping(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId
                ? {
                    ...msg,
                    text: accumulatedText,
                    html: renderMarkdown(
                      accumulatedText,
                      theme.palette.mode === 'dark',
                    ),
                  }
                : msg,
            ),
          );
        }

        const updatedConvs = await getAIConversations();
        setConversations(updatedConvs);
        if (!activeConversationId && updatedConvs.length > 0) {
          setActiveConversationId(updatedConvs[0].id);
        }
      } catch (err) {
        console.error('Error fetching stream response:', err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  text: 'Lo siento, ha ocurrido un error al generar la respuesta.',
                  html: '<p style="color: red;">Error generating response.</p>',
                }
              : msg,
          ),
        );
        setIsTyping(false);
      }
    },
    [
      messages,
      biggestTask,
      activeConversationId,
      conversations,
      theme.palette.mode,
      selectedModel,
    ],
  );

  const handleRetry = async (msgId: string) => {
    const msgIndex = messages.findIndex((m) => m.id === msgId);
    if (msgIndex === -1) return;

    const msg = messages[msgIndex];
    let retryText = '';
    let truncateToIndex = msgIndex;

    if (msg.sender === 'user') {
      retryText = msg.text;
      truncateToIndex = msgIndex;
    } else {
      const prevUserMsgIndex = messages
        .slice(0, msgIndex)
        .reduce((acc, curr, idx) => {
          if (curr.sender === 'user') return idx;
          return acc;
        }, -1);
      if (prevUserMsgIndex === -1) return;
      retryText = messages[prevUserMsgIndex].text;
      truncateToIndex = prevUserMsgIndex;
    }

    const truncatedHistory = messages.slice(0, truncateToIndex);
    setMessages(truncatedHistory);
    sendMessage(retryText, truncatedHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt);
    inputRef.current?.focus();
  };

  const primaryColor = theme.palette.primary.main;
  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <AskAIContainer>
      {/* ── Main Chat Area ── */}
      <ChatAreaWrapper>
        {/* ── Chat Header with Model Selector ── */}
        <ChatHeader>
          <Box display="flex" alignItems="center" gap={1}>
            <CuteRobotIcon
              size={20}
              variant="mini"
              primaryColor={primaryColor}
            />
            <Typography
              variant="subtitle2"
              fontWeight={800}
              color="text.primary"
            >
              Lumina AI Chat
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
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
                  mt: 0.5,
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
          </Box>
        </ChatHeader>

        {/* ── Scrollable chat area ── */}
        <ChatScrollArea>
          <CenteredColumn>
            {/* ── Welcome screen (shown when no messages) ── */}
            {!hasMessages && (
              <WelcomeSection>
                <MascotWrapper>
                  <CuteRobotIcon
                    size={60}
                    variant="full"
                    primaryColor={primaryColor}
                  />
                </MascotWrapper>

                <Typography
                  variant="h2"
                  fontWeight={700}
                  sx={{ letterSpacing: '-0.02em', color: 'text.primary' }}
                >
                  {getGreeting()}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 440, lineHeight: 1.7 }}
                >
                  I'm <strong style={{ color: primaryColor }}>Lumina</strong>,
                  your AI productivity buddy. Ask me anything about your tasks,
                  schedule, or focus strategy.
                </Typography>

                {/* Suggestion cards */}
                <SuggestionGrid sx={{ mt: 3 }}>
                  {suggestions.map((s) => (
                    <SuggestionCard
                      key={s.title}
                      onClick={() => handleSuggestionClick(s.prompt)}
                    >
                      <Typography fontSize="22px" lineHeight={1}>
                        {s.emoji}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="text.primary"
                        sx={{ lineHeight: 1.3 }}
                      >
                        {s.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.subtitle}
                      </Typography>
                    </SuggestionCard>
                  ))}
                </SuggestionGrid>
              </WelcomeSection>
            )}

            {/* ── Message history ── */}
            {hasMessages && (
              <Box display="flex" flexDirection="column" gap={1.5} py={3}>
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const { cleanText, action } = parseLuminaAction(msg.text);
                  const cleanHtml = msg.html
                    ? renderMarkdown(cleanText, theme.palette.mode === 'dark')
                    : undefined;

                  return (
                    <MessageRow key={msg.id} isUser={isUser}>
                      {/* AI avatar */}
                      {!isUser && (
                        <AvatarWrapper>
                          <CuteRobotIcon
                            size={22}
                            variant="mini"
                            primaryColor={primaryColor}
                          />
                        </AvatarWrapper>
                      )}

                      <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                          maxWidth: '75%',
                          alignItems: isUser ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flexDirection: isUser ? 'row-reverse' : 'row',
                          }}
                        >
                          <MessageBubble isUser={isUser}>
                            {cleanHtml ? (
                              <div
                                dangerouslySetInnerHTML={{ __html: cleanHtml }}
                                style={{ lineHeight: 1.65, fontSize: '14px' }}
                              />
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{ whiteSpace: 'pre-wrap' }}
                              >
                                {cleanText}
                              </Typography>
                            )}
                          </MessageBubble>
                          <Tooltip title="Regenerate/Retry" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => handleRetry(msg.id)}
                              sx={{
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                color: 'text.secondary',
                                '&:hover': {
                                  color: 'primary.main',
                                  bgcolor: 'action.hover',
                                },
                                p: 0.5,
                              }}
                              className="msg-action-btn"
                            >
                              <RefreshIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        {!isUser && action && (
                          <SuggestedActionCard action={action} />
                        )}
                      </Box>

                      {/* User avatar */}
                      {isUser && (
                        <UserAvatar>
                          {user?.picture ? (
                            <img
                              src={user.picture}
                              alt={user.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%',
                              }}
                            />
                          ) : (
                            userInitial
                          )}
                        </UserAvatar>
                      )}
                    </MessageRow>
                  );
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <MessageRow>
                    <AvatarWrapper>
                      <CuteRobotIcon
                        size={22}
                        variant="mini"
                        primaryColor={primaryColor}
                      />
                    </AvatarWrapper>
                    <TypingIndicator>
                      <div className="dot" />
                      <div className="dot" />
                      <div className="dot" />
                    </TypingIndicator>
                  </MessageRow>
                )}

                <div ref={endRef} />
              </Box>
            )}
          </CenteredColumn>
        </ChatScrollArea>

        {/* ── Sticky bottom input ── */}
        <InputWrapper>
          <InputBox elevation={0}>
            <StyledInput
              inputRef={inputRef}
              placeholder="Ask Lumina anything…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              multiline
              maxRows={5}
              variant="outlined"
              fullWidth
              autoComplete="off"
            />
            <SendButton
              active={!!inputValue.trim()}
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              size="small"
            >
              <SendIcon sx={{ fontSize: 18 }} />
            </SendButton>
          </InputBox>
        </InputWrapper>
      </ChatAreaWrapper>

      {/* ── Chat History Sidebar (right) ── */}
      <HistorySidebar>
        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleNewChat}
            startIcon={<AddIcon />}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              boxShadow: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            New Chat
          </Button>
        </Box>
        <Box sx={{ flex: 1, overflowY: 'auto', px: 1, pb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={800}
            sx={{
              px: 1.5,
              mb: 1.5,
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '10px',
            }}
          >
            Chat History
          </Typography>
          {conversations.map((c) => {
            const isActive = c.id === activeConversationId;
            return (
              <Box
                key={c.id}
                onClick={() => handleSelectConversation(c.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 1.5,
                  py: 1,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  mb: 0.8,
                  bgcolor: isActive
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(59, 130, 246, 0.12)'
                      : 'rgba(59, 130, 246, 0.08)'
                    : theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.02)'
                      : 'rgba(0, 0, 0, 0.015)',
                  border: `1px solid ${
                    isActive
                      ? theme.palette.primary.main
                      : theme.palette.divider
                  }`,
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: isActive
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'rgba(59, 130, 246, 0.12)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.03)',
                    borderColor: isActive
                      ? theme.palette.primary.dark
                      : 'rgba(19, 127, 236, 0.3)',
                    '& .delete-btn': { opacity: 1 },
                  },
                  transition: 'all 0.15s ease',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    mr: 1,
                    flex: 1,
                  }}
                >
                  {c.title || 'Untitled Chat'}
                </Typography>
                <IconButton
                  className="delete-btn"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(c.id);
                  }}
                  sx={{
                    p: 0.25,
                    opacity: 0,
                    color: 'text.secondary',
                    '&:hover': { color: theme.palette.error.main },
                    transition: 'opacity 0.15s, color 0.15s',
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            );
          })}
        </Box>
        {FEATURE_FLAGS.LIMIT_AI_CONVERSATIONS && (
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
              >
                Chats creados:
              </Typography>
              <Typography
                variant="caption"
                color={
                  conversations.length >= 4 ? 'error.main' : 'text.primary'
                }
                fontWeight={700}
              >
                {conversations.length} / 4
              </Typography>
            </Box>
            <Box
              sx={{
                width: '100%',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '2px',
                height: 4,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${Math.min((conversations.length / 4) * 100, 100)}%`,
                  bgcolor:
                    conversations.length >= 4 ? 'error.main' : 'primary.main',
                  height: '100%',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>
            {conversations.length >= 4 && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                fullWidth
                onClick={() => setIsUpgradeModalOpen(true)}
                sx={{
                  mt: 0.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  py: 0.5,
                  fontWeight: 700,
                }}
              >
                Desbloquear chats ilimitados
              </Button>
            )}
          </Box>
        )}
      </HistorySidebar>

      <Dialog
        open={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 2.5,
            width: '400px',
            bgcolor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            textAlign: 'center',
            py: 2,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'rgba(59, 130, 246, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <InfoIcon sx={{ fontSize: 28 }} />
          </Box>
          <DialogTitle
            sx={{
              p: 0,
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.3px',
            }}
          >
            Límite de Chats Alcanzado
          </DialogTitle>
          <DialogContent sx={{ p: 0, mt: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              Has alcanzado el límite de <strong>4 conversaciones</strong> en tu
              plan gratuito. Actualiza a la versión premium hoy para disfrutar
              de chats ilimitados con la inteligencia artificial y llevar tu
              planificación al siguiente nivel.
            </Typography>
          </DialogContent>
        </Box>
        <DialogActions
          sx={{ px: 0, pb: 1, flexDirection: 'column', gap: 1.25 }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setIsUpgradeModalOpen(false);
              sileo.success({
                title: 'Plan Actualizado',
                description: '¡Gracias por actualizar tu suscripción!',
                duration: 4000,
              });
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: '10px',
              py: 1.2,
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            Pagar y Desbloquear
          </Button>
          <Button
            onClick={() => setIsUpgradeModalOpen(false)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              color: 'text.secondary',
              fontSize: '0.85rem',
            }}
          >
            Más tarde
          </Button>
        </DialogActions>
      </Dialog>
    </AskAIContainer>
  );
};

export default AskAI;
