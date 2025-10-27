/**
 * Timeline State - Shared reactive state for playback
 */

class TimelineState {
	currentTime = $state(0); // milliseconds
	isPlaying = $state(false);
}

export const timelineState = new TimelineState();
