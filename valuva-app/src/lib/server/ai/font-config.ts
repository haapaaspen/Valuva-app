// Font configuration with Google Fonts API key
import { GOOGLE_API_KEY } from '$env/static/private';
import { fontManager, configureFontManager, type FontMetadata, type GoogleFontData } from './font-utils';

// Configure the font manager with the API key from environment
if (GOOGLE_API_KEY) {
  configureFontManager(GOOGLE_API_KEY);
  console.log('Google Fonts API configured with enhanced features');
} else {
  console.warn('GOOGLE_API_KEY not found in environment. Font system will work with basic CSS loading only.');
}

// Export the configured font manager and types
export { fontManager, type FontMetadata, type GoogleFontData };
export const isGoogleFontsApiConfigured = !!GOOGLE_API_KEY; 