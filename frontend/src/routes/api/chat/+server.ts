import { myProvider } from '$lib/server/ai/models';
import { systemPrompt } from '$lib/server/ai/prompts.js';
import { generateCanvasGraphics } from '$lib/server/ai/tools.js';
import { createDataStreamResponse, smoothStream, streamText } from 'ai';

export async function POST({ request, cookies }) {
	const { id, messages } = await request.json();
	const selectedChatModel = cookies.get('selected-model') || 'chat-model';

	return createDataStreamResponse({
		execute: (dataStream) => {
			const result = streamText({
				model: myProvider.languageModel(selectedChatModel),
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
					functionId: 'stream-text'
				}
			});

			result.consumeStream();

			result.mergeIntoDataStream(dataStream, {
				sendReasoning: true
			});
		},
		onError: (e) => {
			console.error(e);
			return 'Oops! Something went wrong.';
		}
	});
}

