/**
 * Export Service - Handles video and PNG sequence export
 */

import JSZip from 'jszip';
import { animation, exportState, FPS } from './animation-store.svelte';
import { renderService } from './render-service';

/**
 * Video export using MediaRecorder
 */
export async function exportVideo(): Promise<void> {
	if (!renderService.isReady()) {
		console.error('[ExportService] Animation not ready');
		return;
	}

	exportState.isExporting = true;
	exportState.progress = 0;

	try {
		console.time('[ExportService] Video export');

		// Create canvas for export
		const canvas = document.createElement('canvas');
		canvas.width = animation.width;
		canvas.height = animation.height;
		const ctx = canvas.getContext('2d')!;

		const totalFrames = Math.ceil((animation.duration / 1000) * FPS);

		// Setup MediaRecorder
		const stream = canvas.captureStream(FPS);
		const chunks: Blob[] = [];

		const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
			? 'video/webm;codecs=vp9'
			: 'video/webm;codecs=vp8';

		const recorder = new MediaRecorder(stream, {
			mimeType,
			videoBitsPerSecond: 8000000, // 8 Mbps
		});

		recorder.ondataavailable = (e) => {
			if (e.data.size > 0) {
				chunks.push(e.data);
			}
		};

		// Start recording
		recorder.start();

		// Render all frames
		for (let frame = 0; frame < totalFrames; frame++) {
			const time_ms = (frame / FPS) * 1000;

			const imageData = renderService.getFrame(time_ms, canvas);
			if (imageData) {
				ctx.putImageData(imageData, 0, 0);
			}

			exportState.progress = Math.round((frame / totalFrames) * 95);

			// Yield to browser every 10 frames
			if (frame % 10 === 0) {
				await new Promise((resolve) => requestAnimationFrame(resolve));
			}
		}

		// Stop recording and get final blob
		const videoBlob = await new Promise<Blob>((resolve) => {
			recorder.onstop = () => {
				resolve(new Blob(chunks, { type: mimeType }));
			};
			recorder.stop();
		});

		// Download
		downloadBlob(videoBlob, `${animation.title}.webm`);

		exportState.progress = 100;
		console.timeEnd('[ExportService] Video export');
		console.log(`[ExportService] Exported ${totalFrames} frames as video`);
	} catch (error) {
		console.error('[ExportService] Video export failed:', error);
	} finally {
		setTimeout(() => {
			exportState.isExporting = false;
			exportState.progress = 0;
		}, 500);
	}
}

/**
 * Export animation as PNG sequence in a ZIP file
 */
export async function exportPngSequence(): Promise<void> {
	if (!renderService.isReady()) {
		console.error('[ExportService] Animation not ready');
		return;
	}

	exportState.isExporting = true;
	exportState.progress = 0;

	try {
		console.time('[ExportService] PNG sequence export');

		const canvas = document.createElement('canvas');
		canvas.width = animation.width;
		canvas.height = animation.height;
		const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

		const totalFrames = Math.ceil((animation.duration / 1000) * FPS);
		const zip = new JSZip();

		const framePadding = totalFrames.toString().length;

		// Render each frame and add to zip
		for (let frame = 0; frame < totalFrames; frame++) {
			const time_ms = (frame / FPS) * 1000;

			const imageData = renderService.getFrame(time_ms, canvas);
			if (imageData) {
				ctx.putImageData(imageData, 0, 0);

				const blob = await new Promise<Blob>((resolve) => {
					canvas.toBlob((blob) => {
						resolve(blob!);
					}, 'image/png');
				});

				const frameNumber = frame.toString().padStart(framePadding, '0');
				zip.file(`frame_${frameNumber}.png`, blob);
			}

			exportState.progress = Math.round((frame / totalFrames) * 95);

			// Yield to browser every 5 frames
			if (frame % 5 === 0) {
				await new Promise((resolve) => setTimeout(resolve, 0));
			}
		}

		exportState.progress = 95;

		// Generate zip file
		const zipBlob = await zip.generateAsync(
			{
				type: 'blob',
				compression: 'DEFLATE',
				compressionOptions: { level: 6 },
			},
			(metadata) => {
				exportState.progress = 95 + Math.round(metadata.percent / 20);
			},
		);

		// Download
		downloadBlob(zipBlob, `${animation.title}_frames.zip`);

		exportState.progress = 100;
		console.timeEnd('[ExportService] PNG sequence export');
		console.log(`[ExportService] Exported ${totalFrames} frames as zip`);
	} catch (error) {
		console.error('[ExportService] PNG export failed:', error);
	} finally {
		setTimeout(() => {
			exportState.isExporting = false;
			exportState.progress = 0;
		}, 500);
	}
}

function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

