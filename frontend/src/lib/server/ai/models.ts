import { createAnthropic } from '@ai-sdk/anthropic';
import { customProvider } from 'ai';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const claude = createAnthropic({ apiKey: ANTHROPIC_API_KEY });

export const myProvider = customProvider({
	languageModels: {
		'chat-model': claude('claude-3-7-sonnet-20250219')
	}
});

