/**
 * Service Instances - Creates and wires together all animation services
 * This file creates singleton instances with proper dependency injection
 */

import { AnimationService } from './animation-service';
import { TimelineService } from './timeline-service';
import { RenderService } from './render-service';
import { ExportService } from './export-service';
import { animationState } from './animation-state.svelte';
import { timelineState } from './timeline-state.svelte';
import { exportState } from './export-state.svelte';

// Create service instances with proper dependency injection
export const animationService = new AnimationService(animationState);
export const timelineService = new TimelineService(animationService, timelineState);
export const renderService = new RenderService(animationService);
export const exportService = new ExportService(animationService, renderService, exportState);

