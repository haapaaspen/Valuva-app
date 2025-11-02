/**
 * Chat Handler - Server-side business logic for AI chat
 */

import { streamText, stepCountIs, convertToModelMessages, type UIMessage } from 'ai';
import { myProvider } from './models';
import { systemPrompt } from './prompts';
import { generateCanvasGraphics } from './tools';

export class ChatHandler {
	/**
	 * Handle chat request and return streaming response
	 */
	static handleRequest(messages: UIMessage[], selectedModel: string) {
		try {
			const result = streamText({
				model: myProvider.languageModel(selectedModel),
				system: systemPrompt(),
				messages: convertToModelMessages(messages),
				stopWhen: stepCountIs(5),
				activeTools: ['generateCanvasGraphics'],
				tools: {
					generateCanvasGraphics,
				},
			});

			return result.toUIMessageStreamResponse({
				originalMessages: messages,
				generateMessageId: crypto.randomUUID.bind(crypto),
			});
		} catch (e) {
			console.error('[ChatHandler] Error:', e);
			throw new Error('Oops! Something went wrong.');
		}
	}
}

