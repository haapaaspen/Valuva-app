import { z } from 'zod';
import { tool } from 'ai';

export const generateCanvasGraphics = tool({
	description: 'Generate Graphics',
	parameters: z.object({
		graphicsCode: z.string().describe('JavaScript code for canvas graphics and animations.'),
		duration: z.number().min(1).max(60).describe('Animation duration in seconds.'),
		title: z.string().describe('Brief title describing the graphics')
	}),
	execute: async ({ graphicsCode, duration, title }) => {
		console.log('AI used tool generateCanvasGraphics:', { graphicsCode, title, duration });
		
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
	generateCanvasGraphics,
};

