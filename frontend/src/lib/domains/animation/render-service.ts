/**
 * Render Service - Handles animation compilation, rendering, and frame caching
 * Simple frame renderer - just renders frames on request
 */

import type { AnimationService } from './animation-service';
import type { CacheStats } from './types';

const FPS = 60;
const TICK_MS = 1000 / FPS;

function timeToFrame(time_ms: number): number {
	return Math.round(time_ms / TICK_MS);
}

type RenderFunction = (
	ctx: CanvasRenderingContext2D,
	canvas: HTMLCanvasElement,
	width: number,
	height: number,
	current_time_ms: number,
) => void;

export class RenderService {
	private frameCache = new Map<number, ImageData>();
	private renderFn: RenderFunction | null = null;
	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private readonly CACHE_SIZE = 10000;

	constructor(private animationService: AnimationService) {}

	/**
	 * Set canvas and context (called from canvas component on mount)
	 */
	setCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
		this.canvas = canvas;
		this.ctx = ctx;
		console.log('[RenderService] Canvas context set');
	}

	/**
	 * Compile animation code into executable function
	 */
	compile(code: string): boolean {
		this.clearCache();

		try {
			this.renderFn = new Function(
				'ctx',
				'canvas',
				'width',
				'height',
				'current_time_ms',
				`'use strict';\n${code}`,
			) as RenderFunction;

			console.log('[RenderService] Animation compiled successfully');
			return true;
		} catch (error) {
			console.error('[RenderService] Failed to compile animation:', error);
			this.renderFn = null;
			return false;
		}
	}


	/**
	 * Render a specific frame at the given time
	 */
	renderFrame(time_ms: number): boolean {
		if (!this.renderFn || !this.canvas || !this.ctx) {
			return false;
		}

		const frameKey = timeToFrame(time_ms);

		// Check cache first
		const cached = this.frameCache.get(frameKey);
		if (cached) {
			this.ctx.putImageData(cached, 0, 0);
			return true;
		}

		// Render new frame
		try {
			this.renderFn(
				this.ctx,
				this.canvas,
				this.animationService.width,
				this.animationService.height,
				time_ms,
			);

			// Cache the frame
			const imageData = this.ctx.getImageData(0, 0, this.animationService.width, this.animationService.height);

			if (this.frameCache.size < this.CACHE_SIZE) {
				this.frameCache.set(frameKey, imageData);
			}

			return true;
		} catch (error) {
			console.error('[RenderService] Render error:', error);
			return false;
		}
	}

	/**
	 * Get a rendered frame for a specific time (for export)
	 */
	getFrame(time_ms: number, canvas: HTMLCanvasElement): ImageData | null {
		if (!this.renderFn) {
			console.warn('[RenderService] No render function available');
			return null;
		}

		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) {
			console.error('[RenderService] Could not get canvas context');
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
			this.renderFn(ctx, canvas, this.animationService.width, this.animationService.height, time_ms);

			// Cache the frame
			const imageData = ctx.getImageData(0, 0, this.animationService.width, this.animationService.height);

			if (this.frameCache.size < this.CACHE_SIZE) {
				this.frameCache.set(frameKey, imageData);
			}

			return imageData;
		} catch (error) {
			console.error('[RenderService] Render error:', error);
			return null;
		}
	}

	/**
	 * Clear frame cache
	 */
	clearCache(): void {
		this.frameCache.clear();
		console.log('[RenderService] Cache cleared');
	}

	/**
	 * Get cache statistics
	 */
	getCacheStats(): CacheStats {
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

