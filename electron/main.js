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
let resolveObj = null;
let isResolveConnected = false;

// Initialize Resolve interface
async function initResolveInterface() {
  try {
    const isSuccess = await WorkflowIntegration.Initialize(PLUGIN_ID);
    if (!isSuccess) {
      console.log('Error: Failed to initialize Resolve interface!');
      return null;
    }
    
    resolveObj = await WorkflowIntegration.GetResolve();
    if (!resolveObj) {
      console.log('Error: Failed to get Resolve object!');
      return null;
    }
    
    isResolveConnected = true;
    if (mainWindow) {
      mainWindow.webContents.send('resolve-connection-status', true);
    }
    
    return resolveObj;
  } catch (error) {
    console.error('Failed to initialize Resolve:', error);
    isResolveConnected = false;
    if (mainWindow) {
      mainWindow.webContents.send('resolve-connection-status', false);
    }
    return null;
  }
}

// Cleanup
function cleanup() {
  try {
    WorkflowIntegration.CleanUp();
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
  resolveObj = null;
  isResolveConnected = false;
}

// Create the main window
function createWindow() {
  // Use absolute path for preload.js to avoid issues with ESM/CommonJS interop
  const preloadPath = path.join(__dirname, 'preload.js');
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('../index.html');
  
  // For development
  mainWindow.webContents.openDevTools();
  
  mainWindow.on('close', function() {
    cleanup();
  });
  
  // Send initial connection status
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('resolve-connection-status', isResolveConnected);
  });
}

// Initialize the app
app.whenReady().then(async () => {
  // Initialize Resolve connection first
  await initResolveInterface();
  createWindow();

  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function() {
  cleanup();
  app.quit();
});

// Keep-alive ping
ipcMain.handle('keep-alive', async () => {
  // This is just to keep the connection active
  if (!isResolveConnected) {
    await initResolveInterface();
  }
  return { success: true };
});

// Get Resolve info
ipcMain.handle('get-resolve-info', async () => {
  try {
    if (!resolveObj) {
      resolveObj = await initResolveInterface();
      if (!resolveObj) {
        return { success: false, error: 'Failed to connect to Resolve' };
      }
    }
    
    const productName = resolveObj.GetProductName();
    const versionString = resolveObj.GetVersionString();
    
    return {
      success: true,
      productName,
      versionString
    };
  } catch (error) {
    console.error('Error getting Resolve info:', error);
    return { success: false, error: error.message };
  }
});

// IPC Handlers for HTML file operations
ipcMain.handle('select-html-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'HTML Files', extensions: ['html', 'htm'] }]
  });
  
  if (result.canceled) {
    return null;
  }
  
  const filePath = result.filePaths[0];
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return {
      path: filePath,
      content: fileContent
    };
  } catch (error) {
    console.error('Error reading file:', error);
    return { error: error.message };
  }
});

// Load a specific HTML file
ipcMain.handle('load-specific-file', async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { 
        error: `File not found: ${filePath}`
      };
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return {
      path: filePath,
      content: fileContent
    };
  } catch (error) {
    console.error('Error reading specific file:', error);
    return { error: error.message };
  }
});

ipcMain.handle('extract-parameters', async (event, htmlContent) => {
  // This is a simplified parameter extraction
  try {
    const parameters = {
      textElements: [],
      styles: {}
    };
    
    // Extract text elements (simplified example)
    const textRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>|<p[^>]*>(.*?)<\/p>|<span[^>]*>(.*?)<\/span>/gi;
    let match;
    
    while ((match = textRegex.exec(htmlContent)) !== null) {
      const textContent = match[1] || match[2] || match[3];
      if (textContent) {
        parameters.textElements.push({
          type: match[0].startsWith('<h') ? 'heading' : (match[0].startsWith('<p') ? 'paragraph' : 'span'),
          content: textContent.trim()
        });
      }
    }
    
    // Extract CSS styles (simplified example)
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const colorRegex = /(color|background-color)\s*:\s*([^;]+)/gi;
    const fontRegex = /(font-size|font-family|font-weight)\s*:\s*([^;]+)/gi;
    
    while ((match = styleRegex.exec(htmlContent)) !== null) {
      const cssContent = match[1];
      
      // Extract colors
      let colorMatch;
      while ((colorMatch = colorRegex.exec(cssContent)) !== null) {
        parameters.styles[colorMatch[1]] = colorMatch[2].trim();
      }
      
      // Extract font properties
      let fontMatch;
      while ((fontMatch = fontRegex.exec(cssContent)) !== null) {
        parameters.styles[fontMatch[1]] = fontMatch[2].trim();
      }
    }
    
    return parameters;
  } catch (error) {
    console.error('Error extracting parameters:', error);
    return { error: error.message };
  }
});

ipcMain.handle('update-html', async (event, { htmlContent, parameters }) => {
  try {
    let updatedContent = htmlContent;
    
    // Update text elements (simplified)
    parameters.textElements.forEach(element => {
      const regex = new RegExp(`(<${element.type}[^>]*>)(.*?)(<\/${element.type}>)`, 'i');
      updatedContent = updatedContent.replace(regex, `$1${element.content}$3`);
    });
    
    // Update CSS styles (simplified)
    Object.entries(parameters.styles).forEach(([property, value]) => {
      const regex = new RegExp(`(${property}\\s*:\\s*)([^;]+)`, 'gi');
      updatedContent = updatedContent.replace(regex, `$1${value}`);
    });
    
    // Ensure the HTML has a transparent background
    if (!updatedContent.includes('background-color: transparent')) {
      // Add or modify html and body styles for transparency
      if (updatedContent.includes('<style')) {
        // Modify existing style
        updatedContent = updatedContent.replace(
          /<style([^>]*)>([\s\S]*?)<\/style>/gi,
          (match, attrs, styleContent) => {
            // Add html and body transparent background styles if they don't exist
            if (!styleContent.includes('html')) {
              styleContent += '\nhtml, body { background-color: transparent !important; margin: 0; padding: 0; width: 100%; height: 100%; }';
            } else if (!styleContent.includes('background-color: transparent')) {
              styleContent = styleContent.replace(
                /(html\s*,?\s*body\s*\{[^}]*)(background-color:[^;]*)/gi,
                '$1background-color: transparent !important'
              );
            }
            return `<style${attrs}>${styleContent}</style>`;
          }
        );
      } else {
        // Add new style tag
        updatedContent = updatedContent.replace(
          '</head>',
          '<style>html, body { background-color: transparent !important; margin: 0; padding: 0; width: 100%; height: 100%; }</style></head>'
        );
      }
    }
    
    return updatedContent;
  } catch (error) {
    console.error('Error updating HTML:', error);
    return { error: error.message };
  }
});

// Capture HTML as image and add to timeline
ipcMain.handle('export-to-timeline', async (event, htmlContent) => {
  try {
    if (!resolveObj) {
      resolveObj = await initResolveInterface();
      if (!resolveObj) {
        return { success: false, error: 'Failed to connect to Resolve' };
      }
    }
    
    // Ensure HTML content has the same aspect ratio styling as the preview
    let modifiedHtml = htmlContent;
    
    // Add aspect ratio styles to ensure consistent display
    const aspectRatioStyle = `
      <style>
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          background-color: transparent !important;
        }
      </style>
    `;
    
    // Check if HTML has a head section and add the aspect ratio style
    if (!modifiedHtml.includes('<head>')) {
      modifiedHtml = modifiedHtml.replace('<html>', '<html><head>' + aspectRatioStyle + '</head>');
    } else if (!modifiedHtml.includes(aspectRatioStyle)) {
      modifiedHtml = modifiedHtml.replace('</head>', aspectRatioStyle + '</head>');
    }
    
    // Create a temporary HTML file
    const tmpDir = os.tmpdir();
    const tmpHtmlPath = path.join(tmpDir, `graphics_${Date.now()}.html`);
    fs.writeFileSync(tmpHtmlPath, modifiedHtml);
    
    // Get the current project
    const projectManager = resolveObj.GetProjectManager();
    const currentProject = projectManager.GetCurrentProject();
    
    if (!currentProject) {
      return { success: false, error: 'No active project in Resolve' };
    }
    
    // Get the current timeline
    const currentTimeline = currentProject.GetCurrentTimeline();
    if (!currentTimeline) {
      return { success: false, error: 'No active timeline in Resolve' };
    }
    
    // Create a new fusion composition
    // Note: This is a simplified example; the actual implementation would depend on the Resolve API
    const fusionComp = currentTimeline.AddFusionComp();
    
    if (!fusionComp) {
      return { success: false, error: 'Failed to create Fusion composition' };
    }
    
    // TODO: Add HTML content to the Fusion composition
    // This is a placeholder; actual implementation depends on the Resolve API
    
    return {
      success: true,
      message: 'HTML added to timeline'
    };
  } catch (error) {
    console.error('Error exporting to timeline:', error);
    return { success: false, error: error.message };
  }
}); 