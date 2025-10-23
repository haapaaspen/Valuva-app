<script lang="ts">
	import { timeline, tick_ms } from "$lib/hooks/timeline.svelte";
	import { animation } from "$lib/hooks/animation.svelte";
	import ExportDropdown from "$lib/components/export-dropdown.svelte";

	let isDragging = $state(false);
	let timelineEl: HTMLDivElement | undefined;

	function handleTimelineClick(event: MouseEvent) {
		if (!timelineEl) return;

		const rect = timelineEl.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const percentage = Math.max(0, Math.min(1, x / rect.width));
		const rawTime = percentage * animation.duration;

		timeline.currentTime_ms = Math.max(
			0,
			Math.min(animation.duration, rawTime),
		);
	}

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		const wasPlaying = timeline.isPlaying;
		timeline.isPlaying = false;

		handleTimelineClick(event);

		function handleMouseMove(e: MouseEvent) {
			if (!isDragging) return;
			handleTimelineClick(e);
		}

		function handleMouseUp() {
			isDragging = false;
			if (wasPlaying) {
				timeline.isPlaying = true;
			}
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		}

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!timelineEl) return;

		switch (event.key) {
			case "ArrowLeft":
				event.preventDefault();
				timeline.currentTime_ms = Math.max(
					0,
					timeline.currentTime_ms - tick_ms,
				);
				break;
			case "ArrowRight":
				event.preventDefault();
				timeline.currentTime_ms = Math.min(
					animation.duration,
					timeline.currentTime_ms + tick_ms,
				);
				break;
			case "Home":
				event.preventDefault();
				timeline.currentTime_ms = 0;
				break;
			case "End":
				event.preventDefault();
				timeline.currentTime_ms = animation.duration;
				break;
			case " ":
			case "Enter":
				event.preventDefault();
				timeline.isPlaying = !timeline.isPlaying;
				break;
		}
	}

	function formatTime(time_ms: number): string {
		const totalSeconds = Math.floor(time_ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	}

	function exportCode() {
		// Create a safe filename from the title
		const safeFilename = animation.title
			.replace(/[^a-z0-9]/gi, "-")
			.toLowerCase()
			.replace(/-+/g, "-")
			.replace(/^-|-$/g, "");

		const filename = `${safeFilename || "animation"}.js`;

		// Create a Blob with the code content
		const blob = new Blob([animation.code], { type: "text/javascript" });

		// Create a temporary download link
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;

		// Trigger download
		document.body.appendChild(link);
		link.click();

		// Cleanup
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		console.log(`[Timeline] Exported code as ${filename}`);
	}
</script>

<div class="timeline-container bg-transparent border-t border-border/0 p-4">
	<div class="relative">
		<div
			bind:this={timelineEl}
			class="timeline-track bg-foreground/10 h-2 rounded-full cursor-pointer relative overflow-hidden"
			role="slider"
			tabindex="0"
			aria-label="Timeline scrubber"
			aria-valuemin="0"
			aria-valuemax={animation.duration}
			aria-valuenow={timeline.currentTime_ms}
			aria-valuetext="{formatTime(
				timeline.currentTime_ms,
			)} of {formatTime(animation.duration)}"
			onmousedown={handleMouseDown}
			onclick={handleTimelineClick}
			onkeydown={handleKeyDown}
		>
			<div
				class="timeline-progress bg-primary h-full rounded-full transition-all duration-75"
				style="width: {Math.max(
					0,
					Math.min(
						100,
						(timeline.currentTime_ms / animation.duration) * 100,
					),
				)}%"
			></div>

			<div
				class="timeline-playhead absolute top-1/2 w-4 h-4 bg-primary border-2 border-background rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 transition-all duration-75 {isDragging
					? 'scale-125'
					: ''}"
				style="left: {Math.max(
					0,
					Math.min(
						100,
						(timeline.currentTime_ms / animation.duration) * 100,
					),
				)}%"
			></div>
		</div>

		<div class="flex justify-between mt-1 text-xs text-foreground/50">
			<span>0:00</span>
			<span>{formatTime(animation.duration)}</span>
		</div>
	</div>

	<div
		class="flex items-center justify-between mt-3 text-xs text-foreground/60"
	>
		<div class="flex items-center justify-between mb-3">
			<div class="flex items-center gap-3">
				<button
					onclick={() => (timeline.isPlaying = !timeline.isPlaying)}
					class="text-sm border text-primary border-primary rounded-full px-2 py-2 hover:border-primary/90"
					title={timeline.isPlaying ? "Pause" : "Play"}
				>
					{#if timeline.isPlaying}
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
						</svg>
					{:else}
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M6.5 4.5L16.5 10L6.5 15.5V4.5z" />
						</svg>
					{/if}
				</button>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<div
				class="ml-4 border-l border-border pl-4 flex items-center gap-2"
			>
				<ExportDropdown />
				<button
					class="text-sm border border-primary rounded-md px-4 py-2 hover:border-primary/90"
					title="Export JavaScript Code"
					onclick={exportCode}
				>
					Export Code
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.timeline-container {
		min-height: 120px;
	}

	.timeline-track:hover .timeline-playhead {
		transform: translateY(-50%) translateX(-50%) scale(1.1);
	}

	.timeline-progress {
		transition: width 0.1s ease-out;
	}
</style>
