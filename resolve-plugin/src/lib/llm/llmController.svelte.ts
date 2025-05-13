// src/lib/llm/LlmController.svelte.ts

import type { LlmProvider, LlmResponse } from './providers/llmProvider';

/**
 * Manages LLM interactions and related reactive state for the UI.
 * Uses Svelte 5 runes ($state) for reactivity, hence the .svelte.ts extension.
 */
export class LlmController {
  // The active LLM provider (could be mock, network, etc.)
  private provider: LlmProvider;

  // --- Reactive State using Svelte 5 Runes ---
  // These properties will automatically trigger UI updates when changed.

  /** The latest response data from the LLM. */
  currentResponse = $state<string | undefined>(undefined);

  /** The full LlmResponse object, including success status and potential error. */
  lastResponseObject = $state<LlmResponse | null>(null);

  /** True if an LLM query is currently in progress. */
  isLoading = $state<boolean>(false);

  /** Error message if the last query failed, otherwise null. */
  errorMessage = $state<string | undefined>(undefined);

  /**
   * A simple history of prompts and AI responses.
   * You could expand this with timestamps, user/ai roles, etc.
   */
  chatHistory = $state<{ type: 'user' | 'ai'; content: string }[]>([]);


  // Abort controller for cancelling in-flight requests
  private currentAbortController: AbortController | null = null;

  /**
   * Constructs a new LlmController.
   * @param provider An instance of a class that implements LlmProvider.
   */
  constructor(provider: LlmProvider) {
    this.provider = provider;
    console.log('[LlmController] Initialized with provider:', provider.constructor.name);
  }

  /**
   * Submits a prompt to the LLM via the configured provider.
   * Manages loading states, response handling, and error messages.
   * @param promptText The text prompt to send.
   */
  async submitPrompt(promptText: string): Promise<void> {
    if (!promptText.trim()) {
      this.errorMessage = 'Prompt cannot be empty.';
      return;
    }

    // Cancel any previous request that might still be running
    this.cancelCurrentRequest();
    this.currentAbortController = new AbortController();

    this.isLoading = true;
    this.errorMessage = undefined;
    this.currentResponse = undefined; // Clear previous successful response text
    this.lastResponseObject = null;

    // Add user's prompt to chat history
    this.chatHistory = [...this.chatHistory, { type: 'user', content: promptText }];

    try {
      console.log(`[LlmController] Sending prompt: "${promptText}" using ${this.provider.constructor.name}`);
      const result = await this.provider.query(promptText, { signal: this.currentAbortController.signal });
      this.lastResponseObject = result;

      if (result.success) {
        this.currentResponse = result.data;
        if (result.data) {
            // Add AI's response to chat history
            this.chatHistory = [...this.chatHistory, { type: 'ai', content: result.data }];
        } else if (result.data === '') { // Handle explicitly empty successful response
             this.chatHistory = [...this.chatHistory, { type: 'ai', content: "Empty response." }];
        }
      } else {
        this.errorMessage = result.error || 'An unknown error occurred.';
         this.chatHistory = [...this.chatHistory, { type: 'ai', content: `Error: ${this.errorMessage}` }];
      }
    } catch (error: any) {
      // This catch is for unexpected errors from the provider itself or if the signal aborts aggressively.
      console.error('[LlmController] Unexpected error during submitPrompt:', error);
      if (error.name === 'AbortError') {
        this.errorMessage = 'Request was cancelled.';
        this.chatHistory = [...this.chatHistory, { type: 'ai', content: 'Request cancelled.' }];
      } else {
        this.errorMessage = error.message || 'An unexpected error occurred.';
        this.chatHistory = [...this.chatHistory, { type: 'ai', content: `Unexpected error: ${this.errorMessage}` }];
      }
      this.lastResponseObject = { success: false, error: this.errorMessage };
    } finally {
      this.isLoading = false;
      this.currentAbortController = null; // Clear the controller once done
    }
  }

  /**
   * Cancels the currently active LLM query, if any.
   */
  cancelCurrentRequest(): void {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      console.log('[LlmController] Current request cancelled.');
      // isLoading and errorMessage will be handled in the submitPrompt's finally/catch block
    }
  }

  /**
   * Clears the chat history and current response/error states.
   */
  clearChat(): void {
    this.currentResponse = undefined;
    this.errorMessage = undefined;
    this.isLoading = false;
    this.chatHistory = [];
    this.lastResponseObject = null;
    this.cancelCurrentRequest(); // Also cancel if a request is in flight
    console.log('[LlmController] Chat cleared.');
  }

  // You could add more methods here, e.g.,
  // - To get configuration from the provider
  // - To manage different "chat sessions" if needed
  // - To retry the last prompt
}