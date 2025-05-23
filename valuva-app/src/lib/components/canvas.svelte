<script lang="ts">
	import { onMount } from 'svelte';

	interface CanvasProps {
		drawingCode?: string;
		width?: number;
		height?: number;
		className?: string;
		onTimeUpdate?: (time: number) => void;
		animationDuration?: number;
	}

	let { drawingCode = '', width = 1920, height = 1080, className = '', onTimeUpdate, animationDuration = 10 }: CanvasProps = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationId: number | null = null;
	let isPlaying = $state(false);
	let animationStartTime = 0;
	let currentTime = $state(0);
	let seekTime: number | null = null;

	// Scale factor for responsive canvas
	let canvasScale = 1;
	let displayWidth = $state(800);
	let displayHeight = $state(450); // 16:9 ratio

	onMount(() => {
		console.log('Canvas component mounted');
		ctx = canvas.getContext('2d')!;
		
		// Set up high-quality rendering
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		
		// Initial clear
		clearCanvas();
		
		// Calculate responsive scale
		updateCanvasSize();
		window.addEventListener('resize', updateCanvasSize);
		
		return () => {
			window.removeEventListener('resize', updateCanvasSize);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});

	function updateCanvasSize() {
		const container = canvas.parentElement;
		if (!container) return;
		
		const containerWidth = container.clientWidth - 40;
		const containerHeight = container.clientHeight - 40;
		
		const scaleX = containerWidth / width;
		const scaleY = containerHeight / height;
		canvasScale = Math.min(scaleX, scaleY, 1);
		
		displayWidth = width * canvasScale;
		displayHeight = height * canvasScale;
	}

	function clearCanvas() {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
	}

	// Utility functions that the LLM can use
	const canvasUtils = {
		// Color palette
		colors: {
			background: 'hsl(240, 17%, 93%)',
			foreground: 'hsl(240, 2%, 36%)',
			muted: 'hsl(240, 39%, 84%)',
			primary: 'hsl(30, 53%, 75%)',
			accent: 'hsl(266, 24%, 63%)',
			popover: 'hsl(240, 6%, 88%)',
			card: 'hsl(240, 39%, 84%)'
		},
		
		// Particle system
		createParticles: (count: number) => {
			const particles: any[] = [];
			for (let i = 0; i < count; i++) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					size: Math.random() * 4 + 1,
					speedX: (Math.random() - 0.5) * 2,
					speedY: (Math.random() - 0.5) * 2,
					opacity: Math.random() * 0.5 + 0.2,
					hue: Math.random() * 60 + 240,
					update() {
						this.x += this.speedX;
						this.y += this.speedY;
						if (this.x < 0) this.x = width;
						if (this.x > width) this.x = 0;
						if (this.y < 0) this.y = height;
						if (this.y > height) this.y = 0;
					},
					draw(ctx: CanvasRenderingContext2D) {
						ctx.save();
						ctx.globalAlpha = this.opacity;
						ctx.fillStyle = `hsl(${this.hue}, 24%, 63%)`;
						ctx.beginPath();
						ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
						ctx.fill();
						ctx.restore();
					}
				});
			}
			return particles;
		},
		
		// Gradient helper
		createGradient: (type: 'linear' | 'radial', ...args: number[]) => {
			if (type === 'linear') {
				return ctx.createLinearGradient(args[0], args[1], args[2], args[3]);
			} else {
				return ctx.createRadialGradient(args[0], args[1], args[2], args[3], args[4], args[5]);
			}
		},
		
		// Text with glow effect
		drawGlowText: (text: string, x: number, y: number, size: number, color: string, glowColor: string) => {
			ctx.save();
			ctx.font = `bold ${size}px "Segoe UI", Arial, sans-serif`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			
			// Glow layers
			for (let i = 0; i < 3; i++) {
				ctx.save();
				ctx.globalAlpha = 0.3 - (i * 0.1);
				ctx.fillStyle = glowColor;
				ctx.font = `bold ${size + i * 4}px "Segoe UI", Arial, sans-serif`;
				ctx.fillText(text, x, y);
				ctx.restore();
			}
			
			// Main text
			ctx.fillStyle = color;
			ctx.font = `bold ${size}px "Segoe UI", Arial, sans-serif`;
			ctx.fillText(text, x, y);
			ctx.restore();
		},
		
		// Geometric shapes
		drawShape: (type: 'triangle' | 'hexagon' | 'star', x: number, y: number, size: number, rotation: number = 0) => {
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(rotation);
			ctx.beginPath();
			
			if (type === 'triangle') {
				ctx.moveTo(0, -size/2);
				ctx.lineTo(-size/2, size/2);
				ctx.lineTo(size/2, size/2);
				ctx.closePath();
			} else if (type === 'hexagon') {
				for (let i = 0; i < 6; i++) {
					const angle = (i * Math.PI * 2) / 6;
					const px = Math.cos(angle) * size/2;
					const py = Math.sin(angle) * size/2;
					if (i === 0) ctx.moveTo(px, py);
					else ctx.lineTo(px, py);
				}
				ctx.closePath();
			} else if (type === 'star') {
				for (let i = 0; i < 10; i++) {
					const angle = (i * Math.PI) / 5;
					const radius = i % 2 === 0 ? size/2 : size/4;
					const px = Math.cos(angle) * radius;
					const py = Math.sin(angle) * radius;
					if (i === 0) ctx.moveTo(px, py);
					else ctx.lineTo(px, py);
				}
				ctx.closePath();
			}
			
			ctx.restore();
		},
		
		// Animation helper
		animate: (drawFunction: (time: number) => void) => {
			function frame(timestamp: number) {
				if (!isPlaying) return;
				
				if (animationStartTime === 0) {
					animationStartTime = timestamp;
				}
				
				// Calculate current time in seconds
				const elapsed = (timestamp - animationStartTime) / 1000;
				
				// Handle seek time or normal elapsed time
				if (seekTime !== null) {
					currentTime = seekTime;
					seekTime = null;
					animationStartTime = timestamp - currentTime * 1000;
				} else {
					currentTime = elapsed;
				}
				
				// Handle looping - reset when reaching animation duration
				if (currentTime >= animationDuration) {
					currentTime = currentTime % animationDuration;
					animationStartTime = timestamp - currentTime * 1000;
				}
				
				// Update time callback
				onTimeUpdate?.(currentTime);
				
				clearCanvas();
				drawFunction(currentTime * 1000); // Pass time in milliseconds for compatibility
				
				animationId = requestAnimationFrame(frame);
			}
			
			if (isPlaying) {
				if (animationId) cancelAnimationFrame(animationId);
				animationId = requestAnimationFrame(frame);
			}
		},
		
		// Stop animation
		stopAnimation: () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
				animationId = null;
			}
		}
	};

	function executeDrawingCode(code: string) {
		if (!ctx || !code.trim()) return;
		
		try {
			console.log('Executing drawing code...');
			
			// Stop any existing animation
			if (animationId) {
				cancelAnimationFrame(animationId);
				animationId = null;
			}
			
			// Create a function that has access to canvas context and utilities
			const drawingFunction = new Function('ctx', 'canvas', 'width', 'height', 'utils', code);
			
			// Execute the drawing code
			drawingFunction(ctx, canvas, width, height, canvasUtils);
			
			console.log('Drawing code executed successfully');
		} catch (error) {
			console.error('Error executing drawing code:', error);
			clearCanvas();
			
			// Show error on canvas
			ctx.fillStyle = '#ff0000';
			ctx.font = '24px Arial';
			ctx.textAlign = 'center';
			ctx.fillText('Error in drawing code', width/2, height/2);
			ctx.font = '16px Arial';
			ctx.fillText(error?.toString() || 'Unknown error', width/2, height/2 + 40);
		}
	}

	// React to drawing code changes
	$effect(() => {
		console.log('Drawing code changed:', drawingCode ? 'code provided' : 'no code');
		if (drawingCode) {
			executeDrawingCode(drawingCode);
		} else {
			clearCanvas();
		}
	});

	// Sync export state with parent
	$effect(() => {
		onTimeUpdate?.(currentTime);
	});

	// Generate demo drawing code
	export function generateDemoCode(): string {
		return `
// Demo: Animated particles with title
const particles = utils.createParticles(50);

// Create gradient background
const gradient = utils.createGradient('linear', 0, 0, width, height);
gradient.addColorStop(0, utils.colors.popover);
gradient.addColorStop(0.5, utils.colors.muted);
gradient.addColorStop(1, utils.colors.card);

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Draw and update particles
particles.forEach(particle => {
	particle.update();
	particle.draw(ctx);
});

// Draw title with glow
utils.drawGlowText('Valuva AI', width/2, height/2 - 100, 80, utils.colors.foreground, utils.colors.accent);
utils.drawGlowText('Advanced Canvas Graphics', width/2, height/2, 36, utils.colors.primary, utils.colors.accent);

// Draw some geometric shapes
for (let i = 0; i < 6; i++) {
	const angle = (i * Math.PI * 2 / 6);
	const x = width/2 + Math.cos(angle) * 200;
	const y = height/2 + Math.sin(angle) * 200;
	
	ctx.fillStyle = utils.colors.accent;
	ctx.globalAlpha = 0.6;
	utils.drawShape('hexagon', x, y, 30, angle);
	ctx.fill();
	ctx.globalAlpha = 1;
}

// Animated progress bar
const progress = (Math.sin(Date.now() * 0.002) + 1) / 2;
const barWidth = 400;
const barHeight = 8;
const barX = (width - barWidth) / 2;
const barY = height - 150;

ctx.fillStyle = utils.colors.muted;
ctx.fillRect(barX, barY, barWidth, barHeight);

const progressGrad = utils.createGradient('linear', barX, 0, barX + barWidth * progress, 0);
progressGrad.addColorStop(0, utils.colors.primary);
progressGrad.addColorStop(1, utils.colors.accent);

ctx.fillStyle = progressGrad;
ctx.fillRect(barX, barY, barWidth * progress, barHeight);
`;
	}

	// Timeline control methods
	export function play() {
		isPlaying = true;
		animationStartTime = performance.now() - currentTime * 1000;
	}

	export function pause() {
		isPlaying = false;
		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
	}

	export function seek(time: number) {
		// Clamp time within animation duration
		currentTime = Math.max(0, Math.min(time, animationDuration));
		seekTime = currentTime;
		animationStartTime = performance.now() - currentTime * 1000;
		
		// Update time callback
		onTimeUpdate?.(currentTime);
	}

	export function getCurrentTime() {
		return currentTime;
	}

	export function getIsPlaying() {
		return isPlaying;
	}

	export function getAnimationDuration() {
		return animationDuration;
	}

	// PNG Sequence Export
	let isExporting = $state(false);

	export function getIsExporting() {
		return isExporting;
	}

	export async function exportPNGSequence(onProgress?: (progress: number) => void) {
		if (isExporting || !drawingCode) return;
		
		isExporting = true;
		
		// Stop current animation
		const wasPlaying = isPlaying;
		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
		isPlaying = false;
		
		try {
			// Import JSZip
			const JSZip = (await import('jszip')).default;
			
			// Export parameters
			const fps = 25; // 25 fps for PNG sequence
			const totalFrames = Math.ceil(fps * animationDuration);
			const frameInterval = 1000 / fps; // milliseconds per frame
			
			// Create ZIP file
			const zip = new JSZip();
			const frameFolder = zip.folder("valuva_transparent_frames");
			
			// Pre-compile the drawing function once for performance
			const drawingFunction = new Function('ctx', 'canvas', 'width', 'height', 'utils', drawingCode);
			
			// Create optimized utils for transparent rendering
			const transparentUtils = {
				...canvasUtils,
				animate: (drawFunction: (time: number) => void) => {
					// Execute immediately for single frame
					drawFunction(currentFrameTime);
				}
			};
			
			// Render frames with optimized loop
			let currentFrameTime = 0;
			
			for (let frame = 0; frame < totalFrames; frame++) {
				// Calculate exact time for this frame
				currentFrameTime = frame * frameInterval;
				
				// Clear canvas and enable high quality
				ctx.clearRect(0, 0, width, height);
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = 'high';
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';
				ctx.miterLimit = 10;
				
				// Execute drawing code for this frame
				try {
					drawingFunction(ctx, canvas, width, height, transparentUtils);
				} catch (error) {
					console.error('Error rendering frame:', frame, error);
				}
				
				// Export frame as PNG
				const frameData = canvas.toDataURL('image/png');
				const base64Data = frameData.replace(/^data:image\/png;base64,/, '');
				const fileName = `frame_${String(frame + 1).padStart(4, '0')}.png`;
				frameFolder?.file(fileName, base64Data, { base64: true });
				
				// Update progress only every 5 frames to reduce overhead
				if (frame % 5 === 0) {
					const progress = Math.round(((frame + 1) / totalFrames) * 100);
					onProgress?.(progress);
					
					// Minimal delay only every 25 frames
					if (frame % 25 === 0) {
						await new Promise(resolve => setTimeout(resolve, 1));
					}
				}
			}
			
			// Generate ZIP
			const zipContent = await zip.generateAsync({ 
				type: "blob",
				compression: "DEFLATE",
				compressionOptions: { level: 6 }
			});
			
			// Download ZIP file
			const url = URL.createObjectURL(zipContent);
			const a = document.createElement('a');
			a.href = url;
			a.download = `valuva_animation_${totalFrames}frames_${fps}fps.zip`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			
			return true;
		} catch (error) {
			console.error('Export failed:', error);
			return false;
		} finally {
			isExporting = false;
			
			// Resume animation if it was playing
			if (wasPlaying) {
				isPlaying = true;
				if (animationId) cancelAnimationFrame(animationId);
				animationStartTime = performance.now() - currentTime * 1000;
				// Re-execute drawing code to restart animation
				executeDrawingCode(drawingCode);
			}
		}
	}

	function downloadFrame(dataUrl: string, fileName: string) {
		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}
</script>

<div class="canvas-container flex-1 flex items-center justify-center p-5 {className}">
	<div class="relative border-2 border-gray-300 rounded-lg shadow-lg bg-white">
		<canvas
			bind:this={canvas}
			{width}
			{height}
			style="width: {displayWidth}px; height: {displayHeight}px; display: block;"
			class="rounded-lg"
		></canvas>
		
		<!-- Canvas info overlay -->
		<div class="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
			{width}×{height} • 16:9
		</div>
	</div>
</div>

<style>
	.canvas-container {
		min-height: 0;
	}
</style> 