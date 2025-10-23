import { animation } from "$lib/hooks/animation.svelte";
import { timeToFrame } from "$lib/hooks/timeline.svelte";

type RenderFunction = (
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	width: number,
	height: number,
	current_time_ms: number,
) => void;

/**
 * RenderService - Handles animation compilation, rendering, and frame caching
 * Decouples rendering logic from UI components
 */
export class RenderService {
	private frameCache = new Map<number, ImageData>();
	private renderFn: RenderFunction | null = null;
	private readonly CACHE_SIZE = 10000;

	/**
	 * Compile animation code into executable function
	 */
	compileAnimation(code: string): boolean {
		this.clearCache();

		try {
			this.renderFn = new Function(
				"ctx",
				"canvas",
				"width",
				"height",
				"current_time_ms",
				`'use strict';\n${code}`,
			) as RenderFunction;

			console.log("[RenderService] Animation compiled successfully");
			return true;
		} catch (error) {
			console.error("[RenderService] Failed to compile animation:", error);
			this.renderFn = null;
			return false;
		}
	}

	/**
	 * Get a rendered frame for a specific time
	 * Uses cache if available, renders if not
	 */
	getFrame(time_ms: number, canvas: HTMLCanvasElement): ImageData | null {
		if (!this.renderFn) {
			console.warn("[RenderService] No render function available");
			return null;
		}

		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) {
			console.error("[RenderService] Could not get canvas context");
			return null;
		}

		const frameKey = timeToFrame(time_ms);

		// Check cache first
		const cached = this.frameCache.get(frameKey);
		if (cached) {
			return cached;
		}

		// Render new frame
		try {
			this.renderFn(
				ctx,
				canvas,
				animation.width,
				animation.height,
				time_ms,
			);

			// Cache the frame
			const imageData = ctx.getImageData(
				0,
				0,
				animation.width,
				animation.height,
			);

			if (this.frameCache.size < this.CACHE_SIZE) {
				this.frameCache.set(frameKey, imageData);
			}

			return imageData;
		} catch (error) {
			console.error("[RenderService] Render error:", error);
			return null;
		}
	}

	/**
	 * Clear frame cache
	 */
	clearCache(): void {
		this.frameCache.clear();
		console.log("[RenderService] Cache cleared");
	}

	/**
	 * Get cache statistics
	 */
	getCacheStats() {
		return {
			size: this.frameCache.size,
			maxSize: this.CACHE_SIZE,
		};
	}

	/**
	 * Check if render function is available
	 */
	isReady(): boolean {
		return this.renderFn !== null;
	}
}

// Singleton instance
export const renderService = new RenderService();

