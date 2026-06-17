import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useAppSelector } from '@/redux/hooks';
import { CuteRobotIcon } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
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

// ─── Mock AI responses ────────────────────────────────────────────────────────

const getAIResponse = (
  prompt: string,
  taskCount: number,
  t: TFunction,
  biggestTask?: string,
): string => {
  const p = prompt.toLowerCase();

  if (p.includes('optimize') && p.includes('plan')) {
    return t('AI_OPTIMIZE_RESPONSE');
  }

  if (p.includes('break down') || p.includes('smaller task')) {
    if (biggestTask) {
      return t('AI_BREAK_DOWN_RESPONSE', { biggestTask });
    }
    return t('AI_BREAK_DOWN_TEMPLATE_RESPONSE');
  }

  if (
    p.includes('focus strategy') ||
    p.includes('deep work') ||
    p.includes('productivity technique')
  ) {
    return t('AI_FOCUS_STRATEGY_RESPONSE');
  }

  if (
    p.includes('analyze') ||
    p.includes('productiv') ||
    p.includes('pattern')
  ) {
    const rate =
      taskCount > 5 ? t('active') : taskCount > 2 ? t('moderate') : t('light');
    return t('AI_PRODUCTIVITY_RESPONSE', { taskCount, rate });
  }

  // Generic fallback
  return t('AI_GENERIC_RESPONSE');
};

// ─── Component ────────────────────────────────────────────────────────────────

export const AskAI: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.task);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasMessages = messages.length > 0;

  // Auto-scroll to latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.name?.split(' ')[0] || t('there');
    if (hour < 12) return t('Good morning, {{name}} ☀️', { name });
    if (hour < 17) return t('Good afternoon, {{name}} 👋', { name });
    return t('Good evening, {{name}} 🌙', { name });
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
    (text: string) => {
      if (!text.trim()) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: text.trim(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsTyping(true);

      // Simulate AI thinking delay (800ms – 1.5s)
      const delay = 800 + Math.random() * 700;
      setTimeout(() => {
        const aiResponseHtml = getAIResponse(
          text,
          tasks.length,
          t,
          biggestTask?.title,
        );
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiResponseHtml,
          html: aiResponseHtml,
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, delay);
    },
    [tasks.length, biggestTask?.title, t],
  );

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
                {t("I'm")}{' '}
                <strong style={{ color: primaryColor }}>Lumina</strong>,
                {t(
                  'your AI productivity buddy. Ask me anything about your tasks, schedule, or focus strategy.',
                )}
              </Typography>

              {/* Suggestion cards */}
              <SuggestionGrid sx={{ mt: 3 }}>
                {suggestions.map((s) => (
                  <SuggestionCard
                    key={s.title}
                    onClick={() => handleSuggestionClick(t(s.prompt))}
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
                      {t(s.title)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t(s.subtitle)}
                    </Typography>
                  </SuggestionCard>
                ))}
              </SuggestionGrid>
            </WelcomeSection>
          )}

          {/* ── Message history ── */}
          {hasMessages && (
            <Box display="flex" flexDirection="column" gap={1.5} py={3}>
              {messages.map((msg) => (
                <MessageRow key={msg.id} isUser={msg.sender === 'user'}>
                  {/* AI avatar */}
                  {msg.sender === 'ai' && (
                    <AvatarWrapper>
                      <CuteRobotIcon
                        size={22}
                        variant="mini"
                        primaryColor={primaryColor}
                      />
                    </AvatarWrapper>
                  )}

                  <MessageBubble isUser={msg.sender === 'user'}>
                    {msg.html ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: msg.html }}
                        style={{ lineHeight: 1.65, fontSize: '14px' }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: 'pre-wrap' }}
                      >
                        {msg.text}
                      </Typography>
                    )}
                  </MessageBubble>

                  {/* User avatar */}
                  {msg.sender === 'user' && (
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
              ))}

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
            placeholder={t('Ask Lumina anything…')}
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
    </AskAIContainer>
  );
};

export default AskAI;
