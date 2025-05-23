// Font utilities for canvas graphics
// Handles Google Fonts loading and custom font management
// Enhanced with Google Fonts Developer API for validation and metadata

export interface FontConfig {
  family: string;
  weights?: string[];
  subsets?: string[];
}

export interface GoogleFontData {
  family: string;
  variants: string[];
  subsets: string[];
  category: string;
  files: Record<string, string>;
  version: string;
  lastModified: string;
  axes?: Array<{
    tag: string;
    start: number;
    end: number;
  }>;
}

export interface FontMetadata {
  isValid: boolean;
  category?: string;
  availableVariants?: string[];
  availableSubsets?: string[];
  isVariableFont?: boolean;
  axes?: Array<{ tag: string; start: number; end: number }>;
  files?: Record<string, string>;
}

export class FontManager {
  private loadedFonts: Set<string> = new Set();
  private fontPromises: Map<string, Promise<void>> = new Map();
  private fontCache: Map<string, GoogleFontData> = new Map();
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  /**
   * Set Google Fonts API key for enhanced features
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Get font metadata from Google Fonts API
   */
  async getFontMetadata(fontFamily: string): Promise<FontMetadata> {
    if (!this.apiKey) {
      return { isValid: true }; // Assume valid if no API key
    }

    try {
      // Check cache first
      const cachedFont = this.fontCache.get(fontFamily);
      if (cachedFont) {
        return this._convertToMetadata(cachedFont);
      }

      // Query Google Fonts API
      const encodedFamily = encodeURIComponent(fontFamily);
      const url = `https://www.googleapis.com/webfonts/v1/webfonts?family=${encodedFamily}&key=${this.apiKey}&capability=VF`;
      
      const response = await fetch(url);
      if (!response.ok) {
        return { isValid: false };
      }

      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        return { isValid: false };
      }

      const fontData = data.items[0] as GoogleFontData;
      this.fontCache.set(fontFamily, fontData);
      
      return this._convertToMetadata(fontData);
    } catch (error) {
      console.warn(`Failed to fetch font metadata for ${fontFamily}:`, error);
      return { isValid: true }; // Graceful fallback
    }
  }

  /**
   * Validate font and get suggestions for similar fonts
   */
  async validateFont(fontFamily: string): Promise<{
    isValid: boolean;
    suggestions?: string[];
    metadata?: FontMetadata;
  }> {
    const metadata = await this.getFontMetadata(fontFamily);
    
    if (metadata.isValid) {
      return { isValid: true, metadata };
    }

    // If font is invalid, try to find similar fonts
    const suggestions = await this._findSimilarFonts(fontFamily);
    return { isValid: false, suggestions };
  }

  /**
   * Load Google Font using CSS API with validation
   * Examples:
   * - 'Playfair Display' -> loads regular weight
   * - 'Playfair Display:400,700' -> loads specific weights
   * - 'Inter:300,400,600' -> loads multiple weights
   */
  async loadGoogleFont(fontSpec: string): Promise<void> {
    if (this.loadedFonts.has(fontSpec)) {
      return; // Already loaded
    }

    // Check if we're already loading this font
    const existingPromise = this.fontPromises.get(fontSpec);
    if (existingPromise) {
      return existingPromise;
    }

    const promise = this._loadGoogleFontImpl(fontSpec);
    this.fontPromises.set(fontSpec, promise);
    
    try {
      await promise;
      this.loadedFonts.add(fontSpec);
    } catch (error) {
      this.fontPromises.delete(fontSpec);
      throw error;
    }
  }

  private async _loadGoogleFontImpl(fontSpec: string): Promise<void> {
    // Parse font specification
    const [fontFamily, weights] = fontSpec.split(':');
    
    // Validate font if API key is available
    if (this.apiKey) {
      const validation = await this.validateFont(fontFamily);
      if (!validation.isValid) {
        const suggestions = validation.suggestions?.join(', ') || 'none';
        throw new Error(`Font "${fontFamily}" not found. Similar fonts: ${suggestions}`);
      }
    }

    const encodedFamily = encodeURIComponent(fontFamily);
    
    // Construct Google Fonts CSS URL
    let fontUrl = `https://fonts.googleapis.com/css2?family=${encodedFamily}`;
    
    if (weights) {
      fontUrl += `:wght@${weights.replace(/,/g, ';')}`;
    }
    
    fontUrl += '&display=swap'; // Add font-display: swap for better performance

    return this._injectFontCSS(fontUrl, fontFamily);
  }

  /**
   * Load custom font from URL
   */
  async loadCustomFont(fontName: string, fontUrl: string): Promise<void> {
    if (this.loadedFonts.has(fontName)) {
      return;
    }

    const existingPromise = this.fontPromises.get(fontName);
    if (existingPromise) {
      return existingPromise;
    }

    const promise = this._loadCustomFontImpl(fontName, fontUrl);
    this.fontPromises.set(fontName, promise);
    
    try {
      await promise;
      this.loadedFonts.add(fontName);
    } catch (error) {
      this.fontPromises.delete(fontName);
      throw error;
    }
  }

  private async _loadCustomFontImpl(fontName: string, fontUrl: string): Promise<void> {
    // Create CSS for custom font
    const fontFace = `
      @font-face {
        font-family: '${fontName}';
        src: url('${fontUrl}') format('woff2'),
             url('${fontUrl.replace('.woff2', '.woff')}') format('woff');
        font-display: swap;
      }
    `;

    return this._injectFontCSS(fontFace, fontName, true);
  }

  private async _injectFontCSS(cssContent: string, fontFamily: string, isInline = false): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof document === 'undefined') {
        // Server-side rendering - fonts will load on client
        resolve();
        return;
      }

      const link = document.createElement(isInline ? 'style' : 'link');
      
      if (isInline) {
        (link as HTMLStyleElement).textContent = cssContent;
        document.head.appendChild(link);
        
        // Wait for font to load using FontFace API
        if ('fonts' in document) {
          document.fonts.ready.then(() => {
            // Additional check to ensure specific font is loaded
            this._waitForSpecificFont(fontFamily).then(resolve).catch(reject);
          });
        } else {
          // Fallback for older browsers
          setTimeout(resolve, 100);
        }
      } else {
        (link as HTMLLinkElement).rel = 'stylesheet';
        (link as HTMLLinkElement).href = cssContent;
        
        link.onload = () => {
          this._waitForSpecificFont(fontFamily).then(resolve).catch(reject);
        };
        
        link.onerror = () => {
          reject(new Error(`Failed to load font: ${fontFamily}`));
        };
        
        document.head.appendChild(link);
      }
    });
  }

  private async _waitForSpecificFont(fontFamily: string): Promise<void> {
    if (typeof document === 'undefined') {
      return;
    }

    // Use FontFace API if available
    if ('fonts' in document) {
      try {
        await document.fonts.load(`16px "${fontFamily}"`);
        return;
      } catch (error) {
        console.warn(`FontFace API failed for ${fontFamily}:`, error);
      }
    }

    // Fallback: canvas text measurement technique
    return this._measureFontLoad(fontFamily);
  }

  private async _measureFontLoad(fontFamily: string): Promise<void> {
    const testString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const fallbackFont = 'Arial';
    const fontSize = 16;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Measure with fallback font
    ctx.font = `${fontSize}px ${fallbackFont}`;
    const fallbackWidth = ctx.measureText(testString).width;

    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    return new Promise((resolve) => {
      const checkFont = () => {
        ctx.font = `${fontSize}px "${fontFamily}", ${fallbackFont}`;
        const currentWidth = ctx.measureText(testString).width;

        if (currentWidth !== fallbackWidth || attempts >= maxAttempts) {
          resolve();
        } else {
          attempts++;
          setTimeout(checkFont, 100);
        }
      };

      checkFont();
    });
  }

  /**
   * Wait for all queued fonts to finish loading
   */
  async waitForAllFonts(): Promise<void> {
    const promises = Array.from(this.fontPromises.values());
    await Promise.allSettled(promises);
  }

  /**
   * Check if a font is loaded and available
   */
  isFontLoaded(fontFamily: string): boolean {
    return this.loadedFonts.has(fontFamily);
  }

  /**
   * Get all loaded fonts
   */
  getLoadedFonts(): string[] {
    return Array.from(this.loadedFonts);
  }

  /**
   * Search Google Fonts by category, popularity, or name
   */
  async searchFonts(options: {
    category?: 'serif' | 'sans-serif' | 'monospace' | 'display' | 'handwriting';
    sort?: 'alpha' | 'date' | 'popularity' | 'style' | 'trending';
    limit?: number;
  } = {}): Promise<GoogleFontData[]> {
    if (!this.apiKey) {
      throw new Error('API key required for font search');
    }

    try {
      let url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${this.apiKey}`;
      
      if (options.category) {
        url += `&category=${options.category}`;
      }
      
      if (options.sort) {
        url += `&sort=${options.sort}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Font search failed: ${response.statusText}`);
      }

      const data = await response.json();
      const fonts = data.items as GoogleFontData[];
      
      // Cache the results
      fonts.forEach(font => {
        this.fontCache.set(font.family, font);
      });

      return options.limit ? fonts.slice(0, options.limit) : fonts;
    } catch (error) {
      console.error('Font search failed:', error);
      throw error;
    }
  }

  /**
   * Get popular fonts by category
   */
  async getPopularFonts(category?: string, limit = 20): Promise<string[]> {
    try {
      const fonts = await this.searchFonts({
        category: category as any,
        sort: 'popularity',
        limit
      });
      
      return fonts.map(font => font.family);
    } catch (error) {
      // Return fallback popular fonts if API fails
      const fallbackFonts = {
        'serif': ['Playfair Display', 'Lora', 'Crimson Text', 'Libre Baskerville'],
        'sans-serif': ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins'],
        'monospace': ['JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Roboto Mono'],
        'display': ['Abril Fatface', 'Righteous', 'Fredoka One', 'Bebas Neue'],
        'handwriting': ['Dancing Script', 'Pacifico', 'Kaushan Script', 'Shadows Into Light']
      };
      
      return fallbackFonts[category as keyof typeof fallbackFonts] || fallbackFonts['sans-serif'];
    }
  }

  private async _findSimilarFonts(targetFont: string): Promise<string[]> {
    try {
      // Get fonts from the same category or similar style
      const allFonts = await this.searchFonts({ sort: 'popularity', limit: 50 });
      
      // Simple similarity matching based on name
      const similar = allFonts
        .filter(font => {
          const similarity = this._calculateSimilarity(targetFont.toLowerCase(), font.family.toLowerCase());
          return similarity > 0.3;
        })
        .sort((a, b) => {
          const simA = this._calculateSimilarity(targetFont.toLowerCase(), a.family.toLowerCase());
          const simB = this._calculateSimilarity(targetFont.toLowerCase(), b.family.toLowerCase());
          return simB - simA;
        })
        .slice(0, 5)
        .map(font => font.family);

      return similar.length > 0 ? similar : ['Inter', 'Roboto', 'Open Sans']; // Fallback suggestions
    } catch (error) {
      return ['Inter', 'Roboto', 'Open Sans']; // Safe fallbacks
    }
  }

  private _calculateSimilarity(str1: string, str2: string): number {
    // Simple Levenshtein distance-based similarity
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this._levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private _levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i += 1) {
      matrix[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j += 1) {
      matrix[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private _convertToMetadata(fontData: GoogleFontData): FontMetadata {
    return {
      isValid: true,
      category: fontData.category,
      availableVariants: fontData.variants,
      availableSubsets: fontData.subsets,
      isVariableFont: !!fontData.axes,
      axes: fontData.axes,
      files: fontData.files
    };
  }
}

// Singleton instance for global use
export const fontManager = new FontManager();

// Enhanced factory function for creating FontManager with API key
export function createFontManager(apiKey?: string): FontManager {
  return new FontManager(apiKey);
}

// Utility function to configure the global font manager
export function configureFontManager(apiKey: string): void {
  fontManager.setApiKey(apiKey);
} 