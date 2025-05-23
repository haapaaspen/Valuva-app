// Test file to verify Google Fonts API configuration
import { fontManager, isGoogleFontsApiConfigured } from './font-config';

export async function testFontConfiguration() {
  console.log('🔍 Testing Google Fonts API configuration...');
  console.log(`API configured: ${isGoogleFontsApiConfigured}`);
  
  if (isGoogleFontsApiConfigured) {
    try {
      // Test font validation
      console.log('Testing font validation...');
      const validation = await fontManager.validateFont('Inter');
      console.log('✅ Font validation result:', validation);
      
      // Test popular fonts retrieval
      console.log('Testing popular fonts retrieval...');
      const popularFonts = await fontManager.getPopularFonts('serif', 3);
      console.log('✅ Popular serif fonts:', popularFonts);
      
      // Test font search
      console.log('Testing font search...');
      const searchResults = await fontManager.searchFonts({
        category: 'sans-serif',
        sort: 'popularity',
        limit: 3
      });
      console.log('✅ Font search results:', searchResults.map(f => f.family));
      
      console.log('🎉 All Google Fonts API features working correctly!');
      return true;
    } catch (error) {
      console.error('❌ Google Fonts API test failed:', error);
      return false;
    }
  } else {
    console.log('⚠️  Google Fonts API not configured. Basic font loading will work.');
    console.log('   Add GOOGLE_API_KEY to environment variables to enable enhanced features.');
    return false;
  }
}

// Auto-run test in development
if (process.env.NODE_ENV === 'development') {
  testFontConfiguration().catch(console.error);
} 