import { writable } from 'svelte/store';

// Global application state
export const appReady = writable(false);
export const resolveConnected = writable(false);
export const resolveInfo = writable<ResolveInfo | null>(null);

// UI state
export const activePanelTab = writable('chat'); // 'chat' | 'history'
export const showAnnotationOverlay = writable(false);

// Theme state
export const darkMode = writable(true); 