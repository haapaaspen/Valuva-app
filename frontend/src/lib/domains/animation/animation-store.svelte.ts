/**
 * Animation Store - Centralized state for all animation-related data
 * Consolidates previous animation.svelte.ts and timeline.svelte.ts
 */

import defaultAnimation from "$lib/test-graphics/artistic-typography-what-do-you-want-to-create.js?raw";

export const animation = $state({
	code: defaultAnimation,
	duration: 8000, // milliseconds
	width: 1920,
	height: 1080,
	title: "Default Animation",
});

export const timeline = $state({
	currentTime: 0, // milliseconds
	isPlaying: false,
});

export const exportState = $state({
	isExporting: false,
	progress: 0,
});

export const FPS = 60;
export const TICK_MS = 1000 / FPS;

export function quantizeTime(time_ms: number): number {
	const frameNumber = Math.round(time_ms / TICK_MS);
	return frameNumber * TICK_MS;
}

export function timeToFrame(time_ms: number): number {
	return Math.round(time_ms / TICK_MS);
}

export function frameToTime(frame: number): number {
	return frame * TICK_MS;
}

