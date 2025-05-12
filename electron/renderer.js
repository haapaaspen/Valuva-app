// Global variables
let currentHtmlContent = null;
let currentParameters = null;
let currentFilePath = null;
let autoUpdatePreview = true;
const SAMPLE_FILE_PATH = '/Library/Application Support/Blackmagic Design/DaVinci Resolve/Workflow Integration Plugins/com.valuva.ai-graphics/graphics/sample-graphic.html';

// DOM Elements
const connectionStatus = document.getElementById('connection-status');
const selectFileBtn = document.getElementById('select-file-btn');
const fileInfo = document.getElementById('file-info');
const filePath = document.getElementById('file-path');
const parametersSection = document.getElementById('parameters-section');
const textParameters = document.getElementById('text-parameters');
const characterParameters = document.getElementById('character-parameters');
const paragraphParameters = document.getElementById('paragraph-parameters');
const styleParameters = document.getElementById('style-parameters');
const effectsParameters = document.getElementById('effects-parameters');
const exportBtn = document.getElementById('export-btn');
const noPreview = document.getElementById('no-preview');
const previewFrame = document.getElementById('preview-frame');

// Available fonts
const availableFonts = [
  'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier', 
  'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Tahoma', 
  'Trebuchet MS', 'Arial Black', 'Impact', 'Comic Sans MS'
];

// Check Resolve connection
async function checkResolveConnection() {
  try {
    const resolveInfo = await window.valuvaAPI.getResolveInfo();
    
    if (resolveInfo.success) {
      connectionStatus.textContent = `Connected to ${resolveInfo.productName} ${resolveInfo.versionString}`;
      connectionStatus.classList.add('success');
    } else {
      connectionStatus.textContent = resolveInfo.error || 'Not connected to Resolve';
      connectionStatus.classList.add('error');
    }
  } catch (error) {
    connectionStatus.textContent = 'Failed to connect to Resolve';
    connectionStatus.classList.add('error');
    console.error('Resolve connection error:', error);
  }
}

// Load a specific HTML file
async function loadSpecificFile(specificPath) {
  try {
    const result = await window.valuvaAPI.loadSpecificFile(specificPath);
    
    if (!result || result.error) {
      if (result && result.error) {
        showError(`Error loading file: ${result.error}`);
      }
      return false;
    }
    
    // Store content and path
    currentHtmlContent = result.content;
    currentFilePath = result.path;
    
    // Show file info
    fileInfo.classList.remove('hidden');
    filePath.textContent = currentFilePath;
    
    // Extract parameters
    await extractParameters();
    
    // Update preview
    updatePreview();
    
    return true;
  } catch (error) {
    showError(`Error processing file: ${error.message}`);
    return false;
  }
}

// Select HTML file
async function selectHtmlFile() {
  try {
    const result = await window.valuvaAPI.selectHtmlFile();
    
    if (!result || result.error) {
      if (result && result.error) {
        showError(`Error selecting file: ${result.error}`);
      }
      return;
    }
    
    // Store content and path
    currentHtmlContent = result.content;
    currentFilePath = result.path;
    
    // Show file info
    fileInfo.classList.remove('hidden');
    filePath.textContent = currentFilePath;
    
    // Extract parameters
    await extractParameters();
    
    // Update preview
    updatePreview();
    
  } catch (error) {
    showError(`Error processing file: ${error.message}`);
  }
}

// Extract parameters from HTML
async function extractParameters() {
  try {
    const parameters = await window.valuvaAPI.extractParameters(currentHtmlContent);
    
    if (parameters.error) {
      showError(`Error extracting parameters: ${parameters.error}`);
      return;
    }
    
    currentParameters = parameters;
    
    // Show parameters section
    parametersSection.classList.remove('hidden');
    
    // Clear previous parameters
    textParameters.innerHTML = '';
    characterParameters.innerHTML = '';
    paragraphParameters.innerHTML = '';
    styleParameters.innerHTML = '';
    effectsParameters.innerHTML = '';
    
    // Add text elements
    if (parameters.textElements && parameters.textElements.length > 0) {
      parameters.textElements.forEach((element, index) => {
        const paramDiv = document.createElement('div');
        paramDiv.className = 'parameter';
        paramDiv.innerHTML = `
          <label for="text-${index}">${element.type.charAt(0).toUpperCase() + element.type.slice(1)} Text:</label>
          <input type="text" id="text-${index}" value="${element.content}" data-index="${index}">
        `;
        textParameters.appendChild(paramDiv);
        
        // Add event listener for real-time updates
        const textInput = paramDiv.querySelector(`#text-${index}`);
        textInput.addEventListener('input', debounce(() => {
          if (autoUpdatePreview) updateHtmlWithParameters();
        }, 300));
      });
    } else {
      textParameters.innerHTML = '<p>No text elements found</p>';
    }
    
    // Add character parameters
    renderCharacterControls();
    
    // Add paragraph parameters
    renderParagraphControls();
    
    // Add style parameters (colors, etc.)
    if (parameters.styles && Object.keys(parameters.styles).length > 0) {
      // Group style parameters
      const colorGroup = document.createElement('div');
      colorGroup.className = 'parameter-group';
      colorGroup.innerHTML = '<div class="parameter-group-title">Colors</div>';
      
      const sizeGroup = document.createElement('div');
      sizeGroup.className = 'parameter-group';
      sizeGroup.innerHTML = '<div class="parameter-group-title">Dimensions</div>';
      
      const miscGroup = document.createElement('div');
      miscGroup.className = 'parameter-group';
      miscGroup.innerHTML = '<div class="parameter-group-title">Other Styles</div>';
      
      Object.entries(parameters.styles).forEach(([property, value]) => {
        const paramDiv = document.createElement('div');
        paramDiv.className = 'parameter';
        
        if (property.includes('color')) {
          // Color parameter
          const colorHex = value.trim();
          paramDiv.innerHTML = `
            <label for="style-${property}">${formatPropertyName(property)}:</label>
            <div class="color-picker">
              <input type="color" id="style-color-${property}" value="${colorToHex(colorHex)}">
              <input type="text" id="style-${property}" value="${colorHex}" data-property="${property}">
            </div>
          `;
          
          colorGroup.appendChild(paramDiv);
          
          // Add real-time update event listeners
          setTimeout(() => {
            const colorPicker = document.getElementById(`style-color-${property}`);
            const colorText = document.getElementById(`style-${property}`);
            
            colorPicker.addEventListener('input', () => {
              colorText.value = colorPicker.value;
              if (autoUpdatePreview) updateHtmlWithParameters();
            });
            
            colorText.addEventListener('input', debounce(() => {
              if (autoUpdatePreview) updateHtmlWithParameters();
            }, 300));
          }, 0);
          
        } else if (property.includes('size') || property.includes('width') || 
                  property.includes('height') || property.includes('margin') || 
                  property.includes('padding')) {
          // Size/dimension parameter
          paramDiv.innerHTML = `
            <label for="style-${property}">${formatPropertyName(property)}:</label>
            <input type="text" id="style-${property}" value="${value}" data-property="${property}">
          `;
          sizeGroup.appendChild(paramDiv);
          
          // Add real-time update event listener
          setTimeout(() => {
            const input = document.getElementById(`style-${property}`);
            input.addEventListener('input', debounce(() => {
              if (autoUpdatePreview) updateHtmlWithParameters();
            }, 300));
          }, 0);
          
        } else {
          // Other parameter
          paramDiv.innerHTML = `
            <label for="style-${property}">${formatPropertyName(property)}:</label>
            <input type="text" id="style-${property}" value="${value}" data-property="${property}">
          `;
          miscGroup.appendChild(paramDiv);
          
          // Add real-time update event listener
          setTimeout(() => {
            const input = document.getElementById(`style-${property}`);
            input.addEventListener('input', debounce(() => {
              if (autoUpdatePreview) updateHtmlWithParameters();
            }, 300));
          }, 0);
        }
      });
      
      // Append groups to the style parameters container
      if (colorGroup.childElementCount > 1) styleParameters.appendChild(colorGroup);
      if (sizeGroup.childElementCount > 1) styleParameters.appendChild(sizeGroup);
      if (miscGroup.childElementCount > 1) styleParameters.appendChild(miscGroup);
    } else {
      styleParameters.innerHTML = '<p>No style parameters found</p>';
    }
    
    // Add effects parameters
    renderEffectsControls();
    
  } catch (error) {
    showError(`Error parsing parameters: ${error.message}`);
  }
}

// Render character controls (font family, size, weight, etc.)
function renderCharacterControls() {
  characterParameters.innerHTML = `
    <div class="parameter">
      <label for="font-family">Font Family:</label>
      <select id="font-family">
        ${availableFonts.map(font => `<option value="${font}">${font}</option>`).join('')}
      </select>
    </div>
    
    <div class="row">
      <div class="col">
        <div class="parameter">
          <label for="font-size">Size (px):</label>
          <input type="number" id="font-size" value="36" min="8" max="200">
        </div>
      </div>
      <div class="col">
        <div class="parameter">
          <label for="font-weight">Weight:</label>
          <select id="font-weight">
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Light</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col">
        <div class="parameter">
          <label for="letter-spacing">Letter Spacing:</label>
          <div class="slider-container">
            <input type="range" id="letter-spacing-slider" class="slider" min="-5" max="10" value="0" step="0.1">
            <input type="number" id="letter-spacing" value="0" min="-5" max="10" step="0.1">
          </div>
        </div>
      </div>
      <div class="col">
        <div class="parameter">
          <label for="line-height">Line Height:</label>
          <div class="slider-container">
            <input type="range" id="line-height-slider" class="slider" min="0.5" max="3" value="1.2" step="0.1">
            <input type="number" id="line-height" value="1.2" min="0.5" max="3" step="0.1">
          </div>
        </div>
      </div>
    </div>
    
    <div class="parameter">
      <label>Style:</label>
      <div class="toggle-container">
        <span class="toggle-label">Italic</span>
        <label class="toggle-switch">
          <input type="checkbox" id="font-style-italic">
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="toggle-container">
        <span class="toggle-label">Underline</span>
        <label class="toggle-switch">
          <input type="checkbox" id="text-decoration-underline">
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>
  `;
  
  // Add event listeners for real-time updates
  setTimeout(() => {
    const fontControls = characterParameters.querySelectorAll('select, input');
    fontControls.forEach(control => {
      if (control.type === 'range') {
        // Sync range slider with number input
        const numberId = control.id.replace('-slider', '');
        const numberInput = document.getElementById(numberId);
        
        control.addEventListener('input', () => {
          numberInput.value = control.value;
          if (autoUpdatePreview) updateHtmlWithParameters();
        });
        
        numberInput.addEventListener('input', () => {
          control.value = numberInput.value;
          if (autoUpdatePreview) updateHtmlWithParameters();
        });
      } else {
        control.addEventListener('input', debounce(() => {
          if (autoUpdatePreview) updateHtmlWithParameters();
        }, 300));
        
        if (control.type === 'checkbox') {
          control.addEventListener('change', () => {
            if (autoUpdatePreview) updateHtmlWithParameters();
          });
        }
      }
    });
  }, 0);
}

// Render paragraph controls (alignment, spacing, etc.)
function renderParagraphControls() {
  paragraphParameters.innerHTML = `
    <div class="parameter">
      <label>Text Alignment:</label>
      <div class="alignment-controls">
        <div class="alignment-button" data-align="left" title="Align Left"><i class="fas fa-align-left"></i></div>
        <div class="alignment-button" data-align="center" title="Align Center"><i class="fas fa-align-center"></i></div>
        <div class="alignment-button" data-align="right" title="Align Right"><i class="fas fa-align-right"></i></div>
        <div class="alignment-button" data-align="justify" title="Justify"><i class="fas fa-align-justify"></i></div>
      </div>
    </div>
    
    <div class="row">
      <div class="col">
        <div class="parameter">
          <label for="margin-top">Top Margin:</label>
          <input type="number" id="margin-top" value="0" min="0" max="100">
        </div>
      </div>
      <div class="col">
        <div class="parameter">
          <label for="margin-bottom">Bottom Margin:</label>
          <input type="number" id="margin-bottom" value="0" min="0" max="100">
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col">
        <div class="parameter">
          <label for="margin-left">Left Margin:</label>
          <input type="number" id="margin-left" value="0" min="0" max="100">
        </div>
      </div>
      <div class="col">
        <div class="parameter">
          <label for="margin-right">Right Margin:</label>
          <input type="number" id="margin-right" value="0" min="0" max="100">
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners for alignment buttons
  setTimeout(() => {
    const alignButtons = paragraphParameters.querySelectorAll('.alignment-button');
    alignButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        alignButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        if (autoUpdatePreview) updateHtmlWithParameters();
      });
    });
    
    // Set the default active alignment
    const defaultAlign = alignButtons[0]; // Left align by default
    if (defaultAlign) defaultAlign.classList.add('active');
    
    // Add event listeners for margin inputs
    const marginInputs = paragraphParameters.querySelectorAll('input[type="number"]');
    marginInputs.forEach(input => {
      input.addEventListener('input', debounce(() => {
        if (autoUpdatePreview) updateHtmlWithParameters();
      }, 300));
    });
  }, 0);
}

// Render effects controls (shadow, transform, etc.)
function renderEffectsControls() {
  effectsParameters.innerHTML = `
    <div class="parameter-group-title">Text Shadow</div>
    <div class="toggle-container">
      <span class="toggle-label">Enable Shadow</span>
      <label class="toggle-switch">
        <input type="checkbox" id="shadow-enabled" checked>
        <span class="toggle-slider"></span>
      </label>
    </div>
    
    <div class="row">
      <div class="col">
        <div class="parameter">
          <label for="shadow-x">Horizontal (px):</label>
          <input type="number" id="shadow-x" value="2" min="-20" max="20">
        </div>
      </div>
      <div class="col">
        <div class="parameter">
          <label for="shadow-y">Vertical (px):</label>
          <input type="number" id="shadow-y" value="2" min="-20" max="20">
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col">
        <div class="parameter">
          <label for="shadow-blur">Blur (px):</label>
          <input type="number" id="shadow-blur" value="4" min="0" max="20">
        </div>
      </div>
      <div class="col">
        <div class="parameter">
          <label for="shadow-color">Color:</label>
          <div class="color-picker">
            <input type="color" id="shadow-color-picker" value="#000000">
            <input type="text" id="shadow-color" value="rgba(0,0,0,0.3)">
          </div>
        </div>
      </div>
    </div>
    
    <div class="parameter-group-title">Transform</div>
    <div class="parameter">
      <label for="transform-scale">Scale:</label>
      <div class="slider-container">
        <input type="range" id="transform-scale-slider" class="slider" min="0.5" max="2" value="1" step="0.1">
        <input type="number" id="transform-scale" value="1" min="0.5" max="2" step="0.1">
      </div>
    </div>
    
    <div class="parameter">
      <label for="transform-rotate">Rotate (deg):</label>
      <div class="slider-container">
        <input type="range" id="transform-rotate-slider" class="slider" min="-180" max="180" value="0" step="1">
        <input type="number" id="transform-rotate" value="0" min="-180" max="180" step="1">
      </div>
    </div>
  `;
  
  // Add event listeners for real-time updates
  setTimeout(() => {
    // Shadow toggle
    const shadowToggle = document.getElementById('shadow-enabled');
    shadowToggle.addEventListener('change', () => {
      if (autoUpdatePreview) updateHtmlWithParameters();
    });
    
    // Shadow color picker
    const shadowColorPicker = document.getElementById('shadow-color-picker');
    const shadowColorText = document.getElementById('shadow-color');
    shadowColorPicker.addEventListener('input', () => {
      shadowColorText.value = shadowColorPicker.value;
      if (autoUpdatePreview) updateHtmlWithParameters();
    });
    
    // Range sliders
    const rangeSliders = effectsParameters.querySelectorAll('input[type="range"]');
    rangeSliders.forEach(slider => {
      const numberId = slider.id.replace('-slider', '');
      const numberInput = document.getElementById(numberId);
      
      slider.addEventListener('input', () => {
        numberInput.value = slider.value;
        if (autoUpdatePreview) updateHtmlWithParameters();
      });
      
      numberInput.addEventListener('input', () => {
        slider.value = numberInput.value;
        if (autoUpdatePreview) updateHtmlWithParameters();
      });
    });
    
    // Number inputs (not connected to sliders)
    const independentInputs = effectsParameters.querySelectorAll('input[type="number"]:not([id^="transform"])');
    independentInputs.forEach(input => {
      input.addEventListener('input', debounce(() => {
        if (autoUpdatePreview) updateHtmlWithParameters();
      }, 300));
    });
  }, 0);
}

// Update preview with the HTML content
function updatePreview() {
  if (!currentHtmlContent) return;
  
  // Show preview iframe
  noPreview.classList.add('hidden');
  previewFrame.classList.remove('hidden');
  
  // Add styles to ensure 16:9 aspect ratio is maintained
  let contentWithAspectRatio = currentHtmlContent;
  
  // Add CSS to force 16:9 aspect ratio
  if (!contentWithAspectRatio.includes('aspect-ratio-16-9')) {
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
    `;
    
    // Insert the style tag before the closing head tag
    if (contentWithAspectRatio.includes('</head>')) {
      contentWithAspectRatio = contentWithAspectRatio.replace('</head>', `${aspectRatioStyle}</head>`);
    } else {
      // If no head tag, add it at the beginning of the document
      contentWithAspectRatio = `<head>${aspectRatioStyle}</head>${contentWithAspectRatio}`;
    }
    
    // Wrap body content in aspect ratio container
    if (contentWithAspectRatio.includes('<body')) {
      contentWithAspectRatio = contentWithAspectRatio.replace(/<body([^>]*)>([\s\S]*)<\/body>/i, 
        '<body$1><div class="aspect-ratio-16-9"><div class="content-container">$2</div></div></body>');
    }
  }
  
  // Create a Blob URL for the iframe source
  const blob = new Blob([contentWithAspectRatio], { type: 'text/html' });
  const blobURL = URL.createObjectURL(blob);
  
  // Set iframe src to the blob URL
  previewFrame.src = blobURL;
  
  // Add a data attribute to the iframe with the raw HTML content
  // This will make it accessible when exporting
  previewFrame.setAttribute('data-html-content', currentHtmlContent);
  
  // Clean up the previous blob URL when the iframe loads
  previewFrame.onload = () => {
    URL.revokeObjectURL(previewFrame.src);
  };
}

// Update HTML with new parameters
async function updateHtmlWithParameters() {
  if (!currentHtmlContent || !currentParameters) return;
  
  try {
    // Collect updated text elements
    const updatedTextElements = [];
    document.querySelectorAll('[id^="text-"]').forEach(input => {
      const index = parseInt(input.dataset.index);
      if (!isNaN(index) && index < currentParameters.textElements.length) {
        updatedTextElements.push({
          ...currentParameters.textElements[index],
          content: input.value
        });
      }
    });
    
    // Collect updated styles
    const updatedStyles = {};
    document.querySelectorAll('[id^="style-"]').forEach(input => {
      if (input.dataset.property) {
        updatedStyles[input.dataset.property] = input.value;
      }
    });
    
    // Add character parameters
    const fontFamily = document.getElementById('font-family')?.value;
    if (fontFamily) updatedStyles['font-family'] = fontFamily;
    
    const fontSize = document.getElementById('font-size')?.value;
    if (fontSize) updatedStyles['font-size'] = `${fontSize}px`;
    
    const fontWeight = document.getElementById('font-weight')?.value;
    if (fontWeight) updatedStyles['font-weight'] = fontWeight;
    
    const letterSpacing = document.getElementById('letter-spacing')?.value;
    if (letterSpacing) updatedStyles['letter-spacing'] = `${letterSpacing}px`;
    
    const lineHeight = document.getElementById('line-height')?.value;
    if (lineHeight) updatedStyles['line-height'] = lineHeight;
    
    const isItalic = document.getElementById('font-style-italic')?.checked;
    if (isItalic) updatedStyles['font-style'] = 'italic';
    else updatedStyles['font-style'] = 'normal';
    
    const isUnderline = document.getElementById('text-decoration-underline')?.checked;
    if (isUnderline) updatedStyles['text-decoration'] = 'underline';
    else updatedStyles['text-decoration'] = 'none';
    
    // Add paragraph parameters
    const activeAlignButton = document.querySelector('.alignment-button.active');
    if (activeAlignButton) {
      updatedStyles['text-align'] = activeAlignButton.dataset.align;
    }
    
    const marginTop = document.getElementById('margin-top')?.value;
    if (marginTop) updatedStyles['margin-top'] = `${marginTop}px`;
    
    const marginBottom = document.getElementById('margin-bottom')?.value;
    if (marginBottom) updatedStyles['margin-bottom'] = `${marginBottom}px`;
    
    const marginLeft = document.getElementById('margin-left')?.value;
    if (marginLeft) updatedStyles['margin-left'] = `${marginLeft}px`;
    
    const marginRight = document.getElementById('margin-right')?.value;
    if (marginRight) updatedStyles['margin-right'] = `${marginRight}px`;
    
    // Add effects parameters
    const shadowEnabled = document.getElementById('shadow-enabled')?.checked;
    if (shadowEnabled) {
      const shadowX = document.getElementById('shadow-x')?.value || 0;
      const shadowY = document.getElementById('shadow-y')?.value || 0;
      const shadowBlur = document.getElementById('shadow-blur')?.value || 0;
      const shadowColor = document.getElementById('shadow-color')?.value || 'rgba(0,0,0,0.3)';
      
      updatedStyles['text-shadow'] = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColor}`;
    } else {
      updatedStyles['text-shadow'] = 'none';
    }
    
    const transformScale = document.getElementById('transform-scale')?.value || 1;
    const transformRotate = document.getElementById('transform-rotate')?.value || 0;
    
    if (transformScale !== 1 || transformRotate !== 0) {
      updatedStyles['transform'] = `scale(${transformScale}) rotate(${transformRotate}deg)`;
    } else {
      updatedStyles['transform'] = 'none';
    }
    
    // Update parameters
    const updatedParameters = {
      textElements: updatedTextElements,
      styles: updatedStyles
    };
    
    // Update HTML content
    const result = await window.valuvaAPI.updateHtml({
      htmlContent: currentHtmlContent,
      parameters: updatedParameters
    });
    
    if (result.error) {
      showError(`Error updating HTML: ${result.error}`);
      return;
    }
    
    // Update current content and parameters
    currentHtmlContent = result;
    currentParameters = updatedParameters;
    
    // Update preview
    updatePreview();
    
  } catch (error) {
    showError(`Error updating parameters: ${error.message}`);
  }
}

// Export to Resolve timeline
async function exportToTimeline() {
  if (!currentHtmlContent) {
    showError('No content to export. Please load an HTML file first.');
    return;
  }
  
  try {
    showStatus('Exporting to timeline...', 'info');
    
    console.log('Exporting HTML content, length:', currentHtmlContent.length);
    
    // Make sure we're passing the latest HTML content
    const result = await window.valuvaAPI.exportToTimeline(currentHtmlContent);
    
    if (result.success) {
      showSuccess(result.message || 'Graphic exported successfully');
    } else {
      showError(result.error || 'Failed to export graphic');
    }
  } catch (error) {
    console.error('Export error:', error);
    showError(`Error exporting to timeline: ${error.message}`);
  }
}

// Helper functions
function formatPropertyName(property) {
  return property.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function colorToHex(color) {
  // Try to handle named colors, rgb, rgba values
  if (color.startsWith('#')) {
    return color;
  }
  
  // For named colors and complex formats, use a temporary element
  const tempEl = document.createElement('div');
  tempEl.style.color = color;
  document.body.appendChild(tempEl);
  const computed = getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);
  
  // Try to convert rgb to hex
  if (computed.startsWith('rgb')) {
    const rgb = computed.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      return '#' + rgb.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }
  }
  
  // Default fallback
  return '#000000';
}

function showSuccess(message) {
  connectionStatus.textContent = message;
  connectionStatus.className = 'status success';
  
  // Reset after 3 seconds
  setTimeout(() => {
    checkResolveConnection();
  }, 3000);
}

function showError(message) {
  connectionStatus.textContent = message;
  connectionStatus.className = 'status error';
  
  // Reset after 5 seconds
  setTimeout(() => {
    checkResolveConnection();
  }, 5000);
}

function showStatus(message, type) {
  connectionStatus.textContent = message;
  connectionStatus.className = `status ${type}`;
}

// Debounce function to limit how often a function can run
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Initialize on load
async function initialize() {
  await checkResolveConnection();
  
  // Automatically load the sample file
  console.log('Loading sample file:', SAMPLE_FILE_PATH);
  const success = await loadSpecificFile(SAMPLE_FILE_PATH);
  
  if (!success) {
    console.warn('Failed to load sample file automatically');
  } else {
    console.log('Sample file loaded successfully');
  }
}

// Set up event listeners
selectFileBtn.addEventListener('click', selectHtmlFile);
exportBtn.addEventListener('click', exportToTimeline);

// Initialize when the page loads
initialize();