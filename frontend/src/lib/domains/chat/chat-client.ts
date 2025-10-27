/**
 * Chat Client - Extends the AI SDK's Chat class with domain coordination
 * Handles cross-domain communication (e.g., chat → animation)
 */

import { Chat } from '@ai-sdk/svelte';
import type { UIMessage } from '@ai-sdk/svelte';
import { untrack } from 'svelte';
import { toast } from 'svelte-sonner';
import { processMessageParts, findGraphicsResult } from './message-parser';
import { animationService, timelineService, renderService } from '../animation/instances';

export class ChatClient extends Chat {
	constructor() {
		super({
			id: crypto.randomUUID(),
			sendExtraMessageFields: true,
			generateId: crypto.randomUUID.bind(crypto),
			onError: (error: Error) => {
				console.error('[ChatClient] Error:', error);
				toast.error(error.message || 'Something went wrong');
			},
			onFinish: (message, options) => {
				this.handleCompletedMessage(message);
			},
		});
	}

	/**
	 * Check if chat is currently loading (streaming or submitted)
	 */
	get isLoading(): boolean {
		return this.status === 'streaming' || this.status === 'submitted';
	}


	/**
	 * Handle completed AI messages with tool results
	 * @private
	 */
	private handleCompletedMessage(message: any): void {
		try {
			const processedParts = processMessageParts(message);
			const graphicsData = findGraphicsResult(processedParts);

			if (graphicsData) {
				// Load animation via service instance
				animationService.loadFromAI({
					code: graphicsData.code,
					duration: graphicsData.duration,
					title: graphicsData.title,
				});

				// Reset timeline and compile
				timelineService.stop();
				renderService.compile(graphicsData.code);
				
				console.log('[ChatClient] Loaded animation:', graphicsData.title);
			}
		} catch (error) {
			console.error('[ChatClient] Error processing AI message:', error);
			toast.error('Failed to process animation');
		}
	}
}

