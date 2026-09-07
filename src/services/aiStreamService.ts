export type AIStreamEventType = 'chunk' | 'done' | 'error';

export interface StreamableMessage {
  id: string;
  sender?: string;
  text: string;
  html?: string;
  [key: string]: unknown;
}

export interface AIStreamEvent {
  type: AIStreamEventType;
  chunk?: string;
  accumulatedText: string;
  conversationId: string;
  aiMsgId: string;
  activeMessages: StreamableMessage[];
  error?: Error | string;
}

export type AIStreamListener = (event: AIStreamEvent) => void;

export interface AIStreamState {
  isGenerating: boolean;
  conversationId: string | null;
  aiMsgId: string | null;
  accumulatedText: string;
  activeMessages: StreamableMessage[];
  status: 'idle' | 'streaming' | 'completed' | 'error';
  error: string | null;
}

class AIStreamService {
  private state: AIStreamState = {
    isGenerating: false,
    conversationId: null,
    aiMsgId: null,
    accumulatedText: '',
    activeMessages: [],
    status: 'idle',
    error: null,
  };

  private listeners = new Set<AIStreamListener>();
  private activeReader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  getState(): Readonly<AIStreamState> {
    return { ...this.state };
  }

  isGenerating(): boolean {
    return this.state.isGenerating;
  }

  isStreamingFor(conversationId: string | null): boolean {
    return (
      this.state.isGenerating &&
      (conversationId === null || this.state.conversationId === conversationId)
    );
  }

  getActiveMessages(): StreamableMessage[] {
    return this.state.activeMessages;
  }

  subscribe(listener: AIStreamListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(event: AIStreamEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('[AIStreamService] Listener error:', err);
      }
    });
  }

  async startStream(
    conversationId: string,
    aiMsgId: string,
    streamPromise: Promise<ReadableStream<Uint8Array>>,
    initialMessages: StreamableMessage[] = [],
  ): Promise<string> {
    this.state = {
      isGenerating: true,
      conversationId,
      aiMsgId,
      accumulatedText: '',
      activeMessages: [...initialMessages],
      status: 'streaming',
      error: null,
    };

    try {
      const stream = await streamPromise;
      const reader = stream.getReader();
      this.activeReader = reader;
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        this.state.accumulatedText += chunk;

        // Keep activeMessages up-to-date
        this.state.activeMessages = this.state.activeMessages.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                text: this.state.accumulatedText,
              }
            : msg,
        );

        this.notify({
          type: 'chunk',
          chunk,
          accumulatedText: this.state.accumulatedText,
          conversationId,
          aiMsgId,
          activeMessages: this.state.activeMessages,
        });
      }

      this.state.isGenerating = false;
      this.state.status = 'completed';
      this.notify({
        type: 'done',
        accumulatedText: this.state.accumulatedText,
        conversationId,
        aiMsgId,
        activeMessages: this.state.activeMessages,
      });

      return this.state.accumulatedText;
    } catch (err: unknown) {
      this.state.isGenerating = false;
      this.state.status = 'error';
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Error streaming AI response';
      this.state.error = errorMessage;
      this.notify({
        type: 'error',
        error: this.state.error,
        accumulatedText: this.state.accumulatedText,
        conversationId,
        aiMsgId,
        activeMessages: this.state.activeMessages,
      });
      throw err;
    } finally {
      this.activeReader = null;
    }
  }

  reset() {
    this.state = {
      isGenerating: false,
      conversationId: null,
      aiMsgId: null,
      accumulatedText: '',
      activeMessages: [],
      status: 'idle',
      error: null,
    };
  }
}

export const aiStreamService = new AIStreamService();
