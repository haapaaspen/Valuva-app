<script lang="ts">
	import { timeline } from "$lib/hooks/timeline.svelte";
	import { animation } from "$lib/hooks/animation.svelte";
	import { exportStatus } from "$lib/hooks/exporter.svelte";
	/* 	interface TimelineProps {
		onPlay?: () => void;
		onPause?: () => void;
		onSeek?: (time: number) => void;
		onExport?: () => void;
		onExportCode?: () => void;
		isExporting?: boolean;
		exportProgress?: number;
	}

	let {
		onPlay,
		onPause,
		onSeek,
		onExport,
		onExportCode,
		isExporting = false,
		exportProgress = 0,
	}: TimelineProps = $props();
 */
	let isDragging = $state(false);
	let timelineEl: HTMLDivElement;
	/* 
	function handleTimelineClick(event: MouseEvent) {
		if (!timelineEl) return;

		const rect = timelineEl.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const percentage = Math.max(0, Math.min(1, x / rect.width));
		const newTime = percentage * duration;

		onSeek?.(newTime);
	}

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		handleTimelineClick(event);

		function handleMouseMove(e: MouseEvent) {
			if (!isDragging) return;
			handleTimelineClick(e);
		}

		function handleMouseUp() {
			isDragging = false;
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
				onSeek?.(Math.max(0, currentTime - 1));
				break;
			case "ArrowRight":
				event.preventDefault();
				onSeek?.(Math.min(duration, currentTime + 1));
				break;
			case "Home":
				event.preventDefault();
				onSeek?.(0);
				break;
			case "End":
				event.preventDefault();
				onSeek?.(duration);
				break;
			case " ":
			case "Enter":
				event.preventDefault();
				timeline.isPlaying = !timeline.isPlaying;
				break;
		}
	}
 */
	function formatTime(time: number): string {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	}
</script>

<div class="timeline-container bg-transparent border-t border-border/0 p-4">
	<!-- Scrubber -->
	<div class="relative">
		<div
			bind:this={timelineEl}
			class="timeline-track bg-foreground/10 h-2 rounded-full cursor-pointer relative overflow-hidden"
			role="slider"
			tabindex="0"
			aria-label="Timeline scrubber"
			aria-valuemin="0"
			aria-valuemax={animation.duration}
			aria-valuenow={timeline.currentTime}
			aria-valuetext="{formatTime(timeline.currentTime)} of {formatTime(
				animation.duration,
			)}"
			onmousedown={() => {}}
			onclick={() => {}}
			onkeydown={() => {}}
		>
			<!-- Progress Bar -->
			<div
				class="timeline-progress bg-primary h-full rounded-full transition-all duration-75"
				style="width: {Math.max(
					0,
					Math.min(
						100,
						(timeline.currentTime / animation.duration) * 100,
					),
				)}%"
			></div>

			<!-- Playhead -->
			<div
				class="timeline-playhead absolute top-1/2 w-4 h-4 bg-primary border-2 border-background rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 transition-all duration-75 {isDragging
					? 'scale-125'
					: ''}"
				style="left: {Math.max(
					0,
					Math.min(
						100,
						(timeline.currentTime / animation.duration) * 100,
					),
				)}%"
			></div>
		</div>

		<!-- Timeline Markers -->
		<div class="flex justify-between mt-1 text-xs text-foreground/50">
			<span>0:00</span>
			<span>{formatTime(animation.duration)}</span>
		</div>
	</div>

	<!-- Below the scrubber -->
	<div
		class="flex items-center justify-between mt-3 text-xs text-foreground/60"
	>
		<div class="flex items-center justify-between mb-3">
			<div class="flex items-center gap-3">
				<!-- Play/Pause Button -->
				<button
					onclick={() => (timeline.isPlaying = !timeline.isPlaying)}
					class="text-sm border text-primary border-primary rounded-full px-2 py-2 hover:border-primary/90 disabled:border-primary/40 disabled:text-foreground/60 disabled:cursor-not-allowed"
					title={timeline.isPlaying ? "Pause" : "Play"}
				>
					{#if timeline.isPlaying}
						<!-- Pause Icon -->
						<svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
						</svg>
					{:else}
						<!-- Play Icon -->
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
			<div class="ml-4 border-l border-border pl-4">
				<button
					class="text-sm border border-primary rounded-md px-4 py-2 hover:border-primary/90 disabled:border-primary/40 disabled:text-foreground/60 disabled:cursor-not-allowed"
					onclick={() => {}}
					disabled={exportStatus.isExporting}
					title="Export PNG Sequence as ZIP"
				>
					{#if exportStatus.isExporting}
						Creating ZIP... {exportStatus.progress}%
					{:else}
						Export ZIP
					{/if}
				</button>

				<!-- Code Export Button -->
				<button
					class="text-sm border border-primary rounded-md px-4 py-2 hover:border-primary/90 disabled:border-primary/40 disabled:text-foreground/60 disabled:cursor-not-allowed"
					onclick={() => {}}
					title="Export JavaScript Code"
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
