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
	
	// Event listener for graphics generation from chat
	onMount(() => {
		const handleGraphicsGenerated = (event: Event) => {
			const customEvent = event as CustomEvent;
			const { code, duration: animDuration, title } = customEvent.detail;
			console.log('Graphics generated:', title);
			
			// Update canvas with new graphics
			drawingCode = code;
			duration = animDuration;
			
			// Reset timeline
			currentTime = 0;
			isPlaying = false;
			if (canvas) {
				canvas.seek(0);
				canvas.pause();
			}
		};
		
		// Listen for graphics generation events
		window.addEventListener('graphicsGenerated', handleGraphicsGenerated);
		
		return () => {
			window.removeEventListener('graphicsGenerated', handleGraphicsGenerated);
		};
	});
	
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

	// Code export handling
	function handleCodeExport() {
		if (!drawingCode.trim()) {
			alert('No code to export. Generate some graphics first!');
			return;
		}

		try {
			// Create a properly formatted JavaScript file
			const codeContent = `// Valuva AI Generated Canvas Graphics
// Generated at: ${new Date().toLocaleString()}
// Duration: ${duration} seconds

// This code is designed to run with the Valuva canvas utilities
// Pre-provided variables: ctx, canvas, width (1920), height (1080), utils

${drawingCode}
`;

			// Create blob and download
			const blob = new Blob([codeContent], { type: 'text/javascript' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			
			// Generate filename with timestamp
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
			a.download = `valuva-graphics-${timestamp}.js`;
			
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			
			console.log('Code exported successfully');
		} catch (error) {
			console.error('Code export error:', error);
			alert('Failed to export code: ' + error);
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
				duration = 3; // Simple demo loops every 3 seconds
			} else {
				duration = 5; // Advanced demo loops every 5 seconds
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
			duration = 3; // Set duration for this demo (3 seconds loop)
			
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

				<button 
					onclick={handleCodeExport}
					class="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm flex items-center gap-2"
					disabled={!drawingCode.trim()}
					title="Export the generated JavaScript code"
				>
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"/>
					</svg>
					💾 Export Code
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
			onExportCode={handleCodeExport}
		/>
	</div>

	<!-- Right -->
	<!-- <EditPanel /> -->
</div>
<!-- TODO <DataStreamHandler {id} /> -->
