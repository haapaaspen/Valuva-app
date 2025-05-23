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

export const tools = {
	generateCanvasGraphics
}; 