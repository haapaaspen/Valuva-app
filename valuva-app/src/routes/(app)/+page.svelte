<script lang="ts">
	import Chat from '$lib/components/chat.svelte';
	import Canvas from '$lib/components/canvas.svelte';
	import Timeline from '$lib/components/timeline.svelte';
	import { resolveApi } from '$lib/resolveApi';
    import { onMount } from 'svelte';

	let { data } = $props();
	
	// Canvas state
	let canvas: Canvas;
	let drawingCode = $state('');
	
	// Timeline state
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(10); // Will be updated based on animation
	let isExporting = $state(false);
	let exportProgress = $state(0);
	
	// File input
	let fileInput: HTMLInputElement;
	
	// Timeline controls
	function handlePlay() {
		if (canvas) {
			isPlaying = true;
			canvas.play();
		}
	}
	
	function handlePause() {
		if (canvas) {
			isPlaying = false;
			canvas.pause();
		}
	}
	
	function handleSeek(time: number) {
		if (canvas) {
			currentTime = time;
			canvas.seek(time);
		}
	}
	
	function handleTimeUpdate(time: number) {
		currentTime = time;
	}
	
	// Export handling
	async function handleExport() {
		if (!canvas || isExporting) return;
		
		isExporting = true;
		exportProgress = 0;
		
		try {
			const success = await canvas.exportPNGSequence((progress) => {
				exportProgress = progress;
			});
			
			if (success) {
				console.log('Export completed successfully');
			} else {
				console.error('Export failed');
			}
		} catch (error) {
			console.error('Export error:', error);
		} finally {
			isExporting = false;
			exportProgress = 0;
		}
	}
	
	// File handling
	function openFileDialog() {
		fileInput?.click();
	}
	
	async function handleFileSelected(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (!file) return;
		
		try {
			const text = await file.text();
			console.log('Loaded file:', file.name);
			drawingCode = text;
			
			// Set appropriate duration based on file type
			if (file.name.includes('simple')) {
				duration = 10; // Simple demo loops every 10 seconds
			} else {
				duration = 15; // Advanced demo loops every 15 seconds
			}
			
			// Reset timeline
			currentTime = 0;
			isPlaying = false;
			if (canvas) {
				canvas.seek(0);
				canvas.pause();
			}
		} catch (error) {
			console.error('Error reading file:', error);
			alert('Error reading file: ' + error);
		}
		
		// Reset input
		target.value = '';
	}
	
	// Load demo for testing
	function loadDemo() {
		if (canvas) {
			duration = 8; // Set duration for this demo (8 seconds loop)
			
			drawingCode = `
// Demo animation with timeline control
utils.animate((time) => {
	// Background
	const gradient = utils.createGradient('linear', 0, 0, width, height);
	gradient.addColorStop(0, \`hsl(\${time * 0.02}, 50%, 10%)\`);
	gradient.addColorStop(1, \`hsl(\${time * 0.02 + 60}, 50%, 5%)\`);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);
	
	// Floating particles
	const particles = utils.createParticles(60);
	particles.forEach(particle => {
		particle.x += Math.sin(time * 0.001 + particle.y * 0.01) * 0.5;
		particle.y += Math.cos(time * 0.001 + particle.x * 0.01) * 0.3;
		particle.draw(ctx);
	});
	
	// Orbiting elements
	for (let i = 0; i < 12; i++) {
		const angle = (i * Math.PI * 2 / 12) + time * 0.001;
		const distance = 200 + Math.sin(time * 0.002 + i) * 100;
		const x = width/2 + Math.cos(angle) * distance;
		const y = height/2 + Math.sin(angle) * distance;
		const size = 20 + Math.sin(time * 0.003 + i) * 15;
		
		ctx.save();
		ctx.globalAlpha = 0.8;
		ctx.fillStyle = \`hsl(\${i * 30 + time * 0.05}, 70%, 60%)\`;
		utils.drawShape(['triangle', 'hexagon', 'star'][i % 3], x, y, size, time * 0.002 + i);
		ctx.fill();
		ctx.restore();
	}
	
	// Central pulsing title
	const pulse = Math.sin(time * 0.005) * 0.3 + 1;
	utils.drawGlowText('TIMELINE DEMO', width/2, height/2, 60 * pulse, '#ffffff', \`hsl(\${time * 0.1}, 70%, 60%)\`);
});
`;
			
			// Reset timeline
			currentTime = 0;
			isPlaying = false;
			if (canvas) {
				canvas.seek(0);
				canvas.pause();
			}
		}
	}
</script>

<!-- Hidden file input -->
<input
	bind:this={fileInput}
	type="file"
	accept=".js,.txt"
	onchange={handleFileSelected}
	style="display: none;"
/>

<div class="flex h-screen bg-vaalea">
	<!-- Left -->
	 <div class="w-1/4">
		<Chat chat={undefined} initialMessages={[]} readonly={false} user={data.user} />
	</div>

	<!-- Center -->
	<div class="flex flex-col flex-1">
		<!-- Top toolbar with file button -->
		<div class="p-3 bg-white border-b flex items-center justify-between">
			<div class="flex items-center gap-3">
				<button 
					onclick={openFileDialog}
					class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
				>
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-4l-1-1H4z"/>
					</svg>
					Load Demo Graphics from File
				</button>
				
				<button 
					onclick={loadDemo}
					class="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
				>
					Load Test Demo
				</button>
			</div>
			
			<div class="text-sm text-gray-500">
				Valuva AI Graphics • 4K Canvas
			</div>
		</div>
		
		<!-- Canvas -->
		<Canvas 
			bind:this={canvas} 
			drawingCode={drawingCode}
			animationDuration={duration}
			onTimeUpdate={handleTimeUpdate}
		/>
		
		<!-- Timeline Controls -->
		<Timeline
			{isPlaying}
			{currentTime}
			{duration}
			{isExporting}
			{exportProgress}
			onPlay={handlePlay}
			onPause={handlePause}
			onSeek={handleSeek}
			onExport={handleExport}
		/>
	</div>

	<!-- Right -->
	<!-- <EditPanel /> -->
</div>
<!-- TODO <DataStreamHandler {id} /> -->
