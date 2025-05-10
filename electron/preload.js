const { contextBridge, ipcRenderer } = require('electron');
const WorkflowIntegration = require('../WorkflowIntegration.node');

const PLUGIN_ID = 'com.valuva.ai-graphics';

// Exposing Resolve interface related functions to the renderer
window.GetResolveInterface = function GetResolveInterface() {
    // Initialize resolve interface
    const isResolveInit = WorkflowIntegration.Initialize(PLUGIN_ID);
    if (!isResolveInit) {
        console.error('Error: Failed to initialize Resolve interface!');
        return null;
    }

    // Get resolve interface object
    resolveInterfacObj = WorkflowIntegration.GetResolve();
    if (!resolveInterfacObj) {
        console.error('Error: Failed to get Resolve interface object!');
        return null;
    }

    return resolveInterfacObj;
};

window.CleanupResolveInterface = function CleanupResolveInterface() {
    const isSuccess = WorkflowIntegration.CleanUp();
    if (!isSuccess) {
        console.log('Error: Failed to cleanup Resolve interface!');
    }
};

// Expose API to renderer
window.valuvaAPI = {
  // File operations
  selectHtmlFile: () => ipcRenderer.invoke('select-html-file'),
  loadSpecificFile: (filePath) => ipcRenderer.invoke('load-specific-file', filePath),
  extractParameters: (htmlContent) => ipcRenderer.invoke('extract-parameters', htmlContent),
  updateHtml: (data) => ipcRenderer.invoke('update-html', data),
  
  // Resolve operations
  getResolveInfo: () => ipcRenderer.invoke('get-resolve-info'),
  exportToTimeline: (htmlContent) => ipcRenderer.invoke('export-to-timeline', htmlContent),
  
  // Connection status
  onResolveConnection: (callback) => 
    ipcRenderer.on('resolve-connection', (_, connected) => callback(connected)),
  
  // Keep alive ping
  keepAlive: () => ipcRenderer.invoke('keep-alive')
}; 