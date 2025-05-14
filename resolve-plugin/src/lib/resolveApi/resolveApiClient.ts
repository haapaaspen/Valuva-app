import type { ValuvaResolveContract } from './types/ValuvaResolveContract';

// Helper function to safely get the API object from the window
function getWindowResolveApi(): ValuvaResolveContract | null {
  // Ensure window.resolveAPI is accessed safely, especially in non-browser environments (SSR)
  if (typeof window !== 'undefined' && (window as any).resolveAPI) {
    return (window as any).resolveAPI as ValuvaResolveContract;
  }
  return null;
}

// The Proxy handler
const handler: ProxyHandler<ValuvaResolveContract> = {
  get(_target, propertyKey, _receiver) {
    return async (...args: any[]): Promise<any> => {
      const actualApi = getWindowResolveApi();
      const methodName = propertyKey as keyof ValuvaResolveContract;

      if (actualApi && typeof actualApi[methodName] === 'function') {
        try {
          return await Reflect.apply(actualApi[methodName] as Function, actualApi, args);
        } catch (error) {
          console.error(`Error in Resolve API bridge call '${String(methodName)}':`, error);
          throw error;
        }
      } else {
        // During SSR or if the preload script hasn't exposed the API yet
        if (typeof window === 'undefined') {
          console.warn(`Resolve API method '${String(methodName)}' called in a non-browser environment. This will fail.`);
        } else {
          console.error(`Bridged API method '${String(methodName)}' is not available on window.resolveAPI or is not a function.`);
        }
        // Consistently throw an error to indicate the method call failed
        throw new Error(`Bridged API method '${String(methodName)}' is not available or not a function.`);
      }
    };
  }
};

// Create the proxy instance, typed as ValuvaResolveContract
export const resolveApi: ValuvaResolveContract = new Proxy({} as ValuvaResolveContract, handler);


// If you have other parts of your app that expect a type named 'ResolveBridgeProvider'
// you can re-export it:
// export type { MyResolveBridgeAPI as ResolveBridgeProvider } from '../types/MyResolveBridgeAPI';
