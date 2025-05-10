import { writable } from 'svelte/store';

// Define the Resolve info type
export interface ResolveInfo {
  productName: string;
  versionString: string;
  success: boolean;
}

// Create the stores
export const resolveConnected = writable<boolean>(false);
export const resolveInfo = writable<ResolveInfo | null>(null);

// Update the stores with the Resolve connection status
export function updateResolveConnection(connected: boolean): void {
  resolveConnected.set(connected);
}

// Update the Resolve info
export function updateResolveInfo(info: ResolveInfo): void {
  resolveInfo.set(info);
  // If we got valid info, we're connected
  if (info && info.success) {
    resolveConnected.set(true);
  } else {
    resolveConnected.set(false);
  }
} 