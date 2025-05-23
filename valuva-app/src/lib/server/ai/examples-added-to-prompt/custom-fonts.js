// Example: Custom Font Usage
// Demonstrates loading and using custom fonts with proper fallbacks

const duration = 8;

// Font loading initialization
async function initializeFonts() {
  // Load Google Fonts for typography hierarchy
  await utils.loadGoogleFont('Playfair Display:400,700');  // Elegant serif for titles
  await utils.loadGoogleFont('Inter:300,400,600');         // Clean sans-serif for body
  await utils.loadGoogleFont('JetBrains Mono');           // Monospace for code/data
  
  // Wait for all fonts to load
  await utils.waitForFonts();
  
  console.log('All fonts loaded successfully');
}

function drawTypographyDemo(t) {
  // Dynamic background
  const bgGradient = utils.createGradient('linear', 0, 0, width, height);
  bgGradient.addColorStop(0, `hsl(${t * 60 + 220}, 40%, 8%)`);
  bgGradient.addColorStop(1, `hsl(${t * 60 + 280}, 60%, 12%)`);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Title with custom font and fallback
  const titleFont = utils.fonts['Playfair Display'] ? 'Playfair Display, serif' : 'Georgia, serif';
  const titleAlpha = 0.8 + Math.sin(t * Math.PI * 2) * 0.2;
  
  utils.drawText(
    'ELEGANT TYPOGRAPHY',
    width / 2,
    height * 0.3,
    72,
    titleFont,
    `rgba(255, 255, 255, ${titleAlpha})`
  );
  
  // Subtitle with different font
  const subtitleFont = utils.fonts['Inter'] ? 'Inter, sans-serif' : 'Arial, sans-serif';
  const subtitleY = height * 0.45 + Math.sin(t * Math.PI * 3) * 10;
  
  utils.drawText(
    'Modern Sans-Serif Integration',
    width / 2,
    subtitleY,
    32,
    subtitleFont,
    `rgba(200, 220, 255, 0.9)`
  );
  
  // Code/data display with monospace
  const codeFont = utils.fonts['JetBrains Mono'] ? 'JetBrains Mono, monospace' : 'Courier, monospace';
  const dataValue = (Math.sin(t * Math.PI * 4) * 50 + 50).toFixed(1);
  
  utils.drawText(
    `data: ${dataValue}%`,
    width / 2,
    height * 0.65,
    24,
    codeFont,
    `rgba(100, 255, 150, 0.8)`
  );
  
  // Decorative outline text
  if (utils.fonts['Playfair Display']) {
    const outlineScale = 1 + Math.sin(t * Math.PI * 2) * 0.1;
    ctx.save();
    ctx.translate(width / 2, height * 0.8);
    ctx.scale(outlineScale, outlineScale);
    
    utils.drawOutlineText(
      'ARTISTIC VISION',
      0, 0,
      48,
      'Playfair Display, serif',
      `rgba(255, 200, 100, 0.3)`,
      `rgba(255, 255, 255, 0.8)`,
      2
    );
    
    ctx.restore();
  }
}

// Initialize fonts and start animation
initializeFonts().then(() => {
  utils.animate((time_ms) => {
    const t = (time_ms * 0.001 % duration) / duration;
    ctx.clearRect(0, 0, width, height);
    drawTypographyDemo(t);
  });
}).catch(error => {
  console.warn('Font loading failed, using fallbacks:', error);
  
  // Start animation with fallback fonts
  utils.animate((time_ms) => {
    const t = (time_ms * 0.001 % duration) / duration;
    ctx.clearRect(0, 0, width, height);
    drawTypographyDemo(t);
  });
}); 