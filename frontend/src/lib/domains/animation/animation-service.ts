/**
 * Animation Service - Business logic for animation management
 * Centralized control for all animation operations
 */

import { animation, timeline, quantizeTime } from './animation-store.svelte';
import { renderService } from './render-service';
import type { AnimationData } from './types';

export class AnimationService {
	/**
	 * Load animation from AI-generated graphics
	 */
	static loadFromAI(data: AnimationData): void {
		animation.code = data.code;
		animation.duration = data.duration * 1000; // convert to ms
		animation.title = data.title || 'Untitled Animation';

		// Reset timeline when new animation loads
		this.stop();
		this.seek(0);

		// Compile the new animation
		renderService.compile(data.code);

		console.log('[AnimationService] Loaded animation:', {
			title: animation.title,
			duration: data.duration,
			codeLength: data.code.length,
		});
	}

	/**
	 * Play animation
	 */
	static play(): void {
		timeline.isPlaying = true;
		console.log('[AnimationService] Playing');
	}

	/**
	 * Pause animation
	 */
	static pause(): void {
		timeline.isPlaying = false;
		console.log('[AnimationService] Paused');
	}

	/**
	 * Stop animation (pause and reset to start)
	 */
	static stop(): void {
		timeline.isPlaying = false;
		timeline.currentTime = 0;
		console.log('[AnimationService] Stopped');
	}

	/**
	 * Toggle play/pause
	 */
	static togglePlayPause(): void {
		if (timeline.isPlaying) {
			this.pause();
		} else {
			this.play();
		}
	}

	/**
	 * Seek to specific time
	 */
	static seek(time_ms: number): void {
		timeline.currentTime = quantizeTime(time_ms);
	}

	/**
	 * TODO: Validate animation data
	 */
	static validate(data: AnimationData): boolean {
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

