/**
 * Export Service - Handles video and PNG sequence export
 * State is owned externally for reactivity
 */

import JSZip from 'jszip';
import type { AnimationService } from './animation-service';
import type { RenderService } from './render-service';

const FPS = 60;

type ExportState = {
	isExporting: boolean;
	progress: number;
};

export class ExportService {
	constructor(
		private animationService: AnimationService,
		private renderService: RenderService,
		private state: ExportState
	) {}

	/**
	 * Video export using MediaRecorder
	 */
	async exportVideo(): Promise<void> {
		if (!this.renderService.isReady()) {
			console.error('[ExportService] Animation not ready');
			return;
		}

		this.state.isExporting = true;
		this.state.progress = 0;

		try {
			console.time('[ExportService] Video export');

			// Create canvas for export
			const canvas = document.createElement('canvas');
			canvas.width = this.animationService.width;
			canvas.height = this.animationService.height;
			const ctx = canvas.getContext('2d')!;

			const totalFrames = Math.ceil((this.animationService.duration / 1000) * FPS);

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

				const imageData = this.renderService.getFrame(time_ms, canvas);
				if (imageData) {
					ctx.putImageData(imageData, 0, 0);
				}

				this.state.progress = Math.round((frame / totalFrames) * 95);

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
			this.downloadBlob(videoBlob, `${this.animationService.title}.webm`);

			this.state.progress = 100;
			console.timeEnd('[ExportService] Video export');
			console.log(`[ExportService] Exported ${totalFrames} frames as video`);
		} catch (error) {
			console.error('[ExportService] Video export failed:', error);
		} finally {
			setTimeout(() => {
				this.state.isExporting = false;
				this.state.progress = 0;
			}, 500);
		}
	}

	/**
	 * Export animation as PNG sequence in a ZIP file
	 */
	async exportPngSequence(): Promise<void> {
		if (!this.renderService.isReady()) {
			console.error('[ExportService] Animation not ready');
			return;
		}

		this.state.isExporting = true;
		this.state.progress = 0;

		try {
			console.time('[ExportService] PNG sequence export');

			const canvas = document.createElement('canvas');
			canvas.width = this.animationService.width;
			canvas.height = this.animationService.height;
			const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

			const totalFrames = Math.ceil((this.animationService.duration / 1000) * FPS);
			const zip = new JSZip();

			const framePadding = totalFrames.toString().length;

			// Render each frame and add to zip
			for (let frame = 0; frame < totalFrames; frame++) {
				const time_ms = (frame / FPS) * 1000;

				const imageData = this.renderService.getFrame(time_ms, canvas);
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

				this.state.progress = Math.round((frame / totalFrames) * 95);

				// Yield to browser every 5 frames
				if (frame % 5 === 0) {
					await new Promise((resolve) => setTimeout(resolve, 0));
				}
			}

			this.state.progress = 95;

			// Generate zip file
			const zipBlob = await zip.generateAsync(
				{
					type: 'blob',
					compression: 'DEFLATE',
					compressionOptions: { level: 6 },
				},
				(metadata) => {
					this.state.progress = 95 + Math.round(metadata.percent / 20);
				},
			);

			// Download
			this.downloadBlob(zipBlob, `${this.animationService.title}_frames.zip`);

			this.state.progress = 100;
			console.timeEnd('[ExportService] PNG sequence export');
			console.log(`[ExportService] Exported ${totalFrames} frames as zip`);
		} catch (error) {
			console.error('[ExportService] PNG export failed:', error);
		} finally {
			setTimeout(() => {
				this.state.isExporting = false;
				this.state.progress = 0;
			}, 500);
		}
	}

	private downloadBlob(blob: Blob, filename: string): void {
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
}
