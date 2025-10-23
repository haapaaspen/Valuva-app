<script lang="ts">
	import { onMount } from "svelte";
	import { createCanvasUtils } from "$lib/canvas-utils";
	import JSZip from "jszip";
	import { animation } from "$lib/hooks/animation.svelte";
	import { timeline } from "$lib/hooks/timeline.svelte";

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let displayWidth = $state(800);
	let displayHeight = $state(450);

	let drawFunction: ((time_ms: number) => void) | null = null;
	let animationFrameId: number | null = null;

	onMount(() => {
		ctx = canvas.getContext("2d")!;
		ctx.clearRect(0, 0, animation.width, animation.height);

		render();

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	});

	$effect(() => {
		executeAnimationCode(animation.code);
		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	});

	function render() {
		if (drawFunction) {
			// Convert timeline seconds to milliseconds
			const time_ms = timeline.currentTime * 1000;
			drawFunction(time_ms);
		}
		animationFrameId = requestAnimationFrame(render);
	}

	function executeAnimationCode(code: string) {
		drawFunction = null;
		const utils = {
			animate: (fn: (time_ms: number) => void) => {
				drawFunction = fn;
			},
		};
		const animFunction = new Function(
			"ctx",
			"canvas",
			"width",
			"height",
			"utils",
			code,
		);
		animFunction(ctx, canvas, animation.width, animation.height, utils);
	}
</script>

<div class="relative w-full h-full">
	<canvas
		bind:this={canvas}
		width={animation.width}
		height={animation.height}
		style="width: {displayWidth}px; height: {displayHeight}px; display: block;"
		class="rounded-lg"
	></canvas>
</div>
