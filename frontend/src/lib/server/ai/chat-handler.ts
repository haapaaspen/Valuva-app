/**
 * Chat Handler - Server-side business logic for AI chat
 * Extracted from routes/api/chat/+server.ts for better separation of concerns
 */

import { createDataStreamResponse, smoothStream, streamText } from 'ai';
import { myProvider } from './models';
import { systemPrompt } from './prompts';
import { generateCanvasGraphics } from './tools';

export class ChatHandler {
	/**
	 * Handle chat request and return streaming response
	 */
	static handleRequest(messages: any[], selectedModel: string) {
		return createDataStreamResponse({
			execute: (dataStream) => {
				const result = streamText({
					model: myProvider.languageModel(selectedModel),
					system: systemPrompt(),
					messages,
					maxSteps: 5,
					experimental_activeTools: ['generateCanvasGraphics'],
					experimental_transform: smoothStream({ chunking: 'word' }),
					experimental_generateMessageId: crypto.randomUUID.bind(crypto),
					tools: {
						generateCanvasGraphics,
					},
					experimental_telemetry: {
						isEnabled: true,
						functionId: 'stream-text',
					},
				});

				result.consumeStream();

				result.mergeIntoDataStream(dataStream, {
					sendReasoning: true,
				});
			},
			onError: (e) => {
				console.error('[ChatHandler] Error:', e);
				return 'Oops! Something went wrong.';
			},
		});
	}
}

