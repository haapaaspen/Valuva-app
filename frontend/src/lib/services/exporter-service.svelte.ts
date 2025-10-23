// exporter-service.svelte.ts - VIDEO EXPORT
import { animation } from "$lib/hooks/animation.svelte";
import { renderService } from "$lib/services/render-service";

import JSZip from 'jszip';

export const exportStatus = $state({
    isExporting: false,
    progress: 0,
});

/**
 * Fast video export using MediaRecorder
 */
export async function exportVideo() {
    if (!renderService.isReady()) {
        console.error('[Exporter] Animation not ready');
        return;
    }
    
    exportStatus.isExporting = true;
    exportStatus.progress = 0;
    
    try {
        console.time('[Exporter] Total export time');
        
        // Create canvas for export
        const canvas = document.createElement('canvas');
        canvas.width = animation.width;
        canvas.height = animation.height;
        const ctx = canvas.getContext('2d')!;
        
        const fps = 60;
        const totalFrames = Math.ceil((animation.duration / 1000) * fps);
        
        // Setup MediaRecorder with canvas stream
        const stream = canvas.captureStream(fps);
        const chunks: Blob[] = [];
        
        // Try VP9 first (better quality), fall back to VP8
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
            ? 'video/webm;codecs=vp9'
            : 'video/webm;codecs=vp8';
        
        const recorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: 8000000 // 8 Mbps for good quality
        });
        
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };
        
        // Start recording
        recorder.start();
        
        // Render all frames as fast as possible
        for (let frame = 0; frame < totalFrames; frame++) {
            const time_ms = (frame / fps) * 1000;
            
            // Get and render frame
            const imageData = renderService.getFrame(time_ms, canvas);
            if (imageData) {
                ctx.putImageData(imageData, 0, 0);
            }
            
            // Update progress
            exportStatus.progress = Math.round((frame / totalFrames) * 95);
            
            // Yield to browser every 10 frames to keep UI responsive
            if (frame % 10 === 0) {
                await new Promise(resolve => requestAnimationFrame(resolve));
            }
        }
        
        // Stop recording and wait for final data
        const videoBlob = await new Promise<Blob>((resolve) => {
            recorder.onstop = () => {
                resolve(new Blob(chunks, { type: mimeType }));
            };
            recorder.stop();
        });
        
        // Download video
        const extension = mimeType.includes('vp9') ? 'webm' : 'webm';
        downloadBlob(videoBlob, `${animation.title}.${extension}`);
        
        exportStatus.progress = 100;
        console.timeEnd('[Exporter] Total export time');
        console.log(`[Exporter] Exported ${totalFrames} frames as video`);
        
    } catch (error) {
        console.error('[Exporter] Export failed:', error);
    } finally {
        setTimeout(() => {
            exportStatus.isExporting = false;
            exportStatus.progress = 0;
        }, 500);
    }
}

/**
 * Export animation as PNG sequence in a ZIP file
 */
export async function exportPngSequence() {
    if (!renderService.isReady()) {
        console.error('[Exporter] Animation not ready');
        return;
    }
    
    exportStatus.isExporting = true;
    exportStatus.progress = 0;
    
    try {
        console.time('[Exporter] PNG sequence export time');
        
        // Create canvas for rendering
        const canvas = document.createElement('canvas');
        canvas.width = animation.width;
        canvas.height = animation.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
        
        const fps = 60;
        const totalFrames = Math.ceil((animation.duration / 1000) * fps);
        const zip = new JSZip();
        
        // Calculate zero-padding needed (e.g., 5 digits for 1000+ frames)
        const framePadding = totalFrames.toString().length;
        
        // Render and add each frame to zip
        for (let frame = 0; frame < totalFrames; frame++) {
            const time_ms = (frame / fps) * 1000;
            
            // Get and render frame
            const imageData = renderService.getFrame(time_ms, canvas);
            if (imageData) {
                ctx.putImageData(imageData, 0, 0);
                
                // Convert canvas to PNG blob
                const blob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob((blob) => {
                        resolve(blob!);
                    }, 'image/png');
                });
                
                // Add to zip with padded frame number
                const frameNumber = frame.toString().padStart(framePadding, '0');
                zip.file(`frame_${frameNumber}.png`, blob);
            }
            
            // Update progress (reserve last 5% for zip generation)
            exportStatus.progress = Math.round((frame / totalFrames) * 95);
            
            // Yield to browser every 5 frames to keep UI responsive
            if (frame % 5 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        
        exportStatus.progress = 95;
        console.log('[Exporter] Generating zip file...');
        
        // Generate zip file
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 } // Balance between speed and size
        }, (metadata) => {
            // Update progress during zip generation
            exportStatus.progress = 95 + Math.round(metadata.percent / 20);
        });
        
        // Download zip
        downloadBlob(zipBlob, `${animation.title}_frames.zip`);
        
        exportStatus.progress = 100;
        console.timeEnd('[Exporter] PNG sequence export time');
        console.log(`[Exporter] Exported ${totalFrames} PNG frames as zip`);
        
    } catch (error) {
        console.error('[Exporter] PNG sequence export failed:', error);
    } finally {
        setTimeout(() => {
            exportStatus.isExporting = false;
            exportStatus.progress = 0;
        }, 500);
    }
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}