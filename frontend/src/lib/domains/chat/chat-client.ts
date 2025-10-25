/**
 * Chat Client - Extends the AI SDK's Chat class with domain coordination
 * Handles cross-domain communication (e.g., chat → animation)
 */

import { Chat } from '@ai-sdk/svelte';
import type { UIMessage } from '@ai-sdk/svelte';
import { untrack } from 'svelte';
import { toast } from 'svelte-sonner';
import { processMessageParts, findGraphicsResult } from './message-parser';
import { AnimationService } from '../animation/animation-service';

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
		});
	}

	/**
	 * Check if chat is currently loading (streaming or submitted)
	 */
	get isLoading(): boolean {
		return this.status === 'streaming' || this.status === 'submitted';
	}

	/**
	 * Handle AI response and coordinate with other domains
	 */
	handleAIMessage(message: UIMessage): void {
		const processedParts = processMessageParts(message);
		const graphicsData = findGraphicsResult(processedParts);

		if (graphicsData) {
			AnimationService.loadFromAI({
				code: graphicsData.code,
				duration: graphicsData.duration,
				title: graphicsData.title,
			});
		}
	}
}

