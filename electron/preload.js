// Keeping this file as CommonJS since it's referred to in main.js and Electron preload scripts
// typically use CommonJS
const { contextBridge, ipcRenderer } = require('electron');

// Expose API to renderer
contextBridge.exposeInMainWorld('valuvaAPI', {
  // Resolve operations
  getResolveInfo: () => ipcRenderer.invoke('get-resolve-info'),
  onResolveConnection: (callback) => {
    ipcRenderer.on('resolve-connection-status', (_, connected) => {
      callback(connected);
    });
  },
  exportToTimeline: (htmlContent) => ipcRenderer.invoke('export-to-timeline', htmlContent),
  keepAlive: () => ipcRenderer.invoke('keep-alive'),
  
  // File operations
  selectHtmlFile: () => ipcRenderer.invoke('select-html-file'),
  loadSpecificFile: (filePath) => ipcRenderer.invoke('load-specific-file', filePath),
  extractParameters: (htmlContent) => ipcRenderer.invoke('extract-parameters', htmlContent),
  updateHtml: (data) => ipcRenderer.invoke('update-html', data)
});