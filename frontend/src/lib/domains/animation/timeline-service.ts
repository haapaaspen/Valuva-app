/**
 * Timeline Service - Handles playback control logic
 * Responsible for play/pause/stop logic and the playback loop
 * State is owned externally for reactivity
 */

import type { AnimationService } from './animation-service';

const FPS = 60;
const TICK_MS = 1000 / FPS;

function quantizeTime(time_ms: number): number {
	const frameNumber = Math.round(time_ms / TICK_MS);
	return frameNumber * TICK_MS;
}

type TimelineState = {
	currentTime: number;
	isPlaying: boolean;
};

export class TimelineService {
	private playbackRafId: number | null = null;

	constructor(
		private animationService: AnimationService,
		private state: TimelineState
	) {}

	/**
	 * Play animation
	 */
	play(): void {
		this.state.isPlaying = true;
		this.startPlayback();
		console.log('[TimelineService] Playing');
	}

	/**
	 * Pause animation
	 */
	pause(): void {
		this.state.isPlaying = false;
		this.stopPlayback();
		console.log('[TimelineService] Paused');
	}

	/**
	 * Stop animation (pause and reset to start)
	 */
	stop(): void {
		this.state.isPlaying = false;
		this.state.currentTime = 0;
		this.stopPlayback();
		console.log('[TimelineService] Stopped');
	}

	/**
	 * Toggle play/pause
	 */
	togglePlayPause(): void {
		if (this.state.isPlaying) {
			this.pause();
		} else {
			this.play();
		}
	}

	/**
	 * Seek to specific time
	 */
	seek(time_ms: number): void {
		this.state.currentTime = quantizeTime(time_ms);
	}

	/**
	 * Start playback loop
	 */
	private startPlayback(): void {
		if (this.playbackRafId !== null) {
			return; // Already playing
		}

		const tick = () => {
			// Advance by one frame
			this.state.currentTime += TICK_MS;

			// Loop at end
			if (this.state.currentTime >= this.animationService.duration) {
				this.state.currentTime = this.state.currentTime % this.animationService.duration;
			}

			this.playbackRafId = requestAnimationFrame(tick);
		};

		this.playbackRafId = requestAnimationFrame(tick);
	}

	/**
	 * Stop playback loop
	 */
	private stopPlayback(): void {
		if (this.playbackRafId !== null) {
			cancelAnimationFrame(this.playbackRafId);
			this.playbackRafId = null;
		}
	}
}
