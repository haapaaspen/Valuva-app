import { animation } from "$lib/hooks/animation.svelte";
import { timeline } from "$lib/hooks/timeline.svelte";
import defaultAnimation from "$lib/test-graphics/default-animation.js?raw";

/**
 * Service layer for animation management
 * Encapsulates all business logic for animation state updates
 */
export class AnimationService {
	/**
	 * Update animation from AI-generated graphics
	 */
	static updateFromAITool(code: string, durationSeconds: number, title?: string): void {
		animation.code = code;
		animation.duration = durationSeconds * 1000;
		animation.title = title || "Untitled Animation"; // Add this
		
		// Reset timeline to beginning when new animation loads
		timeline.currentTime_ms = 0;
		timeline.isPlaying = false;
		
		console.log('[AnimationService] Updated animation:', {
			title: animation.title,
			duration: durationSeconds,
			codeLength: code.length
		});
	}

	/**
	 * Reset animation to default state
	 */
	static reset(): void {
		animation.code = defaultAnimation;
		animation.duration = 8000;
		console.log('[AnimationService] Reset to default');
	}

	/**
	 * Validate animation code before applying
	 */
	static validateAndUpdate(code: string, durationSeconds: number): boolean {
		// Add validation logic
		if (!code || code.trim().length === 0) {
			console.error('[AnimationService] Invalid code');
			return false;
		}

		if (durationSeconds <= 0 || durationSeconds > 60) {
			console.error('[AnimationService] Invalid duration');
			return false;
		}

		this.updateFromAITool(code, durationSeconds);
		return true;
	}

	/**
	 * Get current animation metadata
	 */
	static getMetadata() {
		return {
			duration: animation.duration,
			dimensions: { width: animation.width, height: animation.height },
			codeLength: animation.code.length
		};
	}
}
