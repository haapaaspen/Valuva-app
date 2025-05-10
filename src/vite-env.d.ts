/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
}

interface Window {
  valuvaAPI: {
    getResolveInfo: () => Promise<any>;
    onResolveConnection: (callback: (connected: boolean) => void) => void;
    keepAlive: () => void;
    // Add other API methods as needed
    selectHtmlFile: () => Promise<any>;
    loadSpecificFile: (filePath: string) => Promise<any>;
    extractParameters: (htmlContent: string) => Promise<any>;
    updateHtml: (data: any) => Promise<any>;
    exportToTimeline: (htmlContent: string) => Promise<any>;
  };
} 