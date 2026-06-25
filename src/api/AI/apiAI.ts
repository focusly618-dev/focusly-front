import { API_BASE_URL } from '@/config/env.config';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AITaskContext {
  title: string;
  description: string;
  status: string;
  priority_level: number;
  estimate_timer: number;
  real_timer?: number;
  deadline: string;
  links?: { title: string; url: string }[];
}

export const fetchEditResult = async (prompt: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
    }),
  });

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

export const fetchChatStreamResponse = async (
  messages: AIMessage[],
  task: AITaskContext | null,
  abortSignal?: AbortSignal,
  model?: string,
): Promise<ReadableStream<Uint8Array>> => {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      messages,
      task,
      model,
    }),
    signal: abortSignal,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  return response.body;
};
