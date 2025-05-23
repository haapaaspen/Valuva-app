// Enhanced Font Discovery & Validation Example
// Demonstrates Google Fonts API integration for dynamic font selection

async function initializeFontSystem() {
  try {
    // 1. Validate a font before loading
    const validation = await utils.validateFont('Playfair Display');
    console.log('Font validation:', validation);
    
    // 2. Search for popular serif fonts
    const serifFonts = await utils.getPopularFonts('serif', 5);
    console.log('Popular serif fonts:', serifFonts);
    
    // 3. Get detailed font metadata
    const metadata = await utils.getFontMetadata('Inter');
    console.log('Inter metadata:', metadata);
    
    // 4. Search fonts by category and popularity
    const displayFonts = await utils.searchFonts({
      category: 'display',
      sort: 'popularity',
      limit: 3
    });
    console.log('Display fonts:', displayFonts.map(f => f.family));
    
    // Load validated fonts
    await utils.loadGoogleFont('Playfair Display:400,700');
    await utils.loadGoogleFont(serifFonts[0] + ':400'); // First popular serif
    await utils.waitForFonts();
    
    return {
      titleFont: 'Playfair Display',
      bodyFont: serifFonts[0],
      displayFont: displayFonts[0]?.family || 'Abril Fatface'
    };
    
  } catch (error) {
    console.warn('Font API not available, using fallbacks:', error);
    // Graceful fallback when API is not configured
    await utils.loadGoogleFont('Playfair Display:400,700');
    await utils.loadGoogleFont('Lora:400');
    return {
      titleFont: 'Playfair Display',
      bodyFont: 'Lora',
      displayFont: 'Abril Fatface'
    };
  }
}

// Animation showcasing dynamically discovered fonts
const fontDiscoveryDuration = 8;

initializeFontSystem().then((fonts) => {
  utils.animate((time_ms) => {
    const t_sec = time_ms * 0.001;
    const cycle_t = t_sec % fontDiscoveryDuration;
    const progress = cycle_t / fontDiscoveryDuration;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Background gradient
    const gradient = utils.createGradient('radial', width/2, height/2, 0, width/2, height/2, 600);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f0f0f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Animated text showcase with discovered fonts
    const titleY = height * 0.3;
    const bodyY = height * 0.5;
    const displayY = height * 0.7;
    
    // Title with validated font
    const titleFont = utils.fonts[fonts.titleFont] ? fonts.titleFont : 'Georgia';
    const titleScale = 1 + Math.sin(progress * Math.PI * 2) * 0.1;
    utils.drawText(
      'Dynamic Typography',
      width / 2,
      titleY,
      48 * titleScale,
      titleFont + ', serif',
      '#ffffff'
    );
    
    // Body text with popular font
    const bodyFont = utils.fonts[fonts.bodyFont] ? fonts.bodyFont : 'Times';
    const bodyAlpha = (Math.sin(progress * Math.PI * 2 + Math.PI / 2) + 1) / 2;
    ctx.save();
    ctx.globalAlpha = bodyAlpha;
    utils.drawText(
      'Intelligent Font Selection',
      width / 2,
      bodyY,
      28,
      bodyFont + ', serif',
      '#cccccc'
    );
    ctx.restore();
    
    // Display font showcase
    const displayRotation = Math.sin(progress * Math.PI * 2) * 0.1;
    ctx.save();
    ctx.translate(width / 2, displayY);
    ctx.rotate(displayRotation);
    utils.drawGlowText(
      'API POWERED',
      0,
      0,
      36,
      '#ff6b6b',
      '#ff3030'
    );
    ctx.restore();
    
    // Font info overlay
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(20, 20, 300, 120);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Title: ${fonts.titleFont}`, 30, 45);
    ctx.fillText(`Body: ${fonts.bodyFont}`, 30, 65);
    ctx.fillText(`Display: ${fonts.displayFont}`, 30, 85);
    ctx.fillText(`API Status: ${utils.validateFont ? 'Active' : 'Fallback'}`, 30, 105);
    ctx.restore();
    
    // Floating font specimens
    for (let i = 0; i < 3; i++) {
      const angle = progress * Math.PI * 2 + (i * Math.PI * 2) / 3;
      const radius = 200 + Math.sin(progress * Math.PI * 4) * 50;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      
      ctx.save();
      ctx.globalAlpha = 0.6;
      const sampleFonts = [fonts.titleFont, fonts.bodyFont, fonts.displayFont];
      const availableFont = utils.fonts[sampleFonts[i]] ? sampleFonts[i] : 'Arial';
      utils.drawText(
        'Aa',
        x,
        y,
        24,
        availableFont,
        '#ffffff'
      );
      ctx.restore();
    }
  });
});

/*
ENHANCED FONT API FEATURES DEMONSTRATED:

1. Font Validation:
   - utils.validateFont(fontFamily) - Check if font exists
   - Get suggestions for similar fonts if invalid
   - Access detailed font metadata

2. Font Discovery:
   - utils.getPopularFonts(category, limit) - Get trending fonts
   - utils.searchFonts(options) - Search by category, popularity, etc.
   - Access to 1400+ Google Fonts with metadata

3. Font Metadata:
   - utils.getFontMetadata(fontFamily) - Get variants, subsets, category
   - Variable font information and axes
   - Direct font file URLs

4. Graceful Fallbacks:
   - System works without API key (basic CSS loading)
   - Automatic fallback fonts when API fails
   - Progressive enhancement approach

5. Error Handling:
   - Validation before loading prevents errors
   - Meaningful error messages with suggestions
   - Robust caching and retry logic
*/ 