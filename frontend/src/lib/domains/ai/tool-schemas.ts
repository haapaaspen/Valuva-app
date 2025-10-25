/**
 * Shared AI tool schemas
 * Can be used by both client and server
 */

import { z } from 'zod';

export const graphicsSchema = z.object({
	graphicsCode: z.string().describe('JavaScript code for canvas graphics and animations.'),
	duration: z.number().min(1).max(60).describe('Animation duration in seconds.'),
	title: z.string().describe('Brief title describing the graphics'),
});

export type GraphicsToolParams = z.infer<typeof graphicsSchema>;

