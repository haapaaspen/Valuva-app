<script lang="ts">
	import { onMount } from "svelte";
	import {
		animation,
		timeline,
	} from "$lib/domains/animation/animation-store.svelte";
	import { renderService } from "$lib/domains/animation/render-service";

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	onMount(() => {
		ctx = canvas.getContext("2d", { willReadFrequently: true })!;
		renderService.setCanvas(canvas, ctx);

		// Initial clear
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, animation.width, animation.height);
	});

	// Watch the animation.code for changes and recompile
	$effect(() => {
		const code = animation.code;

		const success = renderService.compile(code);

		if (!success && ctx) {
			// Clear canvas on compilation error
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, animation.width, animation.height);
		}
	});

	// Rendering loop - display frames from RenderService
	$effect(() => {
		if (!ctx || !canvas) return;

		renderService.renderFrame(timeline.currentTime);
	});

	// Playback control
	$effect(() => {
		if (timeline.isPlaying) {
			renderService.startPlayback();
		} else {
			renderService.stopPlayback();
		}

		return () => {
			renderService.stopPlayback();
		};
	});
</script>

<div class="relative">
	<canvas
		bind:this={canvas}
		width={animation.width}
		height={animation.height}
		style="width: 100%; display: block;"
		class="rounded-lg"
	></canvas>
</div>
