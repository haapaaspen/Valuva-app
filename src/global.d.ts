/// <reference types="svelte" />

interface Window {
  electronAPI?: {
    getResolveInfo: () => Promise<ResolveInfo>;
    onResolveConnectionStatus: (callback: (status: boolean) => void) => void;
  };
}

interface ResolveInfo {
  projectName?: string;
  timelineName?: string;
  frameRate?: string;
  error?: string;
}

interface GuidedPrompt {
  id: string;
  type: string;
  text: string;
  style: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: string[];
}

interface DesignArtifact {
  id: string;
  type: string;
  name: string;
  html: string;
  css: string;
  js?: string;
  preview?: string;
} 