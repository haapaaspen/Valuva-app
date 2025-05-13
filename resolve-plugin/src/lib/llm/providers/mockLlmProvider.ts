// src/lib/llm/providers/mockLlmProvider.ts

import type { LlmProvider, LlmResponse } from './llmProvider';

/**
 * A mock implementation of the ILlmProvider interface.
 * This class simulates LLM responses without making any actual network calls.
 * It's useful for development, testing, and offline work.
 */
export class MockLlmProvider implements LlmProvider {
  private simulateDelayMs: number;

  /**
   * Constructs a new MockLlmProvider.
   * @param simulateDelayMs The delay in milliseconds to simulate network latency. Defaults to 500ms.
   */
  constructor(simulateDelayMs = 500) {
    this.simulateDelayMs = simulateDelayMs;
    console.log('[MockLlmProvider] Initialized.');
  }

  /**
   * Simulates sending a query to an LLM.
   * @param prompt The text prompt.
   * @param options Optional parameters, including an AbortSignal.
   * @returns A Promise that resolves to an LlmResponse object.
   */
  async query(prompt: string, options?: { signal?: AbortSignal }): Promise<LlmResponse> {
    console.log(`[MockLlmProvider] Received prompt: "${prompt}"`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.simulateDelayMs));

    // Check if the request was aborted during the simulated delay
    if (options?.signal?.aborted) {
      console.log('[MockLlmProvider] Request aborted by client.');
      return {
        success: false,
        error: 'Mock request aborted by client.',
      };
    }

    // Simple logic to simulate different responses based on the prompt
    if (prompt.toLowerCase().includes('error')) {
      console.warn('[MockLlmProvider] Simulating an error response.');
      return {
        success: false,
        error: 'Simulated error from MockLlmProvider: The LLM is on a coffee break.',
      };
    }

    if (prompt.toLowerCase().includes('empty')) {
      console.log('[MockLlmProvider] Simulating an empty but successful response.');
      return {
        success: true,
        data: '',
      };
    }

    // Default successful response
    const mockResponses = [
      `Mocked AI thoughts on: "${prompt}". Fascinating, indeed!`,
      `This is a purely fabricated answer to "${prompt}". Enjoy!`,
      `If I were a real LLM, I'd say something profound about "${prompt}".`,
    ];
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    console.log(`[MockLlmProvider] Sending mock response: "${randomResponse}"`);
    return {
      success: true,
      data: randomResponse,
    };
  }

}