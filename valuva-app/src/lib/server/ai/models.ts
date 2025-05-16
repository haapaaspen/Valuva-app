/* import { createXai } from '@ai-sdk/xai';
import { createGroq } from '@ai-sdk/groq';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';
import { XAI_API_KEY, GROQ_API_KEY } from '$env/static/private';

const xai = createXai({ apiKey: XAI_API_KEY });
const groq = createGroq({ apiKey: GROQ_API_KEY });

export const myProvider = customProvider({
	languageModels: {
		'chat-model': xai('grok-2-1212'),
		'chat-model-reasoning': wrapLanguageModel({
			model: groq('deepseek-r1-distill-llama-70b'),
			middleware: extractReasoningMiddleware({ tagName: 'think' })
		}),
		'title-model': xai('grok-2-1212'),
		'artifact-model': xai('grok-2-1212')
	},
	imageModels: {
		'small-model': xai.image('grok-2-image')
	}
});
 */

import { anthropic } from '@ai-sdk/anthropic';
import { createAnthropic } from '@ai-sdk/anthropic';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { customProvider, extractReasoningMiddleware, wrapLanguageModel } from 'ai';

const claude = createAnthropic({ apiKey: ANTHROPIC_API_KEY });


export const myProvider = customProvider({
	languageModels: {
		'chat-model': claude('claude-3-7-sonnet-20250219'),
		'chat-model-reasoning': wrapLanguageModel({
			model: claude('claude-3-7-sonnet-20250219'),
			middleware: extractReasoningMiddleware({ tagName: 'think' })
		}),
		'title-model': claude('claude-3-7-sonnet-20250219'),
		'artifact-model': claude('claude-3-7-sonnet-20250219')
	}
});