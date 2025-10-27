/**
 * Export State - Shared reactive state for export progress
 */

class ExportState {
	isExporting = $state(false);
	progress = $state(0);
}

export const exportState = new ExportState();

