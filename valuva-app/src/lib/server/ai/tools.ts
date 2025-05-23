import { z } from 'zod';
import { tool } from 'ai';

export const generateCanvasGraphics = tool({
	description: 'Generate JavaScript code for canvas-based graphics and animations. This creates high-quality, professional graphics that will be executed on a 4K canvas (1920x1080) with timeline controls.',
	parameters: z.object({
		graphicsCode: z.string().describe('Complete JavaScript code for canvas graphics. Must use utils.animate() for animations and include sophisticated visual effects.'),
		duration: z.number().min(1).max(60).describe('Animation duration in seconds (1-60). Choose based on complexity: simple=3-5s, complex=5-10s, ambient=10-30s'),
		title: z.string().describe('Brief title describing the graphics (e.g., "Particle Explosion", "Corporate Logo Animation")')
	}),
	execute: async ({ graphicsCode, duration, title }) => {
		console.log('AI used tool generateCanvasGraphics:', { graphicsCode, title, duration });
		
		// Return the graphics data in a format that the client can use
		return {
			success: true,
			type: 'canvas_graphics',
			data: {
				code: graphicsCode,
				duration: duration,
				title: title,
				timestamp: new Date().toISOString()
			}
		};
	}
});

export const webfontloadertool = tool({
	description: 'Load Google Fonts using webfontloadertool for canvas graphics. Specify font families with optional weights and subsets.',
	parameters: z.object({
		families: z.array(z.string()).describe('Array of Google Font family names with optional weights (e.g., ["Inter:400,700", "Playfair Display:400,600,900", "Roboto Mono"])')
	}),
	execute: async ({ families }) => {
		console.log('AI uses webfontloadertool tool with families:', families);
		
		try {
			// The tool doesn't actually load fonts server-side, but returns instructions
			// for the client-side code to load them using webfontloader
			
			// Validate and format font families
			const formattedFamilies = families.map(family => {
				// Clean up the family string and ensure proper format
				return family.trim();
			});
			
			// Extract just the font names for reference (without weights)
			const fontNames = formattedFamilies.map(family => {
				return family.split(':')[0].trim();
			});
			
			return {
				success: true,
				type: 'fonts_specified',
				data: {
					families: formattedFamilies,
					fontNames: fontNames,
					webfontLoaderCode: generateWebFontLoaderCode(formattedFamilies),
					message: `Specified ${formattedFamilies.length} font families for loading: ${fontNames.join(', ')}`
				}
			};
		} catch (error) {
			console.error('Webfontloader tool error:', error);
			
			return {
				success: false,
				type: 'fonts_error',
				data: {
					error: error instanceof Error ? error.message : 'Unknown error occurred',
					families: families,
					message: 'Failed to process font families. Please check the format.'
				}
			};
		}
	}
});

// Helper function to generate webfontloadertool code
function generateWebFontLoaderCode(families: string[]): string {
	const familiesString = families.map(f => `'${f}'`).join(',\n                ');
	
	return `// Load webfontloadertool via CDN
const script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
script.onload = function() {
    WebFont.load({
        google: {
            families: [
                ${familiesString}
            ]
        },
        active: function() {
            console.log('Fonts loaded successfully');
            startAnimation();
        },
        inactive: function() {
            console.log('Fonts failed to load, using fallbacks');
            startAnimation();
        }
    });
};
document.head.appendChild(script);`;
}

export const tools = {
	generateCanvasGraphics,
	webfontloadertool
}; 