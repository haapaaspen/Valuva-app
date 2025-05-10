const { contextBridge, ipcRenderer } = require('electron');

// Expose API to renderer
contextBridge.exposeInMainWorld('valuvaAPI', {
  // File operations
  selectHtmlFile: () => ipcRenderer.invoke('select-html-file'),
  loadSpecificFile: (filePath) => ipcRenderer.invoke('load-specific-file', filePath),
  extractParameters: (htmlContent) => ipcRenderer.invoke('extract-parameters', htmlContent),
  updateHtml: (data) => ipcRenderer.invoke('update-html', data),
  
  // Resolve operations
  getResolveInfo: () => ipcRenderer.invoke('get-resolve-info'),
  exportToTimeline: (htmlContent) => ipcRenderer.invoke('export-to-timeline', htmlContent)
});