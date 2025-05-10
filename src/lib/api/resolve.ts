import { updateResolveConnection, updateResolveInfo } from '../stores/resolveStore';


// Type definitions for the window API
declare global {
  interface Window {
    valuvaAPI: {
      // Resolve operations
      getResolveInfo: () => Promise<any>;
      onResolveConnection: (callback: (connected: boolean) => void) => void;
      exportToTimeline: (htmlContent: string) => Promise<any>;
      keepAlive: () => void;
      
      // File operations
      selectHtmlFile: () => Promise<any>;
      loadSpecificFile: (filePath: string) => Promise<any>;
      extractParameters: (htmlContent: string) => Promise<any>;
      updateHtml: (data: any) => Promise<any>;
    };
  }
}

// Initialize the connection to Resolve
export function initResolveConnection(): void {
  // Check if the API is available
  if (!window.valuvaAPI) {
    console.error('Resolve API not available');
    updateResolveConnection(false);
    return;
  }

  // Listen for connection status updates from main process
  window.valuvaAPI.onResolveConnection((connected: boolean) => {
    updateResolveConnection(connected);
  });

  // Get the Resolve information
  getResolveInfo();
  
  // Set up keep-alive ping
  setInterval(() => {
    if (window.valuvaAPI) window.valuvaAPI.keepAlive();
  }, 1000);
}

// Get Resolve information
export async function getResolveInfo(): Promise<void> {
  if (!window.valuvaAPI) {
    console.error('Resolve API not available');
    updateResolveConnection(false);
    return;
  }

  try {
    const info = await window.valuvaAPI.getResolveInfo();
    updateResolveInfo(info);
  } catch (error) {
    console.error('Error getting Resolve info:', error);
    updateResolveConnection(false);
  }
}

// Export HTML content to DaVinci Resolve timeline
export async function exportToTimeline(htmlContent: string): Promise<any> {
  if (!window.valuvaAPI) {
    console.error('Resolve API not available');
    return { success: false, error: 'Resolve API not available' };
  }

  try {
    return await window.valuvaAPI.exportToTimeline(htmlContent);
  } catch (error) {
    console.error('Error exporting to timeline:', error);
    return { success: false, error: String(error) };
  }
}

// File Operations

// Select an HTML file using a dialog
export async function selectHtmlFile(): Promise<any> {
  if (!window.valuvaAPI) {
    console.error('Resolve API not available');
    return { error: 'Resolve API not available' };
  }

  try {
    return await window.valuvaAPI.selectHtmlFile();
  } catch (error) {
    console.error('Error selecting HTML file:', error);
    return { error: String(error) };
  }
}

// Load a specific HTML file by path
export async function loadSpecificFile(filePath: string): Promise<any> {
  if (!window.valuvaAPI) {
    console.error('Resolve API not available');
    return { error: 'Resolve API not available' };
  }

  try {
    return await window.valuvaAPI.loadSpecificFile(filePath);
  } catch (error) {
    console.error('Error loading specific file:', error);
    return { error: String(error) };
  }
}

// Extract parameters from HTML content
export async function extractParameters(htmlContent: string): Promise<any> {
  if (!window.valuvaAPI) {
    console.error('Resolve API not available');
    return { error: 'Resolve API not available' };
  }

  try {
    return await window.valuvaAPI.extractParameters(htmlContent);
  } catch (error) {
    console.error('Error extracting parameters:', error);
    return { error: String(error) };
  }
}

// Update HTML content with new parameters
export async function updateHtml(data: { htmlContent: string; parameters: any }): Promise<any> {
  if (!window.valuvaAPI) {
    console.error('Resolve API not available');
    return { error: 'Resolve API not available' };
  }

  try {
    return await window.valuvaAPI.updateHtml(data);
  } catch (error) {
    console.error('Error updating HTML:', error);
    return { error: String(error) };
  }
} 