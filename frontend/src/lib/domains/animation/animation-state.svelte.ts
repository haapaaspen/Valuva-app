/**
 * Animation State - Shared reactive state for animation data
 */

import defaultAnimation from "$lib/test-graphics/artistic-typography-what-do-you-want-to-create.js?raw";

class AnimationState {
	code = $state("");
	duration = $state(8000); // milliseconds
	width = $state(1920);
	height = $state(1080);
	title = $state("Default Animation");
}

export const animationState = new AnimationState();

