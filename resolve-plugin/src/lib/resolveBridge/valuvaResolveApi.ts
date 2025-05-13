import type { ValuvaResolveAPI } from './types/ValuvaResolveAPI';

// Helper function to safely get the API object from the window
function getWindowResolveApi(): ValuvaResolveAPI | null {
  if (typeof window !== 'undefined' && window.resolveAPI) {
    return window.resolveAPI;
  }
  // console.warn('Resolve API (window.resolveAPI) not available.'); // Can be noisy; enable if debugging
  return null;
}

// The Proxy handler
const handler: ProxyHandler<ValuvaResolveAPI> = {
  get(_target, propertyKey, _receiver) {
    // propertyKey will be the name of the method being called (e.g., 'isResolveConnected')
    
    return async (...args: any[]): Promise<any> => {
      const actualApi = getWindowResolveApi();
      // Cast propertyKey to keyof MyResolveBridgeAPI to ensure type safety if possible,
      // or handle as string if dynamic properties not strictly in MyResolveBridgeAPI might be called (less safe).
      const methodName = propertyKey as keyof ValuvaResolveAPI;

      if (actualApi && typeof actualApi[methodName] === 'function') {
        try {
          // Forward the call to the actual API method on window.resolveAPI
          return await Reflect.apply(actualApi[methodName] as Function, actualApi, args);
        } catch (error) {
          console.error(`Error in Resolve API bridge call '${String(methodName)}':`, error);
          // Re-throw the error so the calling Svelte component can handle it if needed
          throw error;
        }
      } else {
        const errorMessage = `Bridged API method '${String(methodName)}' is not available on window.resolveAPI or is not a function.`;
        console.error(errorMessage);
        // Consistently throw an error to indicate the method call failed
        throw new Error(errorMessage);
      }
    };
  }
};

// Create the proxy instance, ensuring it's typed as ValuvaResolveAPI
export const valuvaResolveApi: ValuvaResolveAPI = new Proxy({} as ValuvaResolveAPI, handler);


// If you have other parts of your app that expect a type named 'ResolveBridgeProvider'
// you can re-export it:
// export type { MyResolveBridgeAPI as ResolveBridgeProvider } from '../types/MyResolveBridgeAPI';
