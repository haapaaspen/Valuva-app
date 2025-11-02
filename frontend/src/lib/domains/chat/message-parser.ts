/**
 * Message Parser - Extracts and processes message parts from AI responses
 * Moved from lib/utils/message-processor.ts
 */

import type { UIMessage } from '@ai-sdk/svelte';
import { isToolUIPart, getToolName } from 'ai';
import type { ProcessedPart, GraphicsResult } from './types';

/**
 * Process message parts into a cleaner, typed structure for rendering
 */
export function processMessageParts(message: UIMessage): ProcessedPart[] {
	if (!message.parts) return [];

	return message.parts
		.map((part, index) => {
			// Handle text parts
			if (part.type === 'text') {
				return {
					type: 'text' as const,
					key: `${message.id}-${index}`,
					content: part.text,
				};
			}

			// Handle tool invocations (v5 uses typed parts)
			if (isToolUIPart(part)) {
				const toolName = getToolName(part);
				const state = part.state;

				// Map v5 states to our internal states
				const mappedState = state === 'output-available' ? 'result' : 'call';
				const icon = mappedState === 'call' ? '🛠️' : '✅';
				const action = mappedState === 'call' ? 'Using tool' : 'completed';
				const displayText = `${action}: ${toolName}`;

				return {
					type: 'tool' as const,
					key: `${message.id}-${index}`,
					toolName,
					state: mappedState,
					displayText,
					icon,
					result: state === 'output-available' ? part.output : undefined,
				};
			}

			return null;
		})
		.filter((part): part is ProcessedPart => part !== null);
}

/**
 * Check if processed parts contain a completed graphics generation
 */
export function findGraphicsResult(parts: ProcessedPart[]): GraphicsResult | null {
	for (const part of parts) {
		if (
			part.type === 'tool' &&
			part.toolName === 'generateCanvasGraphics' &&
			part.state === 'result' &&
			part.result?.data
		) {
			return part.result.data;
		}
	}
	return null;
}

