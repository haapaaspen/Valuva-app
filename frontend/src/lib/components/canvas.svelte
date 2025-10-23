<script lang="ts">
	import { onMount } from "svelte";
	import { animation } from "$lib/hooks/animation.svelte";
	import { tick_ms, timeline } from "$lib/hooks/timeline.svelte";
	import { renderService } from "$lib/services/render-service";

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	onMount(() => {
		ctx = canvas.getContext("2d", { willReadFrequently: true })!;
		// Initial clear
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, animation.width, animation.height);
	});

	// Watch the animation.code for changes and recompile
	$effect(() => {
		const code = animation.code;

		const success = renderService.compileAnimation(code);

		if (!success && ctx) {
			// Clear canvas on compilation error
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, animation.width, animation.height);
		}
	});

	// Rendering loop - just display frames from RenderService
	$effect(() => {
		if (!ctx || !canvas) return;

		const imageData = renderService.getFrame(
			timeline.currentTime_ms,
			canvas,
		);

		if (imageData) {
			ctx.putImageData(imageData, 0, 0);
		}
	});

	// Play loop
	$effect(() => {
		if (!timeline.isPlaying) return;

		let rafId: number;

		const tick = () => {
			// Always advance by exactly one frame
			timeline.currentTime_ms += tick_ms;

			if (timeline.currentTime_ms >= animation.duration) {
				timeline.currentTime_ms =
					timeline.currentTime_ms % animation.duration;
			}

			rafId = requestAnimationFrame(tick);
		};

		rafId = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(rafId);
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
