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
  LinearProgress,
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
  Mic as MicIcon,
  Search as SearchIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FEATURE_FLAGS } from '@/config/featureFlags.config';
import { useAppSelector } from '@/redux/hooks';
import {
  LuminaAnimatedFace,
  LuminaOrb,
  ClaudeIcon,
  GeminiIcon,
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
import { SuggestedActionCard } from '@/components/chat/suggestedActionCard/SuggestedActionCard';
import { SuggestedActionsPlan } from '@/components/chat/suggestedActionsPlan/SuggestedActionsPlan';
import { UpgradeModal } from '@/components/modals';
import { aiStreamService } from '@/services/aiStreamService';
import { parseLuminaActions, sileo, type ParsedLuminaAction } from '@/utils';
import { surfaceColor } from '@/context';
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
  SuggestionsBar,
  TypingIndicator,
  LuminaWorkingIndicator,
  InputWrapper,
  InputBox,
  StyledInput,
  SendButton,
  HistorySidebar,
  ChatAreaWrapper,
  ChatHeader,
  ModelBadgeButton,
  StatusPill,
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
  // Populated only for messages loaded from history — the backend already
  // parsed these out of the raw `[ACTION: ...]` tags before they ever left
  // the server, so we don't need (and shouldn't rely on) client-side regex
  // parsing of persisted content. A single AI reply can suggest several
  // tasks (e.g. one per week of a month-long plan), hence the array.
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
      return `<a href="${url}" style="color: #60a5fa; text-decoration: underline; font-weight: 600;">${text}</a>`;
    }
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline; font-weight: 600;">${text}</a>`;
  });

  // 4b. Quoted task names or entities: "Task name" -> styled highlighted pill
  const pillBg = isDark ? 'rgba(96, 165, 250, 0.16)' : '#eff6ff';
  const pillBorder = isDark ? 'rgba(96, 165, 250, 0.35)' : '#dbeafe';
  const pillColor = isDark ? '#93c5fd' : '#1e40af';
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

export interface AIContextSelector {
  type: 'tasks' | 'workspaces' | 'task' | 'workspace';
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

// Rotates while waiting for the first token of a reply — reflects, roughly,
// the context-building steps the backend actually does before the LLM call
// (see build_context() in focusly-workflows) so the wait doesn't look idle.
const LAST_CONVERSATION_STORAGE_KEY = 'focusly_ai_last_conversation_id';

const LUMINA_STATUS_MESSAGES = [
  'Lumina se está conectando',
  'Leyendo tus tareas',
  'Revisando tus workspaces y folders',
  'Consultando tu calendario',
  'Analizando el contexto',
];

// ─── Component ────────────────────────────────────────────────────────────────

export const AskAI: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.task);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>(() => {
    if (aiStreamService.isGenerating()) {
      return aiStreamService.getActiveMessages() as unknown as Message[];
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState<boolean>(() =>
    aiStreamService.isGenerating(),
  );
  const [statusMessageIndex, setStatusMessageIndex] = useState(0);
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
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [modelAnchor, setModelAnchor] = useState<null | HTMLElement>(null);
  const [selectedContext, setSelectedContext] =
    useState<AIContextSelector | null>(null);
  const [contextAnchor, setContextAnchor] = useState<null | HTMLElement>(null);
  const [contextMenuLevel, setContextMenuLevel] = useState<
    'main' | 'tasks' | 'workspaces'
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

  // Subscribe to background AI stream service
  useEffect(() => {
    const unsubscribe = aiStreamService.subscribe((event) => {
      if (event.type === 'chunk') {
        setIsTyping(false);
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
        setIsTyping(false);
        getAIConversations()
          .then((updatedConvs) => {
            setConversations(updatedConvs);
            if (!activeConversationId && updatedConvs.length > 0) {
              setActiveConversationId(updatedConvs[0].id);
            }
          })
          .catch(console.error);
      } else if (event.type === 'error') {
        setIsTyping(false);
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

  // Rotate the "what Lumina is doing" status text while waiting for the
  // first token of a reply (index is reset to 0 where sendMessage sets
  // isTyping, right before the request goes out).
  useEffect(() => {
    if (!isTyping) return;
    const intervalId = setInterval(() => {
      setStatusMessageIndex(
        (prev) => (prev + 1) % LUMINA_STATUS_MESSAGES.length,
      );
    }, 1400);
    return () => clearInterval(intervalId);
  }, [isTyping]);

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

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 20 * 1024 * 1024) {
        sileo.error({
          title: 'File too large',
          description: `${file.name} exceeds 20MB limit`,
          fill: 'var(--sileo-error-bg)',
          duration: 3500,
        });
        continue;
      }

      const extension = file.name.split('.').pop()?.toLowerCase() || '';

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
          title: 'Failed to read file',
          description: `Could not parse ${file.name}`,
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
            ? 'File attached'
            : `${newFiles.length} files attached`,
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

      if (FEATURE_FLAGS.LIMIT_AI_CONVERSATIONS && !activeConversationId) {
        if (conversations.length >= 4) {
          setIsUpgradeModalOpen(true);
          return;
        }
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
      setIsTyping(true);
      setStatusMessageIndex(0);

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
        setIsTyping(false);
      }
    },
    [
      messages,
      biggestTask,
      activeConversationId,
      conversations,
      selectedModel,
      selectedContext,
      attachedFiles,
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
      if (inputValue.trim() || attachedFiles.length > 0) {
        sendMessage(inputValue);
      }
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
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                bgcolor: (t) =>
                  t.palette.mode === 'dark'
                    ? 'rgba(99, 102, 241, 0.15)'
                    : '#ffffff',
                border: '1.5px solid',
                borderColor: (t) =>
                  t.palette.mode === 'dark'
                    ? 'rgba(99, 102, 241, 0.4)'
                    : '#c7d2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(99, 102, 241, 0.08)',
                flexShrink: 0,
              }}
            >
              <LuminaAnimatedFace size={22} primaryColor={primaryColor} />
            </Box>
            <Box display="flex" flexDirection="column" gap={0.2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="subtitle1"
                  fontWeight={800}
                  color="text.primary"
                  sx={{ fontSize: '15px', lineHeight: 1.2 }}
                >
                  Lumina AI
                </Typography>
                <StatusPill>
                  <span className="status-dot" />
                  En línea
                </StatusPill>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '11.5px',
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                Tu copiloto inteligente para estructurar y ejecutar tareas
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <ModelBadgeButton
              size="small"
              onClick={(e) => setModelAnchor(e.currentTarget)}
              startIcon={
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: '#8b5cf6',
                  }}
                />
              }
              endIcon={<ArrowDownIcon sx={{ fontSize: 14 }} />}
            >
              <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                {getModelLabel(selectedModel)}
              </Typography>
              <Box
                component="span"
                sx={{
                  bgcolor: (t) =>
                    t.palette.mode === 'dark'
                      ? 'rgba(37, 99, 235, 0.25)'
                      : '#eff6ff',
                  color: '#2563eb',
                  fontSize: '10px',
                  fontWeight: 700,
                  px: 0.6,
                  py: 0.15,
                  borderRadius: '4px',
                  ml: 0.25,
                }}
              >
                Rápido
              </Box>
            </ModelBadgeButton>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 0.75, height: '18px', alignSelf: 'center' }}
            />

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
                  borderColor: '#2563eb',
                  bgcolor: 'action.hover',
                },
              }}
            >
              Historial
            </Button>
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
                                ? 'rgba(59, 130, 246, 0.15)'
                                : 'rgba(59, 130, 246, 0.08)',
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

                {messages.map((msg) => {
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

                  const {
                    cleanText,
                    actions: liveActions,
                    hasPendingAction: livePendingAction,
                  } = parseLuminaActions(parsedCleanText);
                  // Historical messages already carry the backend-parsed
                  // actions; only fall back to the client-side regex (and
                  // its "still streaming a tag" flag) for the message
                  // currently being streamed in.
                  const actions =
                    msg.actions !== undefined ? msg.actions : liveActions;
                  const hasPendingAction =
                    msg.actions === undefined && livePendingAction;

                  if (!isUser && !cleanText.trim() && !hasPendingAction) {
                    return null;
                  }
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
                          cleanText,
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
                      <AvatarWrapper>
                        <LuminaAnimatedFace
                          size={22}
                          primaryColor={primaryColor}
                        />
                      </AvatarWrapper>
                      <AIMessageWrapper>
                        <AIMessageHeader>
                          <span className="ai-title">Lumina AI</span>
                          <span className="ai-time">{timeStr}</span>
                        </AIMessageHeader>
                        <MessageBubble isUser={false}>
                          {cleanText &&
                            (cleanHtml ? (
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
                                {cleanText}
                              </Typography>
                            ))}
                          {hasPendingAction && (
                            <LuminaWorkingIndicator
                              sx={cleanText ? { mt: 1 } : undefined}
                            >
                              <span className="shimmer-text">
                                Lumina está trabajando
                              </span>
                              <span className="pulse-dots">
                                <span className="pulse-dot" />
                                <span className="pulse-dot" />
                                <span className="pulse-dot" />
                              </span>
                            </LuminaWorkingIndicator>
                          )}
                        </MessageBubble>
                        {actions.length === 1 && (
                          <SuggestedActionCard action={actions[0]} />
                        )}
                        {actions.length > 1 && (
                          <SuggestedActionsPlan actions={actions} />
                        )}
                        <AIMessageActions>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => handleCopyMessage(cleanText)}
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

                {/* Typing indicator */}
                {isTyping && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      width: '100%',
                    }}
                  >
                    <AvatarWrapper>
                      <LuminaOrb
                        size={22}
                        state="thinking"
                        primaryColor={primaryColor}
                      />
                    </AvatarWrapper>
                    <AIMessageWrapper>
                      <AIMessageHeader>
                        <span className="ai-title">Lumina AI</span>
                      </AIMessageHeader>
                      <TypingIndicator>
                        <LuminaWorkingIndicator>
                          <span className="shimmer-text">
                            {LUMINA_STATUS_MESSAGES[statusMessageIndex]}
                          </span>
                          <span className="pulse-dots">
                            <span className="pulse-dot" />
                            <span className="pulse-dot" />
                            <span className="pulse-dot" />
                          </span>
                        </LuminaWorkingIndicator>
                      </TypingIndicator>
                    </AIMessageWrapper>
                  </Box>
                )}

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
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(36, 36, 41, 0.92)'
                      : 'rgba(255, 255, 255, 0.92)',
                  color: 'text.primary',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                  border: '1px solid',
                  borderColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    bgcolor:
                      theme.palette.mode === 'dark' ? '#2e2e35' : '#f0f0f2',
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
                {tasks.length === 0 ? (
                  <MenuItem disabled sx={{ fontSize: '11px' }}>
                    No hay tareas activas
                  </MenuItem>
                ) : (
                  tasks.slice(0, 8).map((t) => (
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

          {/* Suggestions Bar */}
          <SuggestionsBar>
            <span className="sug-label">⚡ Sugerencias:</span>
            <button
              type="button"
              className="sug-pill"
              onClick={() => sendMessage('Revisar tono y claridad del texto')}
            >
              ✍️ Revisar tono
            </button>
            <button
              type="button"
              className="sug-pill"
              onClick={() =>
                sendMessage('Dividir en bloques de 25 min para hoy')
              }
            >
              ⏱️ Dividir en bloques
            </button>
            <button
              type="button"
              className="sug-pill"
              onClick={() => sendMessage('Resumir y extraer próximos pasos')}
            >
              📊 Resumir
            </button>
          </SuggestionsBar>

          <InputBox elevation={0} ref={inputBoxRef}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".pdf,.docx,.txt,.md,.csv,.json,.js,.jsx,.ts,.tsx,.py,.html,.css"
              style={{ display: 'none' }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                alignSelf: 'center',
              }}
            >
              <Tooltip title="Reference context (@)">
                <IconButton
                  size="small"
                  onClick={() => {
                    setContextAnchor(inputBoxRef.current);
                    setContextMenuLevel('main');
                  }}
                  sx={{
                    color: selectedContext ? '#2563eb' : 'text.secondary',
                    '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.08)' },
                  }}
                >
                  <AtIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Attach files (PDF, DOCX, TXT, MD, CSV, Code)">
                <span>
                  <IconButton
                    size="small"
                    onClick={handleOpenFile}
                    disabled={isProcessingFile}
                    sx={{
                      color:
                        attachedFiles.length > 0 ? '#2563eb' : 'text.secondary',
                      '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.08)' },
                    }}
                  >
                    {isProcessingFile ? (
                      <CircularProgress
                        size={18}
                        thickness={5}
                        sx={{ color: '#2563eb' }}
                      />
                    ) : (
                      <AttachFileIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            {/* Context & Attached Files Chips */}
            {(selectedContext || attachedFiles.length > 0) && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 0.8,
                  mr: 1,
                  maxWidth: { xs: '200px', sm: '320px', md: '450px' },
                }}
              >
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
                      maxWidth: '140px',
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(37, 99, 235, 0.15)'
                          : 'rgba(37, 99, 235, 0.05)',
                      borderColor: '#2563eb',
                    }}
                  />
                )}
              </Box>
            )}

            <StyledInput
              inputRef={inputRef}
              placeholder={
                attachedFiles.length > 0
                  ? 'Pregunta sobre los archivos adjuntos...'
                  : 'Pregúntale a Lumina lo que necesites o escribe / para comandos...'
              }
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value;
                setInputValue(val);
                if (val.endsWith('@')) {
                  setContextAnchor(inputBoxRef.current);
                  setContextMenuLevel('main');
                }
              }}
              onKeyDown={handleKeyDown}
              multiline
              maxRows={3}
              variant="outlined"
              fullWidth
              autoComplete="off"
            />

            {/* Mic and Send action buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Dictado por voz">
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    p: 0.75,
                    '&:hover': {
                      color: '#2563eb',
                      bgcolor: 'rgba(37, 99, 235, 0.08)',
                    },
                  }}
                >
                  <MicIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>

              <SendButton
                active={!!inputValue.trim() || attachedFiles.length > 0}
                onClick={() => sendMessage(inputValue)}
                disabled={
                  (!inputValue.trim() && attachedFiles.length === 0) ||
                  isTyping ||
                  isProcessingFile
                }
                size="small"
              >
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </SendButton>
            </Box>
          </InputBox>

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
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
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
              bgcolor: '#2563eb',
              color: '#ffffff',
              '&:hover': {
                bgcolor: '#1d4ed8',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              },
            }}
          >
            + Nuevo Chat
          </Button>

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
                                ? 'rgba(37, 99, 235, 0.16)'
                                : '#eff6ff'
                          : 'transparent',
                        border: isActive
                          ? (theme) =>
                              theme.palette.mode === 'dark'
                                ? '1px solid rgba(59, 130, 246, 0.3)'
                                : '1px solid #bfdbfe'
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
                          color: isActive ? '#2563eb' : 'text.secondary',
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
                              color: isActive ? '#2563eb' : 'text.primary',
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
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{ fontSize: '11px' }}
              >
                Chats creados:
              </Typography>
              <Typography
                variant="caption"
                color={
                  conversations.length >= 4 ? 'error.main' : 'text.primary'
                }
                fontWeight={700}
                sx={{ fontSize: '11px' }}
              >
                {conversations.length} / 4
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min((conversations.length / 4) * 100, 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.06)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: conversations.length >= 4 ? 'error.main' : '#2563eb',
                },
              }}
            />
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => setIsUpgradeModalOpen(true)}
              sx={{
                mt: 0.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '11.5px',
                py: 0.7,
                fontWeight: 700,
                borderColor: '#2563eb',
                color: '#2563eb',
                '&:hover': {
                  borderColor: '#1d4ed8',
                  bgcolor: 'rgba(37, 99, 235, 0.04)',
                },
              }}
            >
              Desbloquear chats ilimitados
            </Button>
          </Box>
        )}
      </HistorySidebar>

      <UpgradeModal
        open={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
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
            bgcolor: theme.palette.mode === 'dark' ? '#18181b' : '#ffffff',
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
