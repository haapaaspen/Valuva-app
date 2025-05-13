
import type { ResolveApiProvider } from './providers/resolveApiProvider';
import { ToolboxResolveApiProvider } from './providers/toolbox/toolboxResolveApiProvider';
import { ResolveApiController } from './resolveApiController.svelte';


const activeProvider: ResolveApiProvider = new ToolboxResolveApiProvider();

export const resolveApiController = new ResolveApiController(activeProvider);

//console.log(`[LLM index.svelte.ts] LlmController instance created with ${activeProvider.constructor.name}.`);
