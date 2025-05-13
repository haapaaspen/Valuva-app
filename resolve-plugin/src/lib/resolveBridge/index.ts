
import { valuvaResolveApi } from './valuvaResolveApi';
import { ResolveApiController } from './resolveApiController.svelte';
import type { ValuvaResolveAPI } from './types/ValuvaResolveAPI';

export const resolveApiControllerInstance = new ResolveApiController(valuvaResolveApi);

export {
    ResolveApiController,
};

export type { ValuvaResolveAPI };

// For debugging:
// console.log(`[ResolveBridge index.ts] ResolveApiController instance created with provider:`, valuvaResolveApi);
