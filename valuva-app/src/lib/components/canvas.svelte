<script lang="ts">
	import { onMount } from 'svelte';
	import { createCanvasUtils } from '$lib/canvas-utils';

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
	
	// Canvas utils will be created after context is available
	let canvasUtils: any = null;

	onMount(() => {
		console.log('Canvas component mounted');
		ctx = canvas.getContext('2d')!;
		
		// Create canvas utils with the full functionality including fonts
		canvasUtils = createCanvasUtils(ctx, canvas);
		
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
/* 
	// Legacy utils for backward compatibility (will be replaced with full utils)
	const legacyCanvasUtils = {
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
			// Validate particle count
			const validCount = Math.max(1, Math.min(Math.floor(count) || 50, 1000));
			const particles: any[] = [];
			
			for (let i = 0; i < validCount; i++) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					size: Math.random() * 4 + 1,
					speedX: (Math.random() - 0.5) * 2,
					speedY: (Math.random() - 0.5) * 2,
					opacity: Math.random() * 0.5 + 0.2,
					hue: Math.random() * 60 + 240,
					update() {
						// Ensure speed values are valid
						this.speedX = isFinite(this.speedX) ? this.speedX : 0;
						this.speedY = isFinite(this.speedY) ? this.speedY : 0;
						
						this.x += this.speedX;
						this.y += this.speedY;
						if (this.x < 0) this.x = width;
						if (this.x > width) this.x = 0;
						if (this.y < 0) this.y = height;
						if (this.y > height) this.y = 0;
					},
					draw(ctx: CanvasRenderingContext2D) {
						// Validate drawing parameters
						if (!isFinite(this.x) || !isFinite(this.y) || !isFinite(this.size)) return;
						
						ctx.save();
						ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity || 0.5));
						ctx.fillStyle = `hsl(${this.hue || 240}, 24%, 63%)`;
						ctx.beginPath();
						ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
						ctx.fill();
						ctx.restore();
					}
				});
			}
			return particles;
		},
		
		// Gradient helper
		createGradient: (type: 'linear' | 'radial', ...args: number[]) => {
			// Validate and sanitize parameters to prevent IndexSizeError
			const sanitizeNumber = (num: number, defaultValue: number = 0) => {
				return isNaN(num) || !isFinite(num) ? defaultValue : Math.max(0, Math.min(num, Math.max(width, height) * 2));
			};
			
			if (type === 'linear') {
				// Linear gradient: x1, y1, x2, y2
				const [x1 = 0, y1 = 0, x2 = width, y2 = height] = args;
				return ctx.createLinearGradient(
					sanitizeNumber(x1, 0),
					sanitizeNumber(y1, 0),
					sanitizeNumber(x2, width),
					sanitizeNumber(y2, height)
				);
			} else {
				// Radial gradient: x1, y1, r1, x2, y2, r2
				const [x1 = width/2, y1 = height/2, r1 = 0, x2 = width/2, y2 = height/2, r2 = 100] = args;
				return ctx.createRadialGradient(
					sanitizeNumber(x1, width/2),
					sanitizeNumber(y1, height/2),
					Math.max(0, sanitizeNumber(r1, 0)),
					sanitizeNumber(x2, width/2),
					sanitizeNumber(y2, height/2),
					Math.max(1, sanitizeNumber(r2, 100)) // Ensure r2 is at least 1
				);
			}
		},
		
		// Text with glow effect
		drawGlowText: (text: string, x: number, y: number, size: number, color: string, glowColor: string, fontFamily?: string) => {
			ctx.save();
			ctx.font = `bold ${size}px ${fontFamily || '"Segoe UI", Arial, sans-serif'}`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			
			// Glow layers
			for (let i = 0; i < 3; i++) {
				ctx.save();
				ctx.globalAlpha = 0.3 - (i * 0.1);
				ctx.fillStyle = glowColor;
				ctx.font = `bold ${size + i * 4}px ${fontFamily || '"Segoe UI", Arial, sans-serif'}`;
				ctx.fillText(text, x, y);
				ctx.restore();
			}
			
			// Main text
			ctx.fillStyle = color;
			ctx.font = `bold ${size}px ${fontFamily || '"Segoe UI", Arial, sans-serif'}`;
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
 */
	function executeDrawingCode(code: string) {
		if (!ctx || !code.trim()) return;
		
		try {
			console.log('Executing drawing code...');
			
			// Stop any existing animation
			if (animationId) {
				cancelAnimationFrame(animationId);
				animationId = null;
			}
			
			// Reset to first frame
			currentTime = 0;
			animationStartTime = 0;
			
			// Validate the code doesn't contain dangerous patterns
			const dangerousPatterns = [
				/while\s*\(\s*true\s*\)/gi,
				/for\s*\(\s*;\s*;\s*\)/gi,
				/setInterval|setTimeout.*0/gi
			];
			
			for (const pattern of dangerousPatterns) {
				if (pattern.test(code)) {
					throw new Error('Code contains potentially dangerous infinite loops');
				}
			}
			
			// Use canvasUtils if available, otherwise fallback to legacy utils
			const utilsToUse = canvasUtils;
			
			// Create a function that has access to canvas context and utilities
			// Use 'canvasElement' to avoid conflicts with user code that might declare 'canvas'
			const drawingFunction = new Function('ctx', 'canvasElement', 'width', 'height', 'utils', code);
			
			// Execute the drawing code to show first frame
			drawingFunction(ctx, canvas, width, height, utilsToUse);
			
			// Also render first frame immediately if it uses animate
			renderFirstFrame(drawingFunction);
			
			console.log('Drawing code executed successfully');
		} catch (error) {
			console.error('Error executing drawing code:', error);
			clearCanvas();
			
			// Show error on canvas with more helpful information
			ctx.fillStyle = '#ff4444';
			ctx.font = 'bold 24px Arial';
			ctx.textAlign = 'center';
			ctx.fillText('⚠️ Graphics Code Error', width/2, height/2 - 40);
			
			ctx.fillStyle = '#ff6666';
			ctx.font = '16px Arial';
			const errorMsg = error?.toString() || 'Unknown error';
			const lines = errorMsg.length > 60 ? [errorMsg.substring(0, 60) + '...'] : [errorMsg];
			lines.forEach((line, i) => {
				ctx.fillText(line, width/2, height/2 + 10 + (i * 20));
			});
			
			ctx.fillStyle = '#ffaaaa';
			ctx.font = '14px Arial';
			ctx.fillText('Try asking for simpler graphics or reload the page', width/2, height/2 + 60);
		}
	}

	function renderFirstFrame(drawingFunction: Function) {
		// Use canvasUtils if available, otherwise fallback to legacy utils
		const utilsToUse = canvasUtils;
		
		// Create a special utils object that renders the first frame immediately
		const firstFrameUtils = {
			...utilsToUse,
			animate: (drawFunction: (time: number) => void) => {
				// Render first frame (time = 0) immediately
				clearCanvas();
				drawFunction(0);
			}
		};
		
		try {
			// Execute with first frame utils to render initial state
			drawingFunction(ctx, canvas, width, height, firstFrameUtils);
		} catch (error) {
			console.error('Error rendering first frame:', error);
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
		
		// If not playing, render the specific frame
		if (!isPlaying && drawingCode) {
			renderSpecificFrame(currentTime * 1000);
		}
	}

	function renderSpecificFrame(time: number) {
		if (!drawingCode) return;
		
		try {
			// Use canvasUtils if available, otherwise fallback to legacy utils
			const utilsToUse = canvasUtils;
			
			// Create utils that render a specific frame
			const frameUtils = {
				...utilsToUse,
				animate: (drawFunction: (time: number) => void) => {
					clearCanvas();
					drawFunction(time);
				}
			};
			
			const drawingFunction = new Function('ctx', 'canvasElement', 'width', 'height', 'utils', drawingCode);
			drawingFunction(ctx, canvas, width, height, frameUtils);
		} catch (error) {
			console.error('Error rendering specific frame:', error);
		}
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
			
			// Create export-compatible utils that render single frames
			const exportUtils = {
				...canvasUtils,
				animate: (drawFunction: (time: number) => void) => {
					// During export, just call the draw function with the current frame time
					drawFunction(currentFrameTime);
				}
			};
			
			// Pre-compile the drawing function once for performance
			let drawingFunction: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, width: number, height: number, utils: any) => void;
			try {
				// Create a simplified version of the code that works during export
				let exportCode = drawingCode;
				
				// Replace async font loading with immediate execution
				exportCode = exportCode.replace(
					/const script = document\.createElement\('script'\);[\s\S]*?startAnimation\(\);/g,
					'// Font loading simplified for export\nstartAnimation();'
				);
				
				// Ensure startAnimation is called immediately
				if (!exportCode.includes('startAnimation();') && exportCode.includes('function startAnimation()')) {
					exportCode += '\nstartAnimation();';
				}
				
				drawingFunction = new Function('ctx', 'canvas', 'width', 'height', 'utils', exportCode) as any;
			} catch (error) {
				console.error('Error compiling export code:', error);
				// Fallback to original function
				drawingFunction = new Function('ctx', 'canvas', 'width', 'height', 'utils', drawingCode) as any;
			}
			
			// Render frames
			let currentFrameTime = 0;
			
			for (let frame = 0; frame < totalFrames; frame++) {
				// Calculate exact time for this frame
				currentFrameTime = frame * frameInterval;
				
				// Clear canvas completely (transparent background)
				ctx.clearRect(0, 0, width, height);
				
				// Set high quality rendering
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = 'high';
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';
				ctx.miterLimit = 10;
				
				// Execute drawing code for this frame
				try {
					drawingFunction(ctx, canvas, width, height, exportUtils);
				} catch (error) {
					console.error('Error rendering frame:', frame, error);
					// Continue with next frame rather than failing completely
				}
				
				// Export frame as PNG with transparency
				const frameData = canvas.toDataURL('image/png');
				const base64Data = frameData.replace(/^data:image\/png;base64,/, '');
				const fileName = `frame_${String(frame + 1).padStart(4, '0')}.png`;
				frameFolder?.file(fileName, base64Data, { base64: true });
				
				// Update progress
				if (frame % 5 === 0) {
					const progress = Math.round(((frame + 1) / totalFrames) * 100);
					onProgress?.(progress);
					
					// Small delay every 25 frames to prevent blocking
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
			a.download = `valuva_transparent_animation_${totalFrames}frames_${fps}fps.zip`;
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