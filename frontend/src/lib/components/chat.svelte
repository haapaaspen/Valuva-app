<script lang="ts">
	import Messages from "./messages.svelte";
	import MultimodalInput from "./input-box.svelte";
	import type { UIMessage } from "@ai-sdk/svelte";
	import { ChatClient } from "$lib/domains/chat/chat-client";

	const chatClient = new ChatClient();

	$effect(() => {
		const messages = chatClient.messages;
		if (messages.length > 0) {
			const lastMessage = messages[messages.length - 1];
			if (lastMessage.role === "assistant") {
				chatClient.handleAIMessage(lastMessage);
			}
		}
	});
</script>

<div class="flex h-full min-w-0 flex-col">
	<Messages loading={chatClient.isLoading} messages={chatClient.messages} />

	<div class="p-6">
		<MultimodalInput {chatClient} />
	</div>
</div>
