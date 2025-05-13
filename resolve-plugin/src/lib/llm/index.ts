
import type { LlmProvider } from './providers/llmProvider';
import { MockLlmProvider } from './providers/mockLlmProvider';
import { VibeLlmProvider } from './providers/vibeLlmProvider';
import { LlmController } from './LlmController.svelte';

const activeProvider: LlmProvider = new MockLlmProvider();

export const llmController = new LlmController(activeProvider);

console.log(`[LLM index.svelte.ts] LlmController instance created with ${activeProvider.constructor.name}.`);
