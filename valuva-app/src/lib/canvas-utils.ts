// Canvas utilities for AI graphics generation
// Streamlined to only essential functions the AI actually uses

// Client-safe font manager (no server dependencies)
class ClientFontManager {
  private loadedFonts: Set<string> = new Set();
  private fontPromises: Map<string, Promise<void>> = new Map();

  async loadGoogleFont(fontSpec: string): Promise<void> {
    if (this.loadedFonts.has(fontSpec)) {
      return; // Already loaded
    }

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

  async waitForAllFonts(): Promise<void> {
    if (typeof document === 'undefined') return;
    
    try {
      await document.fonts.ready;
    } catch (error) {
      console.warn('Error waiting for fonts:', error);
    }
  }

  isLoaded(fontName: string): boolean {
    const baseName = fontName.split(':')[0];
    return this.loadedFonts.has(fontName) || this.loadedFonts.has(baseName);
  }

  private async _loadGoogleFontImpl(fontSpec: string): Promise<void> {
    if (typeof document === 'undefined') {
      return; // Server-side rendering
    }

    // Parse font specification (e.g., "Inter:400,600,700" or "Playfair Display")
    const [fontFamily, weights = '400'] = fontSpec.split(':');
    const encodedFamily = encodeURIComponent(fontFamily);
    
    // Construct Google Fonts CSS URL
    let cssUrl: string;
    if (weights && weights !== '400') {
      const weightList = weights.split(',').join(';');
      cssUrl = `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightList}&display=swap`;
    } else {
      cssUrl = `https://fonts.googleapis.com/css2?family=${encodedFamily}&display=swap`;
    }

    return this._injectFontCSS(cssUrl, fontFamily);
  }

  private async _injectFontCSS(cssContent: string, fontFamily: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof document === 'undefined') {
        resolve();
        return;
      }

      const element = document.createElement('link');
      element.rel = 'stylesheet';
      element.href = cssContent;
      
      element.onload = () => {
        this._waitForSpecificFont(fontFamily).then(resolve).catch(reject);
      };
      
      element.onerror = () => {
        reject(new Error(`Failed to load font: ${fontFamily}`));
      };
      
      document.head.appendChild(element);
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

    // Fallback: short timeout for most cases
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Create a singleton instance
const clientFontManager = new ClientFontManager();

export interface CanvasUtils {
  // Animation
  animate: (drawFunction: (time_ms: number) => void) => void;
  
  // Font loading (essential only)
  loadGoogleFont: (fontFamily: string) => Promise<void>;
  waitForFonts: () => Promise<void>;
  fonts: Record<string, boolean>;
  
  // Graphics utilities
  createGradient: (type: 'linear' | 'radial', ...args: number[]) => CanvasGradient;
}

export function createCanvasUtils(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): CanvasUtils {
  const loadedFonts: Record<string, boolean> = {};
  
  return {
    // Animation system
    animate(drawFunction: (time_ms: number) => void) {
      let animationId: number;
      
      const animate = (timestamp: number) => {
        drawFunction(timestamp);
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
      
      // Return cleanup function (could be stored if needed)
      return () => cancelAnimationFrame(animationId);
    },

    // Font loading
    async loadGoogleFont(fontFamily: string) {
      await clientFontManager.loadGoogleFont(fontFamily);
      // Extract base font name (remove weight specification)
      const baseName = fontFamily.split(':')[0];
      loadedFonts[baseName] = true;
    },

    async waitForFonts() {
      await clientFontManager.waitForAllFonts();
    },

    get fonts() {
      return { ...loadedFonts };
    },

    // Graphics utilities
    createGradient(type: 'linear' | 'radial', ...args: number[]) {
      if (type === 'linear') {
        const [x1 = 0, y1 = 0, x2 = canvas.width, y2 = canvas.height] = args;
        return ctx.createLinearGradient(x1, y1, x2, y2);
      } else {
        const [x1 = canvas.width/2, y1 = canvas.height/2, r1 = 0, x2 = canvas.width/2, y2 = canvas.height/2, r2 = 100] = args;
        return ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
      }
    }
  };
} 