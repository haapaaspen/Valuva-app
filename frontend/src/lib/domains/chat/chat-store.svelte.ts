/**
 * Chat Store - Centralized state for chat-related data
 */

export const chat = $state({
	isLoading: false,
	error: null as string | null,
});

