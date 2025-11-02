/**
 * API Endpoint - Thin bridge between client and server
 * Delegates business logic to ChatHandler
 */

import { ChatHandler } from '$lib/server/ai/chat-handler';
import type { UIMessage } from 'ai';

export async function POST({ request, cookies }) {
	const { messages }: { messages: UIMessage[] } = await request.json();
	const selectedChatModel = cookies.get('selected-model') || 'chat-model';

	return ChatHandler.handleRequest(messages, selectedChatModel);
}

