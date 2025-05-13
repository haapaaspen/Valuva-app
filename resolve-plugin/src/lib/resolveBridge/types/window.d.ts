
import type { ValuvaResolveAPI } from './ValuvaResolveAPI';

declare global {
  interface Window {
    // The 'Resolve' type, which is the type of window.resolveAPI,
    // should be globally available if your main 'ResolveAPI.d.ts'
    // (likely located at resolve-plugin/src/lib/resolveApi/types/reference/ResolveAPI.d.ts)
    // is correctly included in your tsconfig.json.
    resolveAPI?: ValuvaResolveAPI;

    
  }
}

// This export {} is important to make this file a module.
// Augmenting global types like 'Window' is only allowed from modules.
export {};
