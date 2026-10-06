import { API_BASE_URL } from '@/config/env.config';
import axios from 'axios';
import { format } from 'date-fns';
import type { AIMessage, AITaskContext } from './apiAI.types';
import type { ParsedLuminaAction } from '@/utils/lumina/lumina.types';
import {
  remainingFromHeaders,
  throwIfPlanLimit,
} from '@/api/Billing/planLimit';
import { billingService } from '@/services/billingService';

const getAIEndpoint = () => {
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev ? '' : API_BASE_URL;
  return `${baseUrl}/ai/chat`;
};

export const fetchEditResult = async (prompt: string): Promise<string> => {
  const endpoint = getAIEndpoint();
  const makeRequest = () =>
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        // One-shot rewrite: keep it out of the Lumina history.
        persist: false,
        system_context:
          'You are a helpful AI writing assistant integrated into the Focusly workspace editor. Help users refine, summarize, expand, translate, or rewrite their text. Always respond concisely and only with the requested output, no preambles or explanations.',
      }),
    });

  let response = await makeRequest();

  if (response.status === 401) {
    try {
      const { store } = await import('@/redux/store');
      const user = store.getState().auth.user;
      if (user) {
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { userId: user.id },
          { withCredentials: true },
        );
        response = await makeRequest();
      }
    } catch (refreshErr) {
      console.error(
        'Failed to refresh token during edit result fetch:',
        refreshErr,
      );
    }
  }

  await throwIfPlanLimit(response);
  if (!response.ok) {
    throw new Error(await response.text());
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body reader');
  }

  const decoder = new TextDecoder();
  let result = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  return result.trim();
};

export const generateWorkspaceTitle = async (
  plainTextContent: string,
): Promise<string> => {
  const raw = await fetchEditResult(
    `Generate a short, specific title (3-7 words, no quotes, no trailing punctuation) for a document that starts like this:\n\n${plainTextContent.slice(0, 1500)}`,
  );
  return raw.replace(/^["'“”]+|["'“”]+$/g, '').trim();
};

export const fetchChatStreamResponse = async (
  messages: AIMessage[],
  task: AITaskContext | null,
  abortSignal?: AbortSignal,
  model?: string,
  conversationId?: string,
  contextType?:
    | 'tasks'
    | 'workspaces'
    | 'task'
    | 'workspace'
    | 'calendar'
    | 'event'
    | null,
  contextId?: string | null,
): Promise<ReadableStream<Uint8Array>> => {
  const endpoint = getAIEndpoint();
  const makeRequest = () =>
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        messages,
        task,
        model,
        conversationId,
        contextType,
        contextId,
        clientTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      }),
      signal: abortSignal,
    });

  let response = await makeRequest();

  if (response.status === 401) {
    try {
      const { store } = await import('@/redux/store');
      const user = store.getState().auth.user;
      if (user) {
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { userId: user.id },
          { withCredentials: true },
        );
        response = await makeRequest();
      }
    } catch (refreshErr) {
      console.error(
        'Failed to refresh token during chat stream fetch:',
        refreshErr,
      );
    }
  }

  await throwIfPlanLimit(response);
  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  const remaining = remainingFromHeaders(response);
  if (remaining !== null) billingService.setRemaining(remaining);

  return response.body;
};

export interface AIConversation {
  id: string;
  title: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: ParsedLuminaAction[];
  createdAt: string;
}

export const getAIConversations = async (): Promise<AIConversation[]> => {
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev ? '' : API_BASE_URL;
  const response = await fetch(`${baseUrl}/ai/conversations`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const getAIConversationMessages = async (
  conversationId: string,
): Promise<ConversationMessage[]> => {
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev ? '' : API_BASE_URL;
  const response = await fetch(
    `${baseUrl}/ai/conversations/${conversationId}/messages`,
    {
      credentials: 'include',
    },
  );
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

export const deleteAIConversation = async (
  conversationId: string,
): Promise<{ status: string }> => {
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev ? '' : API_BASE_URL;
  const response = await fetch(
    `${baseUrl}/ai/conversations/${conversationId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  );
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};
