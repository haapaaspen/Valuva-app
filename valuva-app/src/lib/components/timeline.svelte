<script lang="ts">
	interface TimelineProps {
		isPlaying?: boolean;
		currentTime?: number;
		duration?: number;
		onPlay?: () => void;
		onPause?: () => void;
		onSeek?: (time: number) => void;
		onExport?: () => void;
		isExporting?: boolean;
		exportProgress?: number;
	}

	let { 
		isPlaying = false, 
		currentTime = 0, 
		duration = 100, 
		onPlay, 
		onPause, 
		onSeek, 
		onExport, 
		isExporting = false, 
		exportProgress = 0 
	}: TimelineProps = $props();

	let isDragging = $state(false);
	let timelineEl: HTMLDivElement;

	function togglePlayback() {
		if (isPlaying) {
			onPause?.();
		} else {
			onPlay?.();
		}
	}

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
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		}
		
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!timelineEl) return;
		
		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				onSeek?.(Math.max(0, currentTime - 1));
				break;
			case 'ArrowRight':
				event.preventDefault();
				onSeek?.(Math.min(duration, currentTime + 1));
				break;
			case 'Home':
				event.preventDefault();
				onSeek?.(0);
				break;
			case 'End':
				event.preventDefault();
				onSeek?.(duration);
				break;
			case ' ':
			case 'Enter':
				event.preventDefault();
				togglePlayback();
				break;
		}
	}

	function formatTime(time: number): string {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}
</script>

<div class="timeline-container bg-white border-t p-4">
	<!-- Timeline Header -->
	<div class="flex items-center justify-between mb-3">
		<div class="flex items-center gap-3">
			<!-- Play/Pause Button -->
			<button
				onclick={togglePlayback}
				class="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
				title={isPlaying ? 'Pause' : 'Play'}
			>
				{#if isPlaying}
					<!-- Pause Icon -->
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z"/>
					</svg>
				{:else}
					<!-- Play Icon -->
					<svg class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M6.5 4.5L16.5 10L6.5 15.5V4.5z"/>
					</svg>
				{/if}
			</button>

			<!-- Time Display -->
			<div class="text-sm font-mono text-gray-600">
				{formatTime(currentTime)} / {formatTime(duration)}
			</div>
		</div>

		<!-- Animation Status -->
		<div class="text-xs text-gray-500">
			{isPlaying ? 'Playing' : 'Paused'} • Frame {Math.floor(currentTime)}
		</div>
	</div>

	<!-- Timeline Scrubber -->
	<div class="relative">
		<div 
			bind:this={timelineEl}
			class="timeline-track bg-gray-200 h-2 rounded-full cursor-pointer relative overflow-hidden"
			role="slider"
			tabindex="0"
			aria-label="Timeline scrubber"
			aria-valuemin="0"
			aria-valuemax={duration}
			aria-valuenow={currentTime}
			aria-valuetext="{formatTime(currentTime)} of {formatTime(duration)}"
			onmousedown={handleMouseDown}
			onclick={handleTimelineClick}
			onkeydown={handleKeyDown}
		>
			<!-- Progress Bar -->
			<div 
				class="timeline-progress bg-blue-500 h-full rounded-full transition-all duration-75"
				style="width: {Math.max(0, Math.min(100, (currentTime / duration) * 100))}%"
			></div>
			
			<!-- Playhead -->
			<div 
				class="timeline-playhead absolute top-1/2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 transition-all duration-75 {isDragging ? 'scale-125' : ''}"
				style="left: {Math.max(0, Math.min(100, (currentTime / duration) * 100))}%"
			></div>
		</div>

		<!-- Timeline Markers -->
		<div class="flex justify-between mt-1 text-xs text-gray-400">
			<span>0:00</span>
			<span>{formatTime(duration)}</span>
		</div>
	</div>

	<!-- Additional Controls -->
	<div class="flex items-center justify-between mt-3 text-xs text-gray-500">
		<div class="flex items-center gap-4">
			<span>Animation Timeline</span>
			{#if duration > 0}
				<span>{Math.round((currentTime / duration) * 100)}%</span>
			{/if}
		</div>
		
		<div class="flex items-center gap-2">
			<button 
				class="px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors"
				onclick={() => onSeek?.(0)}
				title="Reset to beginning"
			>
				⏮
			</button>
			<button 
				class="px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors"
				onclick={() => onSeek?.(duration)}
				title="Go to end"
			>
				⏭
			</button>
			
			<!-- Export Button -->
			<div class="ml-4 border-l pl-4">
				<button 
					class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					onclick={() => onExport?.()}
					disabled={isExporting}
					title="Export PNG Sequence as ZIP"
				>
					{#if isExporting}
						📦 Creating ZIP... {exportProgress}%
					{:else}
						📦 Export ZIP
					{/if}
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