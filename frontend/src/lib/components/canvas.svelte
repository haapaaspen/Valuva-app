<script lang="ts">
	import { onMount } from "svelte";
	import { renderService } from "$lib/domains/animation/instances";
	import { animationState } from "$lib/domains/animation/animation-state.svelte";
	import { timelineState } from "$lib/domains/animation/timeline-state.svelte";

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	onMount(() => {
		ctx = canvas.getContext("2d", { willReadFrequently: true })!;
		renderService.setCanvas(canvas, ctx);

		// Initial clear
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, animationState.width, animationState.height);

		// If already compiled (e.g., code loaded before mount), render initial frame immediately
		if (renderService.isReady()) {
			renderService.renderFrame(timelineState.currentTime);
		}
	});

	// Watch the animation.code for changes and recompile
	$effect(() => {
		const code = animationState.code;

		const success = renderService.compile(code);

		if (!success && ctx) {
			// Clear canvas on compilation error
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, animationState.width, animationState.height);
		}

		// After a successful compile and when context is ready, render the initial frame
		if (success && ctx) {
			renderService.renderFrame(timelineState.currentTime);
		}
	});

	// Rendering loop - display frames from RenderService
	$effect(() => {
		if (!ctx || !canvas) return;

		renderService.renderFrame(timelineState.currentTime);
	});
</script>

<div class="relative">
	<canvas
		bind:this={canvas}
		width={animationState.width}
		height={animationState.height}
		style="width: 100%; display: block;"
		class="rounded-lg"
	></canvas>
</div>
