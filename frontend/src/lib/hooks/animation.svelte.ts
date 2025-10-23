import defaultAnimation from "$lib/test-graphics/artistic-typography-what-do-you-want-to-create.js?raw";

/**
 * Animation state - single source of truth for animation properties
 * Rendering logic is handled by RenderService
 */
export const animation = $state({
	duration: 8000,
	code: "",
	width: 1920,
	height: 1080,
	title: "Default Animation",
});
