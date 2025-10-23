export const fps = 60;
export const tick_ms = 1000 / fps;




export function quantizeTime(time_ms: number): number {
	const frameNumber = Math.round(time_ms / tick_ms);
	return frameNumber * tick_ms;
}

export function timeToFrame(time_ms: number): number {
	return Math.round(time_ms / tick_ms);
}

export function frameToTime(frame: number): number {
	return frame * tick_ms;
}

class Timeline {
	isPlaying = $state(false);
	isExporting = $state(false);
	exportProgress = $state(0);
	
	#time = $state(0);
	
	get currentTime_ms() {
		return this.#time;
	}
	
	set currentTime_ms(time_ms: number) {
		this.#time = quantizeTime(time_ms);
	}
}

export const timeline = new Timeline();