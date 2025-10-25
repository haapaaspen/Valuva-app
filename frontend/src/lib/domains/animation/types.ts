/**
 * Animation domain types
 */

export interface AnimationData {
	code: string;
	duration: number; // seconds
	title?: string;
}

export interface CacheStats {
	size: number;
	maxSize: number;
}

