// @ts-check // Enable stricter type checking for JSDoc

/** @type {ResolveEnums} ResolveEnums */
/** @type {Timeline} Timeline */
/** @type {TimelineItem} TimelineItem */
/** @type {MediaPoolItem} MediaPoolItem */
/** @type {MediaPool} MediaPool */
/** @type {Folder} Folder */
/** @type {Project} Project */
/** @type {Gallery} Gallery */
/** @type {Resolve} Resolve */
/** @type {GalleryStill} GalleryStill */
/** @type {GalleryStillAlbum} GalleryStillAlbum */
/** @type {FusionComp} FusionComp */
/** @type {RenderJob} RenderJob */
/** @type {RenderJobStatus} RenderJobStatus */
/** @type {RenderFormat} RenderFormat */
/** @type {RenderCodec} RenderCodec */
/** @type {RenderSettings} RenderSettings */

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// We only need contextBridge and ipcRenderer from 'electron'
// No direct 'electron/renderer' needed if only using these two.
const { contextBridge, ipcRenderer } = require('electron/renderer')

/**
 * @typedef {import('../resolve-plugin/src/lib/resolveApi/types/ValuvaResolveContract').ValuvaResolveContract} ValuvaResolveContract
 */

/**
 * This object defines the API that will be exposed to the renderer process.
 * Each function here invokes a corresponding handler in main.js via IPC.
 * This ensures that no Node.js or Electron main-process modules are directly
 * exposed to the renderer, which is a security best practice.
 *
 * The types should match ValuvaResolveAPI.d.ts
 * @type {ValuvaResolveContract}
 */
const resolveAPIHandler = {
  isResolveConnected:         () => ipcRenderer.invoke('resolve:isResolveConnected'),
  openPage:                   (pageName) => ipcRenderer.invoke('resolve:openPage', pageName),
  createProject:              (projectName) => ipcRenderer.invoke('resolve:createProject', projectName),
  saveProject:                () => ipcRenderer.invoke('resolve:saveProject'),
  openProject:                (projectName) => ipcRenderer.invoke('resolve:openProject', projectName),
  createBin:                  (binName) => ipcRenderer.invoke('resolve:createBin', binName),
  selectBin:                  (binName) => ipcRenderer.invoke('resolve:selectBin', binName),
  deleteBin:                  (binName) => ipcRenderer.invoke('resolve:deleteBin', binName),
  addClips:                   (filePathsArray) => ipcRenderer.invoke('resolve:addClips', filePathsArray),
  createTimeline:             (timelineName) => ipcRenderer.invoke('resolve:createTimeline', timelineName),
  selectTimeline:             (timelineName) => ipcRenderer.invoke('resolve:selectTimeline', timelineName),
  renderTimeline:             (timelineName, renderPresetName, targetDirPath, targetClipName) => 
                                ipcRenderer.invoke('resolve:renderTimeline', timelineName, renderPresetName, targetDirPath, targetClipName),
  getRenderPresets:           () => ipcRenderer.invoke('resolve:getRenderPresets'),

  // Add any new methods from ValuvaResolveAPI.d.ts here, following the pattern:
  // methodName: (...args) => ipcRenderer.invoke('resolve:methodName', ...args),
};

// Securely expose the API to the renderer process
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('resolveAPI', resolveAPIHandler);
    console.log("Valuva's resolveAPI bridge exposed to renderer.");
  } catch (error) {
    console.error('Failed to expose resolveAPI via contextBridge:', error);
  }
} else {
  console.warn(
    'Context Isolation is NOT enabled in preload.js. ' +
    'This is a security risk. The resolveAPI will not be exposed.'
  );
  // For older Electron versions or non-isolated contexts (NOT RECOMMENDED):
  // window.resolveAPI = resolveAPIHandler;
}
