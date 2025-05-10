// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
const url = require('url')
// Point to the WorkflowIntegration.node in the parent directory
const WorkflowIntegration = require('../WorkflowIntegration.node')

// Plugin ID must match the ID in manifest.xml
const PLUGIN_ID = 'com.valuva.ai-graphics'

let mainWindow
let resolveIsConnected = false

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Load the index.html
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '../index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // Check connection with Resolve every 5 seconds
  setInterval(checkResolveConnection, 5000)
}

// Check if we can connect to Resolve
function checkResolveConnection() {
  try {
    const resolve = global.GetResolveInterface ? global.GetResolveInterface() : null
    const newConnectionStatus = resolve !== null && typeof resolve.GetProjectManager === 'function'
    
    // If status changed, notify renderer
    if (newConnectionStatus !== resolveIsConnected) {
      resolveIsConnected = newConnectionStatus
      if (mainWindow) {
        mainWindow.webContents.send('resolve-connection', resolveIsConnected)
      }
      console.log('Resolve connection status:', resolveIsConnected ? 'Connected' : 'Disconnected')
    }
  } catch (error) {
    console.error('Error checking Resolve connection:', error)
    resolveIsConnected = false
    if (mainWindow) {
      mainWindow.webContents.send('resolve-connection', false)
    }
  }
}

// Get basic Resolve information to confirm connection
ipcMain.handle('get-resolve-info', async () => {
  try {
    const resolve = global.GetResolveInterface ? global.GetResolveInterface() : null
    if (!resolve) {
      return { error: 'Resolve not connected' }
    }

    const projectManager = resolve.GetProjectManager()
    const project = projectManager.GetCurrentProject()
    
    if (!project) {
      return { error: 'No project currently open' }
    }

    return {
      productName: resolve.GetProductName(),
      productVersion: resolve.GetVersionString(),
      projectName: project.GetName(),
      timelineName: project.GetCurrentTimeline()?.GetName() || 'No timeline open'
    }
  } catch (error) {
    console.error('Error getting Resolve info:', error)
    return { error: error.message || 'Unknown error occurred' }
  }
})

// Keep alive ping to maintain connection
ipcMain.handle('keep-alive', () => {
  return { status: 'alive', resolveConnected: resolveIsConnected }
})

// App lifecycle events
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// Cleanup when app is about to quit
app.on('before-quit', () => {
  if (global.CleanupResolveInterface) {
    global.CleanupResolveInterface()
  }
})

// Make GetResolveInterface and CleanupResolveInterface available globally
global.GetResolveInterface = function GetResolveInterface() {
  const WorkflowIntegration = require('../WorkflowIntegration.node')
  
  // Initialize resolve interface
  const isResolveInit = WorkflowIntegration.Initialize(PLUGIN_ID)
  if (!isResolveInit) {
    console.error('Error: Failed to initialize Resolve interface!')
    return null
  }

  // Get resolve interface object
  const resolveInterfacObj = WorkflowIntegration.GetResolve()
  if (!resolveInterfacObj) {
    console.error('Error: Failed to get Resolve interface object!')
    return null
  }

  return resolveInterfacObj
}

global.CleanupResolveInterface = function CleanupResolveInterface() {
  const WorkflowIntegration = require('../WorkflowIntegration.node')
  const isSuccess = WorkflowIntegration.CleanUp()
  if (!isSuccess) {
    console.log('Error: Failed to cleanup Resolve interface!')
  }
}

// IPC Handlers for HTML file operations
ipcMain.handle('select-html-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'HTML Files', extensions: ['html', 'htm'] }]
  })
  
  if (result.canceled) {
    return null
  }
  
  const filePath = result.filePaths[0]
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    return {
      path: filePath,
      content: fileContent
    }
  } catch (error) {
    console.error('Error reading file:', error)
    return { error: error.message }
  }
})

// Load a specific HTML file
ipcMain.handle('load-specific-file', async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { 
        error: `File not found: ${filePath}`
      }
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8')
    return {
      path: filePath,
      content: fileContent
    }
  } catch (error) {
    console.error('Error reading specific file:', error)
    return { error: error.message }
  }
})

ipcMain.handle('extract-parameters', async (event, htmlContent) => {
  // This is a simplified parameter extraction
  try {
    const parameters = {
      textElements: [],
      styles: {}
    }
    
    // Extract text elements (simplified example)
    const textRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>|<p[^>]*>(.*?)<\/p>|<span[^>]*>(.*?)<\/span>/gi
    let match
    
    while ((match = textRegex.exec(htmlContent)) !== null) {
      const textContent = match[1] || match[2] || match[3]
      if (textContent) {
        parameters.textElements.push({
          type: match[0].startsWith('<h') ? 'heading' : (match[0].startsWith('<p') ? 'paragraph' : 'span'),
          content: textContent.trim()
        })
      }
    }
    
    // Extract CSS styles (simplified example)
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
    const colorRegex = /(color|background-color)\s*:\s*([^;]+)/gi
    const fontRegex = /(font-size|font-family|font-weight)\s*:\s*([^;]+)/gi
    
    while ((match = styleRegex.exec(htmlContent)) !== null) {
      const cssContent = match[1]
      
      // Extract colors
      let colorMatch
      while ((colorMatch = colorRegex.exec(cssContent)) !== null) {
        parameters.styles[colorMatch[1]] = colorMatch[2].trim()
      }
      
      // Extract font properties
      let fontMatch
      while ((fontMatch = fontRegex.exec(cssContent)) !== null) {
        parameters.styles[fontMatch[1]] = fontMatch[2].trim()
      }
    }
    
    return parameters
  } catch (error) {
    console.error('Error extracting parameters:', error)
    return { error: error.message }
  }
})

ipcMain.handle('update-html', async (event, { htmlContent, parameters }) => {
  try {
    let updatedContent = htmlContent
    
    // Update text elements (simplified)
    parameters.textElements.forEach(element => {
      const regex = new RegExp(`(<${element.type}[^>]*>)(.*?)(<\/${element.type}>)`, 'i')
      updatedContent = updatedContent.replace(regex, `$1${element.content}$3`)
    })
    
    // Update CSS styles (simplified)
    Object.entries(parameters.styles).forEach(([property, value]) => {
      const regex = new RegExp(`(${property}\\s*:\\s*)([^;]+)`, 'gi')
      updatedContent = updatedContent.replace(regex, `$1${value}`)
    })
    
    return updatedContent
  } catch (error) {
    console.error('Error updating HTML:', error)
    return { error: error.message }
  }
})

// Capture HTML as image and add to timeline
ipcMain.handle('export-to-timeline', async (event, htmlContent) => {
  try {
    if (!resolveIsConnected) {
      return { success: false, error: 'Not connected to Resolve' }
    }
    
    // Ensure HTML content has the same aspect ratio styling as the preview
    let modifiedHtml = htmlContent
    
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
        .aspect-ratio-16-9 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .content-container {
          width: 80%;
          max-width: 1600px;
          margin: 0 auto;
          position: relative;
        }
        /* Make containers scale properly */
        .graphic-container, .lower-third {
          width: 100% !important;
          margin: 0 auto !important;
        }
      </style>
    `
    
    // Insert the style tag
    if (modifiedHtml.includes('</head>')) {
      modifiedHtml = modifiedHtml.replace('</head>', `${aspectRatioStyle}</head>`);
    } else {
      // If no head tag, add it at the beginning of the document
      modifiedHtml = `<head>${aspectRatioStyle}</head>${modifiedHtml}`;
    }
    
    // Wrap body content in aspect ratio container
    if (modifiedHtml.includes('<body') && !modifiedHtml.includes('aspect-ratio-16-9')) {
      modifiedHtml = modifiedHtml.replace(/<body([^>]*)>([\s\S]*)<\/body>/i, 
        '<body$1><div class="aspect-ratio-16-9"><div class="content-container">$2</div></div></body>');
    }
    
    // 1. Create a temporary HTML file
    const tempDir = path.join(os.tmpdir(), 'valuva-graphics');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const tempHtmlPath = path.join(tempDir, `temp-${Date.now()}.html`);
    fs.writeFileSync(tempHtmlPath, modifiedHtml, 'utf8');
    
    // 2. Create a window to capture the HTML with exact 16:9 resolution matching the preview
    const captureWin = new BrowserWindow({
      width: 1920,
      height: 1080,
      show: false,
      backgroundColor: '#00000000', // Transparent background
      webPreferences: { 
        offscreen: true,
        transparent: true 
      }
    });
    
    // Set precise dimensions
    captureWin.setContentSize(1920, 1080);
    
    await captureWin.loadFile(tempHtmlPath);
    
    // Allow more time for rendering and animations
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // The styling is now handled by the CSS above, so we just need minimal JS adjustments
    await captureWin.webContents.executeJavaScript(`
      // Look for any heading elements and make them larger
      const headings = document.querySelectorAll('h1, h2, h3');
      headings.forEach(heading => {
        // Get current size and increase it
        const currentSize = window.getComputedStyle(heading).fontSize;
        const numericSize = parseFloat(currentSize);
        if (!isNaN(numericSize)) {
          heading.style.fontSize = (numericSize * 1.2) + 'px';
        }
      });
      
      // Look for paragraph elements and increase their size
      const paragraphs = document.querySelectorAll('p');
      paragraphs.forEach(p => {
        const currentSize = window.getComputedStyle(p).fontSize;
        const numericSize = parseFloat(currentSize);
        if (!isNaN(numericSize)) {
          p.style.fontSize = (numericSize * 1.2) + 'px';
        }
      });
      
      // Force transparency
      document.documentElement.style.backgroundColor = 'transparent';
      document.body.style.backgroundColor = 'transparent';
    `);
    
    // Allow additional time for any adjustments
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 3. Capture as image with transparency
    const image = await captureWin.webContents.capturePage();
    const imagePath = path.join(tempDir, `graphic-${Date.now()}.png`);
    fs.writeFileSync(imagePath, image.toPNG());
    
    captureWin.close();
    
    // Log some info for debugging
    console.log(`Captured image saved to: ${imagePath}`);
    
    // 4. Import to Resolve and add to timeline
    const projectManager = await global.GetResolveInterface().GetProjectManager();
    if (!projectManager) {
      return { success: false, error: 'Project manager not available' };
    }
    
    const project = await projectManager.GetCurrentProject();
    if (!project) {
      return { success: false, error: 'No project open' };
    }
    
    const mediaPool = await project.GetMediaPool();
    if (!mediaPool) {
      return { success: false, error: 'Media pool not available' };
    }
    
    // Import the image to media pool
    const mediaItems = await mediaPool.ImportMedia([imagePath]);
    if (!mediaItems || mediaItems.length === 0) {
      return { success: false, error: 'Failed to import media to Resolve' };
    }
    
    // Add to timeline at current position
    const timeline = await project.GetCurrentTimeline();
    if (!timeline) {
      return { success: false, error: 'No timeline open' };
    }
    
    const timelineItems = await mediaPool.AppendToTimeline(mediaItems);
    
    return {
      success: true,
      message: 'Graphic added to timeline successfully',
      mediaItem: mediaItems[0],
      timelineItem: timelineItems ? timelineItems[0] : null
    };
    
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error: error.toString() };
  }
}); 