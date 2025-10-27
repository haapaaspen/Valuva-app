<script lang="ts">
	import Messages from "./messages.svelte";
	import InputBox from "./input-box.svelte";
	import { ChatClient } from "$lib/domains/chat/chat-client";

	const chatClient = new ChatClient();
</script>

<div class="flex h-full min-w-0 flex-col">
	<Messages loading={chatClient.isLoading} messages={chatClient.messages} />

	<div class="p-6">
		<InputBox {chatClient} />
	</div>
</div>
