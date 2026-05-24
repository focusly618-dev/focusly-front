import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useAppSelector } from '@/redux/hooks';
import { CuteRobotIcon } from '@/components/ui';
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
  biggestTask?: string,
): string => {
  const p = prompt.toLowerCase();

  if (p.includes('optimize') && p.includes('plan')) {
    return `<strong>🗓️ Your Optimized Daily Plan</strong>

Based on typical productivity research, here's a smart schedule for your day:

<strong>Morning Block (9 AM – 12 PM)</strong> — Peak Cognitive Hours
Use this for your most demanding, deep-focus work. No meetings, no Slack. Pure creation.

<strong>Early Afternoon (1 PM – 2:30 PM)</strong> — Light Admin
After lunch your alertness dips. Schedule emails, reviews, and light tasks here.

<strong>Afternoon Block (3 PM – 5 PM)</strong> — Creative & Collaboration
Energy rebounds. Good for calls, brainstorming, and creative tasks.

<strong>Wind Down (5 PM – 5:30 PM)</strong> — Capture & Plan
Spend 30 mins reviewing what you finished and setting tomorrow's top 3 priorities.

💡 <strong>Tip:</strong> Time-box each task to prevent scope creep. 25-minute sprints work wonders!`;
  }

  if (p.includes('break down') || p.includes('smaller task')) {
    if (biggestTask) {
      return `<strong>🔨 Breaking Down: "${biggestTask}"</strong>

Here are 5 focused tasks to tackle this effectively:

<strong>1. Define scope & success metrics</strong>
Clarify what done looks like. Write 3–5 acceptance criteria. <code>~30 min</code>

<strong>2. Research & gather resources</strong>
Collect all information, assets, or dependencies you'll need upfront. <code>~1 hr</code>

<strong>3. Draft a rough version (v0)</strong>
Don't aim for perfect. Get something on paper/screen first. <code>~2 hrs</code>

<strong>4. Review & iterate</strong>
Step away, then come back with fresh eyes to refine. <code>~1 hr</code>

<strong>5. Polish & finalize</strong>
Final quality pass, proofread, validate against success criteria. <code>~45 min</code>

💡 Add these tasks directly in your Workspace to start tracking progress!`;
    }
    return `<strong>🔨 Task Breakdown Template</strong>

I don't see a specific task selected, but here's a universal breakdown framework:

<strong>1. Define the goal clearly</strong> — What does success look like? <code>30 min</code>
<strong>2. Research & collect resources</strong> — Gather everything you need first. <code>1 hr</code>
<strong>3. Create a rough draft / v0</strong> — Ship imperfect fast. <code>2 hrs</code>
<strong>4. Review & iterate</strong> — Fresh eyes after a break. <code>1 hr</code>
<strong>5. Finalize & wrap up</strong> — Polish and close the loop. <code>45 min</code>

Navigate to your Workspace, select a task, and I can analyze it specifically! 🎯`;
  }

  if (
    p.includes('focus strategy') ||
    p.includes('deep work') ||
    p.includes('productivity technique')
  ) {
    return `<strong>⚡ Top Focus Strategies for Deep Work</strong>

Here are 3 powerful techniques, ranked by intensity:

<strong>🍅 1. Pomodoro Technique (Beginner-friendly)</strong>
25 min work → 5 min break. After 4 rounds, take a 15–30 min break.
Best for: task lists, varied work, fighting procrastination.

<strong>⏱️ 2. Timeboxing (Intermediate)</strong>
Assign fixed calendar blocks for specific tasks. No overflow allowed.
Best for: structured days, preventing perfectionism, team work.

<strong>🌊 3. Flowtime Method (Advanced)</strong>
Work until focus breaks naturally, then log how long you sustained it.
Over weeks, you'll discover your personal peak flow windows.
Best for: creative work, coding, writing, deep analysis.

💡 <strong>My recommendation:</strong> Start with Pomodoro today. Use your Focusly Focus Mode for the timer — it's built for exactly this!`;
  }

  if (
    p.includes('analyze') ||
    p.includes('productiv') ||
    p.includes('pattern')
  ) {
    const rate =
      taskCount > 5 ? 'active' : taskCount > 2 ? 'moderate' : 'light';
    return `<strong>📊 Your Productivity Snapshot</strong>

Based on your Focusly data:

<strong>Task Load:</strong> You have <strong>${taskCount} task${taskCount !== 1 ? 's' : ''}</strong> — that's a ${rate} workload.

<strong>🟢 What's working:</strong>
• You're organized enough to use a productivity app — that's already ahead of 80% of people!
• Breaking large tasks into smaller steps dramatically reduces cognitive load.

<strong>🟡 Opportunities:</strong>
• If tasks sit at "In Progress" for more than 3 days, they may be too large. Break them down.
• Schedule your hardest task within the first 2 hours of your workday (peak willpower).

<strong>🔴 Watch out for:</strong>
• Planning fallacy — we always underestimate time. Add 30% buffer to estimates.
• Multitasking costs up to 40% of your productive time. Protect your focus blocks.

💡 Use the Focus Mode on your highest-priority task today! 🚀`;
  }

  // Generic fallback
  return `<strong>✨ Lumina here!</strong>

That's a great question! As your AI productivity buddy, I can help you with:

• 📅 **Planning & scheduling** your day for peak performance
• 🔨 **Breaking down** complex tasks into actionable steps
• ⚡ **Focus strategies** to maximize your deep work sessions
• 📊 **Analyzing patterns** in how you work and where you lose time

Try asking me something like: *"How should I structure my morning?"* or *"I have 8 tasks — what should I focus on first?"*

I'm here to help you do your best work! 🙌`;
};

// ─── Component ────────────────────────────────────────────────────────────────

export const AskAI: React.FC = () => {
  const theme = useTheme();
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
    const name = user?.name?.split(' ')[0] || 'there';
    if (hour < 12) return `Good morning, ${name} ☀️`;
    if (hour < 17) return `Good afternoon, ${name} 👋`;
    return `Good evening, ${name} 🌙`;
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
    [tasks.length, biggestTask?.title],
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
    </AskAIContainer>
  );
};

export default AskAI;
