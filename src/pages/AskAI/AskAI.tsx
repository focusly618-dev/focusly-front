import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Button,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  ArrowDropDown as ArrowDownIcon,
  AlternateEmail as AtIcon,
  CalendarToday as CalendarIcon,
  Build as ToolIcon,
  FlashOn as LightningIcon,
  BarChart as ChartIcon,
  WarningAmberRounded as WarningIcon,
  ChatBubbleOutline as ChatIcon,
  AttachFile as AttachFileIcon,
  ContentCopy as CopyIcon,
  ThumbUpOutlined as ThumbUpOutlinedIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { Trans, useTranslation } from 'react-i18next';
import { FEATURE_FLAGS } from '@/config/featureFlags.config';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setEvents } from '@/redux/calendar/calendar.slice';
import { fetchGoogleEvents } from '@/api/GoogleCalendar/googleCalendarApi';
import type { UserSettings } from '@/api/User/apiUser.types';
import {
  LuminaAnimatedFace,
  LuminaOrb,
  ClaudeIcon,
  GeminiIcon,
  LuminaSpeakingWave,
} from '@/components/ui';
import { useQuery } from '@apollo/client';
import { GET_WORKSPACES } from '@/pages/Workspace/Workspace.graphql';
import {
  fetchChatStreamResponse,
  getAIConversations,
  getAIConversationMessages,
  deleteAIConversation,
  type AIConversation,
} from '@/api/AI/apiAI';
import { ActionPlan } from '@/components/chat/actionPlan/ActionPlan';
import {
  PromptInput,
  PromptInputHeader,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  type ChatStatus,
  ChainOfThought,
  ChainOfThoughtHeader,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
  Shimmer,
} from '@/components/ai-elements';
import { UpgradeModal } from '@/components/modals';
import { aiStreamService } from '@/services/aiStreamService';
import {
  parseLuminaActions,
  sileo,
  type ParsedLuminaAction,
  extractUserIntent,
} from '@/utils';
import { surfaceColor } from '@/context';
import { byMode, emerald, fadeIn, truncateSx, zinc } from '@/styles/mui';
import {
  AskAIContainer,
  ChatScrollArea,
  CenteredColumn,
  WelcomeSection,
  MascotWrapper,
  SuggestionGrid,
  SuggestionCard,
  AvatarWrapper,
  UserAvatar,
  MessageBubble,
  DateSeparator,
  AIMessageWrapper,
  AIMessageHeader,
  AIMessageActions,
  InputWrapper,
  HistorySidebar,
  ChatAreaWrapper,
  ChatHeader,
  TrialUpgradeBanner,
} from './AskAI.styles';

import {
  convertPdfToMarkdown,
  convertDocxToMarkdown,
  readFileAsText,
} from '@/pages/Workspace/components/Editor/components/EditorHeader/components/ImportContentModal/documentConverters';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AttachedFileMeta {
  name: string;
  size?: number;
  type?: string;
}

interface AttachedFile extends AttachedFileMeta {
  id: string;
  content: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  rawContent?: string;
  html?: string;
  actions?: ParsedLuminaAction[];
  attachedFiles?: AttachedFileMeta[];
  createdAt?: string | Date;
}

const formatTodayDate = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const dateStr = now.toLocaleDateString('es-ES', options).toUpperCase();
  return `HOY • ${dateStr}`;
};

const formatMessageTime = (date?: string | Date) => {
  if (!date) {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const parseAttachedFilesFromContent = (
  rawContent: string,
): {
  cleanText: string;
  attachedFiles?: AttachedFileMeta[];
} => {
  if (!rawContent || !rawContent.includes('ATTACHED FILE:')) {
    return { cleanText: rawContent };
  }

  const attachedFiles: AttachedFileMeta[] = [];
  const fileBlockRegex =
    /(?:===|---)\s*ATTACHED FILE:\s*([^\n\r]+?)\s*(?:===|---)\n?[\s\S]*?(?:===|---)\s*END OF FILE\s*(?:===|---)/gi;

  let match: RegExpExecArray | null;
  while ((match = fileBlockRegex.exec(rawContent)) !== null) {
    const fileName = match[1]?.trim();
    if (fileName) {
      attachedFiles.push({
        name: fileName,
      });
    }
  }

  let cleanText = rawContent.replace(fileBlockRegex, '').trim();

  if (
    cleanText === 'Please review and analyze the following attached file(s):'
  ) {
    cleanText = '';
  }

  return {
    cleanText,
    attachedFiles: attachedFiles.length > 0 ? attachedFiles : undefined,
  };
};

// ─── Suggestion cards data ────────────────────────────────────────────────────

const suggestions = [
  {
    iconType: 'calendar',
    title: 'Optimize my daily plan',
    subtitle: 'Reschedule tasks for peak energy',
    prompt: 'Optimize my daily plan',
  },
  {
    iconType: 'tool',
    title: 'Break down a big task',
    subtitle: 'Split your largest task into smaller tasks',
    prompt: 'Break down my biggest task into smaller tasks',
  },
  {
    iconType: 'lightning',
    title: 'Suggest a focus strategy',
    subtitle: 'Get personalized deep-work techniques',
    prompt: 'Suggest a focus strategy for me',
  },
  {
    iconType: 'chart',
    title: 'Analyze my productivity',
    subtitle: 'Identify patterns and bottlenecks',
    prompt: 'Analyze my productivity and suggest improvements',
  },
];

// ─── Markdown Rendering Helper ───────────────────────────────────────────────

const renderMarkdown = (text: string, isDark: boolean, theme: Theme) => {
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
      return `<a href="${url}" style="color: #008767; text-decoration: underline; font-weight: 600;">${text}</a>`;
    }
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #008767; text-decoration: underline; font-weight: 600;">${text}</a>`;
  });

  // 4b. Quoted task names or entities: "Task name" -> styled highlighted pill
  const pillBg = isDark ? 'rgba(0, 135, 103, 0.16)' : '#ecfdf5';
  const pillBorder = isDark ? 'rgba(0, 135, 103, 0.35)' : '#a7f3d0';
  const pillColor = isDark ? '#6ee7b7' : '#065f46';
  html = html.replace(
    /&quot;([^&"\n]{3,80})&quot;|"([^"\n]{3,80})"/g,
    `<span style="display: inline-block; background-color: ${pillBg}; border: 1px solid ${pillBorder}; color: ${pillColor}; font-weight: 700; padding: 1px 7px; border-radius: 6px; margin: 0 2px;">"$1$2"</span>`,
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
      const rowBg = surfaceColor(
        theme,
        'rgba(15,23,42,0.15)',
        'rgba(36,36,37,0.15)',
        'rgba(255,255,255,0.95)',
      );
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
          `<blockquote style="margin: 10px 0; padding: 8px 14px; background: ${quoteBg}; border-left: 4px solid #008767; border-radius: 0 6px 6px 0; color: ${quoteColor}; font-style: italic; font-size: 13.5px; line-height: 1.6;">${quoteText}</blockquote>`,
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

export interface AIContextSelector {
  type: 'tasks' | 'workspaces' | 'task' | 'workspace' | 'calendar' | 'event';
  id?: string;
  title: string;
}

const formatUpdateTime = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const now = new Date();

    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    }

    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

const LAST_CONVERSATION_STORAGE_KEY = 'focusly_ai_last_conversation_id';

// ─── Component ────────────────────────────────────────────────────────────────

export const AskAI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.task);
  const { reduxEvents } = useAppSelector((state) => state.calendar);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCalendarConnected = Boolean(
    (user?.settings as UserSettings | undefined)?.calendarConnected,
  );

  useEffect(() => {
    if (
      user?.authProvider === 'google' &&
      user?.id &&
      isCalendarConnected &&
      reduxEvents.length === 0
    ) {
      const now = new Date();
      const start = new Date(now.getTime() - 7 * 86400000).toISOString();
      const end = new Date(now.getTime() + 45 * 86400000).toISOString();
      fetchGoogleEvents(start, end)
        .then((events) => {
          if (events && events.length > 0) {
            dispatch(setEvents(events));
          }
        })
        .catch((err) => {
          console.error('Failed to fetch calendar events in AskAI:', err);
        });
    }
  }, [
    user?.authProvider,
    user?.id,
    isCalendarConnected,
    reduxEvents.length,
    dispatch,
  ]);

  const [messages, setMessages] = useState<Message[]>(() => {
    if (aiStreamService.isGenerating()) {
      return aiStreamService.getActiveMessages() as unknown as Message[];
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<ChatStatus>(() =>
    aiStreamService.isGenerating() ? 'streaming' : 'ready',
  );
  const isTyping = status === 'submitted' || status === 'streaming';
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [conversationToDelete, setConversationToDelete] = useState<{
    id: string;
    title?: string;
  } | null>(null);
  const [isDeletingConversation, setIsDeletingConversation] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // 10 Trial Messages tracking
  const TRIAL_MESSAGE_LIMIT = 10;
  const trialStorageKey = `focusly_ask_ai_user_messages_count_${user?.id || 'default'}`;
  const proStorageKey = `focusly_is_pro_user_${user?.id || 'default'}`;

  const [isProUser, setIsProUser] = useState<boolean>(() => {
    return localStorage.getItem(proStorageKey) === 'true';
  });

  const [userMessageCount, setUserMessageCount] = useState<number>(() => {
    const stored = localStorage.getItem(trialStorageKey);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return 0;
  });

  const isTrialLimitReached =
    !isProUser && userMessageCount >= TRIAL_MESSAGE_LIMIT;

  useEffect(() => {
    const storedPro = localStorage.getItem(proStorageKey) === 'true';
    setIsProUser(storedPro);
    const storedCount = localStorage.getItem(trialStorageKey);
    if (storedCount !== null) {
      const parsed = parseInt(storedCount, 10);
      if (!isNaN(parsed)) setUserMessageCount(parsed);
    }
  }, [proStorageKey, trialStorageKey]);

  useEffect(() => {
    const currentChatUserMsgs = messages.filter(
      (m) => m.sender === 'user',
    ).length;
    if (currentChatUserMsgs > userMessageCount) {
      setUserMessageCount(currentChatUserMsgs);
      localStorage.setItem(trialStorageKey, String(currentChatUserMsgs));
    }
  }, [messages, trialStorageKey, userMessageCount]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { resetAITrial?: () => void }).resetAITrial =
        () => {
          localStorage.removeItem(trialStorageKey);
          localStorage.removeItem(proStorageKey);
          setUserMessageCount(0);
          setIsProUser(false);
          console.log('[DEBUG] Focusly AI trial reset to 0');
        };
    }
  }, [proStorageKey, trialStorageKey]);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [modelAnchor, setModelAnchor] = useState<null | HTMLElement>(null);
  const [selectedContext, setSelectedContext] =
    useState<AIContextSelector | null>(null);
  const [contextAnchor, setContextAnchor] = useState<null | HTMLElement>(null);
  const [contextMenuLevel, setContextMenuLevel] = useState<
    'main' | 'tasks' | 'workspaces' | 'calendar'
  >('main');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [historySearch, setHistorySearch] = useState('');
  const inputBoxRef = useRef<HTMLDivElement>(null);

  const handleCopyMessage = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    sileo.success({ title: 'Copiado al portapapeles' });
  };

  const handleFeedback = () => {
    sileo.success({ title: '¡Gracias por tu feedback!' });
  };

  const filteredConversations = conversations.filter(
    (c) =>
      !historySearch.trim() ||
      (c.title || '').toLowerCase().includes(historySearch.toLowerCase()),
  );

  const groupedConversations = React.useMemo(() => {
    const today: AIConversation[] = [];
    const yesterday: AIConversation[] = [];
    const older: AIConversation[] = [];

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const yesterdayStart = todayStart - 86400000;

    filteredConversations.forEach((c) => {
      const time = c.updatedAt ? new Date(c.updatedAt).getTime() : 0;
      if (time >= todayStart) {
        today.push(c);
      } else if (time >= yesterdayStart) {
        yesterday.push(c);
      } else {
        older.push(c);
      }
    });

    const groups: { label: string; items: AIConversation[] }[] = [];
    if (today.length > 0) groups.push({ label: 'Hoy', items: today });
    if (yesterday.length > 0) groups.push({ label: 'Ayer', items: yesterday });
    if (older.length > 0) groups.push({ label: 'Anteriores', items: older });
    if (groups.length === 0 && filteredConversations.length > 0) {
      groups.push({ label: 'Conversaciones', items: filteredConversations });
    }
    return groups;
  }, [filteredConversations]);

  const { data: workspacesData, loading: workspacesLoading } = useQuery(
    GET_WORKSPACES,
    {
      variables: { search: '' },
      skip: !user?.id,
    },
  );
  const workspacesList = workspacesData?.workspaces || [];

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

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
        msgs.map((m) => {
          const isUser = m.role === 'user';
          const { cleanText, attachedFiles: parsedFiles } = isUser
            ? parseAttachedFilesFromContent(m.content)
            : { cleanText: m.content, attachedFiles: undefined };

          return {
            id: m.id,
            sender: isUser ? 'user' : 'ai',
            text: cleanText,
            rawContent: m.content,
            html: cleanText
              ? renderMarkdown(cleanText, theme.palette.mode === 'dark', theme)
              : '',
            actions: m.actions ?? [],
            attachedFiles: parsedFiles,
            createdAt: m.createdAt || new Date().toISOString(),
          };
        }),
      );
    } catch (err) {
      console.error('Error loading conversation messages:', err);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  // Remember which conversation was open so navigating away and back (e.g.
  // to Tasks/Calendar) resumes it instead of always landing on a blank new
  // chat — the reply itself already finished generating and was saved
  // server-side regardless of whether this page was mounted to show it.
  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem(LAST_CONVERSATION_STORAGE_KEY, activeConversationId);
    } else {
      localStorage.removeItem(LAST_CONVERSATION_STORAGE_KEY);
    }
  }, [activeConversationId]);

  const handleStopStream = useCallback(() => {
    aiStreamService.stopStream();
    setStatus('ready');
  }, []);

  // Subscribe to background AI stream service
  useEffect(() => {
    const unsubscribe = aiStreamService.subscribe((event) => {
      if (event.type === 'chunk') {
        setStatus('streaming');
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === event.aiMsgId);
          if (!exists) {
            return [
              ...prev,
              {
                id: event.aiMsgId,
                sender: 'ai',
                text: event.accumulatedText,
                html: renderMarkdown(
                  event.accumulatedText,
                  theme.palette.mode === 'dark',
                  theme,
                ),
              },
            ];
          }
          return prev.map((msg) =>
            msg.id === event.aiMsgId
              ? {
                  ...msg,
                  text: event.accumulatedText,
                  html: renderMarkdown(
                    event.accumulatedText,
                    theme.palette.mode === 'dark',
                    theme,
                  ),
                }
              : msg,
          );
        });
      } else if (event.type === 'done') {
        setStatus('ready');
        getAIConversations()
          .then((updatedConvs) => {
            setConversations(updatedConvs);
            if (!activeConversationId && updatedConvs.length > 0) {
              setActiveConversationId(updatedConvs[0].id);
            }
          })
          .catch(console.error);
      } else if (event.type === 'error') {
        setStatus('error');
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === event.aiMsgId
              ? {
                  ...msg,
                  text: 'Lo siento, ha ocurrido un error al generar la respuesta.',
                  html: '<p style="color: red;">Error generating response.</p>',
                }
              : msg,
          ),
        );
      }
    });

    return unsubscribe;
  }, [theme, activeConversationId]);

  useEffect(() => {
    if (aiStreamService.isGenerating()) {
      const activeState = aiStreamService.getState();
      if (
        activeState.conversationId &&
        activeState.conversationId !== 'new_chat'
      ) {
        setActiveConversationId(activeState.conversationId);
      }
      return;
    }

    const lastId = localStorage.getItem(LAST_CONVERSATION_STORAGE_KEY);
    if (lastId) {
      handleSelectConversation(lastId);
    }
    // Restore once on mount only — re-running this on every render (e.g. if
    // handleSelectConversation were in the deps) would refetch the same
    // conversation's messages repeatedly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteConversation = async (id: string) => {
    setIsDeletingConversation(true);
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
      setConversationToDelete(null);
    } catch (err) {
      sileo.error({
        title: 'Error deleting conversation',
        description: 'The conversation could not be removed, try again.',
        fill: 'var(--sileo-error-bg)',
        duration: 3000,
      });
      console.error('Error deleting conversation:', err);
    } finally {
      setIsDeletingConversation(false);
    }
  };

  // Auto-scroll to latest message, respecting user scroll position
  useEffect(() => {
    if (!isAtBottomRef.current) return;

    const el = chatScrollAreaRef.current;
    if (el) {
      if (isTyping) {
        // Direct scrollTop during streaming avoids smooth animation queue lag & fighting user scroll
        el.scrollTop = el.scrollHeight;
      } else {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      endRef.current?.scrollIntoView({
        behavior: isTyping ? 'auto' : 'smooth',
      });
    }
  }, [messages, isTyping]);

  const handleChatScroll = useCallback(() => {
    const el = chatScrollAreaRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isNearBottom = distanceFromBottom <= 120;
    isAtBottomRef.current = isNearBottom;
    setShowScrollBottom(!isNearBottom);
  }, []);

  const handleScrollToBottom = useCallback(() => {
    isAtBottomRef.current = true;
    setShowScrollBottom(false);
    const el = chatScrollAreaRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

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

  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFile(true);
    const newFiles: AttachedFile[] = [];

    // Límite de tamaño: 3MB para PDFs y documentos
    const MAX_PDF_SIZE_MB = 3;
    const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;
    const MAX_DOC_SIZE_MB = 3;
    const MAX_DOC_SIZE_BYTES = MAX_DOC_SIZE_MB * 1024 * 1024;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.split('.').pop()?.toLowerCase() || '';

      if (extension === 'pdf' && file.size > MAX_PDF_SIZE_BYTES) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        sileo.error({
          title: 'Archivo demasiado pesado',
          description: `El límite de tamaño en PDF es de 3MB. "${file.name}" (${fileSizeMB}MB) supera el límite.`,
          fill: 'var(--sileo-error-bg)',
          duration: 4000,
        });
        continue;
      }

      if (file.size > MAX_DOC_SIZE_BYTES) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        sileo.error({
          title: 'Archivo demasiado pesado',
          description: `El límite de tamaño para documentos es de 3MB. "${file.name}" (${fileSizeMB}MB) supera el límite.`,
          fill: 'var(--sileo-error-bg)',
          duration: 4000,
        });
        continue;
      }

      try {
        let content = '';
        if (extension === 'pdf') {
          content = await convertPdfToMarkdown(file);
        } else if (extension === 'docx') {
          content = await convertDocxToMarkdown(file);
        } else {
          content = await readFileAsText(file);
        }

        newFiles.push({
          id: `file-${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type || extension,
          content,
        });
      } catch (err) {
        console.error('Failed to read file:', file.name, err);
        sileo.error({
          title: 'Error al leer el archivo',
          description: `No se pudo procesar ${file.name}`,
          fill: 'var(--sileo-error-bg)',
          duration: 3500,
        });
      }
    }

    if (newFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...newFiles]);
      sileo.success({
        title:
          newFiles.length === 1
            ? 'Archivo adjuntado'
            : `${newFiles.length} archivos adjuntados`,
        description: newFiles.map((f) => f.name).join(', '),
        duration: 3000,
      });
    }

    setIsProcessingFile(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectContext = (ctx: AIContextSelector) => {
    setSelectedContext(ctx);
    setContextAnchor(null);
    setContextMenuLevel('main');
    if (inputValue.endsWith('@')) {
      setInputValue((prev) => prev.slice(0, -1));
    }
  };

  const sendMessage = useCallback(
    async (text: string, customHistory?: Message[]) => {
      const trimmedText = text.trim();
      const currentFiles = [...attachedFiles];

      if (!trimmedText && currentFiles.length === 0) return;

      if (!isProUser && userMessageCount >= TRIAL_MESSAGE_LIMIT) {
        setIsUpgradeModalOpen(true);
        return;
      }

      let promptContent = trimmedText;
      if (currentFiles.length > 0) {
        const filesBlock = currentFiles
          .map(
            (f) =>
              `=== ATTACHED FILE: ${f.name} ===\n${f.content || '(empty file)'}\n=== END OF FILE ===`,
          )
          .join('\n\n');

        if (promptContent) {
          promptContent = `${promptContent}\n\n${filesBlock}`;
        } else {
          promptContent = `Please review and analyze the following attached file(s):\n\n${filesBlock}`;
        }
      }

      const displayUserText =
        trimmedText ||
        `Uploaded: ${currentFiles.map((f) => f.name).join(', ')}`;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: displayUserText,
        rawContent: promptContent,
        attachedFiles: currentFiles.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
        createdAt: new Date().toISOString(),
      };

      const baseHistory = customHistory || messages;
      const history = [
        ...baseHistory.map((m) => ({
          role:
            m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.rawContent || m.text,
        })),
        { role: 'user' as const, content: promptContent },
      ];

      if (!customHistory) {
        setMessages((prev) => [...prev, userMsg]);
      } else {
        setMessages([...customHistory, userMsg]);
      }
      setInputValue('');
      setAttachedFiles([]);
      setStatus('submitted');

      if (!isProUser) {
        const nextCount = userMessageCount + 1;
        setUserMessageCount(nextCount);
        localStorage.setItem(trialStorageKey, String(nextCount));
      }

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        html: '',
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      isAtBottomRef.current = true;
      setShowScrollBottom(false);
      requestAnimationFrame(() => {
        if (chatScrollAreaRef.current) {
          chatScrollAreaRef.current.scrollTop =
            chatScrollAreaRef.current.scrollHeight;
        }
      });

      const initialActiveList = !customHistory
        ? [...messages, userMsg, aiMsg]
        : [...customHistory, userMsg, aiMsg];

      try {
        const streamPromise = fetchChatStreamResponse(
          history,
          biggestTask
            ? {
                title: biggestTask.title,
                description: biggestTask.notes || '',
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
          selectedContext?.type || null,
          selectedContext?.id || null,
        );
        setSelectedContext(null);

        aiStreamService
          .startStream(
            activeConversationId || 'new_chat',
            aiMsgId,
            streamPromise,
            initialActiveList,
          )
          .catch((err) => {
            console.error('Error in aiStreamService.startStream:', err);
          });
      } catch (err) {
        console.error('Error starting stream response:', err);
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
        setStatus('error');
      }
    },
    [
      messages,
      biggestTask,
      activeConversationId,
      selectedModel,
      selectedContext,
      attachedFiles,
      isProUser,
      userMessageCount,
      trialStorageKey,
      TRIAL_MESSAGE_LIMIT,
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
        {/* ── Chat Header ── */}
        <ChatHeader>
          <Box display="flex" justifyContent="flex-end" width="100%">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsHistoryOpen((prev) => !prev)}
              startIcon={<ChatIcon sx={{ fontSize: 15 }} />}
              sx={{
                borderRadius: '8px',

                borderColor: 'divider',
                textTransform: 'none',
                color: 'text.primary',
                fontSize: '12px',
                fontWeight: 600,
                px: 1.4,
                py: 0.45,
                '&:hover': {
                  borderColor: '#008767',
                  bgcolor: 'action.hover',
                },
              }}
            >
              Historial
            </Button>
          </Box>
        </ChatHeader>

        {/* ── Scrollable chat area ── */}
        <ChatScrollArea ref={chatScrollAreaRef} onScroll={handleChatScroll}>
          <CenteredColumn>
            {/* ── Welcome screen (shown when no messages) ── */}
            {!hasMessages && (
              <WelcomeSection>
                <MascotWrapper>
                  <LuminaAnimatedFace size={60} primaryColor={primaryColor} />
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
                  {suggestions.map((s) => {
                    let IconComponent = CalendarIcon;
                    if (s.iconType === 'tool') IconComponent = ToolIcon;
                    if (s.iconType === 'lightning')
                      IconComponent = LightningIcon;
                    if (s.iconType === 'chart') IconComponent = ChartIcon;

                    return (
                      <SuggestionCard
                        key={s.title}
                        onClick={() => handleSuggestionClick(s.prompt)}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(0, 135, 103, 0.15)'
                                : 'rgba(0, 135, 103, 0.08)',
                            flexShrink: 0,
                          }}
                        >
                          <IconComponent
                            sx={{ fontSize: 20, color: 'primary.main' }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            textAlign: 'left',
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            color="text.primary"
                            sx={{ lineHeight: 1.3, fontSize: '13.5px' }}
                          >
                            {s.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '11px', lineHeight: 1.2 }}
                          >
                            {s.subtitle}
                          </Typography>
                        </Box>
                      </SuggestionCard>
                    );
                  })}
                </SuggestionGrid>
              </WelcomeSection>
            )}

            {/* ── Message history ── */}
            {hasMessages && (
              <Box display="flex" flexDirection="column" gap={2} py={2}>
                <DateSeparator>
                  <span className="date-pill">{formatTodayDate()}</span>
                </DateSeparator>

                {messages.map((msg, index) => {
                  const isUser = msg.sender === 'user';
                  const {
                    cleanText: parsedCleanText,
                    attachedFiles: fallbackFiles,
                  } =
                    isUser &&
                    (msg.text.includes('ATTACHED FILE:') ||
                      (msg.rawContent && !msg.attachedFiles))
                      ? parseAttachedFilesFromContent(
                          msg.rawContent || msg.text,
                        )
                      : { cleanText: msg.text, attachedFiles: undefined };

                  const displayFiles =
                    msg.attachedFiles && msg.attachedFiles.length > 0
                      ? msg.attachedFiles
                      : fallbackFiles;

                  const needsClientParse = msg.actions === undefined && !isUser;
                  const {
                    cleanText,
                    actions: liveActions,
                    hasPendingAction: livePendingAction,
                  } = needsClientParse
                    ? parseLuminaActions(parsedCleanText)
                    : {
                        cleanText: parsedCleanText,
                        actions: [],
                        hasPendingAction: false,
                      };

                  const actions =
                    msg.actions !== undefined ? msg.actions : liveActions;
                  const hasPendingAction =
                    msg.actions === undefined && livePendingAction;

                  const thinkMatch = !isUser
                    ? cleanText.match(/<think>([\s\S]*?)<\/think>/i)
                    : null;
                  const reasoningText = thinkMatch
                    ? thinkMatch[1].trim()
                    : null;
                  const displayCleanText = reasoningText
                    ? cleanText.replace(/<think>[\s\S]*?<\/think>/i, '').trim()
                    : cleanText;

                  const isStreamingOrSubmitted =
                    (status === 'submitted' || status === 'streaming') &&
                    (msg.id === aiStreamService.getState().aiMsgId ||
                      (!isUser && index === messages.length - 1));

                  if (
                    !isUser &&
                    !displayCleanText &&
                    !hasPendingAction &&
                    !reasoningText &&
                    !isStreamingOrSubmitted
                  ) {
                    return null;
                  }

                  const prevUserMsg = !isUser
                    ? messages
                        .slice(0, index)
                        .reverse()
                        .find((m) => m.sender === 'user')
                    : undefined;
                  const userPromptText = prevUserMsg?.text || '';
                  const userIntent = !isUser
                    ? extractUserIntent(userPromptText)
                    : '';

                  if (
                    isUser &&
                    !cleanText.trim() &&
                    (!displayFiles || displayFiles.length === 0)
                  ) {
                    return null;
                  }

                  const cleanHtml =
                    msg.html && !isUser
                      ? renderMarkdown(
                          displayCleanText,
                          theme.palette.mode === 'dark',
                          theme,
                        )
                      : isUser && cleanText
                        ? renderMarkdown(
                            cleanText,
                            theme.palette.mode === 'dark',
                            theme,
                          )
                        : undefined;

                  const timeStr = formatMessageTime(msg.createdAt);

                  if (isUser) {
                    return (
                      <Box
                        key={msg.id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '3px',
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            gap: 1.25,
                            maxWidth: '85%',
                          }}
                        >
                          <MessageBubble isUser>
                            {displayFiles && displayFiles.length > 0 && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.8,
                                  mb: cleanText ? 1 : 0,
                                }}
                              >
                                {displayFiles.map((file, idx) => (
                                  <Chip
                                    key={idx}
                                    icon={
                                      <AttachFileIcon
                                        sx={{
                                          fontSize: '13px !important',
                                          color: '#ffffff !important',
                                        }}
                                      />
                                    }
                                    label={file.name}
                                    size="small"
                                    sx={{
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      borderRadius: '6px',
                                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                                      color: '#ffffff',
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                            {cleanText && (
                              <Typography
                                variant="body2"
                                sx={{
                                  whiteSpace: 'pre-wrap',
                                  lineHeight: 1.55,
                                }}
                              >
                                {cleanText}
                              </Typography>
                            )}
                          </MessageBubble>
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
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '11px',
                            color: 'text.secondary',
                            mr: '44px',
                            fontWeight: 500,
                          }}
                        >
                          {timeStr}
                        </Typography>
                      </Box>
                    );
                  }

                  // Lumina AI message
                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                        width: '100%',
                      }}
                    >
                      <AvatarWrapper isSpeaking={isStreamingOrSubmitted}>
                        <LuminaAnimatedFace
                          size={22}
                          primaryColor={primaryColor}
                          isSpeaking={isStreamingOrSubmitted}
                        />
                      </AvatarWrapper>
                      <AIMessageWrapper>
                        <AIMessageHeader>
                          <span className="ai-title">Lumina AI</span>
                          {isStreamingOrSubmitted && (
                            <LuminaSpeakingWave
                              isSpeaking={true}
                              label={
                                status === 'streaming' ? 'Hablando' : 'Pensando'
                              }
                            />
                          )}
                          <span className="ai-time">{timeStr}</span>
                        </AIMessageHeader>
                        {/* Notion-style Chain of Thought dropdown */}
                        {userIntent && (
                          <ChainOfThought
                            defaultOpen={isStreamingOrSubmitted}
                            isStreaming={isStreamingOrSubmitted}
                            sx={{ my: 0.75, width: '100%' }}
                          >
                            <ChainOfThoughtHeader>
                              <Box
                                component="span"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.75,
                                  ...truncateSx,
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    fontWeight: 600,
                                    color: byMode(zinc[800], zinc[200]),
                                  }}
                                >
                                  {isStreamingOrSubmitted
                                    ? 'El usuario está queriendo'
                                    : 'El usuario requirió'}
                                  :
                                </Box>
                                <Box
                                  component="span"
                                  sx={{
                                    fontWeight: 400,
                                    fontStyle: 'italic',
                                    color: byMode(zinc[600], zinc[400]),
                                    ...truncateSx,
                                  }}
                                >
                                  {userIntent}
                                </Box>
                              </Box>
                            </ChainOfThoughtHeader>
                            <ChainOfThoughtContent>
                              <ChainOfThoughtStep
                                status="complete"
                                label="Comprendiendo objetivo del usuario"
                                description={`"${userIntent}"`}
                              />
                              <ChainOfThoughtStep
                                status={
                                  isStreamingOrSubmitted && !displayCleanText
                                    ? 'active'
                                    : 'complete'
                                }
                                label="Consultando contexto de Focusly"
                                description="Workspaces, proyectos, tareas y calendario"
                              />
                              <ChainOfThoughtStep
                                status={
                                  isStreamingOrSubmitted
                                    ? displayCleanText
                                      ? 'active'
                                      : 'pending'
                                    : 'complete'
                                }
                                label="Estructurando respuesta y acciones"
                                description={
                                  actions.length > 0
                                    ? `${actions.length} acción(es) detectada(s)`
                                    : undefined
                                }
                              />
                              {reasoningText && (
                                <Box
                                  sx={{
                                    mt: 1.25,
                                    p: 1.5,
                                    borderRadius: '8px',
                                    bgcolor: byMode(
                                      `${zinc[100]}cc`,
                                      `${zinc[800]}99`,
                                    ),
                                    border: '1px solid',
                                    borderColor: byMode(
                                      'rgba(0, 0, 0, 0.05)',
                                      'rgba(255, 255, 255, 0.05)',
                                    ),
                                    fontFamily:
                                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                    fontSize: '12px',
                                    lineHeight: 1.625,
                                    color: byMode(zinc[700], zinc[300]),
                                    maxHeight: 224,
                                    overflowY: 'auto',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      fontFamily: 'inherit',
                                      fontWeight: 600,
                                      fontSize: '11px',
                                      color: byMode(emerald[600], emerald[400]),
                                      textTransform: 'uppercase',
                                      letterSpacing: '0.05em',
                                      mb: 0.75,
                                    }}
                                  >
                                    Pensamiento de Lumina
                                  </Box>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: renderMarkdown(
                                        reasoningText,
                                        theme.palette.mode === 'dark',
                                        theme,
                                      ),
                                    }}
                                  />
                                </Box>
                              )}
                            </ChainOfThoughtContent>
                          </ChainOfThought>
                        )}

                        {/* Loading interaction while AI is working */}
                        {!displayCleanText && isStreamingOrSubmitted && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.25,
                              py: 1.25,
                              px: 1.75,
                              my: 0.75,
                              borderRadius: '12px',
                              bgcolor: byMode(
                                `${emerald[50]}80`,
                                `${emerald[950]}33`,
                              ),
                              border: `1px solid ${emerald[500]}26`,
                              width: 'fit-content',
                              animation: `${fadeIn} 0.3s ease`,
                            }}
                          >
                            <LuminaOrb
                              size={18}
                              state="thinking"
                              primaryColor={primaryColor}
                            />
                            <Shimmer
                              duration={1.5}
                              sx={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: byMode(emerald[700], emerald[400]),
                              }}
                            >
                              Lumina está trabajando en tu solicitud...
                            </Shimmer>
                          </Box>
                        )}

                        {displayCleanText && (
                          <MessageBubble isUser={false}>
                            {cleanHtml ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: cleanHtml,
                                }}
                                style={{
                                  lineHeight: 1.65,
                                  fontSize: '14px',
                                }}
                              />
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{ whiteSpace: 'pre-wrap' }}
                              >
                                {displayCleanText}
                              </Typography>
                            )}
                            {hasPendingAction && (
                              <Box
                                sx={{
                                  mt: 1,
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  color: byMode(emerald[600], emerald[400]),
                                }}
                              >
                                <Shimmer duration={1.5}>
                                  Lumina está preparando los cambios...
                                </Shimmer>
                              </Box>
                            )}
                          </MessageBubble>
                        )}

                        {actions.length > 0 && <ActionPlan actions={actions} />}
                        <AIMessageActions>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => handleCopyMessage(displayCleanText)}
                          >
                            <CopyIcon sx={{ fontSize: 13 }} />
                            Copiar
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => handleRetry(msg.id)}
                          >
                            <RefreshIcon sx={{ fontSize: 13 }} />
                            Regenerar
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => handleFeedback()}
                          >
                            <ThumbUpOutlinedIcon sx={{ fontSize: 13 }} />
                          </button>
                        </AIMessageActions>
                      </AIMessageWrapper>
                    </Box>
                  );
                })}

                <div ref={endRef} />
              </Box>
            )}
          </CenteredColumn>
        </ChatScrollArea>

        {/* ── Floating scroll to bottom button ── */}
        {showScrollBottom && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 112,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              pointerEvents: 'auto',
            }}
          >
            <Tooltip title="Ir al mensaje más reciente">
              <Button
                variant="contained"
                onClick={handleScrollToBottom}
                startIcon={<ArrowDownIcon />}
                size="small"
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  px: 2,
                  py: 0.6,
                  bgcolor: surfaceColor(
                    theme,
                    'rgba(36, 36, 41, 0.92)',
                    'rgba(48, 48, 48, 0.92)',
                    'rgba(255, 255, 255, 0.92)',
                  ),
                  color: 'text.primary',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                  border: '1px solid',
                  borderColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    bgcolor: surfaceColor(
                      theme,
                      '#2e2e35',
                      '#3C3C3C',
                      '#f0f0f2',
                    ),
                  },
                }}
              >
                Ir al final
              </Button>
            </Tooltip>
          </Box>
        )}

        {/* ── Sticky bottom input ── */}
        <InputWrapper>
          <Menu
            anchorEl={contextAnchor}
            open={Boolean(contextAnchor)}
            onClose={() => {
              setContextAnchor(null);
              setContextMenuLevel('main');
            }}
            PaperProps={{
              sx: {
                borderRadius: '12px',
                width: contextAnchor
                  ? `${contextAnchor.clientWidth}px`
                  : 'auto',
                maxHeight: '320px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                border: '1px solid',
                borderColor: 'divider',
                overflowY: 'auto',
              },
            }}
          >
            {contextMenuLevel === 'main' && (
              <>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'block',
                    fontWeight: 800,
                    color: 'text.secondary',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(0,0,0,0.02)',
                  }}
                >
                  SELECCIONAR CONTEXTO
                </Typography>
                <MenuItem
                  onClick={() => setContextMenuLevel('tasks')}
                  sx={{ fontSize: '12px', fontWeight: 600, py: 1 }}
                >
                  📋 Tasks / Tareas
                </MenuItem>
                <MenuItem
                  onClick={() => setContextMenuLevel('calendar')}
                  sx={{ fontSize: '12px', fontWeight: 600, py: 1 }}
                >
                  📅 Calendario / Google Calendar
                </MenuItem>
                <MenuItem
                  onClick={() => setContextMenuLevel('workspaces')}
                  sx={{ fontSize: '12px', fontWeight: 600, py: 1 }}
                >
                  🗂️ Workspaces / Espacios de Trabajo
                </MenuItem>
              </>
            )}

            {contextMenuLevel === 'tasks' && (
              <>
                <MenuItem
                  onClick={() => setContextMenuLevel('main')}
                  sx={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'primary.main',
                    py: 0.75,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  ⬅️ Volver al menú principal
                </MenuItem>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'block',
                    fontWeight: 800,
                    color: 'text.secondary',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(0,0,0,0.02)',
                  }}
                >
                  SELECCIONAR TAREA
                </Typography>
                <MenuItem
                  onClick={() =>
                    selectContext({ type: 'tasks', title: 'Todas las Tareas' })
                  }
                  sx={{ fontSize: '11px', fontWeight: 600, py: 0.75 }}
                >
                  📋 Todas las Tareas (@Tasks)
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {tasks.length === 0 && reduxEvents.length === 0 ? (
                  <MenuItem disabled sx={{ fontSize: '11px' }}>
                    No hay tareas ni eventos activos
                  </MenuItem>
                ) : (
                  <>
                    {tasks.slice(0, 8).map((t) => (
                      <MenuItem
                        key={t.id}
                        onClick={() =>
                          selectContext({
                            type: 'task',
                            id: t.id,
                            title: t.title,
                          })
                        }
                        sx={{
                          fontSize: '11px',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          py: 0.5,
                        }}
                      >
                        📋 {t.title}
                      </MenuItem>
                    ))}
                    {reduxEvents.length > 0 && (
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            px: 2,
                            py: 0.5,
                            display: 'block',
                            fontWeight: 700,
                            color: 'text.secondary',
                            fontSize: '10px',
                          }}
                        >
                          EVENTOS DE CALENDARIO
                        </Typography>
                        {reduxEvents.slice(0, 5).map((ev) => (
                          <MenuItem
                            key={ev.id}
                            onClick={() =>
                              selectContext({
                                type: 'event',
                                id: ev.id,
                                title: ev.title,
                              })
                            }
                            sx={{
                              fontSize: '11px',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              py: 0.5,
                            }}
                          >
                            📅 {ev.title}
                          </MenuItem>
                        ))}
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {contextMenuLevel === 'calendar' && (
              <>
                <MenuItem
                  onClick={() => setContextMenuLevel('main')}
                  sx={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'primary.main',
                    py: 0.75,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  ⬅️ Volver al menú principal
                </MenuItem>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'block',
                    fontWeight: 800,
                    color: 'text.secondary',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(0,0,0,0.02)',
                  }}
                >
                  SELECCIONAR EVENTO DE CALENDARIO
                </Typography>
                <MenuItem
                  onClick={() =>
                    selectContext({
                      type: 'calendar',
                      title: 'Todo el Calendario',
                    })
                  }
                  sx={{ fontSize: '11px', fontWeight: 600, py: 0.75 }}
                >
                  📅 Todo el Calendario (@Calendar)
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {reduxEvents.length === 0 ? (
                  <MenuItem disabled sx={{ fontSize: '11px' }}>
                    No hay eventos de calendario
                  </MenuItem>
                ) : (
                  reduxEvents.slice(0, 10).map((ev) => (
                    <MenuItem
                      key={ev.id}
                      onClick={() =>
                        selectContext({
                          type: 'event',
                          id: ev.id,
                          title: ev.title,
                        })
                      }
                      sx={{
                        fontSize: '11px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        py: 0.5,
                      }}
                    >
                      📅 {ev.title}
                    </MenuItem>
                  ))
                )}
              </>
            )}

            {contextMenuLevel === 'workspaces' && (
              <>
                <MenuItem
                  onClick={() => setContextMenuLevel('main')}
                  sx={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'primary.main',
                    py: 0.75,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  ⬅️ Volver al menú principal
                </MenuItem>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'block',
                    fontWeight: 800,
                    color: 'text.secondary',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.03)'
                        : 'rgba(0,0,0,0.02)',
                  }}
                >
                  SELECCIONAR WORKSPACE
                </Typography>
                <MenuItem
                  onClick={() =>
                    selectContext({
                      type: 'workspaces',
                      title: 'Todos los Workspaces',
                    })
                  }
                  sx={{ fontSize: '11px', fontWeight: 600, py: 0.75 }}
                >
                  🗂️ Todos los Workspaces (@Workspaces)
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                {workspacesLoading ? (
                  <MenuItem disabled sx={{ fontSize: '11px' }}>
                    Cargando workspaces...
                  </MenuItem>
                ) : workspacesList.length === 0 ? (
                  <MenuItem disabled sx={{ fontSize: '11px' }}>
                    No hay workspaces
                  </MenuItem>
                ) : (
                  workspacesList
                    .slice(0, 8)
                    .map((w: { id: string; title: string }) => (
                      <MenuItem
                        key={w.id}
                        onClick={() =>
                          selectContext({
                            type: 'workspace',
                            id: w.id,
                            title: w.title,
                          })
                        }
                        sx={{
                          fontSize: '11px',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          py: 0.5,
                        }}
                      >
                        🗂️ {w.title}
                      </MenuItem>
                    ))
                )}
              </>
            )}
          </Menu>

          {/* AI Elements PromptInput */}
          <Box
            sx={{ width: '100%', maxWidth: 768 }}
            ref={inputBoxRef as unknown as React.Ref<HTMLDivElement>}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".pdf,.docx,.txt,.md,.csv,.json,.js,.jsx,.ts,.tsx,.py,.html,.css"
              style={{ display: 'none' }}
            />

            {/* Trial Limit Reached Banner (similar to ChatGPT upgrade card) */}
            {isTrialLimitReached && (
              <TrialUpgradeBanner>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '12px',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(0, 135, 103, 0.2)'
                          : '#ecfdf5',
                      border: '1px solid',
                      borderColor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(0, 135, 103, 0.45)'
                          : '#a7f3d0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#008767',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0, 135, 103, 0.15)',
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 20 }} />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.35,
                      minWidth: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 800,
                          fontSize: '13.5px',
                          color: 'text.primary',
                          lineHeight: 1.25,
                        }}
                      >
                        Has alcanzado el límite de tu chat de prueba
                      </Typography>
                      <Chip
                        label={`${TRIAL_MESSAGE_LIMIT}/${TRIAL_MESSAGE_LIMIT} mensajes`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '10px',
                          fontWeight: 700,
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : '#fee2e2',
                          color: (theme) =>
                            theme.palette.mode === 'dark'
                              ? '#fca5a5'
                              : '#b91c1c',
                          border: '1px solid',
                          borderColor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(239, 68, 68, 0.3)'
                              : '#fecaca',
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '12px',
                        lineHeight: 1.4,
                      }}
                    >
                      Se agotaron los 10 mensajes de prueba con Lumina.
                      Actualiza a Focusly Plus para continuar conversando sin
                      límites y acceder a modelos avanzados.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  endIcon={<AutoAwesomeIcon sx={{ fontSize: 15 }} />}
                  sx={{
                    borderRadius: '10px',
                    bgcolor: '#008767',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    textTransform: 'none',
                    px: 2.2,
                    py: 0.9,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    width: { xs: '100%', sm: 'auto' },
                    boxShadow: '0 3px 12px rgba(0, 135, 103, 0.35)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: '#007357',
                      boxShadow: '0 5px 18px rgba(0, 135, 103, 0.45)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Actualizar a Plus
                </Button>
              </TrialUpgradeBanner>
            )}

            <PromptInput
              status={status}
              onStop={handleStopStream}
              onSubmit={() => {
                if (isTrialLimitReached) {
                  setIsUpgradeModalOpen(true);
                } else {
                  sendMessage(inputValue);
                }
              }}
              sx={{
                border: '1px solid',
                borderColor: byMode(
                  'rgba(0, 0, 0, 0.1)',
                  'rgba(255, 255, 255, 0.1)',
                ),
                bgcolor: byMode('rgba(255, 255, 255, 0.8)', `${zinc[900]}e6`),
              }}
            >
              {(selectedContext || attachedFiles.length > 0) && (
                <PromptInputHeader>
                  {selectedContext && (
                    <Chip
                      label={`@${selectedContext.title}`}
                      onDelete={() => setSelectedContext(null)}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '11px',
                        height: 24,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(0, 135, 103, 0.15)'
                            : 'rgba(0, 135, 103, 0.08)',
                        borderColor: '#008767',
                      }}
                    />
                  )}
                  {attachedFiles.map((file, idx) => (
                    <Chip
                      key={file.id || idx}
                      icon={
                        <AttachFileIcon sx={{ fontSize: '13px !important' }} />
                      }
                      label={file.name}
                      onDelete={() =>
                        setAttachedFiles((prev) =>
                          prev.filter((_, i) => i !== idx),
                        )
                      }
                      size="small"
                      sx={{
                        borderRadius: '6px',
                        fontWeight: 500,
                        fontSize: '11px',
                        height: 24,
                      }}
                    />
                  ))}
                </PromptInputHeader>
              )}

              <PromptInputBody>
                <PromptInputTextarea
                  value={inputValue}
                  disabled={isTrialLimitReached}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInputValue(val);
                    if (val.endsWith('@')) {
                      setContextAnchor(inputBoxRef.current);
                      setContextMenuLevel('main');
                    }
                  }}
                  placeholder={
                    isTrialLimitReached
                      ? 'Has alcanzado el límite de 10 mensajes de prueba. Actualiza a Plus para continuar...'
                      : attachedFiles.length > 0
                        ? 'Pregunta sobre los archivos adjuntos...'
                        : 'Pregúntale a Lumina lo que necesites o escribe @ para contexto...'
                  }
                />
              </PromptInputBody>

              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputButton
                    onClick={() => {
                      if (!isTrialLimitReached) {
                        setContextAnchor(inputBoxRef.current);
                        setContextMenuLevel('main');
                      }
                    }}
                    disabled={isTrialLimitReached}
                    sx={
                      selectedContext
                        ? {
                            color: byMode(emerald[700], emerald[400]),
                            bgcolor: byMode(emerald[50], `${emerald[950]}66`),
                          }
                        : undefined
                    }
                    title="Referenciar contexto (@)"
                  >
                    <AtIcon sx={{ fontSize: 16 }} />
                    <Box
                      component="span"
                      sx={{ display: { xs: 'none', sm: 'inline' } }}
                    >
                      {selectedContext
                        ? `@${selectedContext.title}`
                        : 'Contexto'}
                    </Box>
                  </PromptInputButton>

                  <PromptInputButton
                    onClick={handleOpenFile}
                    disabled={isProcessingFile || isTrialLimitReached}
                    title="Adjuntar archivo (PDF, DOCX, TXT, MD, etc. - Máx. 3MB)"
                  >
                    {isProcessingFile ? (
                      <CircularProgress size={14} sx={{ color: 'inherit' }} />
                    ) : (
                      <AttachFileIcon sx={{ fontSize: 16 }} />
                    )}
                    <Box
                      component="span"
                      sx={{ display: { xs: 'none', sm: 'inline' } }}
                    >
                      Adjuntar
                    </Box>
                  </PromptInputButton>

                  <PromptInputButton
                    onClick={(e) => setModelAnchor(e.currentTarget)}
                    disabled={isTrialLimitReached}
                    title="Seleccionar modelo"
                  >
                    {selectedModel.startsWith('claude') ? (
                      <ClaudeIcon sx={{ fontSize: 14 }} />
                    ) : (
                      <GeminiIcon sx={{ fontSize: 14 }} />
                    )}
                    <Box
                      component="span"
                      sx={{ display: { xs: 'none', sm: 'inline' } }}
                    >
                      {getModelLabel(selectedModel)}
                    </Box>
                    <ArrowDownIcon sx={{ fontSize: 14 }} />
                  </PromptInputButton>
                </PromptInputTools>

                <PromptInputSubmit
                  status={status}
                  onStop={handleStopStream}
                  disabled={
                    isTrialLimitReached ||
                    (!inputValue.trim() && attachedFiles.length === 0) ||
                    isProcessingFile
                  }
                />
              </PromptInputFooter>
            </PromptInput>

            <Typography
              variant="caption"
              component="p"
              sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}
            >
              <Trans
                i18nKey="legal.aiNotice"
                components={{
                  privacy: (
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'underline' }}
                    />
                  ),
                }}
              />
            </Typography>

            {/* Model Selector Menu (anchored to PromptInput model button) */}
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

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              fontSize: '11px',
              color: 'text.secondary',
              mt: 1,
              opacity: 0.75,
            }}
          >
            Lumina puede cometer errores. Verifica la información importante
            sobre tareas y horarios.
          </Typography>
        </InputWrapper>
      </ChatAreaWrapper>

      {/* ── Chat History Sidebar (right) ── */}
      <HistorySidebar isOpen={isHistoryOpen}>
        <Box
          sx={{
            p: 2,
            pb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.08em',
              fontSize: '11px',
              textTransform: 'uppercase',
              color: 'text.secondary',
            }}
          >
            Historial de conversaciones
          </Typography>
          <IconButton
            size="small"
            onClick={() => setIsHistoryOpen(false)}
            sx={{
              color: 'text.secondary',
              p: 0.5,
              '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            p: 2,
            pb: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {/* Search box */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.6,
              borderRadius: '8px',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.04)',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <SearchIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <input
              type="text"
              placeholder="Buscar en el historial..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '12px',
                color: 'inherit',
                width: '100%',
              }}
            />
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pb: 2 }}>
          {filteredConversations.length === 0 ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ p: 2, display: 'block', textAlign: 'center' }}
            >
              No se encontraron chats
            </Typography>
          ) : (
            groupedConversations.map((group) => (
              <Box key={group.label} sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={800}
                  sx={{
                    px: 1,
                    mb: 1,
                    display: 'block',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontSize: '10px',
                  }}
                >
                  {group.label}
                </Typography>
                {group.items.map((c) => {
                  const isActive = c.id === activeConversationId;
                  return (
                    <Box
                      key={c.id}
                      onClick={() => handleSelectConversation(c.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.25,
                        px: 1.5,
                        py: 1.2,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        mb: 0.8,
                        bgcolor: isActive
                          ? (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(0, 135, 103, 0.16)'
                                : '#ecfdf5'
                          : 'transparent',
                        border: isActive
                          ? (theme) =>
                              theme.palette.mode === 'dark'
                                ? '1px solid rgba(0, 135, 103, 0.35)'
                                : '1px solid #a7f3d0'
                          : '1px solid transparent',
                        color: 'text.primary',
                        '&:hover': {
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.05)'
                              : 'rgba(0, 0, 0, 0.03)',
                          '& .delete-btn': { opacity: 0.7 },
                        },
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <ChatIcon
                        sx={{
                          fontSize: 16,
                          mt: '2px',
                          color: isActive ? '#008767' : 'text.secondary',
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: isActive ? 700 : 600,
                              fontSize: '12.5px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: isActive ? '#008767' : 'text.primary',
                            }}
                          >
                            {c.title || 'Nuevo chat'}
                          </Typography>
                          {c.updatedAt && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                fontSize: '10px',
                                ml: 1,
                                flexShrink: 0,
                              }}
                            >
                              {formatUpdateTime(c.updatedAt)}
                            </Typography>
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: '11px',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mt: 0.25,
                            opacity: 0.8,
                          }}
                        >
                          {c.id === activeConversationId && messages.length > 0
                            ? messages[messages.length - 1].text.slice(0, 50)
                            : 'Conversación de Lumina'}
                        </Typography>
                      </Box>
                      <IconButton
                        className="delete-btn"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConversationToDelete({
                            id: c.id,
                            title: c.title,
                          });
                        }}
                        sx={{
                          p: 0.25,
                          opacity: 0,
                          color: 'text.secondary',
                          '&:hover': {
                            color: theme.palette.error.main,
                            opacity: '1 !important',
                          },
                          transition: 'opacity 0.15s, color 0.15s',
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>
            ))
          )}
        </Box>

        {FEATURE_FLAGS.LIMIT_AI_CONVERSATIONS && (
          <Box
            sx={{
              p: 2,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(0, 0, 0, 0.015)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
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
                  py: 1.1,
                  border: '1px dashed #008767',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: '#007357',
                    boxShadow: '0 4px 12px rgba(0, 135, 103, 0.25)',
                  },
                }}
              >
                Nuevo Chat
              </Button>
            </Box>
          </Box>
        )}
      </HistorySidebar>

      <UpgradeModal
        open={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgradeSuccess={() => {
          setIsProUser(true);
          localStorage.setItem(proStorageKey, 'true');
        }}
      />

      {/* Confirmation Modal to delete AI conversation */}
      <Dialog
        open={Boolean(conversationToDelete)}
        onClose={() => {
          if (!isDeletingConversation) {
            setConversationToDelete(null);
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: '18px',
            p: 1,
            maxWidth: '420px',
            width: '100%',
            bgcolor: surfaceColor(theme, '#18181b', '#222222', '#ffffff'),
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 24px 48px rgba(0, 0, 0, 0.6)'
                : '0 24px 48px rgba(0, 0, 0, 0.12)',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            pt: 2,
            px: 2.5,
            pb: 1,
            fontWeight: 700,
            fontSize: '17px',
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(239, 68, 68, 0.1)',
              color: theme.palette.error.main,
              flexShrink: 0,
            }}
          >
            <WarningIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography variant="h6" sx={{ fontSize: '17px', fontWeight: 700 }}>
            {t('askAi.deleteModalTitle', '¿Eliminar conversación?')}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 2.5, py: 1 }}>
          <DialogContentText
            sx={{
              color: 'text.secondary',
              fontSize: '14px',
              lineHeight: 1.5,
            }}
          >
            {t(
              'askAi.deleteModalDesc',
              '¿Estás seguro de que deseas eliminar esta conversación con Lumina? Esta acción no se puede deshacer y se borrarán todos sus mensajes.',
            )}
          </DialogContentText>

          {conversationToDelete?.title && (
            <Box
              sx={{
                mt: 1.75,
                p: 1.25,
                borderRadius: '10px',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.025)',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <ChatIcon
                sx={{
                  fontSize: 16,
                  color: 'text.secondary',
                  opacity: 0.8,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {conversationToDelete.title}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2, pt: 1.5, gap: 1 }}>
          <Button
            onClick={() => setConversationToDelete(null)}
            disabled={isDeletingConversation}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13.5px',
              px: 2,
              borderColor: theme.palette.divider,
              color: 'text.secondary',
              '&:hover': {
                borderColor: theme.palette.text.disabled,
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(0,0,0,0.03)',
              },
            }}
          >
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button
            onClick={() => {
              if (conversationToDelete) {
                handleDeleteConversation(conversationToDelete.id);
              }
            }}
            disabled={isDeletingConversation}
            variant="contained"
            color="error"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13.5px',
              px: 2.5,
              boxShadow: 'none',
              minWidth: '85px',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              },
            }}
          >
            {isDeletingConversation ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              t('common.delete', 'Eliminar')
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </AskAIContainer>
  );
};

export default AskAI;
