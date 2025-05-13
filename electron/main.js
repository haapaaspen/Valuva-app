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

// @ts-check // Recommended for better JSDoc type checking

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import { createRequire } from 'module';

// Setup __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use createRequire for native modules that don't support ESM
const require = createRequire(import.meta.url);
const WorkflowIntegration = require('../WorkflowIntegration.node');

const PLUGIN_ID = 'com.valuva.ai-graphics';
let mainWindow;

/**
 * @type {Resolve | null}
 */
let resolveScriptingAPI = null; // Cached Resolve object
let projectManagerObj = null; // Cached ProjectManager object

// --- Initialization and Cleanup ---
async function initializeResolve() {
  if (resolveScriptingAPI) return true;

  try {
    console.log('Attempting to initialize WorkflowIntegration...');
    const initSuccess = await WorkflowIntegration.Initialize(PLUGIN_ID);
    if (!initSuccess) {
      console.error('WorkflowIntegration.Initialize reported failure.');
      return false;
    }

    console.log('Attempting to get Resolve object...');
    resolveScriptingAPI = await WorkflowIntegration.GetResolve();

    if (resolveScriptingAPI) {
      console.log('Successfully connected to Resolve and got scripting API object.');
      projectManagerObj = resolveScriptingAPI.GetProjectManager(); // Cache ProjectManager
      if (!projectManagerObj) {
        console.error('Failed to get ProjectManager object from Resolve.');
      }
      if (mainWindow) {
        mainWindow.webContents.send('resolve-connection-status', true);
      }
      return true;
    } else {
      console.error('Failed to get Resolve scripting API object from WorkflowIntegration.');
      return false;
    }
  } catch (error) {
    console.error('Error during Resolve initialization:', error);
    resolveScriptingAPI = null;
    projectManagerObj = null;
    if (mainWindow) {
      mainWindow.webContents.send('resolve-connection-status', false);
    }
    return false;
  }
}

function cleanupResolve() {
  console.log('Cleaning up Resolve interface...');
  try {
    if (WorkflowIntegration && typeof WorkflowIntegration.CleanUp === 'function') {
      WorkflowIntegration.CleanUp();
    }
  } catch (error) {
    console.error('Error during WorkflowIntegration.CleanUp:', error);
  }
  resolveScriptingAPI = null;
  projectManagerObj = null;
  if (mainWindow) {
    mainWindow.webContents.send('resolve-connection-status', false);
  }
}

async function getResolveApi() {
  if (!resolveScriptingAPI) {
    const connected = await initializeResolve();
    if (!connected) {
      throw new Error('DaVinci Resolve is not connected or scripting API is unavailable.');
    }
  }
  return resolveScriptingAPI;
}

async function getProjectManager() {
  if (!projectManagerObj) {
    await getResolveApi(); // This will initialize resolveScriptingAPI and projectManagerObj
    if (!projectManagerObj) {
        throw new Error('Failed to get ProjectManager object.');
    }
  }
  return projectManagerObj;
}

// --- API Implementations ---

// Map string page names to ResolveEnums.Pages (or string equivalents if enums aren't easily accessible)
const mapPageNameToEnumValue = (pageNameString) => {
  // This assumes ResolveEnums.Pages is part of the global scope or accessible.
  // If your .d.ts defines ResolveEnums in a way that it's globally available, this might work.
  // Otherwise, you need a more robust mapping.
  const ResolveEnums = globalThis.ResolveEnums; // Attempt to access if global
  if (ResolveEnums && ResolveEnums.Pages && ResolveEnums.Pages[pageNameString]) {
    return ResolveEnums.Pages[pageNameString];
  }
  // Fallback or more direct mapping if enums are tricky:
  const mapping = {
    "media": "media", "cut": "cut", "edit": "edit",
    "fusion": "fusion", "color": "color", "fairlight": "fairlight",
    "deliver": "deliver", "none": "none",
  };
  const lowerPageName = pageNameString?.toLowerCase();
  if (mapping[lowerPageName]) return mapping[lowerPageName];
  console.warn(`Unknown page name: '${pageNameString}', defaulting to 'edit'.`);
  return mapping["edit"]; // Default or throw error
};

ipcMain.handle('resolve:isResolveConnected', async () => {
  return !!resolveScriptingAPI || await initializeResolve();
});

ipcMain.handle('resolve:openPage', async (_event, pageName) => {
  const resolve = await getResolveApi();
  const enumPageName = mapPageNameToEnumValue(pageName);
  if (typeof resolve.OpenPage !== 'function') throw new Error("Resolve.OpenPage is not a function");
  return resolve.OpenPage(enumPageName); // This is synchronous in Resolve API, but ipcMain.handle makes it a Promise
});

ipcMain.handle('resolve:createProject', async (_event, projectName) => {
  const pm = await getProjectManager();
  if (!pm || typeof pm.CreateProject !== 'function') throw new Error("ProjectManager.CreateProject is not a function");
  const project = pm.CreateProject(projectName);
  return project ? { success: true, name: project.GetName() } : { success: false }; // Adjust return as needed
});

ipcMain.handle('resolve:saveProject', async () => {
  const pm = await getProjectManager();
  if (!pm || typeof pm.SaveProject !== 'function') throw new Error("ProjectManager.SaveProject is not a function");
  return pm.SaveProject();
});

ipcMain.handle('resolve:openProject', async (_event, projectName) => {
  const pm = await getProjectManager();
  if (!pm || typeof pm.LoadProject !== 'function') throw new Error("ProjectManager.LoadProject is not a function");
  const project = pm.LoadProject(projectName);
  return project ? { success: true, name: project.GetName() } : { success: false };
});

ipcMain.handle('resolve:createBin', async (_event, binName) => {
  const resolve = await getResolveApi();
  const project = resolve.GetProjectManager().GetCurrentProject();
  if (!project || typeof project.GetMediaPool !== 'function') throw new Error("Cannot get MediaPool");
  const mediaPool = project.GetMediaPool();
  const rootFolder = mediaPool.GetRootFolder();
  if (!rootFolder || typeof mediaPool.AddSubFolder !== 'function') throw new Error("Cannot add subfolder");
  const newBin = mediaPool.AddSubFolder(rootFolder, binName);
  return newBin ? { success: true, name: newBin.GetName() } : { success: false };
});

ipcMain.handle('resolve:selectBin', async (_event, binName) => {
  const resolve = await getResolveApi();
  const project = resolve.GetProjectManager().GetCurrentProject();
  const mediaPool = project.GetMediaPool();
  const rootFolder = mediaPool.GetRootFolder();
  const subFolders = rootFolder.GetSubFolderList();
  for (const folder of subFolders) {
      if (folder.GetName() === binName) {
          return mediaPool.SetCurrentFolder(folder);
      }
  }
  console.warn(`Bin named '${binName}' not found.`);
  return false;
});

ipcMain.handle('resolve:deleteBin', async (_event, binName) => {
  const resolve = await getResolveApi();
  const project = resolve.GetProjectManager().GetCurrentProject();
  const mediaPool = project.GetMediaPool();
  const rootFolder = mediaPool.GetRootFolder();
  const subFolders = rootFolder.GetSubFolderList();
  for (const folder of subFolders) {
    if (folder.GetName() === binName) {
      return mediaPool.DeleteFolders([folder]);
    }
  }
  console.warn(`Bin named '${binName}' for deletion not found.`);
  return false;
});

ipcMain.handle('resolve:addClips', async (_event, filePathsArray) => {
  const resolve = await getResolveApi();
  if (typeof resolve.GetMediaStorage !== 'function') throw new Error("Resolve.GetMediaStorage is not a function");
  const mediaStorage = resolve.GetMediaStorage();
  if (!mediaStorage || typeof mediaStorage.AddItemListToMediaPool !== 'function') {
    throw new Error("MediaStorage.AddItemListToMediaPool is not available");
  }
  const addedItems = mediaStorage.AddItemListToMediaPool(filePathsArray); // This is MediaPoolItem[]
  return addedItems.map(item => ({ name: item.GetName(), mediaId: item.GetMediaId() })); // Or more detailed info
});

ipcMain.handle('resolve:createTimeline', async (_event, timelineName) => {
  const resolve = await getResolveApi();
  const project = resolve.GetProjectManager().GetCurrentProject();
  const mediaPool = project.GetMediaPool();
  if (!mediaPool || typeof mediaPool.CreateEmptyTimeline !== 'function') throw new Error("MediaPool.CreateEmptyTimeline is not available");
  const timeline = mediaPool.CreateEmptyTimeline(timelineName);
  return timeline ? { success: true, name: timeline.GetName() } : { success: false };
});

ipcMain.handle('resolve:selectTimeline', async (_event, timelineName) => {
  const resolve = await getResolveApi();
  const project = resolve.GetProjectManager().GetCurrentProject();
  const timelineCount = project.GetTimelineCount();
  for (let i = 1; i <= timelineCount; i++) {
      const timeline = project.GetTimelineByIndex(i);
      if (timeline && timeline.GetName() === timelineName) {
          return project.SetCurrentTimeline(timeline);
      }
  }
  console.warn(`Timeline named '${timelineName}' not found.`);
  return false;
});

ipcMain.handle('resolve:renderTimeline', async (_event, timelineName, renderPresetName, targetDirPath, targetClipName) => {
  const resolve = await getResolveApi();
  const project = resolve.GetProjectManager().GetCurrentProject();
  
  let timelineToRender = project.GetCurrentTimeline();
  if (!timelineToRender || timelineToRender.GetName() !== timelineName) {
    let foundTimeline = null;
    const timelineCount = project.GetTimelineCount();
    for (let i = 1; i <= timelineCount; i++) {
        const tl = project.GetTimelineByIndex(i);
        if (tl && tl.GetName() === timelineName) {
            foundTimeline = tl;
            break;
        }
    }
    if (!foundTimeline) throw new Error(`Timeline '${timelineName}' not found for rendering.`);
    project.SetCurrentTimeline(foundTimeline); // Set it as current before proceeding
    timelineToRender = foundTimeline;
  }
  // Now timelineToRender is the correct one and is set as current.

  if (typeof project.LoadRenderPreset !== 'function' || 
      typeof project.SetRenderSettings !== 'function' ||
      typeof project.AddRenderJob !== 'function' ||
      typeof project.StartRendering !== 'function') {
        throw new Error("Required render methods not available on Project object.");
  }

  if (!project.LoadRenderPreset(renderPresetName)) {
    throw new Error(`Failed to load render preset: ${renderPresetName}`);
  }
  if (!project.SetRenderSettings({ "TargetDir": targetDirPath, "CustomName": targetClipName })) {
    throw new Error("Failed to set render settings.");
  }
  const jobId = project.AddRenderJob();
  if (!jobId) {
    throw new Error("Failed to add render job.");
  }
  // StartRendering can also take an array of job IDs.
  // The boolean true makes it interactive mode (shows errors in Resolve UI)
  const success = project.StartRendering([jobId], true); 
  return { success, jobId };
});

ipcMain.handle('resolve:getRenderPresets', async () => {
  const resolve = await getResolveApi();
  const project = resolve.GetProjectManager().GetCurrentProject();
  if (!project || typeof project.GetRenderPresetList !== 'function') throw new Error("Project.GetRenderPresetList is not available");
  return project.GetRenderPresetList(); // Returns string[]
});


// --- Electron App Lifecycle ---
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000, // Adjusted for potentially more content
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Correct path to preload
      contextIsolation: true, // Highly recommended
      nodeIntegration: false, // Recommended for security
      sandbox: true, // Recommended if your renderer doesn't need node APIs directly
    }
  });

  // In production, load from build output
  // For dev, you might load from a dev server if using one with SvelteKit
  const indexPath = path.join(__dirname, '../build/index.html'); // Adjusted path
  if (fs.existsSync(indexPath)) { // Check if the build exists
      mainWindow.loadFile(indexPath);
  } else {
      console.warn(`SvelteKit build not found at ${indexPath}. Displaying placeholder or error.`);
      // Optionally load a placeholder HTML or close with error
      // mainWindow.loadURL('data:text/html;charset=utf-8,<h1>App build not found</h1>');
  }
  

  // mainWindow.webContents.openDevTools(); // Uncomment to open DevTools

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  // Initialize Resolve connection when the app is ready, before creating the window
  // This way, the API is more likely to be available when the renderer loads.
  await initializeResolve(); 
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

   // ---- Add this section for macOS Dock icon ----
   if (process.platform === 'darwin') { // Check if on macOS
    const dockIconPath = path.join(__dirname, '../resolve-plugin/static/favicon.png'); // Or 'icon.icns'
    if (fs.existsSync(dockIconPath)) {
        try {
            app.dock.setIcon(dockIconPath);
        } catch (error) {
            console.error('Failed to set Dock icon:', error);
        }
    } else {
        console.warn(`Dock icon not found at: ${dockIconPath}`);
    }
  }
});

app.on('window-all-closed', () => {
  cleanupResolve(); // Ensure cleanup happens
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Optional: Handle 'before-quit' for explicit cleanup
app.on('before-quit', () => {
  console.log('App before-quit, ensuring cleanup.');
  cleanupResolve();
});

// Make sure your main.js path for build output is correct
// Check the path in your package.json scripts for building the electron app