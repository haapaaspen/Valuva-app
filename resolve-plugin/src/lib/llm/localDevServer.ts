// src/lib/llm/localDevServer.ts
// IMPORTANT: This file is for local development simulation only.
// It will NOT be part of your final production plugin.

import type { LlmResponse } from './providers/llmProvider';

console.log('[LocalDevServer] Module loaded (simulated server for development).');

interface DevServerOptions {
  simulateDelayMs?: number;
  forceError?: boolean;
}

/**
 * Simulates a server endpoint that would handle LLM queries.
 * In a real BFF, this would be an HTTP POST endpoint (e.g., /api/llm/query).
 * @param prompt The prompt received from the client (NetworkLlmProvider).
 * @param options Options to control the simulated behavior.
 * @returns A Promise that resolves to an LlmResponse.
 */
export async function handleQuery(
  prompt: string,
  options: DevServerOptions = {}
): Promise<LlmResponse> {
  const { simulateDelayMs = 600, forceError = false } = options;

  console.log(`[LocalDevServer] Received query for prompt: "${prompt}"`);
  console.log(`[LocalDevServer] Simulation options: delay=${simulateDelayMs}ms, forceError=${forceError}`);

  await new Promise(resolve => setTimeout(resolve, simulateDelayMs));

  if (forceError || prompt.toLowerCase().includes('server error')) {
    console.warn('[LocalDevServer] Simulating a server-side error.');
    return {
      success: false,
      error: 'Simulated error from LocalDevServer: The server is feeling overwhelmed.',
    };
  }

  if (prompt.toLowerCase().includes('no data')) {
    console.log('[LocalDevServer] Simulating a successful response with no data.');
    return {
      success: true,
      // data: undefined, // data is optional, so not including it is fine
    };
  }

  const serverResponses = [
    `LocalDevServer processed: "${prompt}". This is a test.`,
    `Greetings from your friendly neighborhood LocalDevServer! You asked about: "${prompt}".`,
    `"${prompt}"? LocalDevServer has an opinion: it's mock-tacular!`,
  ];
  const randomResponse = serverResponses[Math.floor(Math.random() * serverResponses.length)];

  console.log(`[LocalDevServer] Sending response: "${randomResponse}"`);
  return {
    success: true,
    data: randomResponse,
  };
}

/**
 * Simulates another server endpoint, e.g., for getting server status or configuration.
 * @returns A Promise resolving to some status information.
 */
export async function getStatus(): Promise<{ status: string; version: string; timestamp: string }> {
  console.log('[LocalDevServer] Received request for status.');
  await new Promise(resolve => setTimeout(resolve, 100)); // Quick response
  return {
    status: 'OK',
    version: '0.1.0-dev',
    timestamp: new Date().toISOString(),
  };
}

// You could add more functions here to simulate other API endpoints your BFF might have.
