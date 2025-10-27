/**
 * Animation Service - Business logic for animation management
 * Handles file operations and animation data validation
 * State is owned externally for reactivity
 */

import type { AnimationData } from './types';

type AnimationState = {
	code: string;
	duration: number;
	width: number;
	height: number;
	title: string;
};

export class AnimationService {
	constructor(private state: AnimationState) {}

	// Getters for accessing state
	get code() { return this.state.code; }
	get duration() { return this.state.duration; }
	get width() { return this.state.width; }
	get height() { return this.state.height; }
	get title() { return this.state.title; }

	/**
	 * Load animation from AI-generated graphics
	 */
	loadFromAI(data: AnimationData): void {
		if (!this.validate(data)) {
			console.error('[AnimationService] Validation failed');
			return;
		}

		this.state.code = data.code;
		this.state.duration = data.duration * 1000; // convert to ms
		this.state.title = data.title || 'Untitled Animation';

		console.log('[AnimationService] Loaded animation:', {
			title: this.state.title,
			duration: data.duration,
			codeLength: data.code.length,
		});
	}

	/**
	 * TODO: Real validation
	 */
	private validate(data: AnimationData): boolean {
		if (!data.code || data.code.trim().length === 0) {
			console.error('[AnimationService] Invalid code');
			return false;
		}

		if (data.duration <= 0 || data.duration > 60) {
			console.error('[AnimationService] Invalid duration');
			return false;
		}

		return true;
	}
}
