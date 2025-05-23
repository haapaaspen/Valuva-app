# Font Implementation Guide

## How Font Loading Works

The AI prompt defines font loading APIs like `utils.loadGoogleFont('Playfair Display')`, but the backend needs to resolve font names to actual URLs. Here's how we implement it:

## Implementation Approach: Google Fonts CSS API

### ✅ **Recommended Solution**

We use Google Fonts' CSS API to dynamically load fonts. This is the most reliable and performant approach.

**How it works:**
1. AI calls `utils.loadGoogleFont('Playfair Display:400,700')`
2. Backend constructs Google Fonts CSS URL: `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap`
3. System injects CSS link into document head
4. Font becomes available for canvas text rendering

### **URL Construction Examples**

```typescript
// Basic font loading
'Playfair Display' → 'https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap'

// With specific weights
'Inter:400,600,700' → 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'

// Multiple fonts
['Playfair Display:400,700', 'Inter:300,400'] → separate CSS requests
```

## Alternative Approaches (Not Recommended)

### ❌ **Google Fonts API (REST)**
- **Pros**: Access to font metadata, discovery
- **Cons**: Additional API calls, complexity, rate limits
- **Use case**: Font discovery/browsing tools

### ❌ **Local Font Database**
- **Pros**: No external dependencies
- **Cons**: Maintenance overhead, limited selection
- **Use case**: Offline environments

### ❌ **CDN Direct URLs**
- **Pros**: Fast loading
- **Cons**: Fragile URLs, no automatic format selection
- **Use case**: When you control the font hosting

## Implementation Architecture

```
AI Request
    ↓
utils.loadGoogleFont('Playfair Display')
    ↓
FontManager.loadGoogleFont()
    ↓
Construct CSS URL
    ↓
Inject <link> into document
    ↓
Wait for font load (FontFace API)
    ↓
Font available for canvas
```

## Key Features

### **1. Font Loading**
```typescript
// Google Fonts (automatic URL construction)
await utils.loadGoogleFont('Playfair Display:400,700');

// Custom fonts (manual URL)
await utils.loadFont('CustomFont', '/fonts/custom.woff2');
```

### **2. Font Availability Checking**
```typescript
const fontFamily = utils.fonts['Playfair Display'] 
  ? 'Playfair Display, serif' 
  : 'Georgia, serif';
```

### **3. Loading States**
```typescript
// Wait for all fonts to finish loading
await utils.waitForFonts();

// Check specific font status
if (utils.fonts['Inter']) {
  // Font is loaded and ready
}
```

### **4. Error Handling**
```typescript
try {
  await utils.loadGoogleFont('CustomFont');
} catch (error) {
  console.warn('Font loading failed, using fallback');
  // Continue with fallback fonts
}
```

## Font Detection Methods

### **1. FontFace API (Modern Browsers)**
```typescript
await document.fonts.load('16px "Playfair Display"');
```

### **2. Canvas Text Measurement (Fallback)**
```typescript
// Measure text width with fallback vs target font
// Different width = font loaded successfully
const fallbackWidth = ctx.measureText(testText).width;
ctx.font = '16px "Custom Font", Arial';
const customWidth = ctx.measureText(testText).width;
const isLoaded = fallbackWidth !== customWidth;
```

## Performance Optimizations

### **1. Font Loading Strategy**
- Load fonts before starting animations
- Use `font-display: swap` for better UX
- Limit number of font weights/variants

### **2. Caching**
- Track loaded fonts to avoid re-loading
- Share FontManager instance globally
- Use Promise caching for concurrent requests

### **3. Fallback Strategy**
```typescript
// Always provide fallback fonts
const fontStack = 'Playfair Display, Georgia, serif';

// Progressive enhancement
const fontFamily = utils.fonts['Playfair Display'] 
  ? 'Playfair Display, serif' 
  : 'Georgia, serif';
```

## Integration with Canvas Utils

The `createCanvasUtils()` function creates the utils object that gets injected into the AI's execution context:

```typescript
const utils = createCanvasUtils(ctx, canvas);

// AI can now use:
await utils.loadGoogleFont('Playfair Display');
utils.drawText('Hello', x, y, 24, 'Playfair Display', '#ffffff');
```

## Example Usage in AI Context

```javascript
// Font loading initialization
async function initializeFonts() {
  await utils.loadGoogleFont('Playfair Display:400,700');
  await utils.loadGoogleFont('Inter:300,400');
  await utils.waitForFonts();
}

// Animation with custom fonts
initializeFonts().then(() => {
  utils.animate((time_ms) => {
    const titleFont = utils.fonts['Playfair Display'] 
      ? 'Playfair Display, serif' 
      : 'Georgia, serif';
      
    utils.drawText('Elegant Title', width/2, height/2, 48, titleFont, '#ffffff');
  });
});
```

## Browser Compatibility

- **Modern browsers**: FontFace API + CSS Font Loading
- **Legacy browsers**: CSS injection + timeout/measurement fallback
- **Server-side**: Graceful degradation (fonts load on client)

## Benefits of This Approach

1. **No API Dependencies**: Direct CSS loading is reliable
2. **Performance**: Optimized font loading with display:swap
3. **Compatibility**: Works across all browsers
4. **Simplicity**: Minimal backend complexity
5. **Reliability**: Google Fonts CDN is highly available
6. **Flexibility**: Supports both Google Fonts and custom fonts

This implementation provides a robust, performant font loading system that the AI can use seamlessly while maintaining excellent fallback behavior. 